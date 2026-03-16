import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  findAll(category?: string): Promise<ProductDocument[]> {
    const filter: Record<string, unknown> = { available: true };
    if (category) filter.category = category;
    return this.productModel.find(filter).exec();
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Produit introuvable.');
    }
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Produit introuvable.');
    return product;
  }
}
