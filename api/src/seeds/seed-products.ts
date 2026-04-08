import mongoose, { Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// ─── Raw Mongoose schema (mirrors product.schema.ts) ──────────────────────────

const ProductSchema = new Schema(
  {
    name: String,
    description: String,
    category: { type: String, enum: ['matcha', 'bubble_tea', 'mochi', 'tea'] },
    price: Number,
    image: String,
    customizationOptions: {
      flavours: [String],
      syrups: [String],
      sweetnessLevel: [String],
      temperature: [String],
      milkType: [String],
    },
    allergens: [String],
    hasMilk: Boolean,
    available: Boolean,
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);

// ─── Shared option lists ──────────────────────────────────────────────────────

const ALL_MILK_TYPES = ["lait de vache", "lait d'avoine", "lait d'amande", "lait de soja"];
const ALL_SWEETNESS  = ['sans sucre', 'peu sucré', 'normal', 'très sucré'];
const ALL_TEMPS      = ['chaud', 'froid / glacé'];
const ALL_SYRUPS     = ['sans sirop', 'sirop de vanille', 'sirop de caramel', 'sirop de lavande'];

// ─── Seed data ────────────────────────────────────────────────────────────────

const products = [
  // ── Matcha ─────────────────────────────────────────────────────────────────
  {
    name: 'Matcha',
    description: 'Notre matcha de cérémonie sourcé directement à Uji, Japon. Pur, onctueux et délicat.',
    category: 'matcha',
    price: 5.50,
    image: '/images/products/matcha.jpg',
    customizationOptions: {
      flavours: ['original', 'vanille', 'caramel'],
      syrups: ALL_SYRUPS,
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPS,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait'],
    hasMilk: true,
    available: true,
  },
  {
    name: 'Matcha Fraise',
    description: 'Le mariage parfait du matcha cérémonial et de la fraise fraîche. Doux, fruité et irrésistible.',
    category: 'matcha',
    price: 6.00,
    image: '/images/products/matcha-fraise.jpg',
    customizationOptions: {
      flavours: ['original', 'fruits rouges'],
      syrups: ['sans sirop', 'sirop de lavande'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPS,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait'],
    hasMilk: true,
    available: true,
  },
  {
    name: 'Matcha Vanille',
    description: 'La douceur de la vanille de Madagascar rencontre l\'intensité du matcha. Un équilibre parfait.',
    category: 'matcha',
    price: 6.00,
    image: '/images/products/matcha-vanille.jpg',
    customizationOptions: {
      flavours: ['original', 'vanille'],
      syrups: ['sans sirop', 'sirop de vanille'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPS,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait'],
    hasMilk: true,
    available: true,
  },

  // ── Bubble Tea ─────────────────────────────────────────────────────────────
  {
    name: 'Bubble Tea Pistache',
    description: 'Un bubble tea crémeux à la pistache avec des billes de tapioca fondantes cuisinées chaque matin.',
    category: 'bubble_tea',
    price: 6.50,
    image: '/images/products/bubble-tea-pistache.jpg',
    customizationOptions: {
      flavours: ['original', 'vanille'],
      syrups: ['sans sirop', 'sirop de vanille'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPS,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait', 'fruits à coque'],
    hasMilk: true,
    available: true,
  },
  {
    name: 'Bubble Tea Fraise',
    description: 'Des perles de tapioca fraîches noyées dans une base fraise acidulée. Frais et gourmand.',
    category: 'bubble_tea',
    price: 6.50,
    image: '/images/products/bubble-tea-fraise.jpg',
    customizationOptions: {
      flavours: ['original', 'fruits rouges'],
      syrups: ['sans sirop', 'sirop de lavande'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ['froid / glacé'],
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['gluten'],
    hasMilk: false,
    available: true,
  },
  {
    name: 'Bubble Tea Vanille',
    description: 'Un bubble tea velouté à la vanille naturelle, billes de tapioca à personnaliser sans limite.',
    category: 'bubble_tea',
    price: 6.50,
    image: '/images/products/bubble-tea-vanille.jpg',
    customizationOptions: {
      flavours: ['original', 'vanille', 'caramel'],
      syrups: ALL_SYRUPS,
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPS,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait', 'gluten'],
    hasMilk: true,
    available: true,
  },

  // ── Mochi ──────────────────────────────────────────────────────────────────
  {
    name: 'Mochi Matcha',
    description: 'Mochis artisanaux à la pâte de matcha, enveloppés dans une pâte de riz douce et moelleuse.',
    category: 'mochi',
    price: 4.50,
    image: '/images/products/mochi-matcha.jpg',
    customizationOptions: {
      flavours: ['original', 'vanille'],
      syrups: ['sans sirop'],
      sweetnessLevel: ['normal', 'peu sucré'],
      temperature: ['froid / glacé'],
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['gluten'],
    hasMilk: false,
    available: true,
  },
  {
    name: 'Mochi Fraise',
    description: 'Mochis fourrés à la crème de fraise, une douceur japonaise aux couleurs de la saison.',
    category: 'mochi',
    price: 4.50,
    image: '/images/products/mochi-fraise.jpg',
    customizationOptions: {
      flavours: ['original', 'fruits rouges'],
      syrups: ['sans sirop'],
      sweetnessLevel: ['normal', 'peu sucré'],
      temperature: ['froid / glacé'],
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['gluten'],
    hasMilk: false,
    available: true,
  },
  {
    name: 'Mochi Vanille',
    description: 'Mochis à la vanille de Madagascar, fondants et délicatement parfumés. Le goût du Japon en une bouchée.',
    category: 'mochi',
    price: 4.50,
    image: '/images/products/mochi-vanille.jpg',
    customizationOptions: {
      flavours: ['original', 'vanille'],
      syrups: ['sans sirop'],
      sweetnessLevel: ['normal', 'peu sucré'],
      temperature: ['froid / glacé'],
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['gluten'],
    hasMilk: false,
    available: true,
  },
];

// ─── Run ──────────────────────────────────────────────────────────────────────

async function seed() {
  const { DB_USERNAME, DB_PASSWORD, DB_HOST = 'localhost', DB_PORT = '27017', DB_NAME = 'oh_my_matcha' } = process.env;

  const uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  await Product.deleteMany({});
  console.log('🗑️  Cleared existing products');

  await Product.insertMany(products);
  console.log(`🌱 Inserted ${products.length} products`);

  const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  counts.forEach(({ _id, count }) => console.log(`   · ${_id}: ${count} produits`));

  await mongoose.disconnect();
  console.log('👋 Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
