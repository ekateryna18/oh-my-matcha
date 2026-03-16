import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const user = req.user as UserDocument;
    return this.ordersService.create(user._id.toString(), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirm')
  confirm(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as UserDocument;
    return this.ordersService.confirm(id, user._id.toString());
  }
}

// Separate controller for the /users/me/orders route
@Controller('users')
export class UserOrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/orders')
  getMyOrders(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.ordersService.findByUser(user._id.toString());
  }
}
