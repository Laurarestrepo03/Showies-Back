/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import constants from '../shared/security/constants';
import { ApiUserModule } from '../api-user/api-user.module';
import { ApiUserService } from '../api-user/api-user.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    ApiUserModule,
    PassportModule,
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
    })
  ],
  providers: [AuthService, ApiUserService, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
