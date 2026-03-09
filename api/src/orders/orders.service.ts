import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { SlotsService } from '../slots/slots.service';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private usersService: UsersService,
    private slotsService: SlotsService,
    private cartService: CartService,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    const user = (await this.usersService.findById(userId)) as UserDocument;

    if (!user.billingAddress) {
      throw new BadRequestException(
        'Veuillez renseigner votre adresse de facturation avant de commander.',
      );
    }

    const cart = await this.cartService.getCartDocument(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Votre panier est vide.');
    }

    const availableSlots = await this.slotsService.getAvailableSlots();
    if (!availableSlots.find((s) => s.time === dto.pickupSlot)) {
      throw new BadRequestException('Ce créneau n\'est pas disponible.');
    }

    const applyCredit = dto.applyCredit ?? false;
    if (applyCredit && user.loyaltyPoints < 50) {
      throw new BadRequestException(
        'Vous n\'avez pas assez de points pour utiliser le crédit.',
      );
    }

    // Snapshot items with product name at order time
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findById(item.productId.toString());
        return {
          productId: item.productId,
          name: product.name,
          price: item.unitPrice,
          quantity: item.quantity,
          customization: (item.customization ?? {}) as Record<string, string>,
        };
      }),
    );

    const totalAmount =
      Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
    const creditApplied = applyCredit ? 5 : 0;
    const finalAmount = Math.round((totalAmount - creditApplied) * 100) / 100;
    const loyaltyPointsEarned = Math.floor(finalAmount);

    const count = await this.orderModel.countDocuments().exec();
    const year = new Date().getFullYear();
    const orderNumber = `OMM-${year}-${String(count + 1).padStart(4, '0')}`;

    const order = new this.orderModel({
      orderNumber,
      userId: new Types.ObjectId(userId),
      items,
      totalAmount,
      creditApplied,
      finalAmount,
      pickupSlot: dto.pickupSlot,
      status: OrderStatus.PENDING,
      billingAddress: { ...user.billingAddress },
      loyaltyPointsEarned,
    });

    return order.save();
  }

  async confirm(orderId: string, userId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order || order.userId.toString() !== userId) {
      throw new NotFoundException('Commande introuvable.');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cette commande ne peut plus être confirmée.');
    }

    order.status = OrderStatus.CONFIRMED;
    await order.save();

    await this.slotsService.incrementSlot(order.pickupSlot, todayDate());

    const user = (await this.usersService.findById(userId)) as UserDocument;
    let newPoints = user.loyaltyPoints + order.loyaltyPointsEarned;
    if (order.creditApplied > 0) newPoints -= 50;

    await this.usersService.updateById(userId, {
      loyaltyPoints: newPoints,
      loyaltyHistory: [
        ...user.loyaltyHistory,
        {
          date: new Date(),
          amount: order.loyaltyPointsEarned,
          reason: `Commande ${order.orderNumber}`,
          orderId: order._id.toString(),
        },
      ],
    } as never);

    await this.cartService.clearByUserId(userId);

    return order;
  }

  async findByUser(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
