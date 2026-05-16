import { supabase } from '../lib/supabaseClient.js';

export const reportsService = {
  // Full customer sales summary from view
  async getCustomerSalesSummary() {
    const { data, error } = await supabase
      .from('customer_sales_summary')
      .select('custno, custname, total_transactions, total_spend, last_sale_date')
      .order('total_spend', { ascending: false });
    return { data, error };
  },

  // Top 10 customers by total spend
  async getTopCustomers() {
    const { data, error } = await supabase
      .from('customer_sales_summary')
      .select('custno, custname, total_transactions, total_spend, last_sale_date')
      .order('total_spend', { ascending: false })
      .limit(10);
    return { data, error };
  },

  // Product revenue from view
  async getProductRevenue() {
    const { data, error } = await supabase
      .from('product_revenue')
      .select('prodcode, description, unit, total_qty_sold, total_revenue')
      .order('total_revenue', { ascending: false });
    return { data, error };
  },
};