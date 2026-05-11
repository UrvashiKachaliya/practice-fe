// "500g" → 500, "1kg" → 1000, "2kg" → 2000
export const toGrams = (weight) => {
  if (!weight) return 0;
  if (weight.endsWith("kg")) return parseFloat(weight) * 1000;
  return parseFloat(weight);
};

// 1500 → "1.5 kg", 500 → "500 g", 1000 → "1 kg"
export const formatWeight = (grams) => {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
};

// weight="500g", packs=3 → "1.5 kg"
export const totalWeight = (weight, packs) =>
  formatWeight(toGrams(weight) * packs);
