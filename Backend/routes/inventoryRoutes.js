const express = require("express");
const router = express.Router();
const {
    addInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory
} = require("../Controllers/inventoryController");

router.post("/addInventory", addInventory);                 // POST
router.get("/viewInventory", getAllInventory);              // GET all
router.get("/getInventory/:id", getInventoryById);          // GET one
router.put("/updateInventory/:id", updateInventory);        // PUT
router.delete("/deleteInventory/:id", deleteInventory);     // DELETE

module.exports = router;
