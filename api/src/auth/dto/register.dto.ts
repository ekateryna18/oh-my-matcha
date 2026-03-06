import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CookieConsentsDto {
  @IsBoolean()
  marketing: boolean;

  @IsBoolean()
  functional: boolean;

  @IsString()
  version: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsDateString()
  dateOfBirth: string;

  @IsBoolean()
  @IsOptional()
  newsletterSubscribed?: boolean;

  @ValidateNested()
  @Type(() => CookieConsentsDto)
  cookieConsents: CookieConsentsDto;
}
