"use client";
import NotificationsAndSupportManager from "@/app/components/admin/NotificationsAndSupportManager";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.role === "user") {
      return router.push("/dashboard");
    }
  }, [session]);
  return (
    <>
      <NotificationsAndSupportManager />
    </>
  );
};

export default Page;
