// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// interface MaintenanceContextType {
//   maintenanceMode: boolean;
// }

// const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

// export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
//   const [maintenanceMode, setMaintenanceMode] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter(); 

//   const fetchMaintenanceStatus = async () => {
//     try {
//       const response = await axios.get("/api/setting");
//       if (response) {
//         setMaintenanceMode(response.data.maintenanceMode);
//         if (response.data.maintenanceMode && session?.user?.role === "user") {
//           router.push("/");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching maintenance status:", error);
//     }
//   };

//   useEffect(() => {
//     if (session) {
//       fetchMaintenanceStatus();
//       const interval = setInterval(fetchMaintenanceStatus, 300000);
//       return () => clearInterval(interval);
//     }
//   }, [session]);

//   return (
//     <MaintenanceContext.Provider value={{ maintenanceMode }}>
//       {children}
//     </MaintenanceContext.Provider>
//   );
// }

// export function useMaintenance() {
//   const context = useContext(MaintenanceContext);
//   if (context === undefined) {
//     throw new Error("useMaintenance must be used within a MaintenanceProvider");
//   }
//   return context;
// } 