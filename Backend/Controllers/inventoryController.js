const Inventory = require("../models/inventory");

// Add new inventory item
const addInventory = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json({
            message: "Inventory item added successfully",
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to add inventory item",
            details: error.message
        });
    }
};

// ✅ Get all inventory items (supports ?month=YYYY-MM)
const getAllInventory = async (req, res) => {
    try {
        const { month } = req.query;
        let query = {};

        if (month) {
            const [year, monthNum] = month.split("-");
            const start = new Date(`${year}-${monthNum}-01`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            query.date = { $gte: start, $lt: end };
        }

        const items = await Inventory.find(query).sort({ date: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch inventory",
            details: error.message
        });
    }
};

// Get a single inventory item by ID
const getInventoryById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve item",
            details: error.message
        });
    }
};

// Update inventory item
const updateInventory = async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        res.status(200).json({
            message: "Inventory item updated successfully",
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update inventory item",
            details: error.message
        });
    }
};

// Delete inventory item
const deleteInventory = async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete inventory item",
            details: error.message
        });
    }
};

module.exports = {
    addInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory
};
