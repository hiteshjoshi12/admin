function formatProductTitle(name) {
  if (!name) return 'Handcrafted Juttis | Beads and Bloom';
  const withBrand = `${name} | Beads and Bloom`;
  if (withBrand.length <= 60) {
    return withBrand;
  }
  return name;
}

function getCraftOptions(name = '', embellishment = '') {
  const nameLower = (name || '').toLowerCase();
  const embLower = (embellishment || '').toLowerCase();

  // 1. Specific crafts mentioned in the product name first (authoritative styling)
  if (nameLower.includes('gota patti')) return ['Gota patti work', 'Gota patti'];
  if (nameLower.includes('mirror work') || nameLower.includes('sheesh')) return ['Sheesha mirror work', 'Mirror work'];
  if (nameLower.includes('phulkari')) return ['Phulkari embroidery', 'Phulkari work'];
  if (nameLower.includes('dabka')) return ['Dabka threadwork', 'Dabka work'];
  if (nameLower.includes('resham')) return ['Resham threadwork', 'Resham work'];
  if (nameLower.includes('cutdana')) return ['Zardozi & cutdana', 'Cutdana work', 'Zardozi work'];
  if (nameLower.includes('zari')) return ['Fine zari work', 'Zari work'];
  if (nameLower.includes('pearl') || nameLower.includes('bead')) return ['Pearl & bead work', 'Pearl work'];
  if (nameLower.includes('zardozi')) return ['Zardozi embroidery', 'Zardozi work'];

  // 2. Specific crafts from embellishment if name doesn't specify one
  if (embLower.includes('sheesha') || embLower.includes('mirror')) return ['Sheesha mirror work', 'Mirror work'];
  if (embLower.includes('phulkari')) return ['Phulkari embroidery', 'Phulkari work'];
  if (embLower.includes('dabka')) return ['Dabka threadwork', 'Dabka work'];
  if (embLower.includes('resham')) return ['Resham threadwork', 'Resham work'];
  if (embLower.includes('cutdana') && embLower.includes('zardozi')) return ['Zardozi & cutdana', 'Zardozi work'];
  if (embLower.includes('cutdana')) return ['Cutdana beadwork', 'Cutdana work'];
  if (embLower.includes('zari')) return ['Fine zari work', 'Zari work'];
  if (embLower.includes('seed pearls') || embLower.includes('moti')) return ['Pearl & bead work', 'Pearl work'];

  // 3. For the generic "Handcrafted Zardozi, Pearls & Sequins" products:
  // If product name has no craft indicator, omit per user instructions:
  // "Never use a default; if nothing matches, omit the craft phrase."
  if (embLower === 'handcrafted zardozi, pearls & sequins') {
    if (nameLower.includes('sitara')) return ['Sitara & sequin work', 'Sequin work'];
    return []; // Omit craft phrase entirely
  }

  if (embLower.includes('zardozi')) return ['Zardozi embroidery', 'Zardozi work'];

  return []; // Omit
}

function getCraftDetail(nameOrEmbellishment = '', maybeEmbellishment = '') {
  let name = nameOrEmbellishment;
  let embellishment = maybeEmbellishment;
  if (!maybeEmbellishment && nameOrEmbellishment) {
    // If only one argument was passed, treat as embellishment
    name = '';
    embellishment = nameOrEmbellishment;
  }
  const options = getCraftOptions(name, embellishment);
  return options.length > 0 ? options[0] : '';
}

function formatProductMeta(product) {
  if (!product) return '';
  const name = product.name || '';
  const price = Number(product.price || 0).toLocaleString('en-IN');
  const craftOptions = getCraftOptions(product.name, product.embellishment);

  for (const craft of craftOptions) {
    const candidate = `${name}. ${craft}, pure leather sole. ₹${price}. COD in India, 2-4 day delivery, worldwide shipping.`;
    if (candidate.length <= 155) {
      return candidate;
    }
  }

  // Fallback when no craft fits or no craft is specified
  return `${name}. Pure leather sole. ₹${price}. COD in India, 2-4 day delivery, worldwide shipping.`;
}

module.exports = {
  formatProductTitle,
  getCraftDetail,
  getCraftOptions,
  formatProductMeta
};
