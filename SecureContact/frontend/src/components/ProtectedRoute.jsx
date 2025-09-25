import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        // Verify token with backend
        const response = await fetch(`${API_URL}/messages?page=1&limit=1`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('adminToken')
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [API_URL])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Render protected content
  return children
}

export default ProtectedRoute
