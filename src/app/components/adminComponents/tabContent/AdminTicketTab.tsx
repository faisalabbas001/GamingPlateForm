// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Label } from "../../ui/label";
// import { Input } from "../../ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import { ScrollArea } from "../../ui/scroll-area";
// import { Button } from "../../ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../ui/select";

// // Mocked data for demonstration purposes
// const INITIAL_USERS = [
//   {
//     id: 1,
//     username: "user1",
//     email: "user1@example.com",
//     tickets: 10,
//     credits: 1000,
//     level: "Plata",
//     isActive: true,
//   },
//   {
//     id: 2,
//     username: "user2",
//     email: "user2@example.com",
//     tickets: 25,
//     credits: 5000,
//     level: "Oro",
//     isActive: true,
//   },
//   {
//     id: 3,
//     username: "user3",
//     email: "user3@example.com",
//     tickets: 5,
//     credits: 500,
//     level: "Bronce",
//     isActive: false,
//   },
// ];

// const ACTIVITIES = [
//   {
//     id: 1,
//     user: "user1",
//     type: "Ruleta",
//     amount: "1 ticket",
//     result: "+200 créditos",
//     timestamp: "2024-03-15 10:30:00",
//   },
//   {
//     id: 2,
//     user: "user2",
//     type: "Compra",
//     amount: "$10",
//     result: "+10 tickets",
//     timestamp: "2024-03-15 11:45:00",
//   },
//   {
//     id: 3,
//     user: "user3",
//     type: "Canje",
//     amount: "5000 créditos",
//     result: "-5000 créditos",
//     timestamp: "2024-03-15 14:20:00",
//   },
// ];

// interface AdminTicketTabProps {
//   t: (key: string) => string;
// }

// const AdminTicketTab: React.FC<AdminTicketTabProps> = ({ t }) => {
//   const [users, setUsers] = useState(INITIAL_USERS);
//   const [activities, setActivities] = useState(ACTIVITIES);

//   return (
//     <>
//       <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
//         <CardHeader>
//           <CardTitle className="text-xl md:text-2xl font-bold text-purple-400">
//             {t("Ticket Management")}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 rounded-[8px] gap-8">
//             <Card className="bg-purple-700 bg-opacity-50">
//               <CardHeader>
//                 <CardTitle className="text-base md:text-lg">
//                   {t("Add Tickets")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="user">{t("User")}</Label>
//                     <Select>
//                       <SelectTrigger className="bg-gray-700 bg-opacity-50 rounded-[8px] text-white border-purple-500">
//                         <SelectValue placeholder={t("Select user")} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {users.map((user) => (
//                           <SelectItem key={user.id} value={user.id.toString()}>
//                             {user.username}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="amount">{t("Amount")}</Label>
//                     <Input
//                       id="amount"
//                       type="number"
//                       className="bg-gray-700 rounded-[8px] bg-opacity-50 text-white border-purple-500"
//                     />
//                   </div>
//                   <Button className="w-full bg-purple-600 hover:bg-purple-700">
//                     {t("Add Tickets")}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//             <Card className="bg-purple-700 bg-opacity-50">
//               <CardHeader>
//                 <CardTitle className="text-base md:text-lg">
//                   {t("Transaction History")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[200px] w-full rounded-xl border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="text-purple-300">
//                           {t("User")}
//                         </TableHead>
//                         <TableHead className="text-purple-300">
//                           {t("Amount")}
//                         </TableHead>
//                         <TableHead className="text-purple-300">
//                           {t("Date")}
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {activities
//                         .filter((a) => a.type === "Compra")
//                         .map((activity) => (
//                           <TableRow key={activity.id}>
//                             <TableCell>{activity.user}</TableCell>
//                             <TableCell>{activity.amount}</TableCell>
//                             <TableCell>{activity.timestamp}</TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   );
// };

// export default AdminTicketTab;
