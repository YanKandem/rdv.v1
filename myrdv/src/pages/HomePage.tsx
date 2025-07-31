import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../lib/store'
import { fetchAppointmentTypes, AppointmentType } from '../features/appointments/appointmentSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { appointmentTypes, isLoading } = useSelector((state: RootState) => state.appointments)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchAppointmentTypes())
  }, [dispatch])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Prenez rendez-vous en ligne
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Système moderne de gestion de rendez-vous inspiré de France Visa. 
          Réservez votre créneau facilement et rapidement.
        </p>
      </section>

      {/* Services Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold">Nos services</h2>
          <p className="text-muted-foreground">
            Choisissez le type de rendez-vous qui correspond à vos besoins
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointmentTypes.filter((type: AppointmentType) => type.active).map((type: AppointmentType) => (
              <Card key={type.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{type.name}</CardTitle>
                  <CardDescription>
                    Durée: {type.duration} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                  <Button className="w-full">
                    Prendre rendez-vous
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && appointmentTypes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                Aucun service disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold">Pourquoi choisir MyRDV ?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary text-xl">⚡</span>
            </div>
            <h3 className="font-semibold">Rapide et Simple</h3>
            <p className="text-sm text-muted-foreground">
              Réservez votre rendez-vous en quelques clics seulement
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary text-xl">📱</span>
            </div>
            <h3 className="font-semibold">Accessible Partout</h3>
            <p className="text-sm text-muted-foreground">
              Interface responsive, utilisable sur tous vos appareils
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary text-xl">🔐</span>
            </div>
            <h3 className="font-semibold">Sécurisé</h3>
            <p className="text-sm text-muted-foreground">
              Vos données sont protégées et sécurisées
            </p>
          </div>
        </div>
      </section>

      {!user && (
        <section className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-semibold">Créez votre compte</h2>
          <p className="text-muted-foreground">
            Pour un suivi personnalisé de vos rendez-vous
          </p>
          <div className="space-x-4">
            <Button variant="outline">
              Se connecter
            </Button>
            <Button>
              S'inscrire
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}