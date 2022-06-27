import {IsBoolean} from "class-validator";

export class ModifyGameActivePoolStatusDTO {
    @IsBoolean()
    status: boolean;
}