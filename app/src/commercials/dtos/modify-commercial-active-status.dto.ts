import { IsBoolean } from 'class-validator';

export class ModifyCommercialActiveStatusDTO {
  @IsBoolean()
  isActive: boolean;
}
