import {
  Controller,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  UseGuards,
  Delete,
  Patch,
  Query,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { Article } from './article.entity';
import { RoleEnum } from 'src/users/roles.enum';
import { Roles } from 'src/users/decorators/roles.decorator';
import { JwtGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { infinityPagination } from 'src/utils/types/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('articles')
@ApiBearerAuth()
@Roles(RoleEnum['store manager'])
@UseGuards(JwtGuard, RolesGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createProfileDto: CreateArticleDto,
    @CurrentUser() user: User,
  ): Promise<Article> {
    return this.articleService.create(createProfileDto, user[0].id);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<Article>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.articleService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Article>> {
    console.log('hello');
    return this.articleService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.update(id, updateProfileDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.articleService.Delete(id);
  }
}
