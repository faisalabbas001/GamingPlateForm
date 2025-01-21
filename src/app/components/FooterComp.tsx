"use client"
import Link from "next/link";
import React from "react";
import { useTranslation } from "../context/TranslationProvider";

const FooterComp = () => {
  const { t } = useTranslation();
  return (
    <>
      <footer className="mt-12 md:mt-16 py-6 border-t border-purple-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm md:text-base">
            &copy; 2024 GamingPlatform. {t("allRightsReserved")}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/terms"
              className="text-sm md:text-base hover:text-purple-400 transition-colors"
            >
              {t("termsOfService")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm md:text-base hover:text-purple-400 transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/contact"
              className="text-sm md:text-base hover:text-purple-400 transition-colors"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterComp;
