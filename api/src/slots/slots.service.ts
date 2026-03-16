import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from './schemas/slot.schema';

const SLOT_START_MINUTES = 11 * 60;      // 11:00
const SLOT_END_MINUTES   = 18 * 60 + 45; // 18:45
const SLOT_INTERVAL      = 15;
const MAX_ORDERS_PER_SLOT = 5;

function toHHmm(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class SlotsService {
  constructor(@InjectModel(Slot.name) private slotModel: Model<SlotDocument>) {}

  async getAvailableSlots(): Promise<SlotDocument[]> {
    const date = todayDate();
    const existing = await this.slotModel.countDocuments({ date }).exec();

    if (existing === 0) {
      await this.generateSlotsForDate(date);
    }

    return this.slotModel
      .find({ date, $expr: { $lt: ['$currentOrders', '$maxOrders'] } })
      .sort({ time: 1 })
      .exec();
  }

  async incrementSlot(time: string, date: string): Promise<void> {
    await this.slotModel
      .findOneAndUpdate({ time, date }, { $inc: { currentOrders: 1 } })
      .exec();
  }

  private async generateSlotsForDate(date: string): Promise<void> {
    const slots: { time: string; date: string; maxOrders: number; currentOrders: number }[] = [];
    for (let m = SLOT_START_MINUTES; m <= SLOT_END_MINUTES; m += SLOT_INTERVAL) {
      slots.push({ time: toHHmm(m), date, maxOrders: MAX_ORDERS_PER_SLOT, currentOrders: 0 });
    }
    await this.slotModel.insertMany(slots, { ordered: false }).catch(() => {
      // ignore duplicate key errors on race conditions
    });
  }
}
