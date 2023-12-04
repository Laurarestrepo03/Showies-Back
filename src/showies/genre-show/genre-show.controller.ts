/* eslint-disable prettier/prettier */
import { Controller,Get, Post,Put,Delete, Param, Body, HttpCode, UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { GenreShowService } from './genre-show.service';
import { GenreDto } from '../genre/genre.dto';
import { GenreEntity } from '../genre/genre.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('shows')
@UseInterceptors(BusinessErrorsInterceptor)
export class GenreShowController {
    constructor(private readonly genreShowService: GenreShowService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.GENRE_SHOW_ADMIN, Role.GENRE_SHOW_READ)
    @Get(':showId/genres')
    async findGenresByShowId(@Param('showId') showId: string){
        return await this.genreShowService.findGenresByShowId(showId);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.GENRE_SHOW_ADMIN, Role.GENRE_SHOW_READ)
    @Get(':showId/genres/:genreId')
    async findGenreByShowIdGenreId(@Param('showId') showId: string, @Param('genreId') genreId: string){
        return await this.genreShowService.findGenreByShowIdGenreId(showId, genreId);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.GENRE_SHOW_ADMIN, Role.GENRE_SHOW_WRITE)
    @Post(':showId/genres/:genreId')
    async addGenreToShow(@Param('showId') showId: string, @Param('genreId') genreId: string){
        return await this.genreShowService.addGenreToShow(showId, genreId);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.GENRE_SHOW_ADMIN, Role.GENRE_SHOW_WRITE)
    @Put(':showId/genres')
    async associateShowsGenre(@Body() genresDto: GenreDto[], @Param('showId') showId: string){
        const genres = plainToInstance(GenreEntity, genresDto)
        return await this.genreShowService.associateGenreShows(showId, genres);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.GENRE_SHOW_ADMIN, Role.GENRE_SHOW_DELETE)
    @Delete(':showId/genres/:genreId')
    @HttpCode(204)
    async deleteGenreShow(@Param('showId') showId: string, @Param('genreId') genreId: string){
        return await this.genreShowService.deleteGenreShow(showId, genreId);
    }

}
