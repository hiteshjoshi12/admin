const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const nameMap = {
  // [1] Neel Pari (Festive, Party - ₹4000)
  "69748bcf84b6ce8e0dd883a7": "Neel Pari - Beige Embroidered Festive Jutti",

  // [2] Peela Sitara (Festive - ₹3799)
  "69748bcf84b6ce8e0dd883b5": "Peela Sitara - Silver Sparkle Festive Jutti",

  // [3] Zar-e-Bahaar (Party, Festive, Limited Edition - ₹2000)
  "69ca8a6d7a89ab93f8a789d9": "Zar-e-Bahaar - Dusty Pink Zari & Pearl Festive Jutti",

  // [4] Rose Goldleaf (Casual, Party, Festive - ₹3500)
  "6a353a4e59b2ef1a0d411a67": "Rose Goldleaf - Shimmering Rose Gold Handcrafted Jutti",

  // [5] Noorani Dabka (Party, Bridal - ₹2500)
  "69748bcf84b6ce8e0dd88392": "Noorani Dabka - Rose Gold Sequined Bridal Jutti",

  // [6] Gul Kairi Zari (Casual, Party, Festive, Limited Edition - ₹1796)
  "69d519997a89ab93f8a78ccc": "Gul Kairi Zari - Paisley Zari Handcrafted Jutti",

  // [7] Fuchsia Raqs (Bridal, Party, Festive - ₹3500)
  "6a2136b2faa13ea97dff988f": "Fuchsia Raqs - Pink Zardozi & Cutdana Bridal Jutti",

  // [8] Noor-e-Hunar (Casual - ₹2999)
  "69748bcf84b6ce8e0dd88384": "Noor-e-Hunar - Pastel Pearl & Bead Casual Jutti",

  // [9] Gul Mehar Dastkaar (Limited Edition, Casual, Everyday - ₹1500)
  "69ca8e3d7a89ab93f8a789e3": "Gul Mehar Dastkaar - Resham Threadwork Casual Jutti",

  // [10] Silver Khwaab (Casual, Party, Festive, Office - ₹3800)
  "6a2f92effaa13ea97dff9bad": "Silver Khwaab - Handcrafted Silver Beaded Jutti",

  // [11] Firoza Bahar (Limited Edition, Casual - ₹1600)
  "69ca889e7a89ab93f8a789cf": "Firoza Bahar - Dusty Pink Zari Floral Jutti",

  // [12] Rani Gul (Bridal, Party, Festive - ₹3500)
  "69fc2ed3ab3b0124d4c22844": "Rani Gul - Rani Pink Velvet Bridal Wedding Jutti",

  // [13] Noor-e-Aaina (Party - ₹3599)
  "69748bcf84b6ce8e0dd883a0": "Noor-e-Aaina - Mirror Work Sheesha Party Jutti",

  // [14] Silken Dabka Elegance (Casual, Office - ₹2699)
  "69748bcf84b6ce8e0dd88376": "Silken Dabka Elegance - Pure Silk Handcrafted Dabka Jutti",

  // [15] Noor-e-Zareen (Bridal, Festive, Limited Edition - ₹3500)
  "699c60ba8b14b5c11b70bb3f": "Noor-e-Zareen - Regal Zardozi Georgette Bridal Jutti",

  // [16] Sitara Lattice (Everyday, Festive - ₹2995)
  "69ba79a17a89ab93f8a781b0": "Sitara Lattice - Grid Zari & Bead Work Festive Jutti",

  // [17] Surkh Aangan (Bridal, Party, Festive - ₹2800)
  "6a145a541f3420d41ba8a781": "Surkh Aangan - Royal Red Zardozi Bridal Wedding Jutti",

  // [18] Blush Mehar (Bridal, Party, Festive - ₹3500)
  "6a4b9f368e1614d4756c44bb": "Blush Mehar - Pastel Pink Handcrafted Bridal Jutti",

  // [19] Blush Mirage (Festive - ₹3499)
  "69748bcf84b6ce8e0dd8837d": "Blush Mirage - Velvet Gota Patti Work Festive Jutti",

  // [20] Neel Noor (Festive - ₹3499)
  "69748bcf84b6ce8e0dd883c3": "Neel Noor - Antique Bronze & Gold Vintage Festive Jutti",

  // [21] Meher Sitara (Limited Edition, Everyday, Office - ₹2000)
  "69a9215b7a89ab93f8a777a4": "Meher Sitara - Handcrafted Zardozi Sitara Casual Jutti",

  // [22] Sheesh Noir (Bridal, Festive, Party - ₹4000)
  "69f0b69fab4bd230f5fe87f2": "Sheesh Noir - Black Geometric Mirror Work Festive Jutti",

  // [23] Rang-e-Bahaar (Party, Festive - ₹3900)
  "6a606cd5a1d97dafebd2cbac": "Rang-e-Bahaar - Pastel Multicolored Handcrafted Festive Jutti",

  // [24] Ruby Heritage (Bridal - ₹3999)
  "69748bcf84b6ce8e0dd88399": "Ruby Heritage - Emerald Green Embroidered Bridal Jutti",

  // [25] Peacock Blush (Party - ₹2799)
  "69748bcf84b6ce8e0dd883bc": "Peacock Blush - Phulkari Inspired Floral Party Jutti",

  // [26] Shehenshah Heirloom (Bridal, Limited Edition - ₹4000)
  "699b21828b14b5c11b70b995": "Shehenshah Heirloom - Royal Metallic Threadwork Bridal Jutti",

  // [27] Cobalt Sheesh (Festive - ₹3999)
  "69748bcf84b6ce8e0dd8838b": "Cobalt Sheesh - Golden Heavy Zardozi Wedding Jutti",

  // [28] Tajvira Royale (Festive, Party - ₹3500)
  "69ba7b987a89ab93f8a781ba": "Tajvira Royale - Mughal Scallop Dabka & Zari Festive Jutti",

  // [29] Champagne Zeenat (Bridal, Party, Festive - ₹3000)
  "6a0dc63e1f3420d41ba8a6ac": "Champagne Zeenat - Champagne Gold Embellished Bridal Jutti",

  // [30] Rose Aurum (Bridal - ₹4100)
  "69748bcf84b6ce8e0dd883ae": "Rose Aurum - Classic Red Stone & Bead Work Bridal Jutti",

  // [31] Nazakat (Bridal, Party, Festive - ₹4000)
  "6a8d7e60f1f6c3dec55438de": "Nazakat - Hand-Placed Pearl & Bead Bridal Festive Jutti",

  // [32] Chand Zari (Casual, Party, Festive, Everyday - ₹3600)
  "6a8d80d3f1f6c3dec554390b": "Chand Zari - Ivory Gold & Silver Metallic Dabka Jutti",

  // [33] Zar Surkh (Bridal, Party - ₹4200)
  "6aa7f37fb711bedea514dc9c": "Zar Surkh - Maroon Velvet Handcrafted Bridal Jutti",

  // [34] Gul Blush (Bridal, Party, Festive - ₹4200)
  "6aa7f552b711bedea514dcab": "Gul Blush - Handcrafted Embroidered Bridal Punjabi Jutti"
};

