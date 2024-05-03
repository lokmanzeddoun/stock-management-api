import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import { Allow } from 'class-validator';

@Entity()
export class Article extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    name: 'title',
    length: 75,
    nullable: false,
    unique: true,
  })
  title: string;
  @Column('varchar', { name: 'description', nullable: true, length: 100 })
  description: string | null;
  @Column('float', { name: 'price', precision: 12, default: () => "'0'" })
  price: number;

  @Column('datetime', { name: 'expiredAt' })
  expiredAt: Date;
  @Allow()
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
