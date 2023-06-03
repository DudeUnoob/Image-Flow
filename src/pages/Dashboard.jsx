import { useEffect, useState } from "react"
import { authMiddleware } from "../functions/authMiddleware"
import { useNavigate } from "react-router-dom"
import { UserContext, UserProvider, useUser, useUserUpdate } from "../context/UserContext"

export default function Dashboard () {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
       
        authMiddleware().then((data) => {
            data == null ? navigate('/login') : setUserData(data)
        })
       
    }, [])

    return (
        <>
            <div>

            </div>
        </>
    )
}