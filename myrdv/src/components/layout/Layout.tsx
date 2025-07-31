import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../lib/store'
import { logout } from '../../features/auth/authSlice'
import { Button } from '../ui/button'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">MyRDV</h1>
            <span className="text-sm text-muted-foreground">
              Système de gestion de rendez-vous
            </span>
          </div>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Bonjour, {user.name}
                </span>
                {user.role === 'admin' && (
                  <Button variant="outline" size="sm">
                    Administration
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  Se connecter
                </Button>
                <Button size="sm">
                  S'inscrire
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-8 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MyRDV. Tous droits réservés.</p>
          <p className="mt-2">
            Inspiré de France Visa - Système moderne de gestion de rendez-vous
          </p>
        </div>
      </footer>
    </div>
  )
}