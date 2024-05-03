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
  @IsOptional()
  @IsNotEmpty()
  title: string | null;

  @IsOptional()
  description?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price: number | null;
}
