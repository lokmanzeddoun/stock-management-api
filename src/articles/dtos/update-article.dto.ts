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

export class UpdateArticleDto {
  @ApiProperty({ example: 'The New Article' })
  @IsOptional()
  @IsNotEmpty()
  title: string | null;
  @ApiProperty()
  @IsOptional()
  description?: string;
  @ApiProperty({ example: 29.99 })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price: number | null;
}
