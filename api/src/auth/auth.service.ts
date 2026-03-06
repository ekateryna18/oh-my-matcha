import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.usersService.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      dateOfBirth: new Date(dto.dateOfBirth),
      newsletterSubscribed: dto.newsletterSubscribed ?? false,
      cookieConsents: {
        marketing: dto.cookieConsents.marketing,
        functional: dto.cookieConsents.functional,
        version: dto.cookieConsents.version,
        date: new Date(),
      },
    });
  }
}
