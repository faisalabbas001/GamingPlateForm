import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Bell, Gift, Zap, Trophy, Info } from 'lucide-react'
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

const NotificationsTab = () => {

    const getNotificationIcon = (type: string) => {
        switch (type) {
          case 'bonus':
            return <Gift className="h-6 w-6 text-yellow-400" />
          case 'freeSpins':
            return <Zap className="h-6 w-6 text-blue-400" />
          case 'levelUp':
            return <Trophy className="h-6 w-6 text-green-400" />
          case 'bigWin':
            return <Zap className="h-6 w-6 text-pink-400" />
          case 'update':
            return <Info className="h-6 w-6 text-purple-400" />
          default:
            return <Bell className="h-6 w-6 text-gray-400" />
        }
      }

    const [notifications, setNotifications] = useState([
        { 
          id: 1, 
          title: "Nuevo bono disponible", 
          message: "¡Has desbloqueado un bono de 100 créditos!", 
          read: false, 
          timestamp: "2024-03-15 10:30",
          type: "bonus"
        },
        { 
          id: 2, 
          title: "Giro gratis listo", 
          message: "Tu giro diario gratis está disponible. ¡No olvides usarlo!", 
          read: true, 
          timestamp: "2024-03-14 15:45",
          type: "freeSpins"
        },
        { 
          id: 3, 
          title: "Nuevo nivel alcanzado", 
          message: "¡Felicidades! Has alcanzado el nivel Plata. Disfruta de tus nuevos beneficios.", 
          read: false, 
          timestamp: "2024-03-13 20:15",
          type: "levelUp"
        },
        { 
          id: 4, 
          title: "Gran victoria", 
          message: "¡Enhorabuena! Has ganado 1000 créditos en la Ruleta de la Fortuna.", 
          read: false, 
          timestamp: "2024-03-12 18:30",
          type: "bigWin"
        },
        { 
          id: 5, 
          title: "Actualización de la plataforma", 
          message: "Hemos realizado mejoras en la seguridad y rendimiento de la plataforma.", 
          read: true, 
          timestamp: "2024-03-11 09:00",
          type: "update"
        }
      ])

    const markNotificationAsRead = (id: number) => {
        setNotifications(notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ))
      }
    
      const markAllNotificationsAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })))
      }

    const unreadNotifications = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (unreadNotifications > 0) {
      document.title = `(${unreadNotifications}) GamingPlatform - Nuevas notificaciones`
    } else {
      document.title = 'GamingPlatform'
    }
  }, [unreadNotifications])

  return (
   <>
      <Card className="bg-gray-800 bg-opacity-80 border-purple-500 border rounded-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            Todas las Notificaciones
          </CardTitle>
          <CardDescription className="text-center text-gray-300 text-lg">
            Mantente al día con las últimas novedades y actualizaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base text-gray-300">
              {unreadNotifications} notificaciones sin leer
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsAsRead}
              className="text-purple-400 hover:text-purple-300 border-purple-500 hover:bg-white bg-white rounded-[8px] font-medium"
            >
              Marcar todas como leídas
            </Button>
          </div>
          <ScrollArea className="h-[400px] w-full rounded-[6px] border border-gray-700 p-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`mb-4 p-3 rounded-[6px] ${
                  notif.read ? "bg-gray-700" : "bg-purple-700"
                } bg-opacity-80 transition-colors duration-200`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg  text-white">
                        {notif.title}
                      </h3>
                      <Badge
                        variant={notif.read ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {notif.read ? "Leído" : "Nuevo"}
                      </Badge>
                    </div>
                    <p className="text-base text-gray-300 mt-1">
                      {notif.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-400">
                        {notif.timestamp}
                      </span>
                      {!notif.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="text-purple-400 hover:text-purple-300 text-sm hover:bg-white rounded-[8px] font-medium"
                        >
                          Marcar como leído
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
   </>
  )
}

export default NotificationsTab
