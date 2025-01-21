"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useTranslation } from "../context/TranslationProvider";
import axios from "axios";
// interface QueryParams {
//     token?: string | string[];
//   }
  import { useSearchParams } from "next/navigation";
export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValue,setTokenValue] = useState("");
 
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    // Access query parameters using router.query
    setTokenValue(searchParams.get("token") || ""); 
  }, []); // Use this hook when router.query changes
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Call the reset-password API
      await axios.patch("/api/forget-password", {
        tokenValue,
        newPassword: password,
        confirmPassword,
      }, {
        headers: {
          'Content-Type': 'application/json', // Explicitly set the content type
        }
      });
      setMessage(t("Password reset successfully"));
      router.push("/login"); // Redirect to login after successful reset
    } catch (err: any) {
      setError(
        err.response?.data?.error || t("An error occurred. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[74vh] p-4">
      <Card className="w-full max-w-md bg-gray-800 border-purple-500 border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            {t("Reset Password")}
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {t("Enter and confirm your new password")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                {t("Password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("Enter your new password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-white rounded-[4px] border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                {t("Confirm Password")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("Confirm your new password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-700 text-white rounded-[4px] border-purple-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full font-bold rounded-[4px] bg-[#9333EA] hover:bg-purple-800 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? t("Submitting...") : t("Submit")}
            </Button>

            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
