/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { GenreDto } from './genre.dto';
import { GenreEntity } from './genre.entity';
import { GenreService } from './genre.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('genres')
@UseInterceptors(BusinessErrorsInterceptor)
export class GenreController {
  
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.GENRE_ADMIN, Role.GENRE_READ)
  @Get()
  async findAll() {
    return await this.genreService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.GENRE_ADMIN, Role.GENRE_READ)
  @Get(':genreId')
  async findOne(@Param('genreId') genreId: string) {
    return await this.genreService.findOne(genreId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.GENRE_ADMIN, Role.GENRE_WRITE)
  @Post()
  async create(@Body() genreDto: GenreDto) {
    const genre: GenreEntity = plainToInstance(GenreEntity, genreDto);
    return await this.genreService.create(genre);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.GENRE_ADMIN, Role.GENRE_WRITE)
  @Put(':genreId')
  async update(@Param('genreId') genreId: string, @Body() genreDto: GenreDto) {
    const genre: GenreEntity = plainToInstance(GenreEntity, genreDto);
    return await this.genreService.update(genreId, genre);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.GENRE_ADMIN, Role.GENRE_DELETE)
  @Delete(':genreId')
  @HttpCode(204)
  async delete(@Param('genreId') genreId: string) {
    return await this.genreService.delete(genreId);
  }
}

