import {IsNumber, Max, Min} from "class-validator";

export class ModifyCommercialsWatchDurationDTO {
    @IsNumber()
    @Min(3)
    @Max(20)
    minimumWatchSeconds: number;
}