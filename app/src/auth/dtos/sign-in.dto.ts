import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class SignInDTO {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(9)
    @MaxLength(30)
    password: string;
}