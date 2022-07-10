import { IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateUserDTO {
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

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  city: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(90)
  age: number;

  @IsOptional()
  @Matches(/((00)?\+?[389]{3})?[\/\-\s*.]?(((\(0\))|0)?\s*7\d)[\/\-\s*.,]?(\d{3})[\/\-\s*.,]?(\d{3})/, {
    message: 'Please enter a valid phone number.',
  })
  @IsString()
  phone: string;
}
