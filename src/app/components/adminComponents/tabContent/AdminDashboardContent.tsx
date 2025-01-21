import React, { useEffect, useState,useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/app/context/TranslationProvider";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import Loader from "../../Loaders/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface UserType {
  totalUsers: number | 0;
  totalTickets: number | 0;
  totalRewards: number | 0;
  totalCredits: number | 0;
}

interface MonthlyData {
  name: string;
  usuarios: number;
  tickets: number;
  creditos: number;
  canjes: number;
}

interface MonthlyDataItem {
  _id: {
    month: number;
    year: number;
  };
  totalUsers: number;
  totalTickets: number;
  totalCredits: number;
}

interface MonthlyRewardDataItem {
  _id: {
    month: number;
    year: number;
  };
  totalRewards: number;
}

const AdminDashboardContent = () => {
  const { t } = useTranslation();
  const [apiUsers, setApiUsers] = useState<UserType>({
    totalUsers: 0,
    totalTickets: 0,
    totalRewards: 0,
    totalCredits: 0,
  });
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [filteredData, setFilteredData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/admin/system-summary");
      const data = res.data;

      // Set total summary data
      setApiUsers({
        totalUsers: data.totalUsers,
        totalTickets: data.totalTickets,
        totalRewards: data.totalRewards,
        totalCredits: data.totalCredits,
      });

      const chartMonthlyData = data.monthlyData.map(
        (item: MonthlyDataItem) => ({
          name: `${item._id.month}-${item._id.year}`,
          usuarios: item.totalUsers,
          tickets: item.totalTickets,
          creditos: item.totalCredits,
          canjes:
            data.monthlyRewardsData.find(
              (reward: MonthlyRewardDataItem) =>
                reward._id.month === item._id.month &&
                reward._id.year === item._id.year
            )?.totalRewards || 0,
        })
      );

      setChartData(chartMonthlyData);
      setFilteredData(chartMonthlyData); // Initialize filtered data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("error", error.response?.data?.message);
        if (error.response?.data?.message === "Forbidden") {
          toast.error("Not authorized", {
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
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterChartData =  useCallback((filterValue: string) => {
    const now = new Date();
    let filtered = chartData;

    switch (filterValue) {
      case "Today":
        filtered = chartData.filter((data) => {
          const [month, year] = data.name.split("-");
          const dataDate = new Date(parseInt(year), parseInt(month) - 1);
          return dataDate.toDateString() === now.toDateString();
        });
        break;

      case "This week":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        filtered = chartData.filter((data) => {
          const [month, year] = data.name.split("-");
          const dataDate = new Date(parseInt(year), parseInt(month) - 1);
          return dataDate >= weekStart && dataDate <= now;
        });
        break;

      case "This month":
        filtered = chartData.filter((data) => {
          const [month, year] = data.name.split("-");
          return (
            parseInt(month) === now.getMonth() + 1 &&
            parseInt(year) === now.getFullYear()
          );
        });
        break;

      case "This year":
        filtered = chartData.filter((data) => {
          const [, year] = data.name.split("-");
          return parseInt(year) === now.getFullYear();
        });
        break;

      default:
        filtered = chartData;
    }

    setFilteredData(filtered);
  }, [chartData]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    filterChartData(filter);
  }, [filter, chartData]);

  return (
    <>
      {isLoading ? (
        <Loader height="80vh" />
      ) : (
        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-xl md:text-2xl font-bold text-purple-400">
                {t("System Summary")}
              </CardTitle>
              <Select
                onValueChange={(value) => setFilter(value)}
                defaultValue="all"
              >
                <SelectTrigger className="w-full md:w-[180px] bg-gray-700 bg-opacity-50 text-white border-purple-500 hover:text-white focus:ring-purple-500 focus:border-purple-500 rounded-xl">
                  <SelectValue placeholder={t("Filter by")} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-purple-500 bg-opacity-90 rounded-xl">
                  <SelectItem
                    value="all"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("All time")}
                  </SelectItem>
                  <SelectItem
                    value="Today"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("Today")}
                  </SelectItem>
                  <SelectItem
                    value="This week"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("This week")}
                  </SelectItem>
                  <SelectItem
                    value="This month"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("This month")}
                  </SelectItem>
                  <SelectItem
                    value="This year"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("This year")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-purple-700 bg-opacity-50 rounded-[16px]">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {t("Total Users")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl md:text-4xl font-bold">
                    {apiUsers?.totalUsers}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-700 bg-opacity-50 rounded-[16px]">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {t("Total Tickets")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl md:text-4xl font-bold">
                    {apiUsers?.totalTickets}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-700 bg-opacity-50 rounded-[16px]">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {t("Total Credits")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl md:text-4xl font-bold">
                    {apiUsers?.totalCredits}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-700 bg-opacity-50 rounded-[16px]">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {t("Redeemed Rewards")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl md:text-4xl font-bold">
                    {apiUsers?.totalRewards}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usuarios" name={t("Users")} fill="#8884d8" />
                  <Bar dataKey="tickets" name={t("Tickets")} fill="#82ca9d" />
                  <Bar dataKey="creditos" name={t("Credits")} fill="#ffc658" />
                  <Bar dataKey="canjes" name={t("Exchanges")} fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AdminDashboardContent;