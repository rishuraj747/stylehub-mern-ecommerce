import mongoose from 'mongoose';
import 'dotenv/config';

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function fixDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    let count = 0;
    for (const p of products) {
      // Get the doc as plain object to inspect fields as they are
      const updateData = {};
      let needsUpdate = false;
      
      let name = p.get('name');
      let category = p.get('category');
      
      if (name && name.endsWith('"')) {
        updateData.name = name.replace(/"+$/, "");
        needsUpdate = true;
      }
      if (category && (category.trim() !== category || category === "kids" || category === '"Kids"')) {
        updateData.category = "Kids"; // Assuming we just want to fix any weird kids casing or extra space
        if(category.toLowerCase().includes('kid')) {
          updateData.category = "Kids";
          needsUpdate = true;
        } else if (category !== category.trim()) {
           updateData.category = category.trim();
           needsUpdate = true;
        }
      }
      
      // Some debugging to see what's actually in DB for category:
      if (typeof category === 'string' && category.match(/kid/i)) {
          console.log(`Category before: '${category}', Category after: '${updateData.category || category}'`);
      }

      if (needsUpdate) {
        await Product.updateOne({ _id: p._id }, { $set: updateData });
        count++;
      }
    }
    
    console.log(`Updated ${count} products.`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixDb();
