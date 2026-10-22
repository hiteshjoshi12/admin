const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Product');

const defaultCare = [
  'Keep away from moisture, rain and direct water exposure',
  'Store in breathable muslin or satin dust bag provided',
  'Clean gently with a soft dry cotton cloth',
  'Air dry in shaded breeze if exposed to dampness'
];

const defaultFit = 'Fits true to EU/Indian sizes. If you have broad feet or fall between sizes, order one size up for an effortless, bite-free fit.';

function getSpecsForProduct(product) {
  const name = product.name || '';
  const cats = Array.isArray(product.category) ? product.category : [product.category || 'Bridal'];
  const isBridal = cats.includes('Bridal') || /bridal|wedding|royale|zareen|surkh|heirloom/i.test(name);
  const isFestive = cats.includes('Festive') || /festive|sangeet|party/i.test(name);

  // Derive Material
  let material = 'Pure Silk Dupion';
  if (/velvet/i.test(name)) material = 'Rich Micro Velvet';
  else if (/silk/i.test(name)) material = 'Pure Raw Silk';
  else if (/georgette/i.test(name)) material = 'Pure Georgette & Organza';
  else if (/brocade/i.test(name)) material = 'Heritage Zari Brocade';
  else if (isBridal) material = 'Lustrous Silk Dupion';
  else material = 'Premium Silk & Vegan Leather Base';

  // Derive Color
  let color = 'Artisanal Palette';
  if (/maroon/i.test(name)) color = 'Regal Maroon';
  else if (/blush|pink/i.test(name)) color = 'Soft Blush Pink';
  else if (/red|surkh/i.test(name)) color = 'Royal Sindoor Red';
  else if (/emerald|green/i.test(name)) color = 'Emerald Green';
  else if (/gold|aurum|zareen/i.test(name)) color = 'Champagne Gold';
  else if (/silver/i.test(name)) color = 'Lustrous Silver';
  else if (/blue|neel|cobalt/i.test(name)) color = 'Royal Cobalt Blue';
  else if (/black|noir/i.test(name)) color = 'Midnight Noir Black';
  else if (/rose/i.test(name)) color = 'Rose Gold';
  else if (/peela|yellow/i.test(name)) color = 'Haldi Yellow';
  else if (/beige|ivory/i.test(name)) color = 'Ivory Cream';

  // Derive Embellishment
  let embellishment = 'Handcrafted Zardozi, Pearls & Sequins';
  if (/mirror|sheesh|sheesha/i.test(name)) {
    embellishment = 'Hand-cut Sheesha Mirror Work with Golden Zari Framing';
  } else if (/pearl|moti|nazakat/i.test(name)) {
    embellishment = 'Delicate Seed Pearls, White Moti & Hand-embroidered Cutdana';
  } else if (/dabka/i.test(name)) {
    embellishment = 'Mughal Dabka Threadwork with Metallic Gold Wire & Resham';
  } else if (/zari/i.test(name)) {
    embellishment = 'Fine Metallic Zari Threadwork with Gota Scallops & Sequins';
  } else if (/resham/i.test(name)) {
    embellishment = 'Pure Resham Silk Threadwork & Fine Floral Embroidery';
  } else if (/phulkari/i.test(name)) {
    embellishment = 'Phulkari-inspired Vibrant Resham Threadwork & Micro Pearls';
  } else if (isBridal) {
    embellishment = 'Intricate Royal Zardozi, Cutdana, Seed Pearls & Zari Stitches';
  }

  // Derive SKU
  const acronym = name
    .replace(/[^a-zA-Z\s]/g, '')
    .split(/\s+/)
    .slice(0, 3)
    .map(w => w[0].toUpperCase())
    .join('');
  const shortId = product._id.toString().slice(-3).toUpperCase();
  const sku = `BB-${acronym || 'JUT'}-${shortId}`;

  // Derive Occasions
  let occasions = ['Festive Celebrations', 'Wedding Guest', 'Family Ceremonies'];
  if (isBridal) {
    occasions = ['Bridal', 'Sangeet & Mehendi', 'Wedding Receptions', 'Festive Celebrations'];
  } else if (isFestive) {
    occasions = ['Festive Celebrations', 'Sangeet & Mehendi', 'Party', 'Wedding Guest'];
  } else {
    occasions = ['Everyday Chic', 'Festive Celebrations', 'Casual Styling', 'Work/Office'];
  }

  const comfortNotes = 'Double-padded memory foam footbed with arch support for bite-free, all-day comfort';
  const sole = '100% Genuine Vegetable-Tanned Leather Sole';
  const lining = 'Soft Genuine Leather Lining with Double-Density Cushioning';

  return {
    sku,
    material,
    color,
    embellishment,
    sole,
    lining,
    comfortNotes,
    fitTip: defaultFit,
    careInstructions: defaultCare,
    occasions
  };
}

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check/populate.`);

    let updatedCount = 0;

    for (const prod of products) {
      const specs = getSpecsForProduct(prod);

      // Only update if not already set or empty
      let needsSave = false;

      if (!prod.sku || prod.sku.trim() === '') {
        prod.sku = specs.sku;
        needsSave = true;
      }
      if (!prod.material || prod.material.trim() === '') {
        prod.material = specs.material;
        needsSave = true;
      }
      if (!prod.color || prod.color.trim() === '') {
        prod.color = specs.color;
        needsSave = true;
      }
      if (!prod.embellishment || prod.embellishment.trim() === '') {
        prod.embellishment = specs.embellishment;
        needsSave = true;
      }
      if (!prod.sole || prod.sole.trim() === '') {
        prod.sole = specs.sole;
        needsSave = true;
      }
      if (!prod.lining || prod.lining.trim() === '') {
        prod.lining = specs.lining;
        needsSave = true;
      }
      if (!prod.comfortNotes || prod.comfortNotes.trim() === '') {
        prod.comfortNotes = specs.comfortNotes;
        needsSave = true;
      }
      if (!prod.fitTip || prod.fitTip.trim() === '') {
        prod.fitTip = specs.fitTip;
        needsSave = true;
      }
      if (!prod.careInstructions || prod.careInstructions.length === 0) {
        prod.careInstructions = specs.careInstructions;
        needsSave = true;
      }
      if (!prod.occasions || prod.occasions.length === 0) {
        prod.occasions = specs.occasions;
        needsSave = true;
      }

      // Also ensure imageDetails has default perspective entries matching images
      if (!prod.imageDetails || prod.imageDetails.length === 0) {
        const details = [];
        if (prod.image) {
          details.push({ url: prod.image, perspective: 'Main 3/4 Studio', isPrimary: true });
        }
        if (Array.isArray(prod.images)) {
          prod.images.forEach((img, idx) => {
            if (img && img !== prod.image) {
              const perspectives = ['Sole & Footbed', 'Close-up Embroidery', 'Side Profile', 'Pair View'];
              const pers = perspectives[idx % perspectives.length] || 'Angle';
              details.push({ url: img, perspective: pers, isPrimary: false });
            }
          });
        }
        prod.imageDetails = details;
        needsSave = true;
      }

      if (needsSave) {
        await prod.save();
        updatedCount++;
        console.log(`[UPDATED] ${prod.name} -> SKU: ${prod.sku}`);
      } else {
        console.log(`[SKIPPED] ${prod.name} (already populated)`);
      }
    }

    console.log(`\nSuccessfully populated ${updatedCount} products with artisanal specifications!`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
