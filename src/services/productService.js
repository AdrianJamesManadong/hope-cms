import { supabase } from '../lib/supabaseClient.js';

export const productService = {
  // Get all products
  async getProducts() {
    const { data, error } = await supabase
      .from('product')
      .select('prodcode, description, unit')
      .order('prodcode');
    return { data, error };
  },

  // Get full price history for a product
  async getPriceHistory(prodcode) {
    const { data, error } = await supabase
      .from('pricehist')
      .select('effdate, prodcode, unitprice')
      .eq('prodcode', prodcode)
      .order('effdate', { ascending: false });
    return { data, error };
  },

  // Get only the latest (current) price for a product
  async getCurrentPrice(prodcode) {
    const { data, error } = await supabase
      .from('pricehist')
      .select('unitprice, effdate')
      .eq('prodcode', prodcode)
      .order('effdate', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  // Get all products WITH their current price (for ProductCataloguePage)
  async getProductsWithCurrentPrice() {
    // Fetch products and all price history, then match latest price per product
    const { data: products, error: prodError } = await supabase
      .from('product')
      .select('prodcode, description, unit')
      .order('prodcode');

    if (prodError) return { data: null, error: prodError };

    const { data: prices, error: priceError } = await supabase
      .from('pricehist')
      .select('prodcode, unitprice, effdate')
      .order('effdate', { ascending: false });

    if (priceError) return { data: null, error: priceError };

    // Map latest price per prodcode
    const latestPriceMap = {};
    prices.forEach(p => {
      if (!latestPriceMap[p.prodcode]) {
        latestPriceMap[p.prodcode] = p.unitprice; // first = latest (sorted desc)
      }
    });

    const merged = products.map(p => ({
      ...p,
      currentPrice: latestPriceMap[p.prodcode] ?? null,
    }));

    return { data: merged, error: null };
  },
};