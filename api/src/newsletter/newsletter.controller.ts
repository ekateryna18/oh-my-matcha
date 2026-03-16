import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { SubscribeDto } from './dto/subscribe.dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  /**
   * POST /newsletter/subscribe
   * Public — no auth required.
   * If a valid JWT is present, the logged-in user gets +5 loyalty pts (once ever).
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  subscribe(@Body() dto: SubscribeDto, @Req() req: Request) {
    const user = (req.user as UserDocument) ?? null;
    return this.newsletterService.subscribe(dto, user);
  }

  /**
   * DELETE /newsletter/unsubscribe
   * Public — GDPR right to opt out.
   */
  @Delete('unsubscribe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(@Body() dto: SubscribeDto) {
    await this.newsletterService.unsubscribe(dto);
  }
}
