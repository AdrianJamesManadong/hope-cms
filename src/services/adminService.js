import { supabase } from '../lib/supabaseClient.js';

export const adminService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('userid, username, user_type, record_status')
      .order('username');
    return { data, error };
  },

  async activateUser(userid) {
    const { error } = await supabase
      .from('users')
      .update({ record_status: 'ACTIVE' })
      .eq('userid', userid)
      .neq('user_type', 'SUPERADMIN');
    return { error };
  },


  async deactivateUser(userid) {
    const { error } = await supabase
      .from('users')
      .update({ record_status: 'INACTIVE' })
      .eq('userid', userid)
      .neq('user_type', 'SUPERADMIN');
    return { error };
  },

  async changeUserType(userid, newType) {
    if (newType === 'SUPERADMIN') return { error: { message: 'Cannot assign SUPERADMIN role.' } };

    const { error } = await supabase
      .from('users')
      .update({ user_type: newType })
      .eq('userid', userid)
      .neq('user_type', 'SUPERADMIN');

    if (error) return { error };
    const adminRights = [
      { userid, right_code: 'CUST_ADD',   right_value: 1 },
      { userid, right_code: 'CUST_EDIT',  right_value: 1 },
      { userid, right_code: 'CUST_DEL',   right_value: 0 },
      { userid, right_code: 'ADM_USER',   right_value: 1 },
      { userid, right_code: 'CUST_VIEW',  right_value: 1 },
      { userid, right_code: 'SALES_VIEW', right_value: 1 },
      { userid, right_code: 'PROD_VIEW',  right_value: 1 },
      { userid, right_code: 'PRICE_VIEW', right_value: 1 },
      { userid, right_code: 'SD_VIEW',    right_value: 1 },
    ];

    const userRights = [
      { userid, right_code: 'CUST_ADD',   right_value: 0 },
      { userid, right_code: 'CUST_EDIT',  right_value: 0 },
      { userid, right_code: 'CUST_DEL',   right_value: 0 },
      { userid, right_code: 'ADM_USER',   right_value: 0 },
      { userid, right_code: 'CUST_VIEW',  right_value: 1 },
      { userid, right_code: 'SALES_VIEW', right_value: 1 },
      { userid, right_code: 'PROD_VIEW',  right_value: 1 },
      { userid, right_code: 'PRICE_VIEW', right_value: 1 },
      { userid, right_code: 'SD_VIEW',    right_value: 1 },
    ];

    const rights = newType === 'ADMIN' ? adminRights : userRights;
    const { error: rightsError } = await supabase
      .from('usermodule_rights')
      .upsert(rights, { onConflict: 'userid,right_code' });

    if (rightsError) return { error: rightsError };

    return { error: null };
  },
};