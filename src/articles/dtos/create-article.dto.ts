import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'The New Article' })
  @IsNotEmpty()
  title: string | null;
  @ApiProperty()
  @IsOptional()
  description?: string;
  @ApiProperty({ example: '2025-09-14' })
  @IsDateString()
  @IsNotEmpty()
  expiredAt: Date | null;
  @ApiProperty({ example: 29.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number | null;
}
