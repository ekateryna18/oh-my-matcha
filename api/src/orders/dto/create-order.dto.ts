import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  pickupSlot: string; // e.g. "13:00"

  @IsBoolean()
  @IsOptional()
  applyCredit?: boolean;
}
