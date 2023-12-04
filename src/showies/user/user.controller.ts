/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER_ADMIN, Role.USER_READ)
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER_ADMIN, Role.USER_READ)
    @Get(':userId')
     async findOne(@Param('userId') userId: string) {
        return await this.userService.findOne(userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER_ADMIN, Role.USER_WRITE)
    @Post()
    async create(@Body() userDto: UserDto) {
        const user: UserEntity = plainToInstance(UserEntity, userDto);
        return await this.userService.create(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER_ADMIN, Role.USER_WRITE)
    @Put(':userId')
    async update(@Param('userId') userId: string, @Body() userDto: UserDto) {
      const user: UserEntity = plainToInstance(UserEntity, userDto);
      return await this.userService.update(userId, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER_ADMIN, Role.USER_DELETE)
    @Delete(':userId')
    @HttpCode(204)
    async delete(@Param('userId') userId: string) {
        return await this.userService.delete(userId);
    }

}
