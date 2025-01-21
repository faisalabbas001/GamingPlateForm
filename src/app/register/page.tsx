// app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { Gamepad2, Eye, EyeOff } from "lucide-react";

import { useTranslation } from "../context/TranslationProvider";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { Bounce, toast } from "react-toastify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const router = useRouter();
  const { t } = useTranslation();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      return router.push("/");
    }
  }, [session]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("/api/register", {
        email,
        username,
        password,
        role: "user",
        referralCode,
      });
      if (response.status === 201) {
        // console.log("Registration successful:", response.data);
        toast.success("Registration successful", {
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
        router.push("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error);
        if (error.response?.data.message === "Invalid referral code") {
          toast.error("Invalid referral code", {
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
          toast.error("Registration failed. Please try again.", {
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
      } else {
        console.error("An unexpected error occurred:", error);
      }

      // setRegisterError("Registration failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleSignIn = async () => {
    // const result =
    await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
    // console.log(result);
    // signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[74vh] p-4">
      <Link href="/" className="flex items-center justify-center mb-8">
        <Gamepad2 className="h-8 w-8 text-purple-400" />
        <span className="ml-2 text-2xl md:text-3xl font-bold text-purple-400">
          GamingPlatform
        </span>
      </Link>
      <Card className="w-full max-w-md bg-gray-800 border-purple-500 border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            {t("Create Account")}
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {t("Sign up to start playing and win")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-200"
              >
                {t("User Name")}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t("Enter your username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white rounded-[4px] border-purple-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                {t("Email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("Enter your email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white rounded-[4px] border-purple-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm rounded-[4px] font-medium text-gray-200"
              >
                {t("Password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("Enter your password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 text-white rounded-[4px] border-purple-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 rounded-[4px] flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-200"
              >
                {t("Confirm Password")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("Confirm your password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-700 rounded-[4px] text-white border-purple-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 rounded-[4px] flex items-center text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="referralCode"
                className="text-sm font-medium text-gray-200"
              >
                {t("Referral Code (Optional)")}
              </Label>
              <Input
                id="referralCode"
                type="text"
                placeholder={t("Enter referral code")}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="bg-gray-700 text-white rounded-[4px] border-purple-500"
              />
            </div>

            {registerError && (
              <p className="text-red-500 text-sm">{registerError}</p>
            )}
            <Button
              type="submit"
              className="w-full rounded-[4px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105"
            >
              {t("register")}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full border-purple-500 rounded-[4px] text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              <FaGoogle className="mr-2" />
              {t("Sign up with Google")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-300">
            {t("Do you already have an account?")}{" "}
            <Link href="/login" className="text-purple-400 hover:underline">
              {t("Log in here")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
