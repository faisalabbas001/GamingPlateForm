import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import React, { useEffect, useState,useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Bounce, toast } from "react-toastify";
import Loader from "@/app/components/Loaders/Loader";
import CircleLoader from "@/app/components/Loaders/CircleLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useRouter } from "next/navigation";
import moment from "moment";
import {Badge} from "../../../../components/ui/badge"

interface RewardsType {
  _id: string;
  name: string;
  cost: number;
  claimed: number;
}

interface RewardTabProps {
  t: (key: string) => string;
  credits: number;
  userId: string;
}

interface RedemptionTypes {
  name: string;
  walletAddress: string;
  network: string;
  createdAt: string;
  status: string;
  cost: number;
  redeemed: number;
}

interface SelectedRewardType {
  _id: string;
  name: string;
  cost: number;
  claimed: number;
}

const RewardTab: React.FC<RewardTabProps> = ({ t, credits, userId }) => {
  const [apiRewards, setApiRewards] = useState<RewardsType[] | null>([]);
  const [selectedReward, setSelectedReward] =
    useState<SelectedRewardType | null>(null);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionTypes[]>(
    []
  );
  const [isRedemptionOverlayOpen, setIsRedemptionOverlayOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  

  console.log("checking that the new````````````` state is",isRedeeming)

  const getAllRewards = async () => {
    setRewardLoading(true);
    try {
      const res = await axios.get("/api/reward");
      setApiRewards(res.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setRewardLoading(false);
    }
  };


  // console.log("checkung the reward data",apiRewards);
  // console.log("checkung the reward history data",redemptionHistory)
  const fetchExchangeHistoryByUserId = useCallback(async () => {
    setExchangeLoading(true);
    try {
      const response = await axios.get(
        `/api/exchange-history?id=${userId}&status=${statusFilter}&page=${activePage}`
      );
      if (response) {
        setRedemptionHistory(response.data.redeemedRewards);
        setTotalPages(response.data.pagination.totalPages);
        setActivePage(response.data.pagination.currentPage);
      }
    } catch (error:unknown) {
      console.error("Error fetching exchange history for this user.", error);
      if(axios.isAxiosError(error)){
        if(error.response?.data?.error === "System is currently under maintenance"){
          router.push("/maintance-page");
        }
      }
    } finally {
      setExchangeLoading(false);
    }
  }, [userId, statusFilter, activePage, router]);

  const handlePrevPage = () => {
    if (activePage > 1) {
      setActivePage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPages) {
      setActivePage(prev => prev + 1);
    }
  };

  useEffect(() => {
    getAllRewards();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchExchangeHistoryByUserId();
    }
  }, [userId, statusFilter, activePage,fetchExchangeHistoryByUserId]);

  const openRedemptionOverlay = (reward: RewardsType) => {
    setSelectedReward(reward);
    setIsRedemptionOverlayOpen(true);
  };

  const closeRedemptionOverlay = () => {
    setIsRedemptionOverlayOpen(false);
    setSelectedReward(null);
    setWalletAddress("");
    setSelectedNetwork("");
  };

  const validateWalletAddress = (address: string) => {
    return address.length >= 42;
  };

  const redeemReward = async () => {
    if (!validateWalletAddress(walletAddress)) {
      toast.error(
        t("Invalid wallet address. Address must be at least 42 characters."),
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
            background: "#4c1d95",
            color: "white",
          },
        }
      );
      return;
    }

    if (
      selectedReward &&
      credits >= selectedReward.cost &&
      walletAddress &&
      selectedNetwork
    ) {
      setIsRedeeming(true);
      try {
        const rewardId = selectedReward._id;
        const redeemed = selectedReward.claimed;
        const response = await axios.post("/api/redeem", {
          userId,
          rewardId,
          walletAddress,
          network: selectedNetwork,
          redeemed,
        });
        if (response) {
          toast.success(
            `${t("You have redeemed")} ${selectedReward.name} ${t("by")} ${
              selectedReward.cost
            } ${t(
              "credits! It will be sent to the address"
            )} ${walletAddress} ${t("on the network")} ${selectedNetwork}.`,
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
                background: "#4c1d95",
                color: "white",
              },
            }
          );
          closeRedemptionOverlay();
          fetchExchangeHistoryByUserId();
        }
      } catch (error:unknown) {
        console.error("error", error);
        if(axios.isAxiosError(error)){
          if(error.response?.data?.error === "System is currently under maintenance"){
            router.push("/maintance-page");
          }
        }else{
          toast.error("Something went wrong! Please try again", {
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
        setIsRedeeming(false);
      }
    } else if (!selectedReward || credits < selectedReward.cost) {
      toast.error(t("You do not have enough credits to redeem this reward."), {
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
    } else {
      toast.error(t("Please complete all fields before redeeming."), {
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
  };

  const maskWallet = (wallet: string ) => {
    if (wallet?.length < 42) return wallet;
    return `${wallet.slice(0, 4)}...${wallet.slice(-5)}`;
  };

  return (
    <div className="space-y-8">
      {rewardLoading ? (
        <Loader height="50vh" />
      ) : (
        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
              {t("Redeem Rewards")}
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              {t("Use your credits to get USDT")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {apiRewards && apiRewards.length > 0 ? (
                apiRewards?.map((reward, index) => (
                  <Card
                    key={index + 1}
                    className="bg-gray-700 bg-opacity-50 border-purple-500 border overflow-hidden flex flex-col rounded-xl"
                  >
                    <div className="flex-shrink-0 h-32   md:h-40 relative">
                      <Image
                        src={
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bX8jcXTis6IPPblUFvDS9MZe8pFBAY.png"
                        }
                        alt={reward.name}
                        layout="fill"
                        objectFit="cover"
                        className="p-2 bg-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col flex-grow p-4">
                      <CardTitle className="text-base md:text-lg font-bold text-purple-400 mb-2">
                        {reward.name}
                      </CardTitle>
                      <p className="text-white mb-0 flex-grow text-sm md:text-base">
                        {t("Cost")}: {reward.cost} {t("credits")}
                      </p>
                      <p className="text-white mb-4 flex-grow text-sm md:text-base">
                        {t("Claim : $")}
                        {reward.claimed}
                      </p>
                      <Button
                        onClick={() => openRedemptionOverlay(reward)}
                        disabled={credits < reward.cost}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm md:text-base rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("Redeem")}
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-300">
                  {t("No Redeem available")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
            {t("Redemption History")}
            <p className="text-sm text-white font-bold mt-3">Only the latest 100 transactions are displayed</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end w-full">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-gray-700 bg-opacity-50 text-white border-purple-500">
                <SelectValue placeholder={t("Filter by Status")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-purple-500">
                <SelectItem value="all">{t("All Status")}</SelectItem>
                <SelectItem value="Pending">{t("Pending")}</SelectItem>
                <SelectItem value="Accepted">{t("Accepted")}</SelectItem>
                <SelectItem value="Rejected">{t("Rejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-purple-400">
                    {t("Reward")}
                  </TableHead>
                  <TableHead className="text-purple-400">{t("Cost")}</TableHead>
                  <TableHead className="text-purple-400">Wallet</TableHead>
                  <TableHead className="text-purple-400">Network</TableHead>
                  <TableHead className="text-purple-400">Redeemed</TableHead>
                  <TableHead className="text-purple-400">{t("Date")}</TableHead>
                  <TableHead className="text-purple-400">
                    {t("Status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeLoading ? (
                  <TableRow className="hover:bg-purple-700 hover:bg-opacity-50 transition-colors duration-200">
                    <TableCell
                      colSpan={7}
                      className="text-center font-medium text-gray-200"
                    >
                      <Loader height="16vh" />
                    </TableCell>
                  </TableRow>
                ) : redemptionHistory?.length > 0 ? (
                  <>
                    {redemptionHistory?.map((redemption, index) => (
                      <TableRow
                        key={index}
                        className={`
                  ${
                    index % 2 === 0
                      ? "bg-gray-700 bg-opacity-50"
                      : "bg-gray-600 bg-opacity-50"
                  }
                  hover:bg-purple-700 hover:bg-opacity-50 transition-colors duration-200
                `}
                      >
                        <TableCell className="font-medium text-gray-200">
                          {redemption.name}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {redemption.cost} {t("credits")}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {maskWallet(redemption.walletAddress)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {redemption.network}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {redemption.redeemed}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {/* {redemption.createdAt} */}
                          {moment(redemption.createdAt).format(
                            "MM/DD/YYYY, h:mm:ss A"
                          )}
                            </TableCell>
                   <TableCell>
  <Badge
    variant={
      redemption.status === "Pending"
        ? "secondary"
        : redemption.status === "Accepted"
        ? "outline"
        : "destructive" // Default if neither condition is met
    }
  >
    {redemption.status}
  </Badge>
</TableCell>

                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow className="hover:bg-purple-700 hover:bg-opacity-50 transition-colors duration-200">
                    <TableCell
                      colSpan={7}
                      className="text-center font-medium text-gray-200"
                    >
                      No exchange history found for this user.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4">
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
          </CardFooter>
      </Card>

      {/* redemption model  */}
      {isRedemptionOverlayOpen && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 !mt-0">
          <Card className="w-full max-w-md bg-gray-800 bg-opacity-90 border-purple-500 border rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
                {t("Redeem")} {selectedReward.name}
              </CardTitle>
              <Button
                onClick={closeRedemptionOverlay}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wallet" className="text-white">
                  {t("Wallet Address")}
                </Label>
                <Input
                  id="wallet"
                  placeholder={t("Enter your wallet address")}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-gray-700 bg-opacity-50 text-white border-purple-500 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-white">{t("Select the Network")}</Label>
                <RadioGroup
                  value={selectedNetwork}
                  onValueChange={setSelectedNetwork}
                  className="flex flex-wrap space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BSC" id="BSC" />
                    <Label htmlFor="BSC" className="text-white">
                      BSC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TRC20" id="TRC20" />
                    <Label htmlFor="TRC20" className="text-white">
                      TRC20
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ETH" id="ETH" />
                    <Label htmlFor="ETH" className="text-white">
                      ETH
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={redeemReward}
                disabled={isRedeeming}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
              >
                {isRedeeming ? <CircleLoader /> : t("Confirm Redemption")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RewardTab;
