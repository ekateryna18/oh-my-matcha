import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as UserDocument;
    return this.cartService.getCart(user._id.toString(), res);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addItem(
    @Req() req: Request,
    @Body() dto: AddItemDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as UserDocument;
    return this.cartService.addItem(user._id.toString(), dto, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':itemId')
  removeItem(@Req() req: Request, @Param('itemId') itemId: string) {
    const user = req.user as UserDocument;
    return this.cartService.removeItem(user._id.toString(), itemId);
  }
}
