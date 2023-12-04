/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class WatchingDto {
    
    @IsString()
    @IsNotEmpty()
    readonly userId: string;
    
    @IsString()
    @IsNotEmpty()
    readonly showId: string;
    
    @IsNumber()
    @IsNotEmpty()
    readonly season: number;
    
    @IsNumber()
    @IsNotEmpty()
    readonly episode: number;
    
    @IsString()
    @IsNotEmpty()
    @Length(8, 10)
    readonly lastSeen: string;

}
