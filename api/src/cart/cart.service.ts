import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Response } from 'express';
import { ProductsService } from '../products/products.service';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  private setCartCookie(res: Response, cartId: string): void {
    res.cookie('cart_id', cartId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      // Session cookie — no maxAge
    });
  }

  private toResponse(cart: CartDocument) {
    const obj = cart.toObject();
    const totalAmount = obj.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    return { ...obj, totalAmount: Math.round(totalAmount * 100) / 100 };
  }

  async getCart(userId: string, res: Response) {
    let cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [] });
      this.setCartCookie(res, cart._id.toString());
    }
    return this.toResponse(cart);
  }

  async addItem(userId: string, dto: AddItemDto, res: Response) {
    const product = await this.productsService.findById(dto.productId);
    if (!product.available) {
      throw new NotFoundException('Ce produit n\'est plus disponible.');
    }

    let cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [] });
      this.setCartCookie(res, cart._id.toString());
    }

    cart.items.push({
      productId: new Types.ObjectId(dto.productId),
      quantity: dto.quantity ?? 1,
      unitPrice: product.price,
      customization: dto.customization ?? {},
    } as never);

    await cart.save();
    return this.toResponse(cart);
  }

  async getCartDocument(userId: string) {
    return this.cartModel.findOne({ userId }).exec();
  }

  async clearByUserId(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate({ userId }, { $set: { items: [] } }).exec();
  }

  async removeItem(userId: string, itemId: string) {
    if (!isValidObjectId(itemId)) {
      throw new NotFoundException('Article introuvable.');
    }

    const cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) throw new NotFoundException('Panier introuvable.');

    const before = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId,
    ) as never;

    if (cart.items.length === before) {
      throw new NotFoundException('Article introuvable.');
    }

    await cart.save();
    return this.toResponse(cart);
  }
}
