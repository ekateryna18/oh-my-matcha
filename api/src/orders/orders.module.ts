import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { SlotsModule } from '../slots/slots.module';
import { UsersModule } from '../users/users.module';
import { OrdersController, UserOrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UsersModule,
    SlotsModule,
    CartModule,
    ProductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController, UserOrdersController],
})
export class OrdersModule {}
