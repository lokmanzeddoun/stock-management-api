import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    JwtModule.register({ secret: '$up3r$3cr3t' }),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesModule],
})
export class ArticlesModule {}
