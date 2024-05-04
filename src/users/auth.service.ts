import { MailService } from 'src/mail/mail.service';
import { UsersService } from './users.service';
import * as crypto from 'crypto';
import { ForgotService } from 'src/forgot/forgot.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtPayloadType } from './jwt-payload.type';

import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthUpdateDto } from './dtos/auth-update.dto';

const scrypt = promisify(_script);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
    private forgotService: ForgotService,
  ) {}
  createAccessToken(email: string, role: string): { accessToken: string } {
    return { accessToken: this.jwtService.sign({ sub: [email, role] }) };
  }
  async signUp(username: string, email: string, password: string) {
    // 1- See If Email Is In use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email already in use');
    }
    // 2- Hash The users Password
    // 2.1 - Generate Salt
    const salt = randomBytes(8).toString('hex');
    // 2.2 - Hash the password and the salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 2.3 - Join The hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // 3- Create A new User And save it
    const newUser = await this.usersService.create(username, email, result);
    // 4-return The user
    const user1 = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
    const data = {
      user: user1,
      access_token: this.createAccessToken(user1.email, user1.role).accessToken,
    };
    return data;
  }
  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Invalid Email Or Password');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid Email Or Password');
    }
    const user1 = {
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const data = {
      user: user1,
      access_token: this.createAccessToken(user1.email, user1.role).accessToken,
    };
    return data;
  }
  async forgotPassword(email: string): Promise<void> {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    await this.forgotService.create({
      hash,
      user,
    });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }
  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne({
      where: {
        hash,
      },
    });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = forgot.user;
    user.password = password;

    await user.save();

    await this.forgotService.softDelete(forgot.id);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    if (userDto.password) {
      if (userDto.oldPassword) {
        const currentUser = await this.usersService.findOne(userJwtPayload[0].id);

        if (!currentUser) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                user: 'userNotFound',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        const [salt, storedHash] = currentUser.password.split('.');

        const hash = (await scrypt(userDto.oldPassword, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.usersService.update(userJwtPayload[0].id, userDto);

      return this.usersService.findOne(userJwtPayload[0].id);
    }
  }
}
