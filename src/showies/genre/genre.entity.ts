/* eslint-disable prettier/prettier */
import { ShowEntity } from '../show/show.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GenreEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameEN: string;

  @Column()
  nameES: string;

  @Column()
  nameFR: string;

  @ManyToMany(() => ShowEntity, show => show.genres, { cascade: true })
  shows: ShowEntity[];

}
