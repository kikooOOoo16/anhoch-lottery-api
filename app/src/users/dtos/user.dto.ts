import {Expose} from "class-transformer";

export class UserDTO {
    @Expose()
    _id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    city: string;

    @Expose()
    age: number;

    @Expose()
    phone: string;

    @Expose()
    playedToday: boolean;
}