import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import axios from "axios";
import { useTranslation } from "@/app/context/TranslationProvider";
import moment from "moment";
import Loader from "../../Loaders/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";

interface User {
  username: string;
}

interface ActivityTypes {
  _id: string;
  activityname: string;
  createdAt: string;
  amount: number;
  result: number;
  user: User;
}

const AdminActivityTabContent = () => {
  const { t } = useTranslation();

  const [activities, setActivities] = useState<ActivityTypes[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/activities?page=${activePage}`);
      setActivities(res.data.activities);
      setTotalPages(res.data.pagination.totalPages);
      setActivePage(res.data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
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

  return (
    <>
      {isLoading ? (
        <Loader height={"80vh"} />
      ) : (
        <Card className="bg-gray-800 bg-opacity-50 border-purple-500 border rounded-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-purple-400">
              {t("Activity Log")}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                        {t("type")}
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Amount")}
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Result")}
                      </TableHead>
                      <TableHead className="text-purple-400">
                        {t("Date")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities?.map((activity, index) => (
                      <TableRow key={activity._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{activity.user.username}</TableCell>
                        <TableCell>{activity.activityname}</TableCell>
                        <TableCell>
                          {activity.activityname === "Buy" ? (
                            <>$ {activity.amount} </>
                          ) : activity.activityname === "Spin" ? (
                            <>{activity.amount} ticket</>
                          ) : activity.activityname === "Exchange" ? (
                            <>{activity.amount} credits</>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            activity?.activityname === "Exchange"
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        >
                          {activity.activityname === "Buy" ? (
                            <>+ {activity.result} tickets</>
                          ) : activity.activityname === "Spin" ? (
                            <>+ {activity.result} credits</>
                          ) : activity.activityname === "Exchange" ? (
                            <>- ${activity.result}</>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell>
                          {moment(activity.createdAt).format(
                            "MM/DD/YYYY, h:mm:ss A"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
      )}
    </>
  );
};

export default AdminActivityTabContent;
