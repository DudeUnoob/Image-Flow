import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../functions/supabaseConnect';

export const UserContext = React.createContext();
export const UserUpdateContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}

export function useUserUpdate() {
  return useContext(UserUpdateContext);
}

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    authCall()
  }, []);

  async function authCall() {
    const authListener = await supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session !== null) {
          setUserData(session.user);
        } else {
          setUserData(null);
        }
      });
  
      return () => {
        authListener.data.subscription.unsubscribe();
      };
  }

  async function googleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    // Handle the login response
  }
  
  return (
    <UserContext.Provider value={userData}>
      <UserUpdateContext.Provider value={googleLogin}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
