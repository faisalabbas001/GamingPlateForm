"use client"
import React, { useEffect, useState ,useCallback} from "react";
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
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Bounce, toast } from "react-toastify";
import Swal from "sweetalert2";
import Loader from "../../Loaders/Loader";
import moment from "moment";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface UserType {
  _id: string;
  username: string;
  email: string;
  tickets: number;
  credits: number;
  level: string;
  isActive: boolean;
  createdAt:number;
  redeemedRewards:number
}
// interface RewardsType {
//   _id: string;
//   name: string;
//   cost: number;
// }

// Define the User type based on the structure of your `apiUsers` data
// type User = {
//   id: number; // Example property; adjust to match your data
//   name: string; // Example property
//   age: number; // Example property
//   // Add other properties as needed
// };


type SortKey = keyof UserType | null;

type SortConfig = {
  key: SortKey;
  direction: string;
};
  
const AdminUserContent = () => {
  const { t } = useTranslation();
  //  const [apiRewards, setApiRewards] = useState<RewardsType[] | null>([]);
  const [apiUsers, setApiUsers] = useState<UserType[] | null>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
// const [redeemedRewards, setRedeemedRewards] = useState(0);
  // const [loading, setLoading] = useState(false);


  console.log("check ing the user for the following",apiUsers)
  // const userId="67505851a75d81414893d1bf"
  // const getAllRewards = async () => {
    
  //   try {
  //     const res = await axios.get("/api/reward");
  //     setApiRewards(res.data);
  //   } catch (error) {
  //     console.error("error", error);
  //   } finally {
     
  //   }
  // };

//  useEffect(() => {
//     getAllRewards();
//   }, []);

 
  // useEffect(() => {
  //   // Fetch total redeemed rewards
  //   const fetchRedeemedRewards = async () => {
  //     try {
  //       const response = await axios.get(`/api/reward/total?userId=${userId}`);
  //       setRedeemedRewards(response.data.totalRedeemed);
  //       setLoading(false);
  //     } catch (err) {
     
  //       setLoading(false);
  //     }
  //   };

  //   fetchRedeemedRewards();
  // }, [userId]);

  console.log("checing th admin side for the totalrewards ")

  const getAllUsers = useCallback(async () => {
    try {
      const response = await axios.get(`/api/users?page=${activePage}`);
      // console.log("checking the data",response)
      if (response) {
        setApiUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setActivePage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.error("error", error);
    }
  }, [activePage]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      await getAllUsers();
      setIsLoading(false);
    };

    fetchUsers();
  }, [activePage,getAllUsers]);


  

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm) {
      try {
        const response = await axios.get(`/api/users?query=${searchTerm}&page=${activePage}`);
        setApiUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setActivePage(response.data.pagination.currentPage);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      getAllUsers();
    }
  }, [activePage, getAllUsers]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, activePage,handleSearch]);

  const handleUserToggleActive = async (userId: string, active: boolean) => {
    try {
      const res = await axios.put(`/api/users?id=${userId}`, {
        isActive: !active,
      });
      if (res) {
        toast.success("Status Updated Successfully", {
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
        getAllUsers();
      }
    } catch (error) {
      toast.error("Please Try Again", {
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
      console.error("error", error);
    }
  };


  const handleUserDelete = async (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.put(`/api/users?deleteId=${userId}`);
          if (res) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
            });

            getAllUsers();
          }
        } catch (error) {
          console.error("Error during deletion:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete user. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleUserEdit = (user: UserType) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const validationSchema = Yup.object({
    username: Yup.string().required(t("Username is required")),
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    tickets: Yup.number()
      .min(0, t("Tickets must be non-negative"))
      .required(t("Tickets are required")),
    credits: Yup.number()
      .min(0, t("Credits must be non-negative"))
      .required(t("Credits are required")),
    level: Yup.string().required(t("Level is required")),
  });

  const editModelInitialValues = {
    _id: selectedUser?._id || "",
    username: selectedUser?.username || "",
    email: selectedUser?.email || "",
    tickets: selectedUser?.tickets || 0,
    credits: selectedUser?.credits || 0,
    level: selectedUser?.level || "",
    isActive: selectedUser?.isActive || false,
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: editModelInitialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.put(`/api/users?id=${values._id}`, values);
        if (res) {
          getAllUsers();
          setSelectedUser(null);
          setIsUserDialogOpen(false);
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
        resetForm();
      } catch (error) {
        console.error("error", error);
      }
    },
  });

  const resetFormWithUserData = useCallback(() => {
    setValues({
      _id: selectedUser?._id || "",
      username: selectedUser?.username || "",
      email: selectedUser?.email || "",
      tickets: selectedUser?.tickets || 0,
      credits: selectedUser?.credits || 0,
      level: selectedUser?.level || "",
      isActive: selectedUser?.isActive || false,
    });
  }, [selectedUser,setValues]);

  useEffect(() => {
    resetFormWithUserData();
  }, [resetFormWithUserData]);

  
  useEffect(() => {
    if (isUserDialogOpen) {
      resetFormWithUserData();
    }
  }, [selectedUser, isUserDialogOpen,resetFormWithUserData]);

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


  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: SortKey) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedUsers = [...(apiUsers || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;
  
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
    }
    return null;
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
                {t("User Management")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <Input
                  placeholder={`${t("Search users")}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 rounded-[8px] bg-gray-700 bg-opacity-50 text-white border-purple-500"
                />
                {/* <Button className="w-full md:w-auto rounded-[8px] bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Usuario
                  </Button> */}
              </div>
              <div className="overflow-x-auto">  
      <ScrollArea className="h-full w-full rounded-xl border">  
        <Table>  
        <TableHeader>
  <TableRow>
    <TableHead className="text-purple-400">ID</TableHead>
    <TableHead className="text-purple-400" onClick={() => handleSort('username')}>
    <span className="flex items-center gap-2">
        {t("Users")} {getSortIcon('username')}
      </span>
    </TableHead>
    <TableHead className="text-purple-400 hidden md:table-cell" onClick={() => handleSort('email')}>
     
      <span className="flex items-center gap-2">
      Email {getSortIcon('email')}
      </span>
    </TableHead>
    <TableHead className="text-purple-400" onClick={() => handleSort('tickets')}>
    <span className="flex items-center gap-2">
    Tickets {getSortIcon('tickets')}
      </span>
    
    </TableHead>
    <TableHead className="text-purple-400" onClick={() => handleSort('credits')}>
    <span className="flex items-center gap-2">
    {t("Total Credits")} {getSortIcon('credits')}
      </span>
     
    </TableHead>
    <TableHead className="text-purple-400" onClick={() => handleSort('redeemedRewards')}>
    <span className="flex items-center gap-2">
    {t("Redeemed Prizes")} {getSortIcon('redeemedRewards')}
      </span>
   
    </TableHead>
    <TableHead className="text-purple-400" onClick={() => handleSort('createdAt')}>
    <span className="flex items-center gap-2">
    {t("Registration Date")} {getSortIcon('createdAt')}
      </span>
   
    </TableHead>
    <TableHead className="text-purple-400" onClick={() => handleSort('isActive')}>
    <span className="flex items-center gap-2">
    {t("Status")} {getSortIcon('isActive')}
      </span>
     
    </TableHead>
    <TableHead className="text-purple-400">{t("Actions")}</TableHead>
  </TableRow>
</TableHeader>
  
          <TableBody>  
            {sortedUsers && sortedUsers.length > 0 ? (  
              sortedUsers.map((user, index) => (  
                <TableRow key={user._id}>  
                  <TableCell className="font-medium">{index + 1}</TableCell>  
                  <TableCell>{user.username}</TableCell>  
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>  
                  <TableCell>{user.tickets}</TableCell>  
                  <TableCell>{user.credits}</TableCell>  
                  <TableCell>{user?.redeemedRewards}</TableCell>  
                  <TableCell>{moment(user.createdAt).format("YYYY-MM-DD")}</TableCell>  
                  <TableCell>  
                    <Switch  
                      checked={user.isActive}  
                      onCheckedChange={() =>  
                        handleUserToggleActive(user._id, user.isActive)  
                      }  
                      className="bg-gray-600 data-[state=checked]:bg-green-500"  
                    />  
                  </TableCell>  
                  <TableCell>  
                    <div className="flex space-x-2">  
                      <Button variant="ghost" onClick={() => handleUserEdit(user)}>  
                        <Edit className="w-4 h-4" />  
                      </Button>  
                      <Button variant="ghost" onClick={() => handleUserDelete(user._id)}>  
                        <Trash2 className="w-4 h-4" />  
                      </Button>  
                    </div>  
                  </TableCell>  
                </TableRow>  
              ))  
            ) : (  
              <TableRow>  
                <TableCell colSpan={8} className="text-center text-lg font-semibold">  
                  No data available  
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

          {/* edit user model  */}
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogContent className="bg-gray-800 bg-opacity-90 text-white border border-purple-500 rounded-xl backdrop-blur-md max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-bold text-purple-400">
                  Editar Usuario
                </DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input
                      id="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500 ${
                        touched.username && errors.username
                          ? "border-red-500"
                          : "border-purple-500"
                      }`}
                    />
                    {touched.username && errors.username && (
                      <p className="text-sm text-red-600">
                        {errors.username as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500 ${
                        touched.email && errors.email
                          ? "border-red-500"
                          : "border-purple-500"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tickets">Tickets</Label>
                    <Input
                      id="tickets"
                      type="number"
                      value={values.tickets}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500 ${
                        touched.tickets && errors.tickets
                          ? "border-red-500"
                          : "border-purple-500"
                      }`}
                    />
                    {touched.tickets && errors.tickets && (
                      <p className="text-sm text-red-600">
                        {errors.tickets as number | string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Créditos</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={values.credits}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500 ${
                        touched.credits && errors.credits
                          ? "border-red-500"
                          : "border-purple-500"
                      }`}
                    />
                    {touched.credits && errors.credits && (
                      <p className="text-sm text-red-600">
                        {errors.credits as number | string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select
                      value={values.level}
                      onValueChange={(value) => setFieldValue("level", value)}
                    >
                      <SelectTrigger className="bg-gray-700 rounded-[7px] bg-opacity-50 text-white border-purple-500">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Bronce", "Plata", "Oro", "Platino", "Diamante"].map(
                          (level) => (
                            <SelectItem
                              className=" cursor-pointer"
                              key={level}
                              value={level}
                            >
                              {level}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    {touched.level && errors.level ? (
                      <div className="text-red-500">
                        {errors.level as string}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="isActive">Activo</Label>
                    <Switch
                      id="isActive"
                      checked={values.isActive}
                      onCheckedChange={(checked) =>
                        setFieldValue("isActive", checked)
                      }
                      className="bg-gray-600 data-[state=checked]:bg-green-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 rounded-[8px] hover:bg-purple-700"
                  >
                    Guardar Cambios
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default AdminUserContent;
