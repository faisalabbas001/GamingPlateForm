import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import { ArrowLeft, Send, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Separator } from "@/app/components/ui/separator";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
interface Message {
  id: number;
  sender: "user" | "support";
  content: string;
  timestamp: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: "Abierto" | "En progreso" | "Resuelto";
  priority: "Alta" | "Media" | "Baja";
  category: string;
  lastUpdate: string;
  messages: Message[];
  hasNewResponse: boolean;
  attachments: File[];
}


const SupportTab = () => {
    const [supportTickets, setSupportTickets] = useState<Ticket[]>([
        {
          id: 1,
          subject: "Problema con el retiro",
          status: "Abierto",
          priority: "Alta",
          category: "Pagos",
          lastUpdate: "2024-03-15 11:20",
          messages: [
            {
              id: 1,
              sender: "user",
              content:
                "Hola, estoy teniendo problemas para retirar mis ganancias. ¿Pueden ayudarme?",
              timestamp: "2024-03-15 11:20",
            },
            {
              id: 2,
              sender: "support",
              content:
                "Hola, lamentamos los inconvenientes. ¿Podrías proporcionarnos más detalles sobre el problema que estás experimentando?",
              timestamp: "2024-03-15 11:35",
            },
          ],
          hasNewResponse: true,
          attachments: [],
        },
        {
          id: 2,
          subject: "Pregunta sobre bonos",
          status: "Resuelto",
          priority: "Baja",
          category: "Bonos",
          lastUpdate: "2024-03-14 09:30",
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
                "El bono de bienvenida se acredita automáticamente en tu cuenta después de tu primer depósito. ¿Has realizado ya tu primer depósito?",
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
                "Perfecto. Si tienes alguna otra pregunta, no dudes en contactarnos. ¡Que tengas un buen día!",
              timestamp: "2024-03-14 09:30",
            },
          ],
          hasNewResponse: false,
          attachments: [],
        },
        {
          id: 3,
          subject: "Error en la ruleta",
          status: "En progreso",
          priority: "Media",
          category: "Juegos",
          lastUpdate: "2024-03-13 16:45",
          messages: [
            {
              id: 1,
              sender: "user",
              content:
                "La ruleta se congeló mientras estaba girando y no recibí mis créditos.",
              timestamp: "2024-03-13 16:30",
            },
            {
              id: 2,
              sender: "support",
              content:
                "Lamentamos el inconveniente. Estamos investigando el problema. ¿Podrías decirnos aproximadamente a qué hora ocurrió esto?",
              timestamp: "2024-03-13 16:45",
            },
          ],
          hasNewResponse: true,
          attachments: [],
        },
      ]);
    
      const [newTicketSubject, setNewTicketSubject] = useState("");
      const [newTicketMessage, setNewTicketMessage] = useState("");
      const [newTicketPriority, setNewTicketPriority] = useState("Media");
      const [newTicketCategory, setNewTicketCategory] = useState("General");
      const [newTicketFile, setNewTicketFile] = useState<File | null>(null);
      const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
      const [newMessage, setNewMessage] = useState("");
    
      const fileInputRef = useRef<HTMLInputElement | null>(null);
    
      const submitNewTicket = () => {
        if (newTicketSubject && newTicketMessage) {
          const newTicket: Ticket = {
            id: supportTickets.length + 1,
            subject: newTicketSubject,
            status: "Abierto",
            priority: newTicketPriority as "Alta" | "Media" | "Baja",
            category: newTicketCategory,
            lastUpdate: new Date().toLocaleString(),
            messages: [
              {
                id: 1,
                sender: "user",
                content: newTicketMessage,
                timestamp: new Date().toLocaleString(),
              },
            ],
            hasNewResponse: false,
            attachments: newTicketFile ? [newTicketFile] : [],
          };
          setSupportTickets([newTicket, ...supportTickets]);
          setNewTicketSubject("");
          setNewTicketMessage("");
          setNewTicketPriority("Media");
          setNewTicketCategory("General");
          setNewTicketFile(null);
          alert(
            "Ticket enviado con éxito. Nuestro equipo de soporte se pondrá en contacto contigo pronto."
          );
        } else {
          alert("Por favor, completa todos los campos del ticket.");
        }
      };
    
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setNewTicketFile(e.target.files[0]);
        }
      };
    
      const sendMessage = () => {
        if (newMessage && selectedTicket) {
          const updatedTickets: Ticket[] = supportTickets.map((ticket) => {
            if (ticket.id === selectedTicket.id) {
              return {
                ...ticket,
                messages: [
                  ...ticket.messages,
                  {
                    id: ticket.messages.length + 1,
                    sender: "user",
                    content: newMessage,
                    timestamp: new Date().toLocaleString(),
                  },
                ],
                lastUpdate: new Date().toLocaleString(),
                status: "En progreso",
              };
            }
            return ticket;
          });
          setSupportTickets(updatedTickets);
          setNewMessage("");
          setSelectedTicket(
            updatedTickets.find((t) => t.id === selectedTicket.id) || null
          );
        }
      };
    
      const markTicketAsRead = (ticketId: number) => {
        setSupportTickets(
          supportTickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, hasNewResponse: false } : ticket
          )
        );
      };
  return (
    <>
    <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
            Soporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTicket(null)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a tickets
                </Button>
                <Badge
                  variant={
                    selectedTicket.status === "Abierto"
                      ? "default"
                      : selectedTicket.status === "En progreso"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {selectedTicket.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-purple-300">
                {selectedTicket.subject}
              </h3>
              <div className="flex space-x-2">
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
                <Badge variant="outline">{selectedTicket.category}</Badge>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
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
                        {message.sender === "user" ? "Tú" : "Soporte"}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-grow bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">
                  Tus Tickets
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#f4f4f580]">
                      <TableHead className="text-purple-400">Asunto</TableHead>
                      <TableHead className="text-purple-400">Estado</TableHead>
                      <TableHead className="text-purple-400">
                        Prioridad
                      </TableHead>
                      <TableHead className="text-purple-400">
                        Categoría
                      </TableHead>
                      <TableHead className="text-purple-400">
                        Última Actualización
                      </TableHead>
                      <TableHead className="text-purple-400">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportTickets.map((ticket) => (
                      <TableRow
                        className="hover:bg-[#f4f4f580]"
                        key={ticket.id}
                      >
                        <TableCell className="font-medium flex flex-col">
                          {ticket.subject}
                          {ticket.hasNewResponse && (
                            <Badge
                              variant="destructive"
                              className="ml-2 bg-[#ef4444] hover:bg-[#ef4444cc] font-semibold w-fit"
                            >
                              Nueva respuesta
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.status === "Abierto"
                                ? "default"
                                : ticket.status === "En progreso"
                                ? "secondary"
                                : "destructive"
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
                        <TableCell>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {ticket.lastUpdate}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              markTicketAsRead(ticket.id);
                            }}
                            className="text-purple-400 hover:text-purple-300 border-purple-500 hover:bg-white  rounded-[8px] "
                          >
                            Ver conversación
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Separator className="bg-gray-600" />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">
                  Nuevo Ticket
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticketSubject" className="text-gray-300">
                      Asunto
                    </Label>
                    <Input
                      id="ticketSubject"
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      className=" ring-offset-2 ring-offset-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a1a1aa] shadow-lg
                               bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                      placeholder="Escribe el asunto de tu consulta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticketMessage" className="text-gray-300">
                      Mensaje
                    </Label>
                    <Textarea
                      id="ticketMessage"
                      value={newTicketMessage}
                      onChange={(e) => setNewTicketMessage(e.target.value)}
                      className="ring-offset-2 ring-offset-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a1a1aa] shadow-lg bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                      placeholder="Describe tu problema o consulta en detalle"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="ticketPriority"
                        className="text-gray-300 "
                      >
                        Prioridad
                      </Label>
                      <Select
                        value={newTicketPriority}
                        onValueChange={setNewTicketPriority}
                      >
                        <SelectTrigger
                          id="ticketPriority"
                          className="bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                        >
                          <SelectValue placeholder="Selecciona la prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ticketCategory" className="text-gray-300">
                        Categoría
                      </Label>
                      <Select
                        value={newTicketCategory}
                        onValueChange={setNewTicketCategory}
                      >
                        <SelectTrigger
                          id="ticketCategory"
                          className="bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                        >
                          <SelectValue placeholder="Selecciona la categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Pagos">Pagos</SelectItem>
                          <SelectItem value="Juegos">Juegos</SelectItem>
                          <SelectItem value="Bonos">Bonos</SelectItem>
                          <SelectItem value="Técnico">Técnico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ticketFile" className="text-gray-300">
                      Adjuntar archivo
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="ticketFile"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-700 hover:bg-white hover:text-black bg-opacity-50 text-white border-purple-500 rounded-xl !font-medium"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Seleccionar archivo
                      </Button>
                      {newTicketFile && (
                        <span className="text-sm text-gray-300">
                          {newTicketFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={submitNewTicket}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-medium text-white rounded-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Ticket
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default SupportTab
