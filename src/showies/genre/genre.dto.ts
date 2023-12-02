/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';
export class GenreDto {

 @IsString()
 @IsNotEmpty()
 readonly nameEN: string;
 
 @IsString()
 @IsNotEmpty()
 readonly nameES: string;
 
 @IsString()
 @IsNotEmpty()
 readonly nameFR: string;
}