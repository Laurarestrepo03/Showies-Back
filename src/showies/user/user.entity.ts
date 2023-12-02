/* eslint-disable prettier/prettier */
import { WatchingEntity } from '../watching/watching.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => WatchingEntity, (watching) => watching.user)
  watching: WatchingEntity[];
}
