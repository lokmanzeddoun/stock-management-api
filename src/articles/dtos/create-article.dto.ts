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
  @IsNotEmpty()
  title: string | null;

  @IsOptional()
  description?: string;
  @IsDateString()
  @IsNotEmpty()
  expiredAt: Date | null;
  @IsNotEmpty()
  @IsNumber()
  price: number | null;
}
