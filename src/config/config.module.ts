import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import telegramConfig from './telegram.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, telegramConfig],
      expandVariables: true,
    }),
  ],
})
export class AppConfigModule {}
