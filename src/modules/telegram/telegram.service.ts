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
    // /start — welcome message with main menu buttons
    this.bot.onText(/\/start/, async (msg: any) => {
      const chatId = String(msg.chat.id);
      const firstName = msg.from?.first_name ?? 'Ota-ona';

      await this.bot.sendMessage(
        chatId,
        `👋 Assalomu alaykum, *${firstName}*!\n\n🏫 *Smart Davomat* botiga xush kelibsiz!\n\nFarzandingizni ulash uchun maktabdan olgan *ULANISH KODI*ni yuboring.\n\n📎 Misol: /connect ABC1234567`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [
              [{ text: '👨‍👩‍👧 Farzandlarim' }, { text: '📊 Bugungi davomat' }],
              [{ text: '❓ Yordam' }],
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
          },
        },
      );
    });

    // /connect CODE — link parent to student
    this.bot.onText(/\/connect (.+)/, async (msg: any, match: any) => {
      const chatId = String(msg.chat.id);
      const code = match?.[1]?.trim().toUpperCase();

      if (!code) {
        await this.bot.sendMessage(
          chatId,
          '❌ Iltimos, ulanish kodini kiriting.\n\nMisol: /connect ABC1234567',
        );
        return;
      }

      try {
        await this.connectParent(chatId, code, msg.from);
        const student = (await this.studentModel
          .findOne({ connectCode: code })
          .lean()) as any;

        await this.bot.sendMessage(
          chatId,
          `✅ *Muvaffaqiyatli ulandi!*\n\n👦 Farzandingiz: *${student.firstName} ${student.lastName}*\n\n📬 Har kuni soat 16:00 da davomat xulosasi yuboriladi.`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              keyboard: [
                [{ text: '👨‍👩‍👧 Farzandlarim' }, { text: '📊 Bugungi davomat' }],
                [{ text: '❓ Yordam' }],
              ],
              resize_keyboard: true,
            },
          },
        );
      } catch (err: any) {
        const isNotFound = err.message?.includes('connect code') || err.status === 404;
        await this.bot.sendMessage(
          chatId,
          isNotFound
            ? '❌ *Ulanish kodi topilmadi.*\n\nIltimos, maktabdan to\'g\'ri kodni oling va qayta urinib ko\'ring.'
            : `❌ Xatolik: ${err.message}`,
          { parse_mode: 'Markdown' },
        );
      }
    });

    // Keyboard button: "Farzandlarim" / /mystudents
    this.bot.onText(/\/mystudents|👨‍👩‍👧 Farzandlarim/, async (msg: any) => {
      const chatId = String(msg.chat.id);
      const parent = (await this.parentModel
        .findOne({ telegramChatId: chatId })
        .populate('studentIds', 'firstName lastName')
        .lean()) as any;

      if (!parent || !parent.studentIds?.length) {
        await this.bot.sendMessage(
          chatId,
          '📭 Hozircha hech qanday farzand ulanmagan.\n\n/connect *KOD* buyrug\'ini yuboring.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      const list = parent.studentIds
        .map((s: any, i: number) => `${i + 1}. 👦 ${s.firstName} ${s.lastName}`)
        .join('\n');

      await this.bot.sendMessage(
        chatId,
        `👨‍👩‍👧 *Sizning farzandlaringiz:*\n\n${list}`,
        { parse_mode: 'Markdown' },
      );
    });

    // Keyboard button: "Bugungi davomat"
    this.bot.onText(/📊 Bugungi davomat/, async (msg: any) => {
      const chatId = String(msg.chat.id);
      await this.bot.sendMessage(
        chatId,
        '📊 Bugungi davomat xulosasi har kuni soat *16:00* da avtomatik yuboriladi.\n\nAgar bugungi ma\'lumotni ko\'rmoqchi bo\'lsangiz, kechqurun 16:00 dan keyin tekshiring.',
        { parse_mode: 'Markdown' },
      );
    });

    // Keyboard button: "Yordam"
    this.bot.onText(/❓ Yordam/, async (msg: any) => {
      const chatId = String(msg.chat.id);
      await this.bot.sendMessage(
        chatId,
        `❓ *Yordam*\n\n` +
        `📌 *Buyruqlar:*\n` +
        `/start — Bosh menyu\n` +
        `/connect KOD — Farzandni ulash\n` +
        `/mystudents — Farzandlar ro'yxati\n\n` +
        `📌 *Ulanish kodi nima?*\n` +
        `Har bir o'quvchiga maktab tomonidan berilgan maxsus kod. Sinf rahbaridan yoki maktab administratoridan so'rang.\n\n` +
        `📌 *Davomat qachon keladi?*\n` +
        `Har kuni soat 16:00 da avtomatik yuboriladi.`,
        { parse_mode: 'Markdown' },
      );
    });

    this.bot.on('polling_error', (error: any) => {
      this.logger.error('Telegram polling error', error.message);
    });
  }

  async connectParent(telegramChatId: string, connectCode: string, from?: any) {
    // 1. Find student by connect code
    const student = (await this.studentModel
      .findOne({ connectCode, isActive: true })
      .lean()) as any;
    if (!student) throw new NotFoundException('Invalid connect code');

    // 2. Check if this Telegram account is already registered
    let parentByTelegram = (await this.parentModel
      .findOne({ telegramChatId })
      .lean()) as any;

    // 3. Check if admin pre-registered a parent for this student (no telegramChatId yet)
    const preRegistered = (await this.parentModel
      .findOne({
        studentIds: student._id,
        telegramChatId: { $exists: false },
        isActive: true,
      })
      .lean()) as any;

    if (parentByTelegram) {
      // Already has Telegram account — just add student if not linked
      const alreadyLinked = parentByTelegram.studentIds.some(
        (id: any) => id.toString() === student._id.toString(),
      );
      if (!alreadyLinked) {
        await this.parentModel.updateOne(
          { telegramChatId },
          { $push: { studentIds: student._id } },
        );
        await this.studentModel.updateOne(
          { _id: student._id },
          { $addToSet: { parentIds: parentByTelegram._id } },
        );
      }
    } else if (preRegistered) {
      // Admin pre-created this parent — link their Telegram to existing record
      await this.parentModel.updateOne(
        { _id: preRegistered._id },
        {
          $set: {
            telegramChatId,
            telegramUsername: from?.username,
          },
          $addToSet: { studentIds: student._id },
        },
      );
      await this.studentModel.updateOne(
        { _id: student._id },
        { $addToSet: { parentIds: preRegistered._id } },
      );
    } else {
      // New parent — create fresh record
      const newParent = await this.parentModel.create({
        telegramChatId,
        telegramUsername: from?.username,
        fullName: from?.first_name,
        studentIds: [student._id],
      });
      await this.studentModel.updateOne(
        { _id: student._id },
        { $addToSet: { parentIds: newParent._id } },
      );
    }

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
