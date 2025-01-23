/* eslint-disable */
"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { calculateLevelAndProgress, LEVELS } from "@/helperFrontend";
import axios from "axios";
import { Info, Lock, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import PasswordUpdateModal from "./PasswordUpdateModal";
import CircleLoader from "@/app/components/Loaders/CircleLoader";

interface UserProfileTabType {
  t: (key: string) => string;
  userData: any;
  getUserById: () => void;
}

const UserProfileTab: React.FC<UserProfileTabType> = ({
  t,
  userData,
  getUserById,
}) => {

  // console.log("user",userData?.referredBy)
  const router = useRouter();
  const [accountLevel, setAccountLevel] = useState(0);
  const [level, setLevel] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  // const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [open, setOpen] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState(0);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  // const userId = session; // Replace with the actual userId


  console.log("34234======",userData?._id)

  useEffect(() => {
    // Fetch total redeemed rewards
    const fetchRedeemedRewards = async () => {
      try {
        const response = await axios.get(`/api/reward/total?userId=${userData?._id}`);
        setRedeemedRewards(response.data.totalRedeemed);
        setLoading(false);
      } catch (err) {
     
        setLoading(false);
      }
    };

    fetchRedeemedRewards();
  }, [userData?._id]);
  //   not use for now
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const { level, progress } = calculateLevelAndProgress(userData?.credits);
    setLevel(level);
    setAccountLevel(progress);
    setUsername(userData?.username);
    // setTwoFactorEnabled(userData?.twoFactorEnabled);
  }, [userData?.credits]);

  const handleLogout = async () => {
    try {
      const logout = await signOut({ redirect: false });
      if (logout) {
        router.push("/login");
      }
    } catch (error) {
      console.error("error", error);
    }
    signOut({ redirect: false });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/users?id=${userData?._id}`, {
        username,
      });
      // console.log("response", response);
      if(response){

        toast.success("Updated Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          style: {
            background: "#4c1d95",
            color: "white",
          },
        });
        getUserById();
      }
    } catch (error) {
      console.error("Error updating username. Please try again.", error);
      toast.error("Please Try Again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        style: {
          background: "#4c1d95",
          color: "white",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // const updateTwoFactor = async (twoFactorEnabled: boolean) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.put(`/api/users?id=${userData?._id}`, {
  //       twoFactorEnabled,
  //     });
  //     setTwoFactorEnabled(response.data.twoFactorEnabled);
  //     if (response) {
  //       console.log("response", response);
  //       getUserById();
  //       toast.success("Updated Successfully", {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         transition: Bounce,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Failed to update two-factor authentication. Please try again.",
  //       error
  //     );
  //     toast.error("Please Try Again", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Bounce,
  //     });
  //     //   setError("Failed to update two-factor authentication. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [referralCode, setReferralCode] = useState("");
  const [referralLoading, setReferralLoading] = useState(false);

  const handleCreateReferral = async () => {
    if (!referralCode) {
      return;
    }
    setReferralLoading(true);
    try {
      const response = await axios.post(
        `/api/referral/create?userId=${userData?._id}&referralCode=${referralCode}`
      );
      // console.log("ress reffer create", response);
      if (response) {
        toast.success("Referral created successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          style: {
            background: "#4c1d95",
            color: "white",
          },
        });
        setReferralCode("")
        getUserById();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating referral:", error.response);
        if (
          error.response?.data?.message ===
          "You cannot use your own referral code"
        ) {
          toast.error("You cannot use your own referral code", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: {
              background: "#4c1d95",
              color: "white",
            },
          });
        } else if (error.response?.data?.message === "Invalid referral code") {
          toast.error("Invalid referral code", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: {
              background: "#4c1d95",
              color: "white",
            },
          });
        } else if (
          error.response?.data?.message ===
          "User is already referred by another user"
        ) {
          toast.error("User is already referred by another user", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: {
              background: "#4c1d95",
              color: "white",
            },
          });
        }
      } else {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          style: {
            background: "#4c1d95",
            color: "white",
          },
        });
      }
    } finally {
      setReferralLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20">
                <AvatarImage
                  src="https://docs.material-tailwind.com/img/face-2.jpg"
                  alt={userData?.username}
                />
                <AvatarFallback>
                  {userData?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-purple-400 text-center md:text-left">
                  {userData?.username}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between font-bold">
                <span className="text-gray-300">{t("Current tickets")}:</span>
                <span className="text-purple-400 font-bold">
                  {userData?.tickets}
                </span>
              </div>
              <div className="flex items-center justify-between  font-bold">
                <span className="text-gray-300">{t("Current credits")}:</span>
                <span className="text-purple-400 ">
                  {userData?.credits}
                </span>
              </div>
              <div className="space-y-2">
                {/* <div className="flex items-center justify-between">
                  <span className="text-gray-300">{t("Account level")}:</span>
                  <span className="text-yellow-400 font-bold">{level}</span>
                </div> */}

<div className="flex items-center justify-between font-bold">
                  <span className="text-gray-300 ">{t("Redeemed rewards")}:</span>
                  <span className="text-purple-400 font-bold">{userData?.redeemedRewards}</span>
                </div>
                
               
                <div>
                <Button
           onClick={()=>router.push("/dashboard")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700  font-bold text-sm md:text-base  transition-all duration-300 transform hover:scale-105 disabled:opacity-50 text-white rounded-xl"
            >
            
              {t("Redeem Rewards")}
            </Button>

      
                </div>

                {/* <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                        {t("Progress")}
                      </span>
                    </div>
                    <div className="text-right flex items-center">
                      <span className="text-xs font-semibold inline-block text-purple-600 mr-1">
                        {accountLevel}%
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-purple-400 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="w-64 md:w-80 bg-gray-800 bg-opacity-90 border-purple-500 text-white p-4 rounded-xl">
                            <h3 className="font-bold mb-2">
                              {t("Account Levels")}
                            </h3>
                            <ul className="space-y-2 text-sm">
                              {LEVELS.map((level, index) => (
                                <li
                                  key={index}
                                  className="flex justify-between"
                                >
                                  <span className="font-semibold">
                                    {level.name}
                                  </span>
                                  <span>
                                    {level.range} {t("credits")}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-purple-200">
                    <div
                      style={{ width: `${accountLevel}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"
                    ></div>
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 bg-opacity-50 rounded-xl">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-xl"
            >
              <User className="w-4 h-4 mr-2" />
              {t("Account")}
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-xl"
            >
              <Lock className="w-4 h-4 mr-2" />
              {t("Security")}
            </TabsTrigger>
            {/* <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-xl"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="account">
            <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-bold text-purple-400">
                  {t("Account information")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!userData?.referredBy &&
                <>
                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="text-gray-300">
                    {t("Referral Code")}
                  </Label>
                  <Input
                    id="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                    />
                </div>
                <Button
                onClick={handleCreateReferral}
                disabled={!referralCode || referralLoading}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  {referralLoading ? <CircleLoader /> : t("Create Referral")}
                </Button>
                  </>
                }

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    {t("User Name")}
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveChanges}
                  disabled={userData?.username === username}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  {loading ? <CircleLoader /> : t("Save Changes")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-bold text-purple-400">
                  {t("Security")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-300">
                      {t("Change password")}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400">
                      {t("Update your password regularly for added security")}
                    </p>
                  </div>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    disabled={userData?.social === true}
                    className="w-full md:w-auto border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl"
                  >
                    {t("Change")}
                  </Button>
                </div>
                    {userData?.social === true &&
                    <p className="text-sm font-medium text-gray-300">
                     <span className="font-bold">Note:</span> Password can only be changed if you are not logged in with a social account.
                    </p>
                    }
                {/* <Separator className="bg-gray-600" /> */}
                {/* <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-300">
                      {t("Two-factor authentication")}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400">
                      {t("Add an extra layer of security to your account")}
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    // onCheckedChange={setTwoFactorEnabled}
                    onCheckedChange={() => updateTwoFactor(!twoFactorEnabled)}
                    className="bg-gray-600 data-[state=checked]:bg-purple-600"
                  />
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>
          {/* <TabsContent value="notifications">
            <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-bold text-purple-400">
                  {t("Notification preferences")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-300">
                      {t("Email notifications")}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400">
                      {t("Receive updates on promotions and events")}
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    className="bg-gray-600 data-[state=checked]:bg-purple-600"
                  />
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-300">
                      {t("Push notifications")}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400">
                      {t("Receive real-time alerts on your device")}
                    </p>
                  </div>
                  <Switch className="bg-gray-600 data-[state=checked]:bg-purple-600" />
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>

        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardContent className="pt-6">
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("Sign Out")}
            </Button>
          </CardContent>
        </Card>
      </div>
      <PasswordUpdateModal
        open={open}
        userId={userData?._id}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default UserProfileTab;
