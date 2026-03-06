import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect.');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect.');

    const token = this.jwtService.sign({ sub: user._id.toString(), email: user.email });
    return { token, user };
  }
}
