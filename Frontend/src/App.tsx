import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/login'
import Home from './pages/home/home'
import ProtectedRoute from './pages/login/ProtectedRoute'
import { useEffect, useState } from 'react'
import Output from './pages/home/output'

function App() {

  const [currentTheme, setCurrentTheme] = useState<string>()

  useEffect(() => {
    const getTheme = localStorage.getItem("theme")
    if (getTheme) {
      setCurrentTheme(getTheme)
    } else {
      localStorage.setItem("theme", "dark-theme")
    }
  }, [])

  const ChangeTheme = () => {
    const curTheme = localStorage.getItem("theme")
    if (curTheme == "dark-theme") {
      localStorage.setItem("theme", "light-theme")
    } else {
      localStorage.setItem("theme", "dark-theme")
    }
  }

  const Logout = () => {
    localStorage.clear();
    return <Navigate to="/login" />
  }

  return (
    <div className={currentTheme}>
      <div className="toggle-theme" onClick={ChangeTheme}>

      </div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute children={<Home />} />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/stdout' element={<Output />}></Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
