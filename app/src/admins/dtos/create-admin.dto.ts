import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class CreateAdminDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    firstName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(40)
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(9)
    @MaxLength(30)
    password: string;

    @IsString()
    @MinLength(9)
    @MaxLength(30)
    masterPassword: string;
}