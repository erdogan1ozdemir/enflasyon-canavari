import { loadItems, loadPrices, validateDataset } from "@ec/data";

function main() {
  const items = loadItems();
  const prices = loadPrices();
  const errors = validateDataset(items, prices);

  if (errors.length > 0) {
    console.error(`✗ ${errors.length} doğrulama hatası:`);
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log(`✓ ${items.length} kalem, ${prices.length} fiyat noktası — tüm veri tutarlı.`);
}

main();
