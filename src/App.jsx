import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import { createClient } from "@supabase/supabase-js"
import Login from './pages/Login';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';
import { UserProvider } from './context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import { onLocalStorageChange } from './functions/onLocalStorageChange';

function App() {
  const [count, setCount] = useState(0)

   useEffect(() => {
    onLocalStorageChange()
   },[])

  return (
    
    <>
    
   <BrowserRouter>
   <UserProvider>
   <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/test' element={<Test />}></Route>
      </Routes>
      </UserProvider>
   </BrowserRouter>
   </>
  )
}

export default App
