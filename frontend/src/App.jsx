import './App.css'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Home from './pages/home/Home'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Toaster} from 'react-hot-toast'


function App() {

  return (
    <>
      <div className='p-4 h-screen flex items-center justify-center'>
      <>
        <div>
  
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<SignUp/>} />
            </Routes>
            <Toaster/>
        </div>
      </>
      </div>
    </>
  )
}

export default App
