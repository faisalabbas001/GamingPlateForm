"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Gamepad2, Gift, Zap, Star, Users, TrendingUp } from "lucide-react";
import { Button } from "./components/ui/button";
import { useTranslation } from "./context/TranslationProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//TODO: According
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  // const { maintenanceMode } = useMaintenance();
  const { data: session } = useSession();
  const [rotationAngle, setRotationAngle] = useState(0);
  // const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 30) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  //TODO: According
  // const faqs = [
  //   {
  //     question: t('faqQuestion1'),
  //     answer: t('faqAnswer1'),
  //   },
  //   {
  //     question: t('faqQuestion2'),
  //     answer: t('faqAnswer2'),
  //   },
  //   {
  //     question: t('faqQuestion3'),
  //     answer: t('faqAnswer3'),
  //   },
  //   {
  //     question: t('faqQuestion4'),
  //     answer: t('faqAnswer4'),
  //   },
  //   {
  //     question: t('faqQuestion5'),
  //     answer: t('faqAnswer5'),
  //   },
  // ]

  const navigationToDashboard = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };
  return (
    <>
      <main className="container mx-auto px-4 py-8 md:py-16">
        <section className="text-center mb-12 md:mb-16">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base md:text-lg px-6 py-3 md:px-8 md:py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigationToDashboard()}
            >
              {t("playNow")}
            </Button>
          </motion.div>
        </section>

        <section className="mb-12 md:mb-20 relative">
          <Card className="bg-gray-800 border-purple-500 overflow-hidden">
            <CardHeader className="relative z-10">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-purple-600 rounded-full opacity-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                animate={{ rotate: rotationAngle }}
                transition={{ duration: 1, ease: "linear" }}
              >
                <Zap className="h-16 w-16 md:h-20 md:w-20 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <CardTitle className="text-2xl md:text-4xl text-center text-purple-400">
                {t("wheelOfFortune")}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-gray-300 text-center text-base md:text-lg mb-6">
                {t("wheelDescription")}
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                <Badge
                  variant="secondary"
                  className="text-yellow-400 bg-yellow-400 bg-opacity-20 px-3 py-1 md:px-4 md:py-2"
                >
                  <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {t("instantWinnings")}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-green-400 bg-green-400 bg-opacity-20 px-3 py-1 md:px-4 md:py-2"
                >
                  <Gift className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {t("bigPrizes")}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-blue-400 bg-blue-400 bg-opacity-20 px-3 py-1 md:px-4 md:py-2"
                >
                  <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {t("easyToPlay")}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="justify-center relative z-10">
              <Button
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => navigationToDashboard()}
              >
                {t("spinTheWheel")}
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center text-purple-400">
            {t("whyChooseUs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-gray-800 border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <Zap className="h-10 w-10 md:h-12 md:w-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle className="text-lg md:text-xl text-center text-purple-300">
                  {t("instantWinnings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm md:text-base">
                  {t("instantWinningsDesc")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <Users className="h-10 w-10 md:h-12 md:w-12 text-green-400 mx-auto mb-4" />
                <CardTitle className="text-lg md:text-xl text-center text-purple-300">
                  {t("activeCommunity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm md:text-base">
                  {t("activeCommunityDesc")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-purple-500 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-lg md:text-xl text-center text-purple-300">
                  {t("constantImprovements")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm md:text-base">
                  {t("constantImprovementsDesc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* //TODO: According */}
        {/* <section className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-center text-purple-400">{t('frequentlyAskedQuestions')}</h2>
          <Card className="bg-gray-800 border-purple-500">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-purple-300 hover:text-purple-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section> */}
        {session ? (
          ""
        ) : (
          <section className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-purple-400">
              {t("readyToTry")}
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto">
              {t("readyToTryDesc")}
            </p>

            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base md:text-lg px-6 py-3 md:px-8 md:py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push("/register")}
            >
              {t("createFreeAccount")}
            </Button>
          </section>
        )}
      </main>
    </>
  );
}
