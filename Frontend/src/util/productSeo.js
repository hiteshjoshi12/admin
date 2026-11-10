export function formatProductTitle(name) {
  if (!name) return 'Handcrafted Juttis | Beads and Bloom';
  const withBrand = `${name} | Beads and Bloom`;
  if (withBrand.length <= 60) {
    return withBrand;
  }
  return name;
}

export function getCraftDetail(embellishment) {
  if (!embellishment) return "";
  const lower = embellishment.toLowerCase();
  if (lower.includes("zardozi") && lower.includes("pearl")) return "zardozi, pearls";
  if (lower.includes("zardozi")) return "zardozi work";
  if (lower.includes("dabka")) return "dabka threadwork";
  if (lower.includes("sheesha") || lower.includes("mirror")) return "sheesha mirror work";
  if (lower.includes("phulkari") || lower.includes("resham")) return "resham threadwork";
  if (lower.includes("zari")) return "fine zari work";
  if (lower.includes("pearl") || lower.includes("moti")) return "pearl and bead work";
  return "hand embroidery";
}

export function formatProductMeta(product) {
  if (!product) return '';
  const name = product.name || '';
  const price = Number(product.price || 0).toLocaleString('en-IN');
  const craft = getCraftDetail(product.embellishment);

  // Helper to ensure length <= 155 both unescaped and escaped
  const fits = (str) => str.length <= 155 && str.replace(/&/g, '&amp;').length <= 155;

  // Preferred template: "{Name}: with {craft}, pure leather sole. ₹{price}. COD in India, 2-4 day delivery, worldwide shipping."
  let candidate = `${name}: with ${craft}, pure leather sole. ₹${price}. COD in India, 2-4 day delivery, worldwide shipping.`;
  if (fits(candidate)) {
    return candidate;
  }

  // Tier 2: shorter shipping clause
  candidate = `${name}: with ${craft}, pure leather sole. ₹${price}. COD in India, 2-4 day delivery, ships worldwide.`;
  if (fits(candidate)) {
    return candidate;
  }

  // Tier 3: direct craft connector
  candidate = `${name}: ${craft}, pure leather sole. ₹${price}. COD in India, 2-4 day delivery, ships worldwide.`;
  if (fits(candidate)) {
    return candidate;
  }

  // Tier 4: compact fallback for longest names
  candidate = `${name}. Pure leather sole. ₹${price}. COD in India, 2-4 day delivery, worldwide shipping.`;
  return candidate;
}
