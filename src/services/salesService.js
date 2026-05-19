import { supabase } from '../lib/supabaseClient.js';

export const salesService = {
  async getSalesByCustomer(custno) {
    const { data, error } = await supabase
      .from('sales')
      .select('transno, salesdate, custno, empno')
      .eq('custno', custno)
      .order('salesdate', { ascending: false });
    return { data, error };
  },

  async getSalesDetail(transno) {
    const { data, error } = await supabase
      .from('salesdetail')
      .select('transno, prodcode, quantity')
      .eq('transno', transno);
    return { data, error };
  },

  async getSalesDetailWithProducts(transno, salesdate) {
    // Get line items
    const { data: details, error } = await supabase
      .from('salesdetail')
      .select('transno, prodcode, quantity')
      .eq('transno', transno);

    if (error || !details?.length) return { data: [], error };

    const prodCodes = details.map((d) => d.prodcode);

    // Get product info
    const { data: products } = await supabase
      .from('product')
      .select('prodcode, description, unit')
      .in('prodcode', prodCodes);

    // Get price history effective at or before sale date
    const { data: prices } = await supabase
      .from('pricehist')
      .select('prodcode, unitprice, effdate')
      .in('prodcode', prodCodes)
      .lte('effdate', salesdate)
      .order('effdate', { ascending: false });

    const productMap = {};
    (products || []).forEach((p) => (productMap[p.prodcode] = p));

    // Pick most recent price per product
    const priceMap = {};
    (prices || []).forEach((p) => {
      if (!priceMap[p.prodcode]) priceMap[p.prodcode] = p.unitprice;
    });

    const data = details.map((row) => ({
      prodcode: row.prodcode,
      quantity: row.quantity,
      product: {
        description: productMap[row.prodcode]?.description ?? '—',
        unit: productMap[row.prodcode]?.unit ?? '—',
        unitprice: priceMap[row.prodcode] ?? null,
      },
    }));

    return { data, error: null };
  },
};