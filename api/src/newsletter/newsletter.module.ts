import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import {
  NewsletterSubscription,
  NewsletterSubscriptionSchema,
} from './schemas/newsletter-subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsletterSubscription.name, schema: NewsletterSubscriptionSchema },
    ]),
    UsersModule,
  ],
  providers: [NewsletterService],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
