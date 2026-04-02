import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(3)
    password: string;
}