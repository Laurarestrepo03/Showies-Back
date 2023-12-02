/* eslint-disable prettier/prettier */
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from './showies/genre/genre.module';
import { GenreShowModule } from './showies/genre-show/genre-show.module';
import { GenreEntity } from './showies/genre/genre.entity';
import { ShowModule } from './showies/show/show.module';
import { ShowEntity } from './showies/show/show.entity';
import { UserModule } from './showies/user/user.module';
import { UserEntity } from './showies/user/user.entity';
import { WatchingModule } from './showies/watching/watching.module';
import { WatchingEntity } from './showies/watching/watching.entity';
import { ShowGenreModule } from './showies/show-genre/show-genre.module';
import { UserWatchingModule } from './showies/user-watching/user-watching.module';
import { ShowWatchingModule } from './showies/show-watching/show-watching.module';
import { Connection } from 'typeorm';
import { ApiUserModule } from './api-user/api-user.module';
import { AuthModule } from './auth/auth.module';
import * as fs from 'fs';

@Module({
  imports: [GenreModule, GenreShowModule, ShowModule, UserModule, WatchingModule, ShowGenreModule, ShowWatchingModule, UserWatchingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'showies',
      entities: [GenreEntity, ShowEntity, UserEntity, WatchingEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
      //logging: true
    }),
    ApiUserModule,
    AuthModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    try {
      await this.connection.transaction(async (queryRunner) => {
        const sqlFilePath = 'src/sql/data.sql';
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
        await queryRunner.query(sqlScript);
      });
    } catch (error) {
      console.error('Error running database setup:', error);
    }
  }
}