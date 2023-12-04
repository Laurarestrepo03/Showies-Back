/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApiUserService } from './api-user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiUserController } from './api-user.controller';

@Module({
  providers: [ApiUserService, AuthService, JwtService],
  controllers: [ApiUserController],
})
export class ApiUserModule {}
