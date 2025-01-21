import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react"; // Close icon
import { Bounce, toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import axios from "axios";
import { useState } from "react";
import CircleLoader from "@/app/components/Loaders/CircleLoader";

interface PasswordUpdateModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // console.log("values.password", values.password);
        const response = await axios.put("/api/change-password", {
          userId,
          password: values.password,
        });
        // console.log("response", response);
        if(response){
          toast.success("Password updated successfully!", {
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
          onClose();
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong! Please try again.", {
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
      } finally {
        setIsLoading(false);
      }
    },
  });
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-800 bg-opacity-90 border-purple-500 border rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center text-purple-400">
            Update Your Password
          </CardTitle>
          <Button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-700 mt-2 bg-opacity-50 text-white border-purple-500 rounded-xl"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter your Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-700 mt-2 bg-opacity-50 text-white border-purple-500 rounded-xl"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <CircleLoader /> : "Confirm Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PasswordUpdateModal;
