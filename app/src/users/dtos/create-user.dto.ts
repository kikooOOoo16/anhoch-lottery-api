import {IsEmail, IsNumber, IsString, Matches, Max, MaxLength, Min, MinLength} from "class-validator";

export class CreateUserDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    firstname: string;

    @IsString()
    @MinLength(3)
    @MaxLength(40)
    lastname: string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    city: string;

    @IsNumber()
    @Min(10)
    @Max(90)
    age: number;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(9)
    @MaxLength(30)
    password: string;

    @Matches(/((00)?\+?[389]{3})?[\/\-\s*\.]?(((\(0\))|0)?\s*7\d{1})[\/\-\s*\.\,]?([\d]{3})[\/\-\s*\.\,]?([\d]{3})/g, {
        message: 'Please enter a valid mobile number.'
    })
    phone: number;
}