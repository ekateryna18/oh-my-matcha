import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Req, Res, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateConsentsDto } from './dto/update-consents.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as UserDocument;
    const data: Record<string, unknown> = { ...dto };

    if (dto.dateOfBirth) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }

    // Set newsletterConsentDate server-side when user subscribes for the first time
    if (dto.newsletterSubscribed === true && !user.newsletterSubscribed) {
      data.newsletterConsentDate = new Date();
    }

    return this.usersService.updateById(user._id.toString(), data as never);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/consents')
  updateConsents(@Req() req: Request, @Body() dto: UpdateConsentsDto) {
    const user = req.user as UserDocument;
    return this.usersService.updateById(user._id.toString(), {
      cookieConsents: {
        marketing: dto.marketing,
        functional: dto.functional,
        version: dto.version,
        date: new Date(),
      },
    } as never);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as UserDocument;
    await this.usersService.deleteById(user._id.toString());
    res.clearCookie('auth_token');
  }
}
