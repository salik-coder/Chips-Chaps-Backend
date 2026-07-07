const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            message: "✅ Product Added Successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            message: "✅ Product Updated Successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ DELETE Product - SAHI CODE
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            message: "✅ Product Deleted Successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
};