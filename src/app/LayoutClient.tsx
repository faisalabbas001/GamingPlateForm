"use client";
import React, { useEffect, useState } from 'react'
import ContextProvider from './context';
import { TranslationProvider } from './context/TranslationProvider';
import ClientSessionProvider from './components/ClientSessionProvider';
import NavbarCom from './components/NavbarCom';
import FooterComp from './components/FooterComp';
import { ToastContainer } from 'react-toastify';

const LayoutClient = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [cookies, setCookies] = useState<string | null>(null);

  useEffect(() => {
    setCookies(document.cookie);
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  

  return (
    isClient ? <ContextProvider cookies={cookies}>
        <TranslationProvider>
          <ClientSessionProvider>
            {/* <MaintenanceProvider> */}
              <NavbarCom />
              {children}
        
              <FooterComp />
            {/* </MaintenanceProvider> */}
          </ClientSessionProvider>
        </TranslationProvider>
        <ToastContainer />
        </ContextProvider>: <p>loadding</p>
   
  )
}

export default LayoutClient

