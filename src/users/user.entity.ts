import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  Index
} from 'typeorm';
import { EntityHelper } from '../utils/entity-helper';
import { Exclude } from 'class-transformer';
import { promisify } from 'util';
import { randomBytes, scrypt as _script } from 'node:crypto';
const scrypt = promisify(_script);
@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    default: 'user',
    enum: ['user', 'admin', 'vendor', 'store manager', 'inventory manager'],
  })
  role: string;

  // @AfterInsert()
  // logInsert() {
  //   console.log('Inserted User with id', this.id);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Updated User with id', this.id);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('Removed User with id', this.id);
  // }
  @Exclude({ toPlainOnly: true })
  public previousPassword: string;
  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }
  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      // 2- Hash The users Password
      // 2.1 - Generate Salt
      const salt = randomBytes(8).toString('hex');
      // 2.2 - Hash the password and the salt together
      const hash = (await scrypt(this.password, salt, 32)) as Buffer;
      // 2.3 - Join The hashed result and the salt together
      this.password = salt + '.' + hash.toString('hex');
    }
  }
}
