"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/forget-password", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[74vh] p-4">
      <Card className="w-full max-w-md bg-gray-800 border-purple-500 border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            {t("Recover Password")}
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            {t("Enter your email to reset your password")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">
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

            <Button
              type="submit"
              disabled={loading}
              className={`w-full font-bold rounded-[4px] bg-[#9333EA] hover:bg-purple-800 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? t("Sending...") : t("Send Recovery Instructions")}
            </Button>

            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <p className="text-md font-medium text-center mt-2 text-gray-300">
              <Link href="/login" className="text-purple-400 hover:underline">
                {t("Back To Login")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
