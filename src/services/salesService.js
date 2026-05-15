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

  async getSalesDetailWithProducts(transno) {
    const { data, error } = await supabase
      .from('salesdetail')
      .select(`
        transno,
        quantity,
        prodcode,
        product (description, unit)
      `)
      .eq('transno', transno);
    return { data, error };
  },
};