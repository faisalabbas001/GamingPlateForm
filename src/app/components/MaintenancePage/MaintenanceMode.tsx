"use client"
import React, { useEffect, useState } from "react";

const MaintenanceMode = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Set maintenance end time to 24 hours from load

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Maintenance has ended. Please refresh the page.");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Under Maintenance
        </h1>
        <p className="text-lg mb-8 text-gray-300">
          We&apos;re currently performing scheduled maintenance. The site will
          be back online soon.
        </p>
        <div className="text-xl font-semibold bg-gray-700 text-purple-200 px-4 py-2 rounded-lg">
          Time Remaining: {timeLeft}
        </div>
      </div>
    </>
  );
};

export default MaintenanceMode;
