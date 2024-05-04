import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
