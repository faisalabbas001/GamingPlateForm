"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { User, Gamepad2, Gift, Share2 } from "lucide-react";
import moment from "moment";
import confetti from "canvas-confetti";
import { useTranslation } from "@/app/context/TranslationProvider";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import TicketAndCreditBalance from "../tabs/TicketAndCreditBalance";
import FunTab from "../tabs/Fun/FunTab";
import RewardTab from "../tabs/Rewards/RewardTab";
import UserProfileTab from "../tabs/Profile/UserProfileTab";
import ReferralTab from "../tabs/Referral/ReferralTab";
import { handleCryptoPayment } from "@/lib/HelperFunctions";
import { useAccount } from "wagmi";

const SPIN_DURATION = 5000; // 5 seconds
const SPIN_EASING = "cubic-bezier(0.25, 0.1, 0.25, 1)";
// const RESULT_DISPLAY_DURATION = 5000; // 5 seconds
const TICKET_PRICE = 1; // $1 per ticket
const MIN_TICKET_PURCHASE = 5; // Minimum 5 tickets per purchase
const FULL_ROTATION = 360;

interface UserType {
  _id: string;
  createdAt: string;
  credits: number;
  email: string;
  isActive: boolean;
  lastFreeSpin: string;
  level: string;
  notificationsEnabled: boolean;
  role: "user" | "admin";
  social: boolean;
  tickets: number;
  username: string;
}
interface PrizeType {
  probability: number;
  name: string;
  value: number;
  _id: string;
}

