import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Match } from '../decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
export class SignUpDto {
  @ApiProperty({ example: 'test' })
  @MaxLength(255)
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
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
  @ApiProperty()
  @Match('password')
  @IsNotEmpty()
  readonly passwordConfirm: string;
}
