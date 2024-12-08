const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const { connect, Schema, model } = require('mongoose');





app.listen(port, async () => {
  try {
    console.log(`Server is running ${port}`)
    await connect('mongodb+srv://Paul:Paul%40270414@cluster.1cbatru.mongodb.net/dbShoping')
    console.log("db connection established")
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});
app.use(bodyParser.json());


//ADMIN SCHEMA

const adminSchemaStructure = new Schema({
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
    minlength: 6,
  },
});
const Admin = model("adminSchema", adminSchemaStructure);




app.post("/Admin", async (req, res) => {
  try {
    const { adminName, adminEmail, adminPassword } = req.body;

    if (!adminName || !adminEmail || !adminPassword) {
      return res.status(400).send({
        message: "adminName, adminEmail, and adminPassword are required.",
      });
    }

    const admin = new Admin({
      adminName,
      adminEmail,
      adminPassword,
    });

    let value = await admin.save();

    res.status(201).send({
      message: "Inserted Successfully",
      admin: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});



app.get("/Admin", async (req, res) => {
  try {
    const admin = await Admin.find();
    if (admin.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/Admin/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin).status(200);

  } catch (err) {
    console.error("Error Finding Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.delete("/Admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully", deletedAdmin });
  } catch (err) {
    console.error("Error deleting Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.put("/Admin/:id", async (req, res) => {
  try {

    let admin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ errors: [{ msg: "admin not found" }] });
    }

    res.json({ message: "admin updated successfully", admin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



app.patch("/Admin/:id", async (req, res) => {
  try {
    const { adminName } = req.body;

    let admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        adminName,
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ errors: [{ msg: "admin not found" }] });
    }

    res.json({ message: "admin updated successfully", admin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




//DISTRICT SCHEMA

const districtSchemaStructure = new Schema({
  districtName: {
    type: String,
    required: true,
  }
});

const District = model("districtSchema", districtSchemaStructure);

app.post("/District", async (req, res) => {
  try {
    const { districtName } = req.body;

    if (!districtName) {
      return res.status(400).send({
        message: "districtName is required.",
      });
    }

    const district = new District({
      districtName,
    });

    let value = await district.save();

    res.status(201).send({
      message: "Inserted Successfully",
      admin: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});




app.get("/District", async (req, res) => {
  try {
    const district = await District.find();
    if (district.length === 0) {
      return res.status(404).json({ message: "District not found" });
    }
    res.status(200).json(district);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/District/:id", async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    res.send(district).status(200);

  } catch (err) {
    console.error("Error Finding District:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.delete("/District/:id", async (req, res) => {
  try {
    const districtId = req.params.id;
    const deletedDistrict = await District.findByIdAndDelete(districtId);

    if (!deletedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }
    res.json({ message: "District deleted successfully", deletedDistrict });
  } catch (err) {
    console.error("Error deleting District:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.patch("/District/:id", async (req, res) => {
  try {
    const { districtName } = req.body;

    let district = await District.findByIdAndUpdate(
      req.params.id,
      {
        districtName,
      },
      { new: true }
    );

    if (!district) {
      return res.status(404).json({ errors: [{ msg: "District not found" }] });
    }

    res.json({ message: "District updated successfully", district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



//PLACE SCHEMA    

const placeSchemaStructure = new Schema({
  placeName: {
    type: String,
    required: true,
  },
  districtId: {
    type: Schema.Types.ObjectId,
    ref: 'districtschema',
    required: true
  }
});

const Place = model("placeSchema", placeSchemaStructure);

app.post("/Place", async (req, res) => {
  try {
    const { placeName, districtId } = req.body;

    if (!placeName || !districtId) {
      return res.status(400).send({
        message: "Name and district id are required.",
      });
    }


    const place = new Place({
      placeName,
      districtId
    });

    let value = await place.save();

    res.status(201).send({
      message: "Inserted Successfully",
      place: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});


app.get("/Place", async (req, res) => {
  try {
    const place = await Place.aggregate([
      {
        $lookup: {
          from: "districtschemas", // Collection name of PostHead model from database
          localField: "districtId",// There, name given in the productSchema
          foreignField: "_id",
          as: "District", //Give some name
        },
      },
      {
        $unwind: "$District", // Deconstructs the postHead array created by $lookup
      },
      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          placeName: 1,  //1 is given for fields in the aggregated 
          districtId: 1,
          districtName: "$District.districtName",
          // category_id: "$Category._id",
        },
      }
    ]);
    if (place.length === 0) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Place/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json({ message: "Place deleted successfully", deletedPlace });
  } catch (err) {
    console.error("Error deleting Place:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/PlaceDeleteMany/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Place.deleteMany({ districtId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No places found with the given district ID" });
    }

    res.json({ message: "Places deleted successfully", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error deleting places:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.patch("/Place/:id", async (req, res) => {
  try {
    const { placeName } = req.body;

    let place = await Place.findByIdAndUpdate(
      req.params.id,
      {
        placeName,
      },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ errors: [{ msg: "Place not found" }] });
    }

    res.json({ message: "Place updated successfully", place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




//CATEGORY SCHEMA

const categorySchemaStructure = new Schema({
  categoryName: {
    type: String,
    required: true,
  }
});

const Category = model("categorySchema", categorySchemaStructure);

// Chat gpt modefied code

app.post("/Category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).send({
        message: "Category name is required.",
      });
    }


    const category = new Category({
      categoryName
    });

    let value = await category.save();

    res.status(201).send({
      message: "Inserted Successfully",
      admin: value, // Optionally return the created admin
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});


app.get("/Category", async (req, res) => {
  try {
    const category = await Category.find();
    if (category.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});



app.delete("/Category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully", deletedCategory });
  } catch (err) {
    console.error("Error deleting Category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.patch("/Category/:id", async (req, res) => {
  try {
    const { categoryName } = req.body;

    let category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ errors: [{ msg: "Category not found" }] });
    }

    res.json({ message: "Category updated successfully", category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



//SUBCATEGORY SCHEMA

const subcategorySchemaStructure = new Schema({
  subcategoryName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'categoryschema',
    required: true
  }
});

const Subcategory = model("subcategorySchema", subcategorySchemaStructure);


app.post("/Subcategory", async (req, res) => {
  try {
    const { subcategoryName, categoryId } = req.body;

    if (!subcategoryName || !categoryId) {
      return res.status(400).send({
        message: "subcategoryName and categoryId are required.",
      });
    }

    const subcategory = new Subcategory({
      subcategoryName,
      categoryId
    });
    let value = await subcategory.save();

    res.status(201).send({
      message: "Inserted Successfully",
      subcategory: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});


app.get("/Subcategory", async (req, res) => {
  try {
    const subcategory = await Subcategory.aggregate([
      {
        $lookup: {
          from: "categoryschemas", // Collection name of PostHead model from database
          localField: "categoryId",// There, name given in the productSchema
          foreignField: "_id",
          as: "Category", //Give some name
        },
      },
      {
        $unwind: "$Category", // Deconstructs the postHead array created by $lookup
      },
      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          subcategoryName: 1,  //1 is given for fields in the aggregated 
          categoryId: 1,
          categoryName: "$Category.categoryName",
          // category_id: "$Category._id",
        },
      }
    ]);
    if (subcategory.length === 0) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Subcategory/:id", async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);

    if (!deletedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ message: "Subcategory deleted successfully", deletedSubcategory });
  } catch (err) {
    console.error("Error deleting Subcategory:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.patch("/Subcategory/:id", async (req, res) => {
  try {
    const { subcategoryName } = req.body;

    let subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      {
        subcategoryName,
      },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ errors: [{ msg: "subcategory not found" }] });
    }

    res.json({ message: "subcategory updated successfully", subcategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



//SHOP SCHEMA

const shopSchemaStructure = new Schema({
  shopName: {
    type: String,
    required: true,
  },
  shopEmail: {
    type: String,
    required: true,
  },
  shopContact: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  shopPhoto: {
    type: String,
    required: true,
  },
  shopProof: {
    type: String,
    required: true,
  },
  shopPassword: {
    type: String,
    required: true,
  },
  shopStatus: {
    type: String,
    required: true,
  },
  placeId: {
    type: Schema.Types.ObjectId,
    ref: 'placeschema',
    required: true
  }
});


const Shop = model("shopSchema", shopSchemaStructure);


app.post("/Shop", async (req, res) => {
  try {
    const { shopName, shopEmail, shopContact, shopAddress, shopPhoto, shopProof, shopPassword, shopStatus, placeId } = req.body;

    if (!shopName || !shopEmail || !shopContact || !shopAddress || !shopPhoto || !shopProof || !shopPassword || !shopStatus || !placeId) {
      return res.status(400).send({
        message: "All fields are required.",
      });
    }

    const shop = new Shop({
      shopName,
      shopEmail,
      shopContact,
      shopAddress,
      shopPhoto,
      shopProof,
      shopPassword,
      shopStatus,
      placeId
    });
    let value = await shop.save();

    res.status(201).send({
      message: "Inserted Successfully",
      shop: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }
    res.status(500).send("Internal Server Error");
  }
})



app.get("/Shop", async (req, res) => {
  try {
    const shop = await Shop.find();
    res.status(200).json(shop);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});




app.delete("/Shop/:id", async (req, res) => {
  try {
    const shopId = req.params.id;
    const deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json({ message: "Shop deleted successfully", deletedShop });
  } catch (err) {
    console.error("Error deleting Shop:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.patch("/Shop/:id", async (req, res) => {
  try {
    const { shopName, shopEmail, shopContact, shopAddress, shopPhoto, shopProof, shopPassword, shopStatus, placeId } = req.body;

    let shop = await Shop.findByIdAndUpdate(
      req.params.id,
      {
        shopName,
        shopEmail,
        shopContact,
        shopAddress,
        shopPhoto,
        shopProof,
        shopPassword,
        shopStatus,
        placeId
      },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ errors: [{ msg: "Shop not found" }] });
    }

    res.json({ message: "Shop updated successfully", shop });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



//Customer Schema


const customerSchemaStructure = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  customerContact: {
    type: String,
    required: true,
    unique: true,
  },
  customerAddress: {
    type: String,
    required: true,
    unique: true,
  },
  placeId: {
    type: Schema.Types.ObjectId,
    ref: 'placeschema',
    required: true
  },
  customerPhoto: {
    type: String,
    required: true,
    unique: true,
  },
  customerPassword: {
    type: String,
    required: true,
    minlength: 6,
  },
});


const Customer = model("customerSchema", customerSchemaStructure);


app.post("/Customer", async (req, res) => {
  try {
    const { customerName, customerEmail, customerContact, customerAddress, placeId, customerPhoto, customerPassword } = req.body;

    if (!customerName || !customerEmail || !customerContact || !customerAddress || !placeId || !customerPhoto || !customerPassword) {
      return res.status(400).send({
        message: "All fields are required.",
      });
    }

    const customer = new Customer({
      customerName,
      customerEmail,
      customerContact,
      customerAddress,
      placeId,
      customerPhoto,
      customerPassword
    });
    let value = await customer.save();

    res.status(201).send({
      message: "Inserted Successfully",
      customer: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }
    res.status(500).send("Internal Server Error");
  }
})


app.get("/Customer", async (req, res) => {
  try {
    const customer = await Customer.find();
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});




app.delete("/Customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully", deletedCustomer });
  } catch (err) {
    console.error("Error deleting Customer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.patch("/Customer/:id", async (req, res) => {
  try {
    const { customerName, customerEmail } = req.body;

    let customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerEmail
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ errors: [{ msg: "Customer not found" }] });
    }

    res.json({ message: "Customer updated successfully", customer });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


//Product Schema

const productSchemaStructure = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productRate: {
    type: String,
    required: true,
  },
  productPhoto: {
    type: String,
    required: true,
  },
  subcategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'subcategory',
    required: true
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: 'shopschema',
    required: true
  },
});

const Product = model("productSchema", productSchemaStructure);

app.post("/Product", async (req, res) => {
  try {
    const { productName, productDescription, productRate, productPhoto, subcategoryId, shopId } = req.body;

    if (!productName || !productDescription || !productRate || !productPhoto || !subcategoryId || !shopId) {
      return res.status(400).send({
        message: "All fields are required.",
      });
    }

    const product = new Product({
      productName,
      productDescription,
      productRate,
      productPhoto,
      subcategoryId,
      shopId
    });
    let value = await product.save();

    res.status(201).send({
      message: "Inserted Successfully",
      product: value,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }
    res.status(500).send("Internal Server Error");
  }
})

app.get("/Product", async (req, res) => {
  try {
    const product = await Product.aggregate([
      {
        $lookup: {
          from: "subcategoryschemas", // Collection name of PostHead model from database
          localField: "subcategoryId",// There, name given in the productSchema
          foreignField: "_id",
          as: "SubCategory", //Give some name
        },
      },
      {
        $unwind: "$SubCategory", // Deconstructs the postHead array created by $lookup
      },
      {
        $lookup: {
          from: "shopschemas", // Collection name of User model
          localField: "shopId",
          foreignField: "_id",
          as: "Shop",
        },
      },
      {
        $unwind: "$Shop", // Deconstructs the user array created by $lookup
      },

      {
        $lookup: {
          from: "categoryschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "SubCategory.categoryId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Category",
        },
      },
      {
        $unwind: "$Category", // Deconstructs the user array created by $lookup
      },

      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          productName: 1,  //1 is given for fields in the aggregated 
          productDescreption: 1,
          productRate: 1,
          productPhoto: 1,
          subcategoryId: 1,
          subcategoryName: "$SubCategory.subcategoryName",
          categoryName: "$Category.categoryName",
          categoryId: "$Category._id",
        },
      }
    ]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (err) {
    console.error("Error deleting Product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.patch("/Product/:id", async (req, res) => {
  try {
    const { productName } = req.body;

    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ errors: [{ msg: "Product not found" }] });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


//GALLERY SCHEMA
const gallerySchemaStructure = new Schema({
  galleryImage: {
    type: String,
    required: true
  },
  galleryCaption: {
    type: String,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "productschema",
    required: true
  }
});

const Gallery = model("gallerySchema", gallerySchemaStructure);

app.post("/Gallery", async (req, res) => {
  try {
    const { galleryImage, galleryCaption, productId } = req.body;

    if (!galleryImage || !galleryCaption || !productId) {
      return res.status(400).send({
        message: "Image, caption and product id are required.",
      });
    }
    const gallery = new Gallery({
      galleryImage,
      galleryCaption,
      productId
    });
    let value = await gallery.save();
    res.status(201).send({
      message: "Inserted Successfully",
      admin: value,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }
    res.status(500).send("Internal Server Error");
  }
})


app.get("/Gallery", async (req, res) => {
  try {
    const gallery = await Gallery.aggregate([
      {
        $lookup: {
          from: "productschemas", // Collection name of PostHead model from database
          localField: "productId",// There, name given in the productSchema
          foreignField: "_id",
          as: "Product", //Give some name
        },
      },
      {
        $unwind: "$Product", // Deconstructs the postHead array created by $lookup
      },
      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          galleryImage: 1,  //1 is given for fields in the aggregated 
          galleryCaption: 1,
          productId: "$Product._id",
        },
      },
    ]);
    if (gallery.length === 0) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.status(200).json(gallery);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Gallery/:id", async (req, res) => {
  try {
    const galleryId = req.params.id;
    const deletedGallery = await Gallery.findByIdAndDelete(galleryId);

    if (!deletedGallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json({ message: "Gallery deleted successfully", deletedGallery });
  } catch (err) {
    console.error("Error deleting Gallery:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.patch("/Gallery/:id", async (req, res) => {
  try {
    const { galleryCaption } = req.body;

    let gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        galleryCaption,
      },
      { new: true }
    );

    if (!gallery) {
      return res.status(404).json({ errors: [{ msg: "Gallery not found" }] });
    }

    res.json({ message: "Gallery updated successfully", gallery });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


//BOOKING SCHEMA
const bookingSchemaStructure = new Schema({
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTotalAmount: {
    type: String,
    required: true
  },
  bookingStatus: {
    type: Boolean,
    required: true
  },
  paymentStatus: {
    type: Boolean,
    required: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customerschema",
    required: true
  }
});

const Booking = model("bookingSchema", bookingSchemaStructure);

app.post("/Booking", async (req, res) => {
  try {
    const { bookingDate, bookingTotalAmount, bookingStatus, paymentStatus, customerId } = req.body;

    if (!bookingDate || !bookingTotalAmount || !bookingStatus || !paymentStatus || !customerId) {
      return res.status(400).send({
        message: "Date, total amount, status, payment status and customer id are required.",
      });
    }
    const booking = new Booking({
      bookingDate,
      bookingTotalAmount,
      bookingStatus,
      paymentStatus,
      customerId
    });
    let value = await booking.save();
    res.status(201).send({
      message: "Inserted Successfully",
      admin: value,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }
    res.status(500).send("Internal Server Error");
  }
})


app.get("/Booking", async (req, res) => {
  try {
    const booking = await Booking.aggregate([
      {
        $lookup: {
          from: "customerschemas", // Collection name of PostHead model from database
          localField: "customerId",// There, name given in the productSchema
          foreignField: "_id",
          as: "Customer", //Give some name
        },
      },
      {
        $unwind: "$Customer", // Deconstructs the postHead array created by $lookup
      },
      {
        $lookup: {
          from: "placeschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Customer.placeId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Place",
        },
      },
      {
        $unwind: "$Place", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "districtschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Place.districtId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "District",
        },
      },
      {
        $unwind: "$District", // Deconstructs the user array created by $lookup
      },
      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          bookingDate: 1,  //1 is given for fields in the aggregated 
          bookingTotalAmount: 1,
          bookingStatus: 1,
          paymentStatus: 1,
          customerId: 1,
          customerName: "$Customer.customerName",
          customerEmail: "$Customer.customerEmail",
          customerContact: "$Customer.customerContact",
          customerAddress: "$Customer.customerAddress",
          placeId: "$Customer.placeId",
          customerPhoto: "$Customer.customerPhoto",
          customerPassword: "$Customer.customerPassword",
          placeName: "$Place.placeName",
          districtName: "$District.districtName",

          // category_id: "$Category._id",
        },
      }
    ]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Booking/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully", deletedBooking });
  } catch (err) {
    console.error("Error deleting Booking:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.patch("/Booking/:id", async (req, res) => {
  try {
    const { bookingDate, bookingTotalAmount, bookingStatus, paymentStatus } = req.body;
    let booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingDate,
        bookingTotalAmount,
        bookingStatus,
        paymentStatus
      },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking updated successfully", booking });
  } catch (err) {
    console.error("Error updating Booking:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



//CART SCHEMAS


const cartSchemaStructure = new Schema({
  cartQuantity: {
    type: String,
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'bookingschema', // its is the name of the collection, so every thing in small letters.
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'productschema', // its is the name of the collection, so every thing in small letters.
    required: true
  },
  cartStatus: {
    type: String,
    required: true
  }
});

const Cart = model("cartSchema", cartSchemaStructure);

app.post("/Cart", async (req, res) => {
  try {
    const { cartQuantity, bookingId, productId, cartStatus } = req.body;
    const newCart = new Cart({
      cartQuantity,
      bookingId,
      productId,
      cartStatus
    });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/Cart", async (req, res) => {
  try {
    const cart = await Cart.aggregate([
      {
        $lookup: {
          from: "bookingschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "bookingId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Booking",
        },
      },
      {
        $unwind: "$Booking", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "productschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "productId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Product",
        },
      },
      {
        $unwind: "$Product", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "customerschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Booking.customerId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Customer",
        },
      },
      {
        $unwind: "$Customer", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "placeschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Customer.placeId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Place",
        },
      },
      {
        $unwind: "$Place", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "districtschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Place.districtId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "District",
        },
      },
      {
        $unwind: "$District", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "shopschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Product.shopId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Shop",
        },
      },
      {
        $unwind: "$Shop", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "subcategoryschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Product.subcategoryId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "SubCategory",
        },
      },
      {
        $unwind: "$SubCategory", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "categoryschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "SubCategory.categoryId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Category",
        },
      },
      {
        $unwind: "$Category", // Deconstructs the user array created by $lookup
      },
      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          cartQuantity: 1,  //1 is given for fields in the aggregated 
          bookingId: 1,
          productId: 1,
          cartStatus: 1,
          bookingDate: "$Booking.bookingDate",
          bookingTotalAmount: "$Booking.bookingTotalAmount",
          bookingStatus: "$Booking.bookingStatus",
          paymentStatus: "$Booking.paymentStatus",
          customerId: "$Booking.customerId",
          customerName: "$Customer.customerName",
          customerEmail: "$Customer.customerEmail",
          customerContact: "$Customer.customerContact",
          customerAddress: "$Customer.customerAddress",
          placeId: "$Customer.placeId",
          customerPhoto: "$Customer.customerPhoto",
          customerPassword: "$Customer.customerPassword",
          placeName: "$Place.placeName",
          districtName: "$District.districtName",
          productName: "$Product.productName",
          productPrice: "$Product.productPrice",
          productQuantity: "$Product.productQuantity",
          productDescription: "$Product.productDescription",
          productPhoto: "$Product.productPhoto",
          productStatus: "$Product.productStatus",
          subcategoryId: "$Product.subcategoryId",
          categoryName: "$Category.categoryName",
          categoryId: "$Category._id",
          subcategoryName: "$SubCategory.subcategoryName",
          shopId: "$Product.shopId",
          shopName: "$Shop.shopName",

        },
      },
    ]);
    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Cart/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const deletedCart = await Cart.findByIdAndDelete(cartId);

    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json({ message: "Cart deleted successfully", deletedCart });
  } catch (err) {
    console.error("Error deleting Cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/Cart/:id", async (req, res) => {
  try {
    const { cartQuantity } = req.body;

    let cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        cartQuantity,
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ errors: [{ msg: "Cart not found" }] });
    }

    res.json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//REVIEW SCHEMA

const reviewSchemaStructure = new Schema({
  reviewRating: {
    type: String,
    required: true,
  },
  reviewContent: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'customerschema', // its is the name of the collection, so every thing in small letters.
    required: true
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: 'shopschema', // its is the name of the collection, so every thing in small letters.
    required: true
  },
  reviewDateTime: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
});

const Review = model("reviewSchema", reviewSchemaStructure);

app.post("/Review", async (req, res) => {
  try {
    const { reviewRating, reviewContent, customerId, shopId, reviewDateTime, customerName } = req.body;
    const newReview = new Review({
      reviewRating,
      reviewContent,
      customerId,
      shopId,
      reviewDateTime,
      customerName
    });
    let value = await newReview.save();
    res.status(201).send({
      message: "Inserted Successfully",
      review: value,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation Error",
        details: error.errors,
      });
    }
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Review", async (req, res) => {
  try {
    const review = await Review.aggregate([
      {
        $lookup: {
          from: "customerschemas",
          localField: "customerId",
          foreignField: "_id",
          as: "Customer",
        },
      },
      {
        $unwind: "$Customer",
      },
      {
        $lookup: {
          from: "shopschemas",
          localField: "shopId",
          foreignField: "_id",
          as: "Shop",
        },
      },
      {
        $unwind: "$Shop",
      },
      {
        $lookup: {
          from: "placeschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Customer.placeId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Place",
        },
      },
      {
        $unwind: "$Place", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "districtschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "Place.districtId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "District",
        },
      },
      {
        $unwind: "$District", // Deconstructs the user array created by $lookup
      },
      {
        $lookup: {
          from: "shopschemas", // Collection name of User model
          //To get details of category, we need to include subcategory.
          localField: "shopId",//This is the syntax while connecting like a chain, name_given_in_the_lookup.foreignField
          foreignField: "_id",
          as: "Shop",
        },
      },
      {
        $unwind: "$Shop", // Deconstructs the user array created by $lookup
      },
      {
        $project: {
          reviewRating: "$reviewRating",
          reviewContent: "$reviewContent",
          customerId: "$customerId",
          shopId: "$shopId",
          reviewDateTime: "$reviewDateTime",
          customerName: "$Customer.customerName",
          shopName: "$Shop.shopName",
          placeName: "$Place.placeName",
          districtName: "$District.districtName",
          productName: "$Product.productName",
          productPrice: "$Product.productPrice",
          productQuantity: "$Product.productQuantity",
          productDescription: "$Product.productDescription",
          productPhoto: "$Product.productPhoto",
          productStatus: "$Product.productStatus",
          subcategoryId: "$Product.subcategoryId",
          categoryName: "$Category.categoryName",
          categoryId: "$Category._id",
          shopEmail: "$Shop.shopEmail",
          shopContact: "$Shop.shopContact",
          shopAddress: "$Shop.shopAddress",
          shopPhoto: "$Shop.shopPhoto",
          shopPassword: "$Shop.shopPassword",
          shopStatus: "$Shop.shopStatus",
          placeId: "$Place._id",
          districtId: "$District._id",
          productId: "$Product._id",
        },
      },
    ]);
    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Review/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully", deletedReview });
  } catch (err) {
    console.error("Error deleting Review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.patch("/Review/:id", async (req, res) => {
  try {
    const { reviewRating } = req.body;

    let review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        reviewRating,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ errors: [{ msg: "Review not found" }] });
    }

    res.json({ message: "Review updated successfully", review });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



//COMPLAINT SCHEMA

const complaintSchemaStructure = new Schema({
  complaintTitle: {
    type: String,
    required: true,
  },
  complaintContent: {
    type: String,
    required: true,
  },
  complaintDate: {
    type: Date,
    required: true,
  },
  complaintStatus: {
    type: Boolean,
    required: true,
  },
  complaintReply: {
    type: String,
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref:'customerschema', 
    required: true
  },
});

const Complaint = model("complaintSchema", complaintSchemaStructure);

app.post("/Complaint", async (req, res) => {
  try {
    const { complaintTitle, complaintContent, complaintDate, complaintStatus, complaintReply, customerId } = req.body;
    const newComplaint = new Complaint({
      complaintTitle,
      complaintContent,
      complaintDate,
      complaintStatus,
      complaintReply,
      customerId
    });
    const savedComplaint = await newComplaint.save();
    res.json(savedComplaint);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/Complaint", async (req, res) => {
  try {
    const complaint = await Complaint.aggregate([
      {
        $lookup: {
          from: "customerschemas", // Collection name of PostHead model from database
          localField: "customerId",// There, name given in the productSchema
          foreignField: "_id",
          as: "Customer", //Give some name
        },
      },
      {
        $unwind: "$Customer", // Deconstructs the postHead array created by $lookup
      },
      {
        $lookup: {
          from: "placeschemas", // Collection name of PostHead model from database
          localField: "Customer.placeId",// There, name given in the productSchema
          foreignField: "_id",
          as: "Place", //Give some name
        },
      },
      {
        $unwind: "$Place", // Deconstructs the postHead array created by $lookup
      },
      {
        $lookup: {
          from: "districtschemas", // Collection name of PostHead model from database
          localField: "Place.districtId",// There, name given in the productSchema
          foreignField: "_id",
          as: "District", //Give some name
        },
      },
      {
        $unwind: "$District", // Deconstructs the postHead array created by $lookup
      },
      {
        $project: {
          // Select fields to include in the final output
          _id: 1,
          complaintTitle: 1,  //1 is given for fields in the aggregated 
          complaintContent: 1,
          complaintDate: 1,
          complaintStatus: 1,
          complaintReply: 1,
          customerId: "$Customer._id",
          customerName: "$Customer.customerName",
          customerEmail: "$Customer.customerEmail",
          customerContact: "$Customer.customerContact",
          customerAddress: "$Customer.customerAddress",
          customerPhoto: "$Customer.customerPhoto",
          customerPassword: "$Customer.customerPassword",
          placeId: "$Customer.placeId",
          placeName: "$Place.placeName",
          districtId: "$Place.districtId",
          districtName: "$District.districtName",


        },
      }
    ]);
    if (complaint.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Complaint/:id", async (req, res) => {
  try {
      const complaintId = req.params.id; 
      const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);

      if (!deletedComplaint) {
          return res.status(404).json({ message: "Complaint not found" });
      }
      res.json({ message: "Complaint deleted successfully", deletedComplaint });
  } catch (err) {
      console.error("Error deleting Complaint:", err);
      res.status(500).json({ message: "Internal server error" });
  }
}); 

app.patch("/Complaint/:id", async (req, res) => {
  try {
    const { complaintTitle } = req.body;

    let complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        complaintTitle,
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ errors: [{ msg: "Complaint not found" }] });
    }

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//FEEDBACK SCHEMA
const feedbackSchemaStructure = new Schema({

  feedbackContent: {
    type: String,
    required: true
  },
  feedbackDate: {
    type: String,
    required: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'customerschema', // its is the name of the collection, so every thing in small letters.
    required: true
  },
});

const Feedback = model("feedbackSchema", feedbackSchemaStructure);

// app.post("/Feedback", async (req, res) => {
//   try {
//     const { feedbackContent, feedbackDate, customerId } = req.body;
//     const newFeedback = new Feedback({
//       feedbackContent,
//       feedbackDate,
//       customerId
//     });
//     await newFeedback.save();
//     res.status(201).json({ message: "Feedback created successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

app.post("/Feedback", async (req, res) => {
  try {
    const { feedbackContent, feedbackDate, customerId } = req.body;
    if (!feedbackContent || !feedbackDate || !customerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newFeedback = new Feedback({
      feedbackContent,
      feedbackDate,
      customerId
    });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