const AppDashboard3 = () => {
  const { t } = useTranslation();

  const router = useRouter();

  // my states
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserType[] | null>(null);
  const [historyData, setHistoryData] = useState([]);
  const [userId, setUserID] = useState("");

  const [timeUntilFreeSpin, setTimeUntilFreeSpin] = useState("");
  const [nextFreeSpinTime, setNextFreeSpinTime] = useState<number | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  // my states

  const [FREE_SPIN_COOLDOWN, setFREE_SPIN_COOLDOWN] = useState<number>(0);
  const [prizes, setPrizes] = useState<PrizeType[]>([]);

  const [result, setResult] = useState("");

  const [activityFilter, setActivityFilter] = useState("all");

  const [referralLink, setReferralLink] = useState("");

  const [historyLoading, setHistoryLoading] = useState(false);
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/setting");

      if (response.data.prizes && response.data.prizes.length > 0) {
        setPrizes(response.data.prizes);
        const newCooldown = response.data.freeSpinInterval * 60 * 60 * 1000;
        setFREE_SPIN_COOLDOWN(newCooldown);
      } else {
        console.error("Invalid prizes data received");
        toast.error("Error loading wheel settings", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark", // Change theme to dark
          transition: Bounce,
          style: {
            background: "#4c1d95", // Purple background
            color: "white", // White text
          },
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Error loading wheel settings", {
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
  useEffect(() => {
    fetchSettings();
  }, []);

  const getUserById = async () => {
    try {
      const res = await axios.get(`/api/users?id=${session?.user?.id}`);
      // console.log("res user data", res.data);
      const lastFreeSpin = moment(res.data.lastFreeSpin);
      const calculatedNextFreeSpinTime = lastFreeSpin
        .add(FREE_SPIN_COOLDOWN, "milliseconds")
        .valueOf();
      setNextFreeSpinTime(calculatedNextFreeSpinTime);
      setTickets(res.data.tickets);
      setCredits(res.data.credits);
      setReferralLink(res.data.referralCode);
      setUserData(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("error", error.response);
        if (error.response?.data?.error === "User not found.") {
          toast.error("User not found", {
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
          signOut();
          router.push("/login");
        }
        if (
          error.response?.data?.error ===
          "System is currently under maintenance"
        ) {
          router.push("/maintance-page");
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
    }
  };

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivities = async () => {
    setHistoryLoading(true);
    try {
      const activityName = activityFilter === "all" ? "" : activityFilter;
      const res = await axios.get(
        `/api/activities?userId=${session?.user?.id}&activityName=${activityName}&page=${activePage}`
      );
      setHistoryData(res.data.activities);
      setTotalPages(res.data.pagination.totalPages);
      setActivePage(res.data.pagination.currentPage);
    } catch (error: unknown) {
      console.error("Error fetching activities:", error);
      if (axios.isAxiosError(error)) {
        if (
          error.response?.data?.error ===
          "System is currently under maintenance"
        ) {
          router.push("/maintance-page");
        }
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchActivities();
    }
  }, [activePage, activityFilter]);

  useEffect(() => {
    if (session?.user?.id) {
      setUserID(session.user.id);
      getUserById();
      // fetchActivities();
    }
  }, [session, FREE_SPIN_COOLDOWN]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment().valueOf(); // Current timestamp in milliseconds
      if (nextFreeSpinTime && now >= nextFreeSpinTime) {
        setTimeUntilFreeSpin("Free spin available!");
      } else if (nextFreeSpinTime) {
        const timeLeft = moment.duration(nextFreeSpinTime - now);
        const hours = timeLeft.hours();
        const minutes = timeLeft.minutes();
        const seconds = timeLeft.seconds();
        setTimeUntilFreeSpin(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextFreeSpinTime]);

  // fun sections
  const handlePurchase = async () => {
    const amount = purchaseAmount;
    if (!isNaN(amount) && amount >= MIN_TICKET_PURCHASE && paymentMethod) {
      setIsPurchaseLoading(true);
      try {
        await confirmPurchase();
      } finally {
        setIsPurchaseLoading(false);
      }
    } else {
      toast.error(
        `${t(
          "Please enter a valid amount (minimum"
        )} ${MIN_TICKET_PURCHASE} ${t(
          "tickets) and select a payment method"
        )}.`,
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
    }
  };
  const { address } = useAccount();
  const confirmPurchase = async () => {
    try {
      const amount = purchaseAmount;
      console.log("amount", typeof amount);
      // wallet transaction
      if (address) {
        const transaction = await handleCryptoPayment(
          Number(amount).toString(),
          address
        );
        console.log("transaction", transaction);
        if (transaction) {
          const response = await axios.post(
            `/api/purchase-tickets?userId=${userId}`,
            {
              amount,
              paymentMethod,
              activityname: "Buy",
            }
          );
          // console.log("Tickets purchased:", response.data);
          if (response) {
            toast.success("Tickets purchased successfully", {
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
            setPurchaseAmount(0);
            setPaymentMethod("");
            setIsPurchaseDialogOpen(false);
            await getUserById();
            await fetchActivities();
          }
        }
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error);
    }
  };

  const fireConfetti = () => {
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      const rect = wheelElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: centerX / window.innerWidth,
          y: centerY / window.innerHeight,
        },
        colors: ["#9F7AEA", "#805AD5", "#D53F8C", "#FBD38D", "#4FD1C5"],
      });
    }
  };

  const spinWheel = async (isFree: boolean) => {
    if (isSpinning) {
      return;
    }

    try {
      setIsSpinning(true);
      // setRotation(0);
      setSpinCount((prev) => prev + 1);

      // Force a reflow
      if (wheelRef.current) {
        void wheelRef.current.offsetHeight;
      }

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Get prize from backend
      const response = await axios.post("/api/spin", {
        userId: session?.user?.id,
        isFree,
      });

      const { prizeIndex, prize } = response.data;

      // Calculate wheel rotation
      const spinSegments = prizes.length;
      const segmentAngle = FULL_ROTATION / spinSegments;
      const extraSpins = 15;
      const baseRotation = extraSpins * FULL_ROTATION;
      const targetAngle = -prizeIndex * segmentAngle + 270;
      const finalRotation = baseRotation + targetAngle;

      // Add small random offset for natural feel
      const randomOffset =
        Math.random() * (segmentAngle * 0.2) - segmentAngle * 0.1;

      // Start the spin animation
      setTimeout(() => {
        setRotation(finalRotation + randomOffset);
      }, 0);

      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, SPIN_DURATION));

      // Update UI with result
      setResult(prize.value.toString());

      // Refresh user data and activities
      await getUserById();
      await fetchActivities();
      // fireConfetti();
    } catch (error) {
      console.error("Spin error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while spinning the wheel",
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
        if (
          error.response?.data?.error ===
          "System is currently under maintenance"
        ) {
          router.push("/maintance-page");
        }
      }
    } finally {
      setIsSpinning(false);
    }
  };

  const claimFreeSpin = () => {
    if (!nextFreeSpinTime) {
      toast.error("Unable to determine free spin availability", {
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
      return;
    }

    if (Date.now() >= nextFreeSpinTime) {
      spinWheel(true);
    } else {
      toast.info(
        t(
          "You cannot claim your free spin yet. Please wait until the counter reaches zero."
        ),
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
    }
  };

  return (
    <>
      <div className="min-h-screen ">
        <main className="container mx-auto px-4 py-8">
          <TicketAndCreditBalance
            tickets={tickets || 0}
            credits={credits || 0}
            minPurchase={MIN_TICKET_PURCHASE}
            ticketPrice={TICKET_PRICE}
            t={t}
            handlePurchase={handlePurchase}
            purchaseAmount={purchaseAmount}
            setPurchaseAmount={setPurchaseAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            isPurchaseDialogOpen={isPurchaseDialogOpen}
            setIsPurchaseDialogOpen={setIsPurchaseDialogOpen}
            isPurchaseLoading={isPurchaseLoading}
          />
          <Tabs defaultValue="fun" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:gap-0 gap-3 rounded-xl p-1 mb-28 md:mb-0 md:grid-cols-4 ">
              <TabsTrigger
                value="fun"
                className="data-[state=active]:bg-purple-600 data-[state=active]:rounded-xl bg-gray-800 bg-opacity-50 rounded-r-xl rounded-l-xl md:rounded-r-none data-[state=active]:text-white "
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t("Fun")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-purple-600 data-[state=active]:rounded-xl bg-gray-800 bg-opacity-50 md:rounded-none data-[state=active]:text-white rounded-xl"
              >
                <Gift className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t("Rewards")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="referral"
                className="data-[state=active]:bg-purple-600 data-[state=active]:rounded-xl bg-gray-800 bg-opacity-50 md:rounded-none data-[state=active]:text-white rounded-xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="hidden md:inline"> {t("Referrals")}</span>
              </TabsTrigger>

              {/* TODO: just UI provdied by client */}
              {/* <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:!rounded-[8px] rounded-[8px] md:rounded-none bg-opacity-50 bg-gray-800  font-medium text-sm py-2 relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t("Notifications")}</span>
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger> */}
              {/* <TabsTrigger
                value="support"
                className="data-[state=active]:bg-purple-600 data-[state=active]:rounded-xl bg-gray-800 bg-opacity-50 md:rounded-none data-[state=active]:text-white rounded-xl"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t("Medium")}</span>
              </TabsTrigger> */}
              {/* TODO: just UI provdied by client */}

              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-purple-600 data-[state=active]:rounded-xl bg-gray-800 bg-opacity-50 rounded-l-xl rounded-r-xl md:rounded-l-none data-[state=active]:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t("Profile")}</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fun">
              <FunTab
                t={t}
                activityFilter={activityFilter}
                setActivityFilter={setActivityFilter}
                historyData={historyData}
                historyLoading={historyLoading}
                wheelRef={wheelRef}
                rotation={rotation}
                SPIN_DURATION={SPIN_DURATION}
                SPIN_EASING={SPIN_EASING}
                PRIZES={prizes}
                isSpinning={isSpinning}
                tickets={tickets}
                nextFreeSpinTime={nextFreeSpinTime ?? 0}
                timeUntilFreeSpin={timeUntilFreeSpin}
                result={result}
                spinWheel={spinWheel}
                claimFreeSpin={claimFreeSpin}
                fireConfetti={fireConfetti}
                spinCount={spinCount}
                setRotation={setRotation}
                setResult={setResult}
                activePage={activePage}
                setActivePage={setActivePage}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
              />
            </TabsContent>
            <TabsContent value="rewards">
              <RewardTab t={t} credits={credits || 0} userId={userId} />
            </TabsContent>
            <TabsContent value="referral">
              <ReferralTab t={t} referralLink={referralLink} userId={userId} />
            </TabsContent>
            {/* TODO: just UI provdied by client */}
            {/* <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent> */}
            {/* <TabsContent value="support">
              <SupportTab />
            </TabsContent> */}{" "}
            {/* TODO: just UI provdied by client */}
            <TabsContent value="profile">
              <UserProfileTab
                t={t}
                userData={userData}
                getUserById={getUserById}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default AppDashboard3;
