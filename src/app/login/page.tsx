// app/login/page.tsx
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
import {  Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "../context/TranslationProvider";
import { Bounce, toast } from "react-toastify";
// import { stat } from 'fs'
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  

  useEffect(() => {
    if (session) {
      return router.push("/");
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (result?.error) {
      setLoginError(result.error);
      if (result.error === "User not found") {
        toast.error("User not found!", {
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
      router.push("/dashboard");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "/dashboard",
    });
    if (result?.error) {
      console.error("Login failed", result.error);
    } else {
      router.push(result?.url || "/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[74vh] p-4">
      {/* <Link href="/" className="flex items-center justify-center mb-8">
        <Gamepad2 className="h-8 w-8 text-purple-400" />
        <span className="ml-2 text-2xl md:text-3xl font-bold text-purple-400">
          GamingPlatform
        </span>
      </Link> */}
      <Card className="w-full max-w-md bg-gray-800 border-purple-500 border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            {t("Login")}
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {t("Enter your credentials to start playing")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-200"
              >
                {t("Username")}
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
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
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
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <Button
              type="submit"
              className="w-full rounded-[4px] hover:bg-purple-800 bg-[#9333EA]"
            >
              {t("Login")}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-purple-500 rounded-[4px] text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              <FaGoogle className="mr-2" />
              {status === "loading" ? (
                <>
                  {t("Continue")}
                  {"..."}
                </>
              ) : (
                <>{t("Continue with Google")}</>
              )}
            </Button>
          </div>
          {/* <div className="mt-2 text-center text-sm -mb-3">
            <p
              onClick={() => alert(t("Are you sure you forget your password?"))}
              className=" w-fit mx-auto text-gray-300  hover:text-white cursor-pointer transition-all duration-300"
            >
              {t("I forgot my password")}
            </p>
          </div> */}
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {/* <p className="text-xs text-gray-400 text-center w-full mb-2">
            {t(
              `For this demo, use "demo" as the user and "password" as password.`
            )}{" "}
          </p> */}
          <p className="text-sm text-gray-300">
            {t("Don't have an account?")}{" "}
            <Link href="/register" className="text-purple-400 hover:underline">
              {t("Register here")}
            </Link>
          </p>
          <p className="text-sm mt-2 text-gray-300"  >
           
            <Link href="/forgetpassword" className="text-purple-400 hover:underline">
              {t("Forgot your password?")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
