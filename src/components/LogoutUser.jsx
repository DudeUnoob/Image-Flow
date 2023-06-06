import { Button } from "react-bootstrap";
import { supabase } from "../functions/supabaseConnect";
import React, { useState, useEffect } from 'react';


export default function LogoutUser() {

    const handleLogout = () => {
        supabase.auth.signOut().then((data) => console.log(data))
    }

    return (
        <div>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
    )
}