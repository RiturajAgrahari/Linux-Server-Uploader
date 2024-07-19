import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/login'
import Home from './pages/home/home'
import ProtectedRoute from './pages/login/ProtectedRoute'

function App() {

  const Logout = () => {
    localStorage.clear();
    return <Navigate to="/login" />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute children={<Home />} />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
