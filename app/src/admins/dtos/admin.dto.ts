import {Expose} from "class-transformer";

export class AdminDTO {
    @Expose()
    _id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;
}