/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { ShowGenreService } from './show-genre.service';
import { ShowEntity } from '../show/show.entity';
import { ShowDto } from '../show/show.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('genres')
@UseInterceptors(BusinessErrorsInterceptor)
export class ShowGenreController {
   constructor(private readonly showGenreService: ShowGenreService){}

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN, Role.SHOW_GENRE_ADMIN, Role.SHOW_GENRE_READ)
   @Get(':genreId/shows/:showId')
   async findShowByGenreIdShowId(@Param('genreId') genreId: string, @Param('showId') showId: string){
       return await this.showGenreService.findShowByGenreIdShowId(genreId, showId);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN, Role.SHOW_GENRE_ADMIN, Role.SHOW_GENRE_READ)
   @Get(':genreId/shows')
   async findShowsByGenreId(@Param('genreId') genreId: string){
       return await this.showGenreService.findShowsByGenreId(genreId);
   }
   
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN, Role.SHOW_GENRE_ADMIN, Role.SHOW_GENRE_WRITE)
   @Post(':genreId/shows/:showId')
   async addShowToGenre(@Param('genreId') genreId: string, @Param('showId') showId: string){
       return await this.showGenreService.addShowToGenre(genreId, showId);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN, Role.SHOW_GENRE_ADMIN, Role.SHOW_GENRE_WRITE)
   @Put(':genreId/shows')
   async associateShowsGenre(@Body() showsDto: ShowDto[], @Param('genreId') genreId: string){
       const shows = plainToInstance(ShowEntity, showsDto)
       return await this.showGenreService.associateShowsGenre(genreId, shows);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN, Role.SHOW_GENRE_ADMIN, Role.SHOW_GENRE_DELETE)
   @Delete(':genreId/shows/:showId')
   @HttpCode(204)
   async deleteShowGenre(@Param('genreId') genreId: string, @Param('showId') showId: string){
       return await this.showGenreService.deleteShowGenre(genreId, showId);
   }
}