import { 
    IsEmail, 
    IsNotEmpty,
    IsInt,
    IsString,
    IsOptional,
    IsIn
} from 'class-validator';

import { Socket } from 'socket.io';

export class UserWsDto {
    
    // @IsInt()
    // @IsNotEmpty()
    id : number;

    // @IsString()
    // @IsOptional()
    Authorization?: string;
}

type Auth = {
    id : string,
    username : string,
    Authorization?: string,
}

export type AuthWithWs = Socket & Auth;
