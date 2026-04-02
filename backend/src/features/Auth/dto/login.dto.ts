import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(3)
    password: string;
}