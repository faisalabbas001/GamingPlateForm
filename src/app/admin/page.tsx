"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import { Switch } from "../components/ui/switch";
import { Users, Gift, Activity, Settings, Share2 } from "lucide-react";
import { useTranslation } from "../context/TranslationProvider";
import AdminDashboardContent from "../components/adminComponents/tabContent/AdminDashboardContent";
import AdminUserContent from "../components/adminComponents/tabContent/AdminUserContent";
import AdminRewardContent from "../components/adminComponents/tabContent/AdminRewardContent";
import AdminActivityTabContent from "../components/adminComponents/tabContent/AdminActivityTabContent";
import { useSession } from "next-auth/react";
import AdminSettingsTab from "../components/adminComponents/tabContent/AdminSettingsTab";
import AdminReferrals from "../components/adminComponents/tabContent/AdminReferrals";
import Loader from "../components/Loaders/Loader";

// Define the PRIZES constant
// const INITIAL_PRIZES = [
//   { id: 1, name: "100", value: 100, probability: 30 },
//   { id: 2, name: "200", value: 200, probability: 25 },
//   { id: 3, name: "300", value: 300, probability: 20 },
//   { id: 4, name: "400", value: 400, probability: 10 },
//   { id: 5, name: "500", value: 500, probability: 8 },
//   { id: 6, name: "1000", value: 1000, probability: 5 },
//   { id: 7, name: "2000", value: 2000, probability: 1.5 },
//   { id: 8, name: "5000", value: 5000, probability: 0.5 },
// ];

// Mocked data for demonstration purposes
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

// const REWARDS = [
//   { id: 1, name: "USDT 5", cost: 5000, claimed: 10 },
//   { id: 2, name: "USDT 2", cost: 2000, claimed: 25 },
//   { id: 3, name: "USDT 3", cost: 3000, claimed: 15 },
//   { id: 4, name: "USDT 1", cost: 1000, claimed: 50 },
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

// New mocked data for referrals
// const REFERRALS = [
//   {
//     id: 1,
//     referrer: "user1",
//     referred: "user4",
//     status: "Activo",
//     credits: 100,
//     date: "2024-03-01",
//   },
//   {
//     id: 2,
//     referrer: "user2",
//     referred: "user5",
//     status: "Pendiente",
//     credits: 0,
//     date: "2024-03-05",
//   },
//   {
//     id: 3,
//     referrer: "user1",
//     referred: "user6",
//     status: "Activo",
//     credits: 150,
//     date: "2024-03-10",
//   },
// ];

// New mocked data for pending redemptions
// const INITIAL_PENDING_REDEMPTIONS = [
//   {
//     id: 1,
//     user: "user1",
//     reward: "USDT 5",
//     cost: 5000,
//     timestamp: "2024-03-15 10:30:00",
//     status: "Pendiente",
//   },
//   {
//     id: 2,
//     user: "user2",
//     reward: "USDT 2",
//     cost: 2000,
//     timestamp: "2024-03-15 11:45:00",
//     status: "Pendiente",
//   },
//   {
//     id: 3,
//     user: "user3",
//     reward: "USDT 3",
//     cost: 3000,
//     timestamp: "2024-03-15 14:20:00",
//     status: "Pendiente",
//   },
// ];

