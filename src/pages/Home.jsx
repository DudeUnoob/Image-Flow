import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { supabase } from '../functions/supabaseConnect';
import { authMiddleware } from '../functions/authMiddleware';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserProvider, useUser, useUserUpdate } from "../context/UserContext"
export default function Home () {
    const getUser = useUser()
    const updateUser = useUserUpdate()
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);


    useEffect(() => {
      setUserData(getUser)
    }, [getUser])

  
    const {
      id,
      aud,
      role,
      email,
      email_confirmed_at,
      phone,
      confirmed_at,
      last_sign_in_at,
      user_metadata: {
        avatar_url,
        email: user_email,
        email_verified,
        full_name,
        iss,
        name,
        picture,
        provider_id,
        sub
      } = {},
      identities,
      created_at,
      updated_at
    }  = getUser || {}
    return (
      <div>
        {getUser && (
          <li>{full_name}</li>
        )}
        
    </div>
    )
}