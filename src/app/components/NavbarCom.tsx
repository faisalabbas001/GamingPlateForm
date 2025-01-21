"use client";
import {
  Gamepad2,
  Globe,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Language, useTranslation } from "../context/TranslationProvider";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const NavbarCom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, currentLanguage, setLanguage } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { data: session } = useSession();

  // const userRole = session?.user?.role;

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsLanguageMenuOpen(false); // Close the menu after selection
  };

  const handleLogout = async () => {
    try {
      const logout = await signOut({ redirect: false });
      if (logout) {
        router.push("/login");
      }
    } catch (error) {
      console.error("error", error);
    }
    signOut({ redirect: false });
  };

  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     title: "Nuevo bono disponible",
  //     message: "¡Has desbloqueado un bono de 100 créditos!",
  //     read: false,
  //     timestamp: "2024-03-15 10:30",
  //     type: "bonus",
  //   },
  //   {
  //     id: 2,
  //     title: "Giro gratis listo",
  //     message: "Tu giro diario gratis está disponible. ¡No olvides usarlo!",
  //     read: true,
  //     timestamp: "2024-03-14 15:45",
  //     type: "freeSpins",
  //   },
  //   {
  //     id: 3,
  //     title: "Nuevo nivel alcanzado",
  //     message:
  //       "¡Felicidades! Has alcanzado el nivel Plata. Disfruta de tus nuevos beneficios.",
  //     read: false,
  //     timestamp: "2024-03-13 20:15",
  //     type: "levelUp",
  //   },
  //   {
  //     id: 4,
  //     title: "Gran victoria",
  //     message:
  //       "¡Enhorabuena! Has ganado 1000 créditos en la Ruleta de la Fortuna.",
  //     read: false,
  //     timestamp: "2024-03-12 18:30",
  //     type: "bigWin",
  //   },
  //   {
  //     id: 5,
  //     title: "Actualización de la plataforma",
  //     message:
  //       "Hemos realizado mejoras en la seguridad y rendimiento de la plataforma.",
  //     read: true,
  //     timestamp: "2024-03-11 09:00",
  //     type: "update",
  //   },
  // ]);

  // const markNotificationAsRead = (id: number) => {
  //   setNotifications(
  //     notifications.map((notif) =>
  //       notif.id === id ? { ...notif, read: true } : notif
  //     )
  //   );
  // };

  // const markAllNotificationsAsRead = () => {
  //   setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  // };

  // const getNotificationIcon = (type: string) => {
  //   switch (type) {
  //     case "bonus":
  //       return <Gift className="h-6 w-6 text-yellow-400" />;
  //     case "freeSpins":
  //       return <Zap className="h-6 w-6 text-blue-400" />;
  //     case "levelUp":
  //       return <Trophy className="h-6 w-6 text-green-400" />;
  //     case "bigWin":
  //       return <Zap className="h-6 w-6 text-pink-400" />;
  //     case "update":
  //       return <Info className="h-6 w-6 text-purple-400" />;
  //     default:
  //       return <Bell className="h-6 w-6 text-gray-400" />;
  //   }
  // };

  // const unreadNotifications = notifications.filter((n) => !n.read).length;

  // useEffect(() => {
  //   if (unreadNotifications > 0) {
  //     document.title = `(${unreadNotifications}) GamingPlatform - Nuevas notificaciones`;
  //   } else {
  //     document.title = "GamingPlatform";
  //   }
  // }, [unreadNotifications]);

  return (
    <>
      <header className="px-4 lg:px-6 h-16 relative z-40 flex items-center justify-between border-b border-purple-800">
        <Link href="/" className="flex items-center justify-center">
          <Gamepad2 className="h-8 w-8 text-purple-400" />
          <span className="ml-2 text-xl md:text-3xl font-bold text-purple-400">
            {pathname.startsWith("/admin") ? "Admin Panel" : "GamingPlatform"}
          </span>
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden md:block">
            <Button
              variant="ghost"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="text-xs font-medium hover:text-purple-400 transition-colors px-2 py-1 bg-white bg-opacity-10 backdrop-blur-sm rounded-full"
            >
              <Globe className="w-3 h-3 mr-1" />
              {currentLanguage.toUpperCase()}
            </Button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white bg-opacity-10 backdrop-blur-md ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="block px-4 py-2 text-sm text-white hover:bg-purple-600 hover:text-white w-full text-left"
                    role="menuitem"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("es")}
                    className="block px-4 py-2 text-sm text-white hover:bg-purple-600 hover:text-white w-full text-left"
                    role="menuitem"
                  >
                    Español
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* <div>
            <DropdownMenu onOpenChange={setIsNotificationOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:text-purple-600 bg-gray-800 bg-opacity-50 hover:bg-opacity-100 transition-colors p-2 rounded hover:bg-white"
                >
                  <Bell className="h-6 w-6 md:h-8 md:w-8 " />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center animate-pulse bg-red-500 text-white">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 md:w-96">
                <Card className="border-0 shadow-none bg-gray-800 bg-opacity-95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-center text-purple-400">
                      Notificaciones
                    </CardTitle>
                    <CardDescription className="text-center text-gray-300 text-base">
                      Tienes {unreadNotifications} notificaciones sin leer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-[4px] border border-gray-700 p-4">
                      {notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={`mb-4 p-3 rounded-[6px] ${
                            notif.read ? "bg-gray-700" : "bg-purple-700"
                          } bg-opacity-80 transition-colors duration-200`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg text-white">
                                  {notif.title}
                                </h3>
                                <Badge
                                  variant={notif.read ? "secondary" : "default"}
                                  className="text-xs"
                                >
                                  {notif.read ? "Leído" : "Nuevo"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-300 mt-1">
                                {notif.message}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">
                                  {notif.timestamp}
                                </span>
                                {!notif.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      markNotificationAsRead(notif.id)
                                    }
                                    className="text-purple-400 hover:text-purple-300 text-xs"
                                  >
                                    Marcar como leído
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="text-purple-400 hover:text-purple-300 border-purple-500 text-sm
                     hover:bg-white bg-white rounded-[8px] font-medium"
                      onClick={markAllNotificationsAsRead}
                    >
                      Marcar todas como leídas
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="text-purple-400 hover:text-purple-300 border-purple-500 text-sm hover:bg-white bg-white rounded-[8px] font-medium"
                      onClick={() => alert("notifications")}
                    >
                      Ver todas
                    </Button>
                  </CardFooter>
                </Card>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
          <div className="hidden md:flex space-x-2">
            {session ? (
              <>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-sm font-medium hover:text-purple-400 transition-colors hover:bg-white px-3 py-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline"> {t("Sign Out")}</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="bg-purple-600 hover:bg-purple-700 text-white transition-colors rounded-full px-4 py-2 flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-colors rounded-full px-4 py-2 flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t("menu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-800 border border-purple-500"
            >
              <DropdownMenuItem onSelect={() => handleLanguageChange("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageChange("es")}>
                Español
              </DropdownMenuItem>

              {session ? (
                <DropdownMenuItem>
                  <div
                    onClick={handleLogout}
                    className="flex items-center w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("Sign Out")}
                  </div>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/login" className="flex items-center w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      {t("login")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register" className="flex items-center w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      {t("register")}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
    </>
  );
};

export default NavbarCom;
