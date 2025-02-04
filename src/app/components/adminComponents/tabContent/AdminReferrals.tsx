"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ScrollArea } from "../../ui/scroll-area";
import { Check } from "lucide-react";
import { Button } from "../../ui/button";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { Badge } from "../../ui/badge";
import moment from "moment";
import Loader from "../../Loaders/Loader";
import CircleLoader from "../../Loaders/CircleLoader";

interface AdminReferralsProps {
  t: (key: string) => string;
  userId: string;
}
interface referralLevels {
  _id: string;
  name: string;
  percentage: number;
}
interface ReferrerType {
  username: string;
}
interface ReferredType {
  username: string;
}
interface ReferralsType {
  _id: string;
  createdAt: string;
  creditsEarned: number;
  status: string;
  referrer: ReferrerType;
  referred: ReferredType;
}

const AdminReferrals: React.FC<AdminReferralsProps> = ({ t, userId }) => {
  const [welcomeBonus, setWelcomeBonus] = useState(0);
  const [purchaseBonus, setPurchaseBonus] = useState(0);
  const [referralLevels, setReferralLevels] = useState<referralLevels[]>([]);

  const [initialWelcomeBonus, setInitialWelcomeBonus] = useState(0);
  const [initialPurchaseBonus, setInitialPurchaseBonus] = useState(0);

  const [settingId, setSettingId] = useState("");

  const [referrals, setReferrals] = useState<ReferralsType[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/setting");
      // console.log(response.data);

      // console.log(response.data._id);
      setSettingId(response.data._id);

      // console.log(response.data.welcomeBonus);
      setWelcomeBonus(response.data.welcomeBonus);
      setInitialWelcomeBonus(response.data.welcomeBonus);

      // console.log(response.data.purchaseBonus);
      setPurchaseBonus(response.data.purchaseBonus);
      setInitialPurchaseBonus(response.data.purchaseBonus);

      // console.log(response.data.referralLevels);
      setReferralLevels(response.data.referralLevels);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchHistoryAllReferralStats = async () => {
    try {
      const response = await axios.get(`/api/referral`);
      // console.log("all history::::", response.data);
      setReferrals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchSettings(), fetchHistoryAllReferralStats()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleChangeWelcomBonusAndPurchaseBonus = async () => {
    try {
      setIsSaving(true);
      const response = await axios.patch(
        `/api/setting?userId=${userId}&settingId=${settingId}`,
        {
          welcomeBonus,
          purchaseBonus,
        }
      );
      // console.log(
      //   "Welcome and Purchase Bonus updated successfully:",
      //   response.data
      // );
      if (response) {
        toast.success("Welcome and Purchase Bonus updated successfully", {
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
            background: "#1E1939",
            color: "white",
          },
        });
        fetchSettings();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        console.error(
          "Error updating Welcome and Purchase Bonus:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message ||
            "Error updating Welcome and Purchase Bonus",
          {
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
              background: "#1E1939",
              color: "white",
            },
          }
        );
      } else {
        // Handle non-Axios errors
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
            background: "#1E1939",
            color: "white",
          },
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReferralLevelUpdate = async (
    levelId: string,
    percentage: number
  ) => {
    try {
      // console.log(
      //   "userid",
      //   userId,
      //   "settingId",
      //   settingId,
      //   "levelId",
      //   levelId,
      //   "perctanege",
      //   percentage
      // );

      const response = await axios.patch(
        `/api/setting?userId=${userId}&settingId=${settingId}&referralLevelsId=${levelId}`,
        { percentage }
      );
      // console.log("res", response);
      if (response) {
        toast.success("Referral level updated successfully", {
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
            background: "#1E1939",
            color: "white",
          },
        });

        fetchSettings();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        console.error(
          "Error updating referral level:",
          error.response?.data?.message || error.message
        );
        toast.error(
          error.response?.data?.message || "Error updating referral level",
          {
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
              background: "#1E1939",
              color: "white",
            },
          }
        );
      } else {
        // Handle non-Axios errors
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
            background: "#1E1939",
            color: "white",
          },
        });
      }
    }
  };

  const isSaveDisabled =
    welcomeBonus === initialWelcomeBonus &&
    purchaseBonus === initialPurchaseBonus;

  // console.log("referrals", referrals);

  return (
    <>
      {isLoading ? (
        <Loader height="80vh" />
      ) : (
        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-purple-400">
              {t("Referral Management")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeBonus">
                    {t("Welcome Bonus")} ({t("Credits")})
                  </Label>
                  <Input
                    id="welcomeBonus"
                    type="number"
                    value={welcomeBonus}
                    min={0}
                    onChange={(e) => setWelcomeBonus(Number(e.target.value))}
                    className="bg-gray-700 bg-opacity-50 rounded-[8px] text-white border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseBonus">
                    {t("Purchase Bonus")} (%)
                  </Label>
                  <Input
                    id="purchaseBonus"
                    type="number"
                    min={0}
                    value={purchaseBonus}
                    onChange={(e) => setPurchaseBonus(Number(e.target.value))}
                    className="bg-gray-700 bg-opacity-50 rounded-[8px] text-white border-purple-500"
                  />
                </div>
              </div>
              <Button
                onClick={handleChangeWelcomBonusAndPurchaseBonus}
                disabled={isSaveDisabled || isSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 rounded-[8px]"
              >
                {isSaving ? <CircleLoader /> : t("Save Settings")}
              </Button>
              {/* <div className="space-y-2">
                <Label>{t("Referral Levels")}</Label>
                <div className="overflow-x-auto">
                  <ScrollArea className="h-[370px] w-full rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-purple-400 w-48">
                            {t("Level")}
                          </TableHead>
                          <TableHead className="text-purple-400 w-44">
                            {t("Percentage")}
                          </TableHead>
                          <TableHead className="text-purple-400">
                            {t("Action")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referralLevels?.map((level, index) => (
                          <TableRow key={level._id}>
                            <TableCell>{level.name}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={level.percentage}
                                onChange={(e) =>
                                  setReferralLevels((prev) =>
                                    prev.map((l, i) =>
                                      i === index
                                        ? {
                                            ...l,
                                            percentage: Number(e.target.value),
                                          }
                                        : l
                                    )
                                  )
                                }
                                className="bg-gray-700 bg-opacity-50 text-white rounded-[8px] border-purple-500 w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                className="text-green-500 hover:text-green-600"
                                onClick={() =>
                                  handleReferralLevelUpdate(
                                    level._id,
                                    level.percentage
                                  )
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div> */}

              <div className="overflow-x-auto">
                <ScrollArea className="h-[300px] w-full rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-purple-400">ID</TableHead>
                        <TableHead className="text-purple-400">
                          {t("Referring")}
                        </TableHead>
                        <TableHead className="text-purple-400">
                          {t("Referred")}
                        </TableHead>
                        <TableHead className="text-purple-400">
                          {t("Status")}
                        </TableHead>
                        <TableHead className="text-purple-400">
                          {t("Credits")}
                        </TableHead>
                        <TableHead className="text-purple-400">
                          {t("Date")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals?.map((referral, index) => (
                        <TableRow key={referral?._id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{referral?.referrer?.username}</TableCell>
                          <TableCell>{referral?.referred?.username}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                referral.status === "Active"
                                  ? "secondary"
                                  : "secondary"
                              }
                            >
                              {referral?.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{referral?.creditsEarned}</TableCell>
                          <TableCell>
                            {moment(referral?.createdAt).format(
                              "MM/DD/YYYY, h:mm:ss A"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AdminReferrals;
