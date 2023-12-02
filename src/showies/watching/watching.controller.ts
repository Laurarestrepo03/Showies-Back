/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { WatchingService } from './watching.service';
import { WatchingDto } from './watching.dto';
import { WatchingEntity } from './watching.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('watching')
@UseInterceptors(BusinessErrorsInterceptor)
export class WatchingController {

    constructor(private readonly watchingService: WatchingService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.WATCHING_ADMIN, Role.WATCHING_READ)
    @Get()
    async findAll() {
        return await this.watchingService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.WATCHING_ADMIN, Role.WATCHING_READ)
    @Get(':userId/:showId')
    async findOne(@Param('userId') userId: string, @Param('showId') showId: string) {
        return await this.watchingService.findOne(userId, showId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.WATCHING_ADMIN, Role.WATCHING_WRITE)
    @Post()
    async create(@Body() watchingDto: WatchingDto) {
      const watching: WatchingEntity = plainToInstance(WatchingEntity, watchingDto);
      return await this.watchingService.create(watching);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.WATCHING_ADMIN, Role.WATCHING_WRITE)
    @Put(':userId/:showId')
    async update(@Param('userId') userId: string, @Param('showId') showId: string, @Body() watchingDto: WatchingDto) {
        const watching: WatchingEntity = plainToInstance(WatchingEntity, watchingDto);
        return await this.watchingService.update(userId, showId, watching);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.WATCHING_ADMIN, Role.WATCHING_DELETE)
    @Delete(':userId/:showId')
    @HttpCode(204)
    async delete(@Param('userId') userId: string, @Param('showId') showId: string) {
        return await this.watchingService.delete(userId, showId);
    }
    
}
