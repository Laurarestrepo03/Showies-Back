/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowDto } from './show.dto';
import { ShowEntity } from './show.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('shows')
@UseInterceptors(BusinessErrorsInterceptor)
export class ShowController {

    constructor(private readonly showService: ShowService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SHOW_ADMIN, Role.SHOW_READ)
    @Get()
    async findAll() {
        return await this.showService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SHOW_ADMIN, Role.SHOW_READ)
    @Get(':showId')
     async findOne(@Param('showId') showId: string) {
        return await this.showService.findOne(showId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SHOW_ADMIN, Role.SHOW_WRITE)
    @Post()
    async create(@Body() showDto: ShowDto) {
        const show: ShowEntity = plainToInstance(ShowEntity, showDto);
        return await this.showService.create(show);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SHOW_ADMIN, Role.SHOW_WRITE)
    @Put(':showId')
    async update(@Param('showId') showId: string, @Body() showDto: ShowDto) {
      const show: ShowEntity = plainToInstance(ShowEntity, showDto);
      return await this.showService.update(showId, show);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SHOW_ADMIN, Role.SHOW_DELETE)
    @Delete(':showId')
    @HttpCode(204)
    async delete(@Param('showId') showId: string) {
        return await this.showService.delete(showId);
    }

}
