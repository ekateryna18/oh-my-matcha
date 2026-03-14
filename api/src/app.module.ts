import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { SlotsModule } from './slots/slots.module';
import { OrdersModule } from './orders/orders.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to MongoDB using env variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.get('DB_USERNAME')}:${config.get('DB_PASSWORD')}@${config.get('DB_HOST')}:${config.get('DB_PORT')}/${config.get('DB_NAME', 'oh_my_matcha')}?authSource=admin`,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    ProductsModule,
    AuthModule,
    CartModule,
    SlotsModule,
    OrdersModule,
    NewsletterModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}