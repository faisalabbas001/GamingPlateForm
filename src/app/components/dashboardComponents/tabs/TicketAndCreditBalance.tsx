import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { GiTwoCoins, GiTicket } from "react-icons/gi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { FaQrcode, FaCopy } from "react-icons/fa";
import CircleLoader from "../../Loaders/CircleLoader";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

interface TicketAndCreditBalanceProps {
  tickets: number;
  credits: number;
  minPurchase: number;
  ticketPrice: number;
  t: (key: string) => string;
  handlePurchase: () => void;
  purchaseAmount: number;
  setPurchaseAmount: (value: number) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  isPurchaseDialogOpen: boolean;
  setIsPurchaseDialogOpen: (open: boolean) => void;
  isPurchaseLoading: boolean;
}

const TicketAndCreditBalance: React.FC<TicketAndCreditBalanceProps> = ({
  tickets,
  credits,
  minPurchase,
  ticketPrice,
  t,
  handlePurchase,
  purchaseAmount,
  setPurchaseAmount,
  paymentMethod,
  setPaymentMethod,
  isPurchaseDialogOpen,
  setIsPurchaseDialogOpen,
  isPurchaseLoading,
}) => {
  const { open } = useAppKit();
  const { address } = useAccount();
  return (
    <>
      <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-500 border-2 rounded-xl mb-8 overflow-hidden shadow-lg">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-300">
            {t("Ticket and Credit Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="w-full h-32 md:h-40 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center mr-8">
              <GiTicket className="text-yellow-400 h-12 w-12 md:h-16 md:w-16 mb-2" />
              <div className="text-4xl md:text-6xl font-bold text-white">
                {tickets}
              </div>
              <div className="text-sm md:text-lg text-purple-200 mt-1">
                {t("tickets available")}
              </div>
            </div>
            <div className="flex flex-col items-center ml-8">
              <GiTwoCoins className="text-yellow-400 h-12 w-12 md:h-16 md:w-16 mb-2" />
              <div className="text-4xl md:text-6xl font-bold text-white">
                {credits}
              </div>
              <div className="text-sm md:text-lg text-purple-200 mt-1">
                {t("earned credits")}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full max-w-xs mx-auto mt-6">
            <Input
              type="number"
              min={0}
              value={purchaseAmount || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : Number(e.target.value);
                setPurchaseAmount(value);
              }}
              placeholder={`${t("Amount")} (min. ${minPurchase})`}
              className="w-full md:w-auto bg-purple-800 bg-opacity-50 text-white border-purple-500 placeholder-purple-300"
            />
            <Dialog
              open={isPurchaseDialogOpen}
              onOpenChange={setIsPurchaseDialogOpen}
            >
              {address ? (
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <GiTicket className="mr-2" />
                    Comprar Tickets
                  </Button>
                </DialogTrigger>
              ) : (
                <Button
                  onClick={() => open()}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Connect Wallet
                </Button>
              )}
              <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-bold text-purple-400">
                    Comprar Tickets
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    {t(
                      "Select a payment method and complete the transaction. Price"
                    )}
                    : ${ticketPrice} {t("per ticket")}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="coinpayments" id="coinpayments" />
                      <Label htmlFor="coinpayments">CoinPayments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="coingate" id="coingate" />
                      <Label htmlFor="coingate">CoinGate</Label>
                    </div>
                  </RadioGroup>
                  {paymentMethod && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <FaQrcode size={150} className="text-purple-400" />
                      </div>
                      <div className="flex items-center justify-between bg-gray-700 bg-opacity-50 p-2 rounded">
                        <span className="text-sm">
                          1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
                            )
                          }
                        >
                          <FaCopy className="text-purple-400" />
                        </Button>
                      </div>
                      <Button
                        onClick={handlePurchase}
                        disabled={isPurchaseLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        {isPurchaseLoading ? (
                          <CircleLoader />
                        ) : (
                          <>
                            {t("Confirm Purchase")} ($
                            {purchaseAmount * ticketPrice || 0})
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TicketAndCreditBalance;
