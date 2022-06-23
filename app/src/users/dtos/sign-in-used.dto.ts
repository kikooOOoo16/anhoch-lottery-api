import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class SignInUsedDTO {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(9)
    @MaxLength(30)
    password: string;
}