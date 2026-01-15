
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const Product = mongoose.model("Product", {
  name: String,
  price: String,
  image: String
});

const upload = multer({ dest: "uploads/" });

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", upload.single("image"), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: process.env.BASE_URL + "/uploads/" + req.file.filename
  });
  await product.save();
  res.json(product);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
