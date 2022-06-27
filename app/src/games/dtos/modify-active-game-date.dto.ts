import {IsNumber, Max, Min} from "class-validator";

export class ModifyActiveGameDateDTO {
    @IsNumber()
    @Min(1)
    @Max(31)
    day: number;

    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @IsNumber()
    @Min(2022)
    @Max(2052)
    year: number;
}