import {IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UpdateAdminDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    firstName: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(40)
    lastName: string;
}