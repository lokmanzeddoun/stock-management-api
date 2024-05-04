import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignInDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
