import React, { useEffect, useState, useRef } from "react";
import { Badge } from "@/app/components/ui/badge";
// import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { FaCopy } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import {  Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReferralTabType {
  t: (key: string) => string;
  referralLink: string;
  userId: string;
}

interface ReferralLink {
  _id: string;
  name: string;
  percentage: number;
}
interface UserReferralStatType {
  totalReferrals: number;
  earnedCredits: number;
  activeReferralsCount: number,
  pendingReferralsCount: number,
  activeReferralRate: number,
  

}
interface referralHistoryType {
  _id: string;
  referredUsername: string;
  status: string;
  creditsEarned: number;
  date: string;
}

const ReferralTab: React.FC<ReferralTabType> = ({
  t,
  referralLink,
  userId,
}) => {
  const [userReferralStat, setUserReferralStat] =
    useState<UserReferralStatType>({
      totalReferrals: 0,
      earnedCredits: 0,
      activeReferralsCount: 0,
      pendingReferralsCount: 0,
      activeReferralRate: 0,
    });
  // const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);



  const [referralHistory, setReferralHistory] = useState<referralHistoryType[]>(
    []
  );
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [creditsRange, setCreditsRange] = useState({ min: '', max: '' });
  const [appliedRange, setAppliedRange] = useState<{ min: string; max: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    setAppliedRange(creditsRange);
    setIsOpen(false);
    fetchHistoryReferralStats();
  };

  const handleCancel = () => {
    setCreditsRange({ min: '', max: '' });
    setAppliedRange(null);
    setIsOpen(false);
    fetchHistoryReferralStats();
  };

  // const handlePrevPage = () => {
  //   if (activePage > 1) {
  //     setActivePage(prev => prev - 1);
  //     fetchHistoryReferralStats();
  //   }
  // };

  // const handleNextPage = () => {
  //   if (activePage < totalPages) {
  //     setActivePage(prev => prev + 1);
  //     fetchHistoryReferralStats(); 
  //   }
  // };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success(t("Referral link copied to clipboard"), {
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
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/setting");
      // console.log(response.data.referralLevels);
      // setReferralLinks(response.data.referralLevels);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching settings:", error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);
console.log("cehcking for data")
  const fetchReferralStats = async () => {
    try {
      const response = await axios.get(`/api/referral?userId=${userId}`);
      console.log("ressssssss::::", response.data);
      setUserReferralStat(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || error.message);
        if (error.response?.data?.error === "System is currently under maintenance") {
          router.push("/maintance-page");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const fetchHistoryReferralStats = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        userId: userId,
        status: statusFilter,
        page: activePage.toString()
      });
      
      if (appliedRange?.min) params.append('minCredits', appliedRange.min);
      if (appliedRange?.max) params.append('maxCredits', appliedRange.max);
      
      const response = await axios.get(`/api/referral/history?${params}`);
      // console.log("checking data fro the history23232",response)
      setReferralHistory(response.data.referralHistory);
      setTotalPages(response.data.pagination.totalPages);
      setActivePage(response.data.pagination.currentPage);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (error.response?.data?.error === "System is currently under maintenance") {
          router.push("/maintance-page");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchReferralStats();
      fetchHistoryReferralStats();
    }
  }, [userId, statusFilter, appliedRange, activePage]);

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-8">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!referralHistory || referralHistory.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-gray-300">
            {t("No referral history")}
          </TableCell>
        </TableRow>
      );
    }

    return referralHistory.map((referral, index) => (
      <TableRow
        key={index + 1}
        className="hover:bg-purple-700 hover:bg-opacity-50 transition-colors duration-200"
      >
        <TableCell className="font-medium text-gray-200">
          {referral.referredUsername}
        </TableCell>
        <TableCell className="text-gray-300">
          {moment(referral.date).format("MM/DD/YYYY, h:mm:ss A")}
        </TableCell>
        <TableCell className="text-gray-300">
          <Badge
            variant={
              referral.status === "Active"
                ? // ? "success"
                  "default"
                : "secondary"
            }
          >
            {referral.status}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-300">
          {referral.creditsEarned}
        </TableCell>
      </TableRow>
    ));
  };

  const getDropdownLabel = () => {
    if (!appliedRange) return t("Credits Range");
    return `${appliedRange.min || '0'} - ${appliedRange.max || '∞'}`;
  };

  return (
    <>
      <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
            {t("Referral Program")}
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {t("Invite your friends and earn rewards")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="bg-gray-700 bg-opacity-50 p-4 md:p-6 rounded-lg space-y-4">
  <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-400">
    {t("Your Referral Stats")}
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Total Referrals Card */}
    <Card className="bg-purple-700 bg-opacity-50">
      <CardContent className="p-4">
        <p className="text-base md:text-lg font-semibold text-gray-300">
          {t("Total Referrals")}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-white">
        {userReferralStat?.totalReferrals}     
        </p>
      </CardContent>
    </Card>

    {/* Credits Earned Card */}
    <Card className="bg-purple-700 bg-opacity-50">
      <CardContent className="p-4">
        <p className="text-base md:text-lg font-semibold text-gray-300">
          {t("Credits Earned")}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-white">
        {userReferralStat?.earnedCredits}
        </p>
      </CardContent>
    </Card>

    {/* Active Referrals Card */}
    <Card className="bg-purple-700 bg-opacity-50">
      <CardContent className="p-4">
        <p className="text-base md:text-lg font-semibold text-gray-300">
          {t("Active Referrals")}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-white">
        {userReferralStat?.activeReferralsCount}
        </p>
      </CardContent>
    </Card>

    {/* Pending Referrals Card */}
    <Card className="bg-purple-700 bg-opacity-50">
      <CardContent className="p-4">
        <p className="text-base md:text-lg font-semibold text-gray-300">
          {t("Pending Referrals")}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-white">
        {userReferralStat.pendingReferralsCount}
        </p>
      </CardContent>
    </Card>
  </div>

  {/* Referral Rate (Full Width Card) */}
  <div className="grid grid-cols-1">
    <Card className="bg-purple-700 bg-opacity-50">
      <CardContent className="p-4 text-center">
        <p className=" md:text-lg font-semibold text-gray-300">
          {t("Referral Rate")}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-white">
        {userReferralStat.activeReferralRate}%
        </p>
      </CardContent>
    </Card>
  </div>
</div>


       <div className="bg-gray-700 grid bg-opacity-50 p-4 md:p-6 rounded-lg space-y-4">
    {/* Titles Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="text-base sm:text-lg font-semibold text-white text-center md:text-left">MY Referral Code</p>
        <p className="text-base sm:text-lg font-semibold text-white text-center md:text-left">MY Referral Link</p>
    </div>

    {/* Cards Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referral Code Card */}
        <div className="bg-gray-600 bg-opacity-50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <span className="text-xs sm:text-sm font-medium text-white truncate w-full text-center sm:text-left">
                    {referralLink}
                </span>
                <button
                    onClick={copyReferralLink}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 p-2 rounded-lg flex items-center justify-center"
                >
                    <FaCopy className="mr-2" />
                    Copy
                </button>
            </div>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gray-600 bg-opacity-50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <span className="text-xs sm:text-sm font-medium text-white truncate w-full text-center sm:text-left">
                {`http://localhost:3000/register?ref=${referralLink}`}


                    
                </span>
                <button
                    onClick={copyReferralLink}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 p-2 rounded-lg flex items-center justify-center"
                >
                    <FaCopy className="mr-2" />
                    Copy
                </button>
            </div>
        </div>
    </div>
</div>

          <div className="bg-gray-700 bg-opacity-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-400">
              {t("How it works")}
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm md:text-base">
              <li>{t("Share your referral link with your friends")}</li>
              <li>{t("Your friends register using your link")}</li>
              <li>
                {t(
                  "You receive a bonus when your referrals make their first purchase"
                )}
              </li>
              <li>{t("Earn additional credits for each active referral")}</li>
            </ol>
          </div>

          <div className="bg-gray-700 bg-opacity-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-400">
              {t("Referral History")}
            </h3>
            <div className="flex justify-end mb-4 gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px] bg-gray-600 border-purple-500 bg-opacity-50 text-white">
                  <SelectValue placeholder={t("Filter by status")} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-purple-500 text-white">
                  <SelectItem value="all">{t("All")}</SelectItem>
                  <SelectItem value="Active">{t("Active")}</SelectItem>
                  <SelectItem value="Pending">{t("Pending")}</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                    ${appliedRange 
                      ? 'bg-purple-600 text-white border-purple-500' 
                      : 'bg-gray-600 text-gray-200 border-gray-500'
                    } hover:bg-opacity-80`}
                >
                  {getDropdownLabel()}
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-gray-700 rounded-lg shadow-lg border border-gray-600 p-4 z-50">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-200">
                          {t("Enter Credits Range")}
                        </label>
                        <div className="flex flex-col gap-2  items-center">
                          <input
                            type="number"
                            placeholder={t("Min")}
                            value={creditsRange.min}
                            onChange={(e) => setCreditsRange(prev => ({ 
                              ...prev, 
                              min: e.target.value.replace(/^0+/, '') 
                            }))}
                            min="0"
                            className="flex-1 px-3 py-2 w-full bg-gray-600 border border-gray-500 rounded-md 
                              text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                          {/* <span className="text-gray-400">-</span> */}
                          <input
                            type="number"
                            placeholder={t("Max")}
                            value={creditsRange.max}
                            onChange={(e) => setCreditsRange(prev => ({ ...prev, max: e.target.value }))}
                            className="flex-1 px-3 py-2 w-full bg-gray-600 border border-gray-500 rounded-md 
                              text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 ">
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md 
                            text-sm transition-colors"
                        >
                          {t("Reset")}
                        </button>
                        <button
                          onClick={handleApply}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md 
                            text-sm transition-colors"
                        >
                          {t("Apply")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-purple-400">
                      {t("User")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Date")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Status")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("earned credits")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableContent()}
                </TableBody>
              </Table>
            </ScrollArea>
            {/* <CardFooter className="flex mt-4 items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={activePage === 1}
              className="text-white flex gap-0 sm:gap-2 items-center justify-center hover:bg-[#541C81] hover:text-white bg-[#541C81] text-sm !border-[#541C81]"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="hidden sm:block">{t("Previous")}</div>
            </Button>

            <span className="text-gray-300">
              {activePage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={activePage === totalPages}
              className="text-white flex gap-0 sm:gap-2 items-center justify-center hover:bg-[#541C81] hover:text-white bg-[#541C81] text-sm !border-[#541C81]"
            >
              <div className="hidden sm:block">{t("Next")}</div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter> */}
          </div>

          {/* <div className="bg-gray-700 bg-opacity-50 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-400">
              {t("Referral Levels")}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-purple-400">
                    {t("Level")}
                  </TableHead>
                  <TableHead className="text-purple-400">
                    {t("Necessary Referrals")}
                  </TableHead>
                  <TableHead className="text-purple-400">
                    {t("Bonus")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralLinks?.map((referrallink) => (
                  <TableRow
                    key={referrallink?._id}
                    className="hover:bg-purple-700 hover:bg-opacity-50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-gray-200">
                      {referrallink.name}
                    </TableCell>

                    <TableCell className="text-gray-300">
                      {referrallink.percentage}
                      {"% "}
                      {t("of referral earnings")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div> */}
        </CardContent>
        
      </Card>
    </>
  );
};

export default ReferralTab;
