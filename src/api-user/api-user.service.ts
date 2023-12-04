/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ApiUser } from './api-user';
import { Role } from '../roles/role.enum';

@Injectable()
export class ApiUserService {
    private users: ApiUser[] = [
        new ApiUser(0, "admin", "admin", [Role.ADMIN]),
        
        new ApiUser(1, "genre_admin", "genre_admin", [Role.GENRE_ADMIN]),
        new ApiUser(2, "genre_read", "genre_read", [Role.GENRE_READ]),
        new ApiUser(3, "genre_write", "genre_write", [Role.GENRE_WRITE]),
        new ApiUser(4, "genre_delete", "genre_delete", [Role.GENRE_DELETE]),

        new ApiUser(5, "genre_show_admin", "genre_show_admin", [Role.GENRE_SHOW_ADMIN]),
        new ApiUser(6, "genre_show_read", "genre_show_read", [Role.GENRE_SHOW_READ]),
        new ApiUser(7, "genre_show_write", "genre_show_write", [Role.GENRE_SHOW_WRITE]),
        new ApiUser(8, "genre_show_delete", "genre_show_delete", [Role.GENRE_SHOW_DELETE]),

        new ApiUser(9, "show_admin", "show_admin", [Role.SHOW_ADMIN]),
        new ApiUser(10, "show_read", "show_read", [Role.SHOW_READ]),
        new ApiUser(11, "show_write", "show_write", [Role.SHOW_WRITE]),
        new ApiUser(12, "show_delete", "show_delete", [Role.SHOW_DELETE]),

        new ApiUser(13, "show_genre_admin", "show_genre_admin", [Role.SHOW_GENRE_ADMIN]),
        new ApiUser(14, "show_genre_read", "show_genre_read", [Role.SHOW_GENRE_READ]),
        new ApiUser(15, "show_genre_write", "show_genre_write", [Role.SHOW_GENRE_WRITE]),
        new ApiUser(16, "show_genre_delete", "show_genre_delete", [Role.SHOW_GENRE_DELETE]),

        new ApiUser(17, "show_watching_admin", "show_watching_admin", [Role.SHOW_WATCHING_ADMIN]),
        new ApiUser(18, "show_watching_read", "show_watching_read", [Role.SHOW_WATCHING_READ]),

        new ApiUser(19, "user_admin", "user_admin", [Role.USER_ADMIN]),
        new ApiUser(20, "user_read", "user_read", [Role.USER_READ]),
        new ApiUser(21, "user_write", "user_write", [Role.USER_WRITE]),
        new ApiUser(22, "user_delete", "user_delete", [Role.USER_DELETE]),

        new ApiUser(23, "user_watching_admin", "user_watching_admin", [Role.USER_WATCHING_ADMIN]),
        new ApiUser(24, "user_watching_read", "user_watching_read", [Role.USER_WATCHING_READ]),

        new ApiUser(25, "watching_admin", "watching_admin", [Role.WATCHING_ADMIN]),
        new ApiUser(26, "watching_read", "watching_read", [Role.WATCHING_READ]),
        new ApiUser(27, "watching_write", "watching_write", [Role.WATCHING_WRITE]),
        new ApiUser(28, "watching_delete", "watching_delete", [Role.WATCHING_DELETE]),    
    ];

   async findOne(username: string): Promise<ApiUser | undefined> {
       return this.users.find(user => user.username === username);
   }
}
