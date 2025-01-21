"use client";
import { useEffect, useState } from "react";
// import AppDashboard3 from "../components/dashboardComponents/dashboards/AppDashboard3";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loaders/Loader";
import dynamic from "next/dynamic";


const AppDashboard3 = dynamic(() => import("../components/dashboardComponents/dashboards/AppDashboard3"), {
  loading: () => <Loader height="80vh" />,
  ssr: false,
});

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      if (session?.user.role === "admin") {
        return router.push('/admin');
      }

      setIsLoading(false);
    };

    initializeAdmin();

  }, [session , router]);
  if (isLoading) {
    return <Loader height={"80vh"} />;
  }

  return (
    <>
      <AppDashboard3 />
    </>
  );
};

export default Page;
