import React, { useState, useEffect } from 'react';
import { supabase } from '../functions/supabaseConnect';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserProvider, useUser, useUserUpdate } from "../context/UserContext"


export default function Login() {
    const getUser = useUser()
    const updateUser = useUserUpdate()
    const navigate = useNavigate()
    const [userState, setUserState] = useState(null)


    useEffect(() => {
        if(getUser){
            navigate('/')
        }
        
    }, [getUser])

    // async function googleLogin() {
    //     const { data, error } = await supabase.auth.signInWithOAuth({
    //         provider: 'google',
            
    //       })
          
    // }
    // useEffect(() => {
    //     supabase.auth.onAuthStateChange((event, session) => {
    //         if((event == "INITIAL_SESSION" || event == "SIGNED_IN") && (session !== null)){
    //             navigate('/')
    //         }
    
    //     })
    
    //     }, [])
    //supabase.auth.getSession().then((data) => data.data.session !== null ? setUserState(data.data.session) : setUserState(false))
    
    
    return (
        <div >
            <h1>Login</h1>
            <button onClick={() => updateUser()}>Login with Google</button>
        </div>
    )
}