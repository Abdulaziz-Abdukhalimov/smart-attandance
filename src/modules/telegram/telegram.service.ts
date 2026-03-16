import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bot: any;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Parent') private readonly parentModel: Model<any>,
    @InjectModel('Student') private readonly studentModel: Model<any>,
  ) {}

  onModuleInit() {
    const token = this.configService.get<string>('telegram.botToken');
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not set — Telegram bot disabled');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.registerHandlers();
    this.logger.log('Telegram bot started');
  }

  onModuleDestroy() {
    if (this.bot) {
      this.bot.stopPolling();
    }
  }

  private registerHandlers() {
    this.bot.onText(/\/start/, async (msg: any) => {
      const chatId = String(msg.chat.id);
      await this.bot.sendMessage(
        chatId,
        '👋 Welcome to Smart Attendance Bot!\n\nTo connect your child, send:\n/connect <CODE>\n\nExample: /connect ABC1234567',
      );
    });

    this.bot.onText(/\/connect (.+)/, async (msg: any, match: any) => {
      const chatId = String(msg.chat.id);
      const code = match?.[1]?.trim().toUpperCase();

      if (!code) {
        await this.bot.sendMessage(chatId, '❌ Please provide a connect code.');
        return;
      }

      try {
        await this.connectParent(chatId, code, msg.from);
        const student = (await this.studentModel
          .findOne({ connectCode: code })
          .lean()) as any;
        await this.bot.sendMessage(
          chatId,
          `✅ Connected successfully!\n\nYou are now linked to: *${student.firstName} ${student.lastName}*\n\nYou will receive daily attendance summaries.`,
          { parse_mode: 'Markdown' },
        );
      } catch (err: any) {
        await this.bot.sendMessage(chatId, `❌ ${err.message}`);
      }
    });

    this.bot.onText(/\/mystudents/, async (msg: any) => {
      const chatId = String(msg.chat.id);
      const parent = (await this.parentModel
        .findOne({ telegramChatId: chatId })
        .populate('studentIds', 'firstName lastName')
        .lean()) as any;

      if (!parent || !parent.studentIds?.length) {
        await this.bot.sendMessage(chatId, 'You have no connected students.');
        return;
      }

      const list = parent.studentIds
        .map((s: any) => `• ${s.firstName} ${s.lastName}`)
        .join('\n');
      await this.bot.sendMessage(chatId, `Your connected students:\n${list}`);
    });

    this.bot.on('polling_error', (error: any) => {
      this.logger.error('Telegram polling error', error.message);
    });
  }

  async connectParent(telegramChatId: string, connectCode: string, from?: any) {
    const student = (await this.studentModel
      .findOne({ connectCode, isActive: true })
      .lean()) as any;
    if (!student) throw new NotFoundException('Invalid connect code');

    let parent = (await this.parentModel
      .findOne({ telegramChatId })
      .lean()) as any;

    if (!parent) {
      parent = await this.parentModel.create({
        telegramChatId,
        telegramUsername: from?.username,
        firstName: from?.first_name,
        studentIds: [student._id],
      });
    } else {
      const alreadyLinked = parent.studentIds.some(
        (id: any) => id.toString() === student._id.toString(),
      );
      if (!alreadyLinked) {
        await this.parentModel.updateOne(
          { telegramChatId },
          { $push: { studentIds: student._id } },
        );
      }
    }

    const parentDoc = (await this.parentModel
      .findOne({ telegramChatId })
      .lean()) as any;
    await this.studentModel.updateOne(
      { _id: student._id },
      { $addToSet: { parentIds: parentDoc._id } },
    );

    return student;
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    if (!this.bot) return;
    try {
      await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (err: any) {
      this.logger.error(`Failed to send message to ${chatId}: ${err.message}`);
    }
  }

  async getParentsForStudent(studentId: string) {
    return this.parentModel.find({ studentIds: studentId, isActive: true }).lean();
  }
}
