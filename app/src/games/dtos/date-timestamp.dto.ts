import {IsNumber} from "class-validator";

export class DateTimestampDTO {
    @IsNumber()
    dateTimestamp: number;
}