import React, { useState, useEffect } from 'react';
import { UserContext, UserProvider, useUser, useUserUpdate } from "../context/UserContext"


export default function Test() {
    const getUser = useUser()
    const updateUser = useUserUpdate()
    return (
        <>
        {console.log(getUser)}
        </>
        
    )
}