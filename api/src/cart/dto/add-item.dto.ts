import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CustomizationDto {
  @IsString()
  @IsOptional()
  flavour?: string;

  @IsString()
  @IsOptional()
  syrup?: string;

  @IsString()
  @IsOptional()
  sweetnessLevel?: string;

  @IsString()
  @IsOptional()
  temperature?: string;

  @IsString()
  @IsOptional()
  milkType?: string;
}

export class AddItemDto {
  @IsMongoId()
  productId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ValidateNested()
  @Type(() => CustomizationDto)
  @IsOptional()
  customization?: CustomizationDto;
}
