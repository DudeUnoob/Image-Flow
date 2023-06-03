import { supabase } from "./supabaseConnect";



export function authMiddleware () {
    
    return new Promise((resolve, reject) => {
        supabase.auth.getUser().then(({ data: { user }}) => {
            resolve(user)
        }).catch(error => {
            console.log(error, "error")
            reject(error)
        })
    })
}