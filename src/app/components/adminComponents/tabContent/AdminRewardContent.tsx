import React, { useEffect, useState,useCallback } from "react";
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "../../ui/card";
import { Input } from "../../ui/input";
import { ScrollArea } from "../../ui/scroll-area";
import { useTranslation } from "@/app/context/TranslationProvider";
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Check, ChevronLeft, ChevronRight, Edit, Plus, Trash2, X } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Label } from "../../ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Bounce, toast } from "react-toastify";
import Swal from "sweetalert2"; // Ensure you import SweetAlert2
import { useSession } from "next-auth/react";
import moment from "moment";
import Loader from "../../Loaders/Loader";
import CircleLoader from "../../Loaders/CircleLoader";

interface RewardsType {
  _id: string;
  name: string;
  cost: number;
  claimed: number;
  redeemed: number;
}

interface UserType {
  username: string;
  _id: string;
}
interface RedemptionsType {
  _id: string;
  name: string;
  cost: number;
  redeemed: number;
  claimed: number;
  updatedAt: string;
  status: string;
  user: UserType;
  walletAddress: string;
}

const AdminRewardContent = () => {
  const { t } = useTranslation();
  const [apiRewards, setApiRewards] = useState<RewardsType[] | null>([]);
  const [selectedReward, setSelectedReward] =
    useState<Partial<RewardsType> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rewardId, setRewardId] = useState("");
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data: session } = useSession();
  const [pendingRedemptions, setPendingRedemptions] = useState<
    RedemptionsType[] | null
  >([]);

  const getAllRewards = useCallback(async () => {
    try {
      const res = await axios.get("/api/reward");
      setApiRewards(res.data);
    } catch (error) {
      console.error("error", error);
    }
  }, []);

  const fetchAllRedeemedRewards =  useCallback(async () => {
    try {
      const response = await axios.get(`/api/exchange-history?page=${activePage}`);
      if (response) {
        setPendingRedemptions(response.data.redeemedRewards);
        setTotalPages(response.data.pagination.totalPages);
        setActivePage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching all redeemed rewards.", error);
    }
  }, [activePage]);

  const handleNextPage = () => {
    if (activePage < totalPages) {
      setActivePage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (activePage > 1) {
      setActivePage(prev => prev - 1);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([getAllRewards(), fetchAllRedeemedRewards()]);
        if (session) {
          setUserId(session?.user.id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, activePage, getAllRewards, fetchAllRedeemedRewards]);

  const openAddRewardDialog = () => {
    setSelectedReward({ name: "", cost: 0, redeemed: 0 });
    setIsEditMode(false);
    setIsRewardDialogOpen(true);
  };

  const handleRewardEdit = (reward: RewardsType) => {
    setSelectedReward(reward);
    setRewardId(reward._id);
    setIsEditMode(true);
    setIsRewardDialogOpen(true);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("Name is required")),
    cost: Yup.number()
      .min(0, t("Cost must be non-negative"))
      .required(t("Cost are required")),
    redeemed: Yup.number()
      .min(0, t("Cost must be non-negative"))
      .required(t("Cost are required")),
  });

  const modelInitialValues = {
    name: selectedReward?.name || "",
    cost: selectedReward?.cost || 0,
    redeemed: selectedReward?.redeemed || 0,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: modelInitialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (rewardId !== "") {
          //   console.log("id", rewardId);
          const res = await axios.put(`/api/reward?id=${rewardId}`, {
            ...values,
            userId,
          });
          //   console.log("res", res);
          if (res) {
            getAllRewards();
            fetchAllRedeemedRewards();
            setRewardId("");
            resetForm();
            setIsRewardDialogOpen(false);
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
                background: "#1E1939",
                color: "white",
              },
            });
          }
        } else {
          //   console.log("id", rewardId);
          const response = await axios.post("/api/reward", {
            ...values,
            userId,
          });
          //   console.log("res", response);
          if (response) {
            getAllRewards();
            fetchAllRedeemedRewards();
            resetForm();
            setIsRewardDialogOpen(false);
            toast.success("Added Successfully", {
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
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetFormWithUserData = () => {
    setValues({
      name: selectedReward?.name || "",
      cost: selectedReward?.cost || 0,
      redeemed: selectedReward?.claimed || 0,
    });
  };

  useEffect(() => {
    if (isRewardDialogOpen) {
      resetFormWithUserData();
    }
  }, [selectedReward, isRewardDialogOpen]);

  const handleRewardDelete = async (rewardId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#7E22CE",
      color: "white",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `/api/reward?id=${rewardId}&userId=${userId}`
          );
          // console.log("res", res);
          if (res) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              background: "#7E22CE",
              color: "white",
              confirmButtonColor: "#3085d6",
            });
            getAllRewards();
            fetchAllRedeemedRewards();
          }
        } catch (error) {
          console.error("Error during deletion:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete user. Please try again.",
            icon: "error",
            background: "#7E22CE",
            color: "white",
          });
        }
      }
    });
  };

  const handleRedemptionAction = async (
    rewardId: string,
    userId: string,
    walletAddress: string,
    action: boolean
  ) => {
    const confirmationText = action
      ? "you want to accept this reward redemption? This will deduct credits from the user."
      : "you want to reject this reward redemption? This action cannot be undone.";

    Swal.fire({
      title: "Are you sure?",
      text: confirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action ? "#3085d6" : "#d33", // Blue for accept, red for reject
      cancelButtonColor: "#999",
      confirmButtonText: action ? "Yes, accept it!" : "Yes, reject it!",
      background: "#7E22CE",
      color: "white",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `/api/redeem?userId=${userId}&rewardId=${rewardId}`,
            {
              action,
            }
          );
          if (response) {
            if (action) {
              // TODO: after also add logic of wallet transcation when admin accpeted then send these redeem in user wallet
              Swal.fire({
                title: "Accepted!",
                text: "The reward redemption has been accepted and credits have been deducted.",
                icon: "success",
                background: "#7E22CE",
                color: "white",
              });
              // console.log("response", response);
              // console.log("action must true", action);
              fetchAllRedeemedRewards();
              getAllRewards();
            } else {
              Swal.fire({
                title: "Rejected!",
                text: "The reward redemption has been rejected.",
                icon: "success",
                background: "#7E22CE",
                color: "white",
              });
              // console.log("response", response);
              // console.log("action must false", action);
              fetchAllRedeemedRewards();
              getAllRewards();
            }
          }
        } catch (error) {
          console.error("Error during redemption action:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to process the redemption. Please try again.",
            icon: "error",
            background: "#7E22CE",
            color: "white",
          });
        }
      }
    });
  };

  if (isLoading) {
    return <Loader height={"80vh"} />;
  }

  return (
    <>
      <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-purple-400">
            {t("Rewards Management")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              onClick={openAddRewardDialog}
              className="bg-purple-600 rounded-[8px] hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("Add Reward")}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <ScrollArea className="h-[300px] w-full rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-purple-400">ID</TableHead>
                    <TableHead className="text-purple-400">
                      {t("Name")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Cost")} ({t("Credits")})
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Redeemed")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiRewards && apiRewards.length > 0 ? (
                    apiRewards?.map((reward, index) => (
                      <TableRow key={reward._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{reward.name}</TableCell>
                        <TableCell>{reward.cost}</TableCell>
                        <TableCell>{reward.claimed}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => handleRewardEdit(reward)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleRewardDelete(reward._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("No data available")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <Separator className="my-6" />

          <CardTitle className="text-xl font-bold text-purple-400 mb-4">
            {t("Pending Exchanges")}
          </CardTitle>
          <div className="overflow-x-auto">
            <ScrollArea className="h-[300px] w-full rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-purple-400">ID</TableHead>
                    <TableHead className="text-purple-400">
                      {t("User")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Reward")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Cost")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Redeemed USD")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Date")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Status")}
                    </TableHead>
                    <TableHead className="text-purple-400">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRedemptions && pendingRedemptions.length > 0 ? (
                    pendingRedemptions?.map((redemption, index) => (
                      <TableRow key={redemption?._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{redemption?.user?.username}</TableCell>
                        <TableCell>{redemption.name}</TableCell>
                        <TableCell>{redemption.cost}</TableCell>
                        <TableCell>
                          {"$"}
                          {redemption.redeemed}
                        </TableCell>
                        <TableCell>
                          {moment(redemption.updatedAt).format(
                            "MM/DD/YYYY, h:mm:ss A"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              redemption.status === "Pending"
                                ? "outline"
                                : redemption.status === "Accepted"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {redemption.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {redemption?.status === "Pending" && (
                            <>
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  handleRedemptionAction(
                                    redemption?._id,
                                    redemption.user._id,
                                    redemption.walletAddress,
                                    true
                                  )
                                }
                                className="text-green-500 hover:text-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  handleRedemptionAction(
                                    redemption?._id,
                                    redemption.user._id,
                                    redemption.walletAddress,
                                    false
                                  )
                                }
                                className="text-red-500 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        {t("No data available")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
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

      {/* add and edit reward model  */}
      <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
        <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold  text-purple-400">
              {isEditMode ? t("Edit Reward") : t("Add Reward")}
            </DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">{t("Name")}</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white ${
                    touched.name && errors.name
                      ? "border-red-500"
                      : "border-purple-500"
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-600">
                    {errors.name as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">
                  {t("Cost")} ({t("Credits")})
                </Label>
                <Input
                  id="cost"
                  type="number"
                  value={values.cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white ${
                    touched.cost && errors.cost
                      ? "border-red-500"
                      : "border-purple-500"
                  }`}
                />
                {touched.cost && errors.cost && (
                  <p className="text-sm text-red-600">
                    {errors.cost as string}
                  </p>
                )}
              </div>
              {/* TODO: Redeemed input add here */}
              <div className="space-y-2">
                <Label htmlFor="redeemed">
                  {t("Redeemed")} ({t("Credits")})
                </Label>
                <Input
                  id="redeemed"
                  type="number"
                  value={values.redeemed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white ${
                    touched.redeemed && errors.redeemed
                      ? "border-red-500"
                      : "border-purple-500"
                  }`}
                />
                {touched.redeemed && errors.redeemed && (
                  <p className="text-sm text-red-600">
                    {errors.redeemed as string}
                  </p>
                )}
              </div>
              {/* TODO: Redeemed input add here */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircleLoader /> : t("Save Changes")}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminRewardContent;
