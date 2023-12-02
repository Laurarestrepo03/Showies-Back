/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ShowWatchingService } from './show-watching.service';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../roles/role.enum';
import { Roles } from '../../roles/roles.decorator'; 
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('shows')
@UseInterceptors(BusinessErrorsInterceptor)
export class ShowWatchingController {

    constructor(private readonly showWatchingService: ShowWatchingService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SHOW_WATCHING_ADMIN, Role.SHOW_WATCHING_READ)
    @Get(':showId/watching')
    async findWatchingsByShowId(@Param('showId') showId: string){
       return await this.showWatchingService.findWatchingsByShowId(showId);
    }

}