// interface RewardsType {
//   _id: string;
//   name: string;
//   cost: number;
//   claimed: number;
// }

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      // if (!session) {
      //   // No session exists, redirect to login
      //   return router.push('/login');
      // }

      if (session?.user.role === "user") {
        // User is not an admin, redirect to dashboard
        return router.push("/dashboard");
      }

      // Valid admin session
      setUserId(session?.user?.id || "");
      setIsLoading(false);
    };

    initializeAdmin();
  }, [session, router]);

  if (isLoading) {
    return <Loader height="80vh" />;
  }
  // apis data states
  // const [apiRewards, setApiRewards] = useState<RewardsType[] | null>([]);
  // const [totalUsers, setTotalUsers] = useState(0);
  // apis data states

  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [users, setUsers] = useState(INITIAL_USERS);
  // const [rewards, setRewards] = useState(REWARDS);
  // const [activities, setActivities] = useState(ACTIVITIES);
  // const [referrals, setReferrals] = useState(REFERRALS);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedUser, setSelectedUser] = useState<null | any>(null);
  // const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  // const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  // const [selectedReward, setSelectedReward] = useState<null | any>(null);
  // const [maintenanceMode, setMaintenanceMode] = useState(false);
  // const [freeSpinInterval, setFreeSpinInterval] = useState(24);
  // const [referralSettings, setReferralSettings] = useState({
  //   welcomeBonus: 100,
  //   purchaseBonus: 5,
  //   levels: [
  //     { name: "Bronce", percentage: 5 },
  //     { name: "Plata", percentage: 10 },
  //     { name: "Oro", percentage: 15 },
  //     { name: "Platino", percentage: 20 },
  //   ],
  // });
  // const [currentLanguage, setCurrentLanguage] = useState("ES");
  // const [prizes, setPrizes] = useState(INITIAL_PRIZES);
  // const [selectedPrize, setSelectedPrize] = useState<null | any>(null);
  // const [isPrizeDialogOpen, setIsPrizeDialogOpen] = useState(false);
  // const [pendingRedemptions, setPendingRedemptions] = useState(
  //   INITIAL_PENDING_REDEMPTIONS
  // );

  // const handleUserEdit = (user: any) => {
  //   setSelectedUser(user);
  //   setIsUserDialogOpen(true);
  // };

  // const handleUserDelete = (userId: number) => {
  //   setUsers(users.filter((user) => user.id !== userId));
  // };

  // const handleUserSave = (updatedUser: any) => {
  //   setUsers(
  //     users.map((user) => (user.id === updatedUser?.id ? updatedUser : user))
  //   );
  //   setIsUserDialogOpen(false);
  // };

  // const handleUserToggleActive = async (userId: number, active: boolean) => {
  //   console.log("userID", userId, "active", active, "active!", !active);
  //   try {
  //     const res = await axios.put(`/api/users?id=${userId}`, {
  //       isActive: !active,
  //     });
  //     console.log("res", res);
  //     // getAllUsers();
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   // setUsers(
  //   //   users.map((user) =>
  //   //     user.id === userId ? { ...user, isActive: !user.isActive } : user
  //   //   )
  //   // );
  // };

  // const handleRewardEdit = (reward: any) => {
  //   setSelectedReward(reward);
  //   setIsRewardDialogOpen(true);
  // };

  // const handleRewardDelete = (rewardId: string) => {
  //   console.log("id", rewardId);
  //   // setRewards(rewards.filter((reward) => reward.id !== rewardId));
  // };

  // const handleRewardSave = (updatedReward: any) => {
  //   setRewards(
  //     rewards.map((reward) =>
  //       reward.id === updatedReward.id ? updatedReward : reward
  //     )
  //   );
  //   setIsRewardDialogOpen(false);
  // };

  // const handlePrizeEdit = (prize: any) => {
  //   setSelectedPrize(prize);
  //   setIsPrizeDialogOpen(true);
  // };

  // const handlePrizeSave = (updatedPrize: any) => {
  //   setPrizes(
  //     prizes.map((prize) =>
  //       prize.id === updatedPrize.id ? updatedPrize : prize
  //     )
  //   );
  //   setIsPrizeDialogOpen(false);
  // };

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const handleReferralSettingsChange = (field: string, value: number) => {
  //   setReferralSettings((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  // const handleReferralLevelChange = (
  //   index: number,
  //   field: string,
  //   value: number
  // ) => {
  //   setReferralSettings((prev) => ({
  //     ...prev,
  //     levels: prev.levels.map((level, i) =>
  //       i === index ? { ...level, [field]: value } : level
  //     ),
  //   }));
  // };

  // const changeLanguage = (lang: SetStateAction<string>) => {
  //   setCurrentLanguage(lang);
  // };

  // const handleRedemptionAction = (id: number, action: string) => {
  //   setPendingRedemptions((prevRedemptions) =>
  //     prevRedemptions.map((redemption) =>
  //       redemption.id === id
  //             ...redemption,
  //             status: action === "accept" ? "Aceptado" : "Rechazado",
  //           }
  //         : redemption
  //     )
  //   );
  // };

  // const getAllUsers = async () => {
  //   try {
  //     const res = await axios.get("/api/reward");
  //     console.log("res", res.data);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // const fetchActivities = async () => {
  //   try {
  //     const res = await axios.get(`/api/activities`);
  //     console.log("res history ddddd", res.data);
  //     setActivities(res.data);
  //   } catch (error) {
  //     console.error("Error fetching activities:", error);
  //   }
  // };

  // useEffect(() => {
  //   getAllUsers();
  // }, []);

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-auto bg-gray-800 bg-opacity-50 rounded-xl p-1 mb-4">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              >
                <Activity className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">{t("Dashboard")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              >
                <Users className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">{t("Users")}</span>
              </TabsTrigger>
              {/* <TabsTrigger
                value="tickets"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              >
                <CreditCard className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Tickets</span>
              </TabsTrigger> */}
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3  md:py-2 text-xs md:text-sm"
              >
                <Gift className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">{t("Rewards")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              >
                <Activity className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">{t("Activity")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              >
                <Share2 className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">{t("Referrals")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-[8px] px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              >
                <Settings className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">{t("Configuration")}</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="dashboard">
            <AdminDashboardContent />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserContent />
          </TabsContent>

          {/* <TabsContent value="tickets">
            <AdminTicketTab t={t} />
          </TabsContent> */}

          <TabsContent value="rewards">
            <AdminRewardContent />
          </TabsContent>

          <TabsContent value="activity">
            <AdminActivityTabContent />
          </TabsContent>

          <TabsContent value="referrals">
            <AdminReferrals t={t} userId={userId} />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsTab t={t} userId={userId} />
          </TabsContent>
        </Tabs>
      </main>

      {/* <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-purple-400">
              {t("Edit User")}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSave(selectedUser);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tickets">Tickets</Label>
                <Input
                  id="tickets"
                  type="number"
                  value={selectedUser.tickets}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      tickets: parseInt(e.target.value),
                    })
                  }
                  className="bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Créditos</Label>
                <Input
                  id="credits"
                  type="number"
                  value={selectedUser.credits}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      credits: parseInt(e.target.value),
                    })
                  }
                  className="bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nivel</Label>
                <Select
                  value={selectedUser.level}
                  onValueChange={(value) =>
                    setSelectedUser({ ...selectedUser, level: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Bronce", "Plata", "Oro", "Platino", "Diamante"].map(
                      (level) => (
                        <SelectItem
                          className=" cursor-pointer"
                          key={level}
                          value={level}
                        >
                          {level}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="isActive">Activo</Label>
                <Switch
                  id="isActive"
                  checked={selectedUser.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedUser({ ...selectedUser, isActive: checked })
                  }
                  className="bg-gray-600 data-[state=checked]:bg-green-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 rounded-[8px] hover:bg-purple-700"
              >
                Guardar Cambios
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
        <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold  text-purple-400">
              {t("Edit Reward")}
            </DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleRewardSave(selectedReward);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">{t("Name")}</Label>
                <Input
                  id="name"
                  value={selectedReward.name}
                  onChange={(e) =>
                    setSelectedReward({
                      ...selectedReward,
                      name: e.target.value,
                    })
                  }
                  className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">
                  {t("Cost")} ({t("Credits")})
                </Label>
                <Input
                  id="cost"
                  type="number"
                  value={selectedReward.cost}
                  onChange={(e) =>
                    setSelectedReward({
                      ...selectedReward,
                      cost: parseInt(e.target.value),
                    })
                  }
                  className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {t("Save Changes")}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={isPrizeDialogOpen} onOpenChange={setIsPrizeDialogOpen}>
        <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-purple-400">
              {t("Edit Award")}
            </DialogTitle>
          </DialogHeader>
          {selectedPrize && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handlePrizeSave(selectedPrize);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="prizeName">{t("Name")}</Label>
                <Input
                  id="prizeName"
                  value={selectedPrize.name}
                  onChange={(e) =>
                    setSelectedPrize({ ...selectedPrize, name: e.target.value })
                  }
                  className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prizeValue">
                  {t("Worth")} ({t("Credits")})
                </Label>
                <Input
                  id="prizeValue"
                  type="number"
                  value={selectedPrize.value}
                  onChange={(e) =>
                    setSelectedPrize({
                      ...selectedPrize,
                      value: parseInt(e.target.value),
                    })
                  }
                  className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prizeProbability">{t("Probability")} (%)</Label>
                <Input
                  id="prizeProbability"
                  type="number"
                  step="0.1"
                  value={selectedPrize.probability}
                  onChange={(e) =>
                    setSelectedPrize({
                      ...selectedPrize,
                      probability: parseFloat(e.target.value),
                    })
                  }
                  className="bg-gray-700 bg-opacity-50 text-white border-purple-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {t("Save Changes")}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
