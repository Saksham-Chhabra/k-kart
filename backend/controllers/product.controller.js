import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
}

export async function getFeaturedProducts(req, res) {
  try {
    const featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      console.log("Serving featured products from Redis cache");

      return res.status(200).json(JSON.parse(featuredProducts));
    }
    // if not in redis fetch it from mongodb yo!
    const newFeaturedProducts = await Product.find({ isFeatured: true }).lean(); // lean for better performance ( as it returns plain js objects ) use when you are not manipulating the documents

    // store in redis for future requests yo!
    await redis.set("featured_products", JSON.stringify(newFeaturedProducts));
    res.status(200).json(newFeaturedProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res
      .status(500)
      .json({ message: "Error fetching featured products", error });
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("product to be deleted", await Product.findById(id));
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (deletedProduct.image) {
      const publicId = deletedProduct.image.split("/").pop().split(".")[0]; // this will get the id of the image from the url
      await cloudinary.uploader.destroy(publicId);
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]); // get 3 random products
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res
      .status(500)
      .json({ message: "Error fetching recommended products", error });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}
