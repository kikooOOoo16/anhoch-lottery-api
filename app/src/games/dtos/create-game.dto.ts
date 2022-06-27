import {IsString, MaxLength, MinLength} from "class-validator";

export class CreateGameDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    description: string;
}