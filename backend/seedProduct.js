import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Product from "./models/product.model.js";

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

// Verify MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file!");
  process.exit(1);
}

const products = [
  // JEANS
  {
    name: "Classic Slim Fit Jeans",
    description:
      "Timeless slim fit jeans made from premium denim. Comfortable stretch fabric with a modern cut.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "jeans",
    isFeatured: true,
  },
  {
    name: "Distressed Boyfriend Jeans",
    description:
      "Relaxed fit boyfriend jeans with vintage distressing. Perfect casual style.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500",
    category: "jeans",
    isFeatured: false,
  },
  {
    name: "Dark Wash Straight Leg Jeans",
    description:
      "Classic straight leg jeans in dark wash. Versatile and timeless design.",
    price: 94.99,
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500",
    category: "jeans",
    isFeatured: false,
  },

  // T-SHIRTS
  {
    name: "Premium Cotton Crew Neck Tee",
    description:
      "Soft, breathable 100% organic cotton t-shirt. Available in classic colors.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "t-shirts",
    isFeatured: true,
  },
  {
    name: "Vintage Graphic T-Shirt",
    description:
      "Retro-inspired graphic tee with soft vintage wash. Comfortable relaxed fit.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    category: "t-shirts",
    isFeatured: false,
  },
  {
    name: "Striped Long Sleeve Tee",
    description:
      "Classic striped long sleeve t-shirt. Perfect for layering or wearing solo.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
    category: "t-shirts",
    isFeatured: false,
  },

  // SHOES
  {
    name: "Classic White Sneakers",
    description:
      "Timeless white leather sneakers. Comfortable cushioned sole for all-day wear.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    category: "shoes",
    isFeatured: true,
  },
  {
    name: "Running Shoes Pro",
    description:
      "Professional running shoes with advanced cushioning and breathable mesh upper.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "shoes",
    isFeatured: true,
  },
  {
    name: "Leather Chelsea Boots",
    description:
      "Premium leather Chelsea boots. Perfect blend of style and comfort.",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500",
    category: "shoes",
    isFeatured: false,
  },

  // GLASSES
  {
    name: "Classic Aviator Sunglasses",
    description:
      "Iconic aviator sunglasses with UV400 protection. Metal frame with polarized lenses.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    category: "glasses",
    isFeatured: true,
  },
  {
    name: "Vintage Round Frame Glasses",
    description:
      "Retro round frame glasses with anti-reflective coating. Stylish and functional.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500",
    category: "glasses",
    isFeatured: false,
  },
  {
    name: "Wayfarer Sunglasses",
    description:
      "Classic wayfarer design with 100% UV protection. Durable acetate frame.",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    category: "glasses",
    isFeatured: false,
  },

  // JACKETS
  {
    name: "Leather Biker Jacket",
    description:
      "Genuine leather motorcycle jacket with asymmetric zip. Timeless rebel style.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    category: "jackets",
    isFeatured: true,
  },
  {
    name: "Denim Trucker Jacket",
    description:
      "Classic denim jacket with vintage wash. Perfect layering piece for any season.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
    category: "jackets",
    isFeatured: false,
  },
  {
    name: "Quilted Bomber Jacket",
    description:
      "Lightweight quilted bomber with ribbed cuffs. Water-resistant outer shell.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
    category: "jackets",
    isFeatured: true,
  },

  // SUITS
  {
    name: "Charcoal Wool Suit",
    description:
      "Modern fit charcoal suit in premium wool blend. Perfect for business or formal occasions.",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    category: "suits",
    isFeatured: true,
  },
  {
    name: "Navy Blue Slim Fit Suit",
    description:
      "Contemporary slim fit suit in navy blue. Fully lined with notch lapel.",
    price: 549.99,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
    category: "suits",
    isFeatured: false,
  },
  {
    name: "Light Gray Linen Suit",
    description:
      "Breathable linen suit perfect for summer events. Relaxed yet refined fit.",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500",
    category: "suits",
    isFeatured: false,
  },

  // BAGS
  {
    name: "Leather Messenger Bag",
    description:
      "Full-grain leather messenger bag with laptop compartment. Professional and durable.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "bags",
    isFeatured: true,
  },
  {
    name: "Canvas Backpack",
    description:
      "Vintage-style canvas backpack with leather trim. Multiple pockets for organization.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500",
    category: "bags",
    isFeatured: false,
  },
  {
    name: "Minimalist Tote Bag",
    description:
      "Eco-friendly canvas tote with reinforced handles. Perfect for daily essentials.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500",
    category: "bags",
    isFeatured: true,
  },
  {
    name: "Weekender Duffle Bag",
    description:
      "Spacious duffle bag in durable canvas. Ideal for weekend trips and gym sessions.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    category: "bags",
    isFeatured: false,
  },
];

const seedProducts = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ Added ${products.length} products to database`);

    // Summary by category
    const categories = [
      "jeans",
      "t-shirts",
      "shoes",
      "glasses",
      "jackets",
      "suits",
      "bags",
    ];
    console.log("\n📊 Products by Category:");
    categories.forEach((cat) => {
      const count = products.filter((p) => p.category === cat).length;
      console.log(`   ${cat}: ${count} products`);
    });

    console.log("\n⭐ Featured Products:");
    products
      .filter((p) => p.isFeatured)
      .forEach((p) => console.log(`   - ${p.name} ($${p.price})`));

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedProducts();
