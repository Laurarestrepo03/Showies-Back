/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../../showies/genre/genre.entity';
import { ShowEntity } from '../../showies/show/show.entity';
import { UserEntity } from '../../showies/user/user.entity';
import { WatchingEntity } from '../../showies/watching/watching.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [GenreEntity, ShowEntity, UserEntity, WatchingEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([GenreEntity, ShowEntity, UserEntity, WatchingEntity]),
];