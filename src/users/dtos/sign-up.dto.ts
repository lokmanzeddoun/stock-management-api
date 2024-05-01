import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Match } from '../decorators/match.decorator';

export class SignUpDto {
  @MaxLength(255)
  @IsNotEmpty()
  readonly username: string;
  
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  readonly email: string;

  @MinLength(8, {
    message: 'password too short',
  })
  @MaxLength(20, {
    message: 'password too long',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  readonly password: string;

  @Match('password')
  @IsNotEmpty()
  readonly passwordConfirm: string;
}
