import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private slotsService: SlotsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAvailableSlots() {
    return this.slotsService.getAvailableSlots();
  }
}
