/* eslint-disable prettier/prettier */
import { WatchingEntity } from '../watching/watching.entity';
import { GenreEntity } from '../genre/genre.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';

@Entity()
export class ShowEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    
    @Column()
    poster: string;
    
    @OneToMany(() => WatchingEntity, (watching) => watching.show)
    watching: WatchingEntity[];

    @ManyToMany(() => GenreEntity, genre => genre.shows)
    @JoinTable({ name: "show_genres" })
    genres: GenreEntity[];
}