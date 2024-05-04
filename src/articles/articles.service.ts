import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { NullableType } from 'src/utils/types/nullable.type';

import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from 'src/users/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(
    createProfileDto: CreateArticleDto,
    userId: User['id'],
  ): Promise<Article> {
    const [articles] = await this.articlesRepository.find({
      where: { title: createProfileDto.title },
    });
    if (articles) {
      throw new BadRequestException('Article Already Exist');
    }
    const originalDate = new Date(createProfileDto.expiredAt);
    if (originalDate < new Date()) {
      throw new BadRequestException('This Article Is Expired');
    }
    Object.assign(createProfileDto, { user: userId });
    return this.articlesRepository.save(createProfileDto);
  }
  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Article[]> {
    return this.articlesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }
  findOne(fields: EntityCondition<Article>): Promise<NullableType<Article>> {
    return this.articlesRepository.findOne({
      where: fields,
    });
  }

  async update(
    id: Article['id'],
    payload: DeepPartial<Article>,
  ): Promise<Article> {
    console.log(payload);
    const article = await this.articlesRepository.findOne({
      where: { id: id },
    });
    if (!article) {
      throw new Error('article not found');
    }
    Object.assign(article, payload);
    return this.articlesRepository.save(article);
  }

  async Delete(id: Article['id']): Promise<void> {
    await this.articlesRepository.delete(id);
  }
}
