import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createProfileDto: CreateArticleDto): Promise<Article> {
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
    return this.articlesRepository.save(
      this.articlesRepository.create(createProfileDto),
    );
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

  update(id: Article['id'], payload: DeepPartial<Article>): Promise<Article> {
    return this.articlesRepository.save(
      this.articlesRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Article['id']): Promise<void> {
    await this.articlesRepository.softDelete(id);
  }
}
