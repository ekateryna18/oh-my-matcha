import { IsBoolean, IsString } from 'class-validator';

export class UpdateConsentsDto {
  @IsBoolean()
  marketing: boolean;

  @IsBoolean()
  functional: boolean;

  @IsString()
  version: string;
}