async function patchDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!\n");

    let updatedCount = 0;

    for (const [id, newName] of Object.entries(nameMap)) {
      const product = await Product.findById(id);
      if (!product) {
        console.warn(`Product with ID ${id} not found.`);
        continue;
      }

      const oldName = product.name;
      const oldSlug = product.slug;

      // Clean single-hyphen slug
      const cleanSlug = newName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') 
        .replace(/[\s_-]+/g, '-')  
        .replace(/^-+|-+$/g, '');

      // Preserve previous slug in oldSlugs array
      if (!product.oldSlugs) product.oldSlugs = [];
      if (oldSlug && oldSlug !== cleanSlug && !product.oldSlugs.includes(oldSlug)) {
        product.oldSlugs.push(oldSlug);
      }

      product.name = newName;
      product.slug = cleanSlug;
      await product.save();

      updatedCount++;
      console.log(`[${updatedCount}/34] Updated: "${oldName}"`);
      console.log(`  -> New Name: "${product.name}"`);
      console.log(`  -> Clean Slug: "${product.slug}"`);
      console.log(`  -> Old Slugs Preserved: ${JSON.stringify(product.oldSlugs)}\n`);
    }

    console.log(`\n🎉 Successfully patched all ${updatedCount} products in MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error("Patching error:", error);
    process.exit(1);
  }
}

patchDatabase();
