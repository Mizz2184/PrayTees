import { productSyncService } from '../src/services/productSync.js';

async function main() {
  try {
    console.log('Starting product sync...');
    await productSyncService.syncProducts();
    console.log('Product sync completed successfully');
  } catch (error) {
    console.error('Product sync failed:', error);
    process.exit(1);
  }
}

main(); 