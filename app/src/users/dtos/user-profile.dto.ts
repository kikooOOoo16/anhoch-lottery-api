import { Expose } from 'class-transformer';

export class UserProfileDTO {
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
}
