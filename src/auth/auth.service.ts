/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiUser } from '../api-user/api-user';
import { ApiUserService } from '../api-user/api-user.service';
import constants from '../shared/security/constants';

@Injectable()
export class AuthService {
   constructor(
       private apiUserService: ApiUserService,
       private jwtService: JwtService
   ) {}

   async validateUser(username: string, password: string): Promise<any> {
       const apiUser: ApiUser = await this.apiUserService.findOne(username);
       if (apiUser && apiUser.password === password) {
           // eslint-disable-next-line @typescript-eslint/no-unused-vars
           const { password, ...result } = apiUser;
           return result;
       }
       return null;
   }

   async login(req: any) {
    const payload = { username: req.user.username, sub: req.user.id, roles: req.user.roles };
    return {
        token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET, expiresIn:constants.JWT_EXPIRES_IN }),
    };
}
}
