
export const onLocalStorageChange = () => {
    window.addEventListener("storage", (e) => {
        console.log(e)
        //localStorage.clear()
        return window.location.reload()
    })
}