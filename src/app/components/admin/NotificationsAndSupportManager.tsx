"use client"

import { useState } from "react";
import {
  Bell,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Send,
  Eye,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  sentAt: string;
  isAutomatic: boolean;
};

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Message = {
  id: number;
  sender: "user" | "support";
  content: string;
  timestamp: string;
};

type SupportTicket = {
  id: number;
  subject: string;
  status: string;
  createdAt: string;
  lastUpdate: string;
  user: User;
  priority: string;
  category: string;
  messages: Message[];
};
export default function NotificationsAndSupportManager() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nuevo bono disponible",
      message: "¡Bono de 100 créditos para todos!",
      type: "bonus",
      sentAt: "2024-03-15 10:30",
      isAutomatic: true,
    },
    {
      id: 2,
      title: "Mantenimiento programado",
      message: "El sitio estará en mantenimiento mañana de 2 AM a 4 AM.",
      type: "system",
      sentAt: "2024-03-14 15:45",
      isAutomatic: false,
    },
    {
      id: 3,
      title: "Nuevo juego lanzado",
      message: "¡Prueba nuestro nuevo juego 'Fortuna Estelar' ahora!",
      type: "game",
      sentAt: "2024-03-13 20:15",
      isAutomatic: true,
    },
    {
      id: 4,
      title: "Gran victoria",
      message:
        "¡El usuario JohnDoe123 ha ganado el jackpot de 1,000,000 créditos!",
      type: "achievement",
      sentAt: "2024-03-12 18:30",
      isAutomatic: true,
    },
    {
      id: 5,
      title: "Alerta de seguridad",
      message:
        "Se ha detectado un intento de inicio de sesión inusual. Verifica tu cuenta.",
      type: "security",
      sentAt: "2024-03-11 09:00",
      isAutomatic: true,
    },
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      subject: "Problema con el retiro",
      status: "Abierto",
      createdAt: "2024-03-15 11:20",
      lastUpdate: "2024-03-15 11:20",
      user: {
        name: "María González",
        email: "maria@example.com",
        avatar: "/placeholder-user.jpg",
      },
      priority: "Alta",
      category: "Pagos",
      messages: [
        {
          id: 1,
          sender: "user",
          content:
            "Hola, estoy teniendo problemas para retirar mis ganancias. He intentado varias veces pero sigue apareciendo un error.",
          timestamp: "2024-03-15 11:20",
        },
      ],
    },
    {
      id: 2,
      subject: "Pregunta sobre bonos",
      status: "Resuelto",
      createdAt: "2024-03-14 09:00",
      lastUpdate: "2024-03-14 09:30",
      user: {
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        avatar: "/placeholder-user.jpg",
      },
      priority: "Baja",
      category: "Bonos",
      messages: [
        {
          id: 1,
          sender: "user",
          content: "¿Cómo puedo reclamar el bono de bienvenida?",
          timestamp: "2024-03-14 09:00",
        },
        {
          id: 2,
          sender: "support",
          content:
            "Hola Carlos, el bono de bienvenida se acredita automáticamente después de tu primer depósito. ¿Ya has realizado tu primer depósito?",
          timestamp: "2024-03-14 09:15",
        },
        {
          id: 3,
          sender: "user",
          content:
            "Ah, entiendo. No, aún no he hecho mi primer depósito. Lo haré ahora mismo. ¡Gracias!",
          timestamp: "2024-03-14 09:25",
        },
        {
          id: 4,
          sender: "support",
          content:
            "Perfecto, Carlos. Si tienes alguna otra pregunta, no dudes en contactarnos. ¡Que tengas un buen día!",
          timestamp: "2024-03-14 09:30",
        },
      ],
    },
    {
      id: 3,
      subject: "Error en la ruleta",
      status: "En progreso",
      createdAt: "2024-03-13 16:30",
      lastUpdate: "2024-03-13 16:45",
      user: {
        name: "Ana Martínez",
        email: "ana@example.com",
        avatar: "/placeholder-user.jpg",
      },
      priority: "Media",
      category: "Juegos",
      messages: [
        {
          id: 1,
          sender: "user",
          content:
            "La ruleta se congeló mientras estaba girando y no recibí mis créditos. Esto pasó hace unos 20 minutos.",
          timestamp: "2024-03-13 16:30",
        },
        {
          id: 2,
          sender: "support",
          content:
            "Lamentamos el inconveniente, Ana. Estamos investigando el problema. ¿Podrías proporcionarnos más detalles? ¿Recuerdas el monto de la apuesta y el resultado que apareció?",
          timestamp: "2024-03-13 16:45",
        },
      ],
    },
  ]);

  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [newNotificationTitle, setNewNotificationTitle] = useState<string>("");
  const [newNotificationMessage, setNewNotificationMessage] =
    useState<string>("");
  const [newNotificationType, setNewNotificationType] =
    useState<string>("bonus");

  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [newTicketResponse, setNewTicketResponse] = useState("");

  const handleAddNotification = () => {
    if (newNotificationTitle && newNotificationMessage) {
      const newNotification = {
        id: notifications.length + 1,
        title: newNotificationTitle,
        message: newNotificationMessage,
        type: newNotificationType,
        sentAt: new Date().toLocaleString(),
        isAutomatic: false,
      };
      setNotifications([...notifications, newNotification]);
      setNewNotificationTitle("");
      setNewNotificationMessage("");
      setNewNotificationType("bonus");
      setIsNotificationDialogOpen(false);
    }
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setNewNotificationTitle(notification.title);
    setNewNotificationMessage(notification.message);
    setNewNotificationType(notification.type);
    setIsNotificationDialogOpen(true);
  };

  const handleUpdateNotification = () => {
    if (editingNotification && newNotificationTitle && newNotificationMessage) {
      const updatedNotifications = notifications.map((notif) =>
        notif.id === editingNotification.id
          ? {
              ...notif,
              title: newNotificationTitle,
              message: newNotificationMessage,
              type: newNotificationType,
            }
          : notif
      );
      setNotifications(updatedNotifications);
      setEditingNotification(null);
      setNewNotificationTitle("");
      setNewNotificationMessage("");
      setNewNotificationType("bonus");
      setIsNotificationDialogOpen(false);
    }
  };

  const handleDeleteNotification = (id: number) => {
    const updatedNotifications = notifications.filter(
      (notif) => notif.id !== id
    );
    setNotifications(updatedNotifications);
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleUpdateTicketStatus = (id: number, newStatus: string) => {
    const updatedTickets = supportTickets.map((ticket) =>
      ticket.id === id
        ? {
            ...ticket,
            status: newStatus,
            lastUpdate: new Date().toLocaleString(),
          }
        : ticket
    );
    setSupportTickets(updatedTickets);
  };

  // const handleSendTicketResponse = () => {
  //   if (selectedTicket && newTicketResponse) {
  //     const updatedTickets = supportTickets.map((ticket) => {
  //       if (ticket.id === selectedTicket.id) {
  //         return {
  //           ...ticket,
  //           messages: [
  //             ...ticket.messages,
  //             {
  //               id: ticket.messages.length + 1,
  //               sender: "support",
  //               content: newTicketResponse,
  //               timestamp: new Date().toLocaleString(),
  //             },
  //           ],
  //           lastUpdate: new Date().toLocaleString(),
  //           status: "En progreso",
  //         };
  //       }
  //       return ticket;
  //     });
  //     setSupportTickets(updatedTickets);
  //     setNewTicketResponse("");
  //     setSelectedTicket(
  //       updatedTickets.find((t) => t.id === selectedTicket.id) || null
  //     );
  //   }
  // };

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
        Panel de Administración
      </h1>
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 bg-opacity-50 rounded-xl">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-xl"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-xl"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Soporte
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notifications">
          <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-purple-300">
                <span>Gestión de Notificaciones</span>
                <Button
                  onClick={() => setIsNotificationDialogOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 !text-white !font-medium rounded-[6px]"
                >
                  <Plus className="w-4 h-4 mr-2" /> Nueva Notificación
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#f4f4f580]">
                    <TableHead className="text-purple-300">Título</TableHead>
                    <TableHead className="text-purple-300">Mensaje</TableHead>
                    <TableHead className="text-purple-300">Tipo</TableHead>
                    <TableHead className="text-purple-300">Enviado</TableHead>
                    <TableHead className="text-purple-300">Origen</TableHead>
                    <TableHead className="text-purple-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notif) => (
                    <TableRow key={notif.id} className="hover:bg-[#f4f4f580]">
                      <TableCell className="font-medium">
                        {notif.title}
                      </TableCell>
                      <TableCell>{notif.message}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            notif.type === "bonus"
                              ? "default"
                              : notif.type === "system"
                              ? "secondary"
                              : notif.type === "game"
                              ? "outline"
                              : notif.type === "achievement"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {notif.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{notif.sentAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={notif.isAutomatic ? "secondary" : "default"}
                        >
                          {notif.isAutomatic ? "Automática" : "Manual"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNotification(notif)}
                          className="text-purple-300 hover:text-purple-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="text-purple-300 hover:text-purple-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="support">
          <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-purple-300">
                Gestión de Tickets de Soporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#f4f4f580]">
                    <TableHead className="text-purple-300">Usuario</TableHead>
                    <TableHead className="text-purple-300">Asunto</TableHead>
                    <TableHead className="text-purple-300">Estado</TableHead>
                    <TableHead className="text-purple-300">Prioridad</TableHead>
                    <TableHead className="text-purple-300">Categoría</TableHead>
                    <TableHead className="text-purple-300">
                      Última Actualización
                    </TableHead>
                    <TableHead className="text-purple-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-[#f4f4f580]">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage
                              src={ticket.user.avatar}
                              alt={ticket.user.name}
                            />
                            <AvatarFallback>
                              {ticket.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{ticket.user.name}</p>
                            <p className="text-sm text-gray-400">
                              {ticket.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ticket.status === "Abierto"
                              ? "default"
                              : ticket.status === "En progreso"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ticket.priority === "Alta"
                              ? "destructive"
                              : ticket.priority === "Media"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>{ticket.lastUpdate}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                          className="text-purple-300 hover:bg-white hover:text-purple-400 hover:opacity-95 duration-300 ease-in-out mb-1 rounded-[6px]"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          onValueChange={(value) =>
                            handleUpdateTicketStatus(ticket.id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px] rounded-[6px] bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Abierto">Abierto</SelectItem>
                            <SelectItem value="En progreso">
                              En progreso
                            </SelectItem>
                            <SelectItem value="Resuelto">Resuelto</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isNotificationDialogOpen}
        onOpenChange={setIsNotificationDialogOpen}
      >
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingNotification
                ? "Editar Notificación"
                : "Nueva Notificación"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notificationTitle">Título</Label>
              <Input
                id="notificationTitle"
                value={newNotificationTitle}
                onChange={(e) => setNewNotificationTitle(e.target.value)}
                className="bg-gray-700 rounded-[6px] focus-visible:ring-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-0 focus-visible:ring-offset-[#a1a1aa] focus-visible:ring-[#a1a1aa]  text-white border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="notificationMessage">Mensaje</Label>
              <Textarea
                id="notificationMessage"
                value={newNotificationMessage}
                onChange={(e) => setNewNotificationMessage(e.target.value)}
                className="bg-gray-700 rounded-[6px] focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:ring-offset-[#a1a1aa] focus-visible:ring-[#a1a1aa]  text-white border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="notificationType">Tipo</Label>
              <Select
                value={newNotificationType}
                onValueChange={setNewNotificationType}
              >
                <SelectTrigger className="w-full focus:outline-offset-0 bg-gray-700 rounded-[6px] focus:ring-2 focus:outline-2 focus:outline-white focus:ring-offset-[#a1a1aa] focus:ring-[#a1a1aa]  text-white border-gray-600">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus">Bono</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="game">Juego</SelectItem>
                  <SelectItem value="achievement">Logro</SelectItem>
                  <SelectItem value="security">Seguridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNotificationDialogOpen(false)}
              className=" rounded-[6px] font-semibold bg-white text-black hover:opacity-95 hover:text-black hover:bg-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editingNotification
                  ? handleUpdateNotification
                  : handleAddNotification
              }
              className="bg-purple-600 hover:bg-purple-700 rounded-[6px] font-semibold !text-white"
            >
              {editingNotification ? "Actualizar" : "Añadir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="bg-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={selectedTicket.user.avatar}
                    alt={selectedTicket.user.name}
                  />
                  <AvatarFallback>
                    {selectedTicket.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedTicket.user.name}</p>
                  <p className="text-sm text-gray-400">
                    {selectedTicket.user.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Asunto</Label>
                  <p className="text-lg font-semibold">
                    {selectedTicket.subject}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Estado</Label>
                  <Badge
                    variant={
                      selectedTicket.status === "Abierto"
                        ? "default"
                        : selectedTicket.status === "En progreso"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {selectedTicket.status}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Prioridad</Label>
                  <Badge
                    variant={
                      selectedTicket.priority === "Alta"
                        ? "destructive"
                        : selectedTicket.priority === "Media"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Categoría</Label>
                  <p className="font-semibold">{selectedTicket.category}</p>
                </div>
                <div>
                  <Label className="font-semibold">Creado</Label>
                  <p className="font-semibold">{selectedTicket.createdAt}</p>
                </div>
                <div>
                  <Label className="font-semibold">Última Actualización</Label>
                  <p className="font-semibold">{selectedTicket.lastUpdate}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Conversación</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-purple-700"
                          : "bg-gray-700"
                      } bg-opacity-50`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">
                          {message.sender === "user"
                            ? selectedTicket.user.name
                            : "Soporte"}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 font-semibold">{message.content}</p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <div>
                <Label htmlFor="ticketResponse" className="font-semibold">Nueva Respuesta</Label>
                <Textarea
                  id="ticketResponse"
                  value={newTicketResponse}
                  onChange={(e) => setNewTicketResponse(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  placeholder="Escribe tu respuesta aquí..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter >
            <Button
              variant="outline"
              className="font-semibold bg-white text-black hover:bg-white/95 hover:text-black"
              onClick={() => setIsTicketDialogOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              // onClick={handleSendTicketResponse}
              className="bg-purple-600 hover:bg-purple-700 font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Respuesta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
