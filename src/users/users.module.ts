import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { MailModule } from 'src/mail/mail.module';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { ForgotModule } from 'src/forgot/forgot.module';
@Module({
  imports: [
    MailModule,
    ForgotModule,

    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: '$up3r$3cr3t' }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
  exports: [JwtModule,UsersModule],
})
export class UsersModule {}
