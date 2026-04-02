"use client"

import "./globals.css";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { SnackbarProvider } from 'notistack';
import { PersistGate } from "redux-persist/lib/integration/react";
import { StyledEngineProvider } from "@mui/material";
import HeaderComp from "@/component/header-comp/header-comp";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <HeaderComp />
                {children}
              </SnackbarProvider>
            </PersistGate>
          </Provider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
