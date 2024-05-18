import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Login from './pages/login/Login'
import SingUp from './pages/singup/SingUp'



function App() {

  return (
    <>
      <div className='p-4 h-screen flex items-center justify-center'>
        <SingUp/>
      </div>
    </>
  )
}

export default App
