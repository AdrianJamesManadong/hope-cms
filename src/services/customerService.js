import { supabase } from '../lib/supabaseClient.js';

const makeStamp = (action, userId) => {
  const shortId = userId.slice(0, 8);
  const date = new Date().toLocaleDateString('en-PH');
  return `${action}:${shortId} ${date}`; // e.g. "DEL:81a9ae58 5/9/2026" — under 60 chars
};

export const customerService = {
  async getCustomers(userType) {
    let query = supabase.from('customer').select('*').order('custno');
    if (userType === 'USER') query = query.eq('record_status', 'ACTIVE');
    const { data, error } = await query;
    return { data, error };
  },

  async addCustomer(customerData, userId) {
    const { data, error } = await supabase
      .from('customer')
      .insert([{ ...customerData, stamp: makeStamp('ADD', userId) }])
      .select();
    return { data, error };
  },

  async updateCustomer(custno, updates, userId) {
    const { data, error } = await supabase
      .from('customer')
      .update({ ...updates, stamp: makeStamp('UPD', userId) })
      .eq('custno', custno)
      .select();
    return { data, error };
  },

  async softDeleteCustomer(custno, userId) {
    const { error } = await supabase
      .from('customer')
      .update({ record_status: 'INACTIVE', stamp: makeStamp('DEL', userId) })
      .eq('custno', custno);
    return { error };
  },

  async recoverCustomer(custno, userId) {
    const { error } = await supabase
      .from('customer')
      .update({ record_status: 'ACTIVE', stamp: makeStamp('REC', userId) })
      .eq('custno', custno);
    return { error };
  }
};