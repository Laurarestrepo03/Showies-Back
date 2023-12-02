/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class ShowDto {
    
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsUrl()
    @IsNotEmpty()
    readonly poster: string;

}