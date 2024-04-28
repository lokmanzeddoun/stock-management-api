import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _script } from 'crypto';
import { NotFoundError } from 'rxjs';
import { promisify } from 'util';

const scrypt = promisify(_script);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string) {
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
    const user = await this.usersService.create(email, result);
    // 4-return The user
    return user;
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
    return user;
  }
}
