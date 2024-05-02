import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { User } from './users/user.entity';
import { Article } from './articles/article.entity';
import { MailerModule } from './mailer/mailer.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import mailConfig from './config/mail.config';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AllConfigType } from './config/config.type';
import { ConfigService } from '@nestjs/config';
import { ForgotModule } from './forgot/forgot.module';
import { Forgot } from './forgot/entities/forgot.entity';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Article , Forgot ],
      synchronize: true,
    }),
    UsersModule,
    ArticlesModule,
    MailerModule,
    MailModule,
    ForgotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
