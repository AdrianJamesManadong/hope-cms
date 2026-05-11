import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './AuthContext';

const UserRightsContext = createContext();

export const useRights = () => {
  const context = useContext(UserRightsContext);
  if (!context) throw new Error('useRights must be used within UserRightsProvider');
  return context;
};

export const UserRightsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [rights, setRights] = useState({});
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setRights({});
      setUserType(null);
      setLoading(false);
      return;
    }

    const loadRights = async () => {
      const { data, error } = await supabase
        .from('usermodule_rights')        
        .select('right_code, right_value')
        .eq('userid', currentUser.id);   

      if (error) {
        console.error('Error loading rights:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const rightsMap = {};
        data.forEach(item => {
          rightsMap[item.right_code] = item.right_value; 
        });
        setRights(rightsMap);
      }

      setUserType(currentUser.user_type);
      setLoading(false);
    };

    loadRights();
  }, [currentUser]);

  return (
    <UserRightsContext.Provider value={{ rights, userType, loading }}>
      {children}
    </UserRightsContext.Provider>
  );
};