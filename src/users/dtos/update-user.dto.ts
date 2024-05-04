import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;
}
