import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { SubscribeDto } from './dto/subscribe.dto';
import {
  NewsletterSubscription,
  NewsletterSubscriptionDocument,
} from './schemas/newsletter-subscription.schema';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(NewsletterSubscription.name)
    private subModel: Model<NewsletterSubscriptionDocument>,
    private usersService: UsersService,
  ) {}

  async subscribe(
    dto: SubscribeDto,
    user: UserDocument | null,
  ): Promise<NewsletterSubscriptionDocument> {
    const existing = await this.subModel.findOne({ email: dto.email.toLowerCase() }).exec();

    if (existing) {
      if (existing.active) {
        throw new BadRequestException('Cette adresse est déjà inscrite à la newsletter.');
      }
      // Re-activate a previously unsubscribed address
      existing.active = true;
      existing.unsubscribeDate = undefined;
      existing.consentDate = new Date();
      await existing.save();

      if (user && !existing.bonusPointsCredited) {
        await this.creditBonus(user._id.toString(), existing);
      }
      return existing;
    }

    const sub = new this.subModel({
      email: dto.email.toLowerCase(),
      userId: user?._id ?? undefined,
      consentDate: new Date(),
      bonusPointsCredited: false,
      active: true,
    });
    await sub.save();

    // Credit +5 pts once, only for registered users
    if (user) {
      await this.creditBonus(user._id.toString(), sub);
    }

    return sub;
  }

  async unsubscribe(dto: SubscribeDto): Promise<void> {
    const sub = await this.subModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (!sub || !sub.active) {
      throw new NotFoundException('Adresse non trouvée ou déjà désabonnée.');
    }
    sub.active = false;
    sub.unsubscribeDate = new Date();
    await sub.save();
    // TODO: notify Brevo API when BREVO_API_KEY is configured
  }

  private async creditBonus(
    userId: string,
    sub: NewsletterSubscriptionDocument,
  ): Promise<void> {
    const user = (await this.usersService.findById(userId)) as UserDocument;
    await this.usersService.updateById(userId, {
      loyaltyPoints: user.loyaltyPoints + 5,
      loyaltyHistory: [
        ...user.loyaltyHistory,
        {
          date: new Date(),
          amount: 5,
          reason: 'Bonus inscription newsletter',
        },
      ],
    } as never);
    sub.bonusPointsCredited = true;
    await sub.save();
  }
}
