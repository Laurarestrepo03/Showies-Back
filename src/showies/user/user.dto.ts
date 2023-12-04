/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
    
    @IsString()
    @IsNotEmpty()
    readonly password: string;

}
