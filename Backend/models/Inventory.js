const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    employeeId: { type: String, required: true },
    name: { type: String, required: true },
    systemManufacturer: { type: String, required: true },
    systemModel: { type: String, required: true },
    monitor: { type: String, required: true },
    romRam: { type: String, required: true },
    product: { type: String, required: true },
    headphone: { type: String, required: true },
    keyboardMouse: { type: String, required: true }
});

module.exports = mongoose.model("Inventory", inventorySchema);
