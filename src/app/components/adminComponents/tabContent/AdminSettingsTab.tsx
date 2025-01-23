"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
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
import { Edit } from "lucide-react";
import { Button } from "../../ui/button";
import axios from "axios";
import { Switch } from "../../ui/switch";
import { Bounce, toast } from "react-toastify";
import PrizeModal from "../models/PrizeModal";
import Loader from "../../Loaders/Loader";
import CircleLoader from "../../Loaders/CircleLoader";

interface Prize {
  _id: string;
  name: string;
  value: number;
  probability: number;
  freeProbability: number;
}
interface AdminSettingsProps {
  t: (key: string) => string;
  userId: string;
}
const AdminSettingsTab: React.FC<AdminSettingsProps> = ({ t, userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [spinPrizes, setSpinPrizes] = useState<Prize[]>([]);

  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [freeSpinInterval, setFreeSpinInterval] = useState(0);
  const [settingId, setSettingId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/setting");
      console.log(response.data.prizes);
      setSpinPrizes(response.data.prizes);
      setMaintenanceMode(response.data.maintenanceMode);
      setFreeSpinInterval(response.data.freeSpinInterval);
      setSettingId(response.data._id);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await fetchSettings();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const updateMaintenanceMode = async () => {
    try {
      const newMaintenanceMode = !maintenanceMode;
      const response = await axios.patch(
        `/api/setting?userId=${userId}&settingId=${settingId}`,
        {
          maintenanceMode: newMaintenanceMode,
        }
      );
      // console.log("Maintenance mode updated successfully:", response.data);
      if(response){

        toast.success("Maintenance mode updated successfully", {
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
        console.error(
          "Error updating maintenance mode:",
          error.response?.data || error.message
        );
        toast.error("Error updating maintenance mode", {
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
            background: "#1E1939",
            color: "white",
          },
        });
      }
    }
  };

  const handlePrizeEdit = (prize: Prize) => {
    setSelectedPrize(prize);
  };

  const handleSpinTime = async () => {
    try {
      setIsSaving(true);
      const response = await axios.patch(
        `/api/setting?userId=${userId}&settingId=${settingId}`,
        {
          freeSpinInterval,
        }
      );
      // console.log(
      //   "Free Spin Interval (hours) updated successfully:",
      //   response.data
      // );
      if(response){

        toast.success("Free Spin Interval (hours) updated successfully", {
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
        console.error(
          "Error updating Free Spin Interval (hours):",
          error.response?.data || error.message
        );
        toast.error("Error updating Free Spin Interval (hours)", {
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
      } else {
        console.error("An unexpected error occurred::", error);
        toast.error("An unexpected error occurred:", {
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

  return (
    <>
      {isLoading ? (
        <Loader height="80vh" />
      ) : (
      <>
      <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-purple-400">
            {t("System Configuration")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-semibold">
                {t("Maintenance Mode")}
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                {t("Activate to perform system maintenance")}
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={() => updateMaintenanceMode()}
              className="bg-gray-600 data-[state=checked]:bg-purple-600"
            />
          </div>
          <Separator className="bg-gray-600" />
          <div className="space-y-2">
            <Label htmlFor="freeSpinInterval">
              {t("Free Spin Interval")} ({t("hours")})
            </Label>
            <Input
              id="freeSpinInterval"
              type="number"
              value={freeSpinInterval}
              onChange={(e) => setFreeSpinInterval(Number(e.target.value))}
              className="bg-gray-700 rounded-[8px] bg-opacity-50 text-white border-purple-500"
            />
          </div>
          <Separator className="bg-gray-600" />
          <div className="space-y-2">
            <h3 className="text-base md:text-lg font-semibold">
              {t("Spin Prizes")}
            </h3>
            <div className="overflow-x-auto">
              <ScrollArea className="h-[400px] w-full rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-purple-400">
                        {t("Prize")}
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Worth")} ({t("Credits")})
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Probability")} (%)
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Free Probability")} (%)
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spinPrizes?.map((prize) => (
                      <TableRow key={prize._id}>
                        <TableCell>{prize.name}</TableCell>
                        <TableCell>{prize.value}</TableCell>
                        <TableCell>{prize.probability}</TableCell>
                        <TableCell>{prize.freeProbability}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => handlePrizeEdit(prize)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
          <Button
            onClick={handleSpinTime}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-[8px]"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <CircleLoader />
              </>
            ) : (
              t("Save Settings")
            )}
          </Button>
        </CardContent>
      </Card>

      {/* model  */}
      <PrizeModal
        t={t}
        selectedPrize={selectedPrize}
        onFetch={fetchSettings}
        onClose={() => setSelectedPrize(null)}
        userId={userId}
        settingId={settingId}
      />
      </>
      )}
    </>
  );
};

export default AdminSettingsTab;
