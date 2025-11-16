import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    console.log("coupon", coupon);
    console.log("userId", req.user._id);
    res.status(200).json(coupon || null);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ message: "Error fetching coupon", error });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }
    res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Error validating coupon", error });
  }
};
