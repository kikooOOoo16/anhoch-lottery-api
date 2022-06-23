import {Expose} from "class-transformer";

export class UserDTO {
    @Expose()
    _id: string;

    @Expose()
    firstname: string;

    @Expose()
    lastname: string;

    @Expose()
    email: string;

    @Expose()
    city: string;

    @Expose()
    age: number;

    @Expose()
    phone: string;
}