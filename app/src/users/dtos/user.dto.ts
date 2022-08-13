import { Exclude, Expose } from 'class-transformer';

export class UserDTO {
  @Expose()
  id: string;

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
  isVerified: boolean;

  @Expose()
  playedToday: boolean;

  @Exclude()
  password: string;
}
