import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ContactForm from './components/ContactForm'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ContactForm />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
