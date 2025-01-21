import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ChevronLeft, ChevronRight, Gamepad2, Gift, Star } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import moment from "moment";
import Loader from "@/app/components/Loaders/Loader";

interface Activity {
  activityname: "Exchange" | "Spin" | "Buy";
  createdAt: string;
  amount: number;
  result: number;
}

interface Price {
  name: string;
  value: number;
}

interface FunTabProps {
  t: (key: string) => string;
  historyData: Activity[] | null;
  activityFilter: string;
  setActivityFilter: (value: string) => void;
  rotation: number;
  SPIN_DURATION: number;
  SPIN_EASING: string;
  isSpinning: boolean;
  tickets: number;
  nextFreeSpinTime: number;
  timeUntilFreeSpin: string;
  result: number | string;
  PRIZES: Price[];
  spinWheel: (isFree: boolean) => Promise<void>;
  claimFreeSpin: () => void;
  wheelRef: React.RefObject<HTMLDivElement>;
  historyLoading: boolean;
  setRotation: (value: number) => void;
  spinCount: number;
  setResult: (value: string) => void;
  fireConfetti: () => void;
  activePage: number;
  setActivePage: (value: number) => void;
  totalPages: number;
  setTotalPages: (value: number) => void;
}

const FunTab: React.FC<FunTabProps> = ({
  t,
  activityFilter,
  setActivityFilter,
  historyData,
  historyLoading,
  wheelRef,
  rotation,
  SPIN_DURATION,
  SPIN_EASING,
  PRIZES,
  isSpinning,
  tickets,
  nextFreeSpinTime,
  timeUntilFreeSpin,
  result,
  spinWheel,
  claimFreeSpin,
  spinCount,
  setRotation,
  setResult,
  fireConfetti,
  activePage,
  setActivePage,
  totalPages,
  // setTotalPages,
}) => {
  const [showResultModal, setShowResultModal] = useState(false);

  const handleCloseModal = () => {
    setShowResultModal(false);
    setRotation(0);
    setResult("");
  };

  useEffect(() => {
    if (result) {
      setShowResultModal(true);
      if (Number(result) > 0) {
        fireConfetti();
      }
    }
  }, [result]);

  const handleNextPage = () => {
    setActivePage(activePage + 1);
  };

  const handlePrevPage = () => {
    setActivePage(activePage - 1);
  };


  return (
    <>
      <div className="space-y-8">
        {/* {isSettingsLoading ? (
          <Loader height="50vh" />
        ) : (
        )} */}
        <>
          <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md overflow-hidden">
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl md:text-4xl text-center text-purple-400">
                {t("wheelOfFortune")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <p className="text-gray-300 text-center text-sm md:text-lg mb-6">
                {t("wheelDescription")}
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                <Badge
                  variant="secondary"
                  className="text-yellow-400 bg-yellow-400 bg-opacity-20 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm"
                >
                  <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {t("instantWinnings")}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-green-400 bg-green-400 bg-opacity-20 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm"
                >
                  <Gift className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {t("bigPrizes")}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-blue-400 bg-blue-400 bg-opacity-20 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm"
                >
                  <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {t("easyToPlay")}
                </Badge>
              </div>
              <div
                ref={wheelRef}
                className="relative w-64 h-64 md:w-80 md:h-80 mx-auto"
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient
                      id="goldBorder"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#9F7AEA", stopOpacity: 1 }}
                      />
                      <stop
                        offset="50%"
                        style={{ stopColor: "#805AD5", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#9F7AEA", stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <radialGradient
                      id="wheelBackground"
                      cx="50%"
                      cy="50%"
                      r="50%"
                      fx="50%"
                      fy="50%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#4A5568", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#2D3748", stopOpacity: 1 }}
                      />
                    </radialGradient>
                  </defs>
                  <g
                    key={spinCount}
                    className="wheel-rotation transition-transform origin-center"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning
                        ? `transform ${SPIN_DURATION}ms ${SPIN_EASING}`
                        : "none",
                    }}
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="98"
                      fill="url(#wheelBackground)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="98"
                      fill="none"
                      stroke="url(#goldBorder)"
                      strokeWidth="4"
                    />
                    {PRIZES.map((prize, index) => {
                      const angle = (index / PRIZES.length) * 360;
                      const startAngle = angle - 22.5;
                      const endAngle = angle + 22.5;
                      const x1 =
                        100 + 96 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 =
                        100 + 96 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 =
                        100 + 96 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 =
                        100 + 96 * Math.sin((endAngle * Math.PI) / 180);
                      return (
                        <path
                          key={prize.name}
                          d={`M100,100 L${x1},${y1} A96,96 0 0,1 ${x2},${y2} Z`}
                          fill={index % 2 === 0 ? "#4A5568" : "#2D3748"}
                          stroke="url(#goldBorder)"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {PRIZES.map((prize, index) => {
                      const angle = (index / PRIZES.length) * 360 + 11.25;
                      const x = 100 + 70 * Math.cos((angle * Math.PI) / 180);
                      const y = 100 + 70 * Math.sin((angle * Math.PI) / 180);
                      return (
                        <text
                          key={prize.name}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#E2E8F0"
                          fontSize="10"
                          fontWeight="bold"
                          transform={`rotate(${angle}, ${x}, ${y})`}
                        >
                          {prize.name}
                        </text>
                      );
                    })}
                  </g>
                  <circle
                    cx="100"
                    cy="100"
                    r="10"
                    fill="url(#goldBorder)"
                    stroke="#805AD5"
                    strokeWidth="2"
                  />
                  <path
                    d="M95,2 Q100,0 105,2 L100,12 Z"
                    fill="url(#goldBorder)"
                    stroke="url(#goldBorder)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
                <Button
                  onClick={() => spinWheel(false)}
                  disabled={isSpinning || tickets < 1}
                  className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-sm md:text-lg px-4 py-2 md:px-8 md:py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSpinning ? "Girando..." : t("Spin (1 ticket)")}
                </Button>
                <Button
                  onClick={() => claimFreeSpin()}
                  disabled={
                    isSpinning ||
                    (nextFreeSpinTime !== null && Date.now() < nextFreeSpinTime)
                  }
                  className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm md:text-lg px-4 py-2 md:px-8 md:py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("Free Spin")}
                </Button>
              </div>
              <p className="text-center text-xs md:text-sm text-gray-400">
                {t("Next free spin on")}: {timeUntilFreeSpin}
              </p>
            </CardContent>
            <CardFooter className="text-center text-xs md:text-sm text-gray-400">
              {t("Play responsibly. Terms and conditions apply.")}
            </CardFooter>
          </Card>
        </>

        {/* Custom Modal */}
        {showResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            {/* Modal Content */}
            <div className="relative bg-gray-800 border-2 border-purple-500 rounded-xl p-6 w-[90%] max-w-md transform transition-all">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="text-center mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-purple-400">
                  {t("Cheers!")}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="text-center py-4">
                <p className="text-base md:text-lg font-bold text-white">
                  {Number(result) > 0 ? t("You have won:") : ""}
                  <span className="text-purple-400">
                    {Number(result) > 0
                      ? ` ${result} ${t("credits")}`
                      : "Better luck next time!"}
                  </span>
                </p>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        )}

        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
              {t("Activity History")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
              <h3 className="text-base md:text-lg font-semibold text-purple-400">
                {t("Recent Activities")}
              </h3>

              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-gray-700 bg-opacity-50 text-white border-purple-500  hover:text-white focus:ring-purple-500 focus:border-purple-500 rounded-xl">
                  <SelectValue placeholder={t("Filter by")} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700  border-purple-500 bg-opacity-90  rounded-xl">
                  <SelectItem
                    value="all"
                    className= "  hover:bg-purple-600 bg-gray-700  text-white transition-colors duration-200"
                  >
                    {t("All activities")}
                  </SelectItem>
                  <SelectItem
                    value="Buy"
                    className="hover:bg-purple-600 bg-gray-700 text-white  transition-colors duration-200"
                  >
                    {t("Buys")}
                  </SelectItem>
                  <SelectItem
                    value="Exchange"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("Exchange")}
                  </SelectItem>
                  <SelectItem
                    value="Spin"
                    className="hover:bg-purple-600 bg-gray-700 text-white transition-colors duration-200"
                  >
                    {t("Games")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-purple-400">
                      {t("Activity")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Time")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Amount")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Result")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        <Loader height="16vh" />
                      </TableCell>
                    </TableRow>
                  ) : historyData && historyData.length > 0 ? (
                    historyData?.map((activity, index) => (
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
                          {activity.activityname === "Exchange" &&
                            t("Exchange")}
                          {activity.activityname === "Spin" && t("Spin")}
                          {activity.activityname === "Buy" && t("Buy")}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {moment(activity.createdAt).format(
                            "MM/DD/YYYY, h:mm:ss A"
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {activity.amount}
                        </TableCell>
                        <TableCell
                          className={
                            activity?.activityname === "Exchange"
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        >
                          {activity?.activityname === "Exchange"
                            ? `- $${activity.result}`
                            : `+ ${activity.result}`}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {t("No activities found")}
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
      </div>
    </>
  );
};

export default FunTab;
