"use client"
import FAQManager from '@/app/components/admin/FAQManager'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

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
    <FAQManager/>
    </>
  )
}

export default Page
