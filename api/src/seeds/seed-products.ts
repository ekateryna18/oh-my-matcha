import mongoose, { Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// ─── Raw Mongoose schema (mirrors product.schema.ts) ──────────────────────────

const ProductSchema = new Schema(
  {
    name: String,
    description: String,
    category: { type: String, enum: ['matcha', 'bubble_tea', 'tea'] },
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
const ALL_SWEETNESS = ['sans sucre', 'peu sucré', 'normal', 'très sucré'];
const ALL_TEMPERATURES = ['chaud', 'froid / glacé'];
const ALL_SYRUPS = ['sans sirop', 'sirop de vanille', 'sirop de caramel', 'sirop de lavande'];

// ─── Seed data ────────────────────────────────────────────────────────────────

const products = [
  // ── Matcha ─────────────────────────────────────────────────────────────────
  {
    name: 'Matcha Latte',
    description:
      'Notre latte signature à base de matcha de qualité cérémoniale, onctueux et parfumé.',
    category: 'matcha',
    price: 5.5,
    customizationOptions: {
      flavours: ['original', 'vanille', 'caramel'],
      syrups: ALL_SYRUPS,
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait'],
    hasMilk: true,
    available: true,
  },
  {
    name: 'Matcha Glacé',
    description:
      'Un matcha rafraîchissant servi sur glace, parfait pour les journées chaudes.',
    category: 'matcha',
    price: 5.0,
    customizationOptions: {
      flavours: ['original', 'fruits rouges'],
      syrups: ['sans sirop', 'sirop de vanille', 'sirop de lavande'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ['froid / glacé'],
      milkType: ALL_MILK_TYPES,
    },
    allergens: [],
    hasMilk: false,
    available: true,
  },
  {
    name: 'Hojicha Latte',
    description:
      'Thé vert japonais torréfié pour un goût caramélisé et doux, sans amertume.',
    category: 'matcha',
    price: 5.5,
    customizationOptions: {
      flavours: ['original', 'caramel', 'vanille'],
      syrups: ['sans sirop', 'sirop de vanille', 'sirop de caramel'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait'],
    hasMilk: true,
    available: true,
  },

  // ── Bubble Tea ─────────────────────────────────────────────────────────────
  {
    name: 'Matcha Bubble Tea',
    description:
      'Notre matcha signature combiné aux billes de tapioca pour une expérience unique.',
    category: 'bubble_tea',
    price: 6.5,
    customizationOptions: {
      flavours: ['original', 'vanille'],
      syrups: ['sans sirop', 'sirop de vanille', 'sirop de caramel'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait', 'gluten'],
    hasMilk: true,
    available: true,
  },
  {
    name: 'Taro Bubble Tea',
    description:
      'Une boisson crémeuse et légèrement sucrée à base de taro, avec des billes de tapioca fondantes.',
    category: 'bubble_tea',
    price: 6.5,
    customizationOptions: {
      flavours: ['original', 'vanille', 'caramel'],
      syrups: ALL_SYRUPS,
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: ['lait', 'gluten'],
    hasMilk: true,
    available: true,
  },
  {
    name: 'Bubble Tea aux Fruits Rouges',
    description:
      'Une boisson fruitée et acidulée aux fruits rouges, avec des billes de tapioca gélifiées.',
    category: 'bubble_tea',
    price: 6.0,
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

  // ── Thés ───────────────────────────────────────────────────────────────────
  {
    name: 'Thé Vert Sencha',
    description:
      'Un thé vert japonais délicat aux notes herbacées et fraîches, cultivé à Uji.',
    category: 'tea',
    price: 3.5,
    customizationOptions: {
      flavours: ['original'],
      syrups: ['sans sirop', 'sirop de vanille'],
      sweetnessLevel: ['sans sucre', 'peu sucré', 'normal'],
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: [],
    hasMilk: false,
    available: true,
  },
  {
    name: 'Thé Noir Earl Grey',
    description:
      'Un thé noir anglais classique parfumé à la bergamote, intense et aromatique.',
    category: 'tea',
    price: 3.5,
    customizationOptions: {
      flavours: ['original', 'vanille'],
      syrups: ['sans sirop', 'sirop de vanille', 'sirop de lavande'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: [],
    hasMilk: false,
    available: true,
  },
  {
    name: 'Thé aux Fruits',
    description:
      'Un mélange fruité et parfumé aux notes de pêche, hibiscus et fruits tropicaux, chaud ou glacé.',
    category: 'tea',
    price: 4.0,
    customizationOptions: {
      flavours: ['original', 'fruits rouges'],
      syrups: ['sans sirop', 'sirop de lavande'],
      sweetnessLevel: ALL_SWEETNESS,
      temperature: ALL_TEMPERATURES,
      milkType: ALL_MILK_TYPES,
    },
    allergens: [],
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
