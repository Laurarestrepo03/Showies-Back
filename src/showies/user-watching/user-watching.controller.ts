/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserWatchingService } from './user-watching.service';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserWatchingController {

    constructor(private readonly userWatchingService: UserWatchingService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.USER_WATCHING_ADMIN, Role.USER_WATCHING_READ)
    @Get(':userId/watching')
    async findWatchingsByUserId(@Param('userId') userId: string){
       return await this.userWatchingService.findWatchingsByUserId(userId);
    }

}
