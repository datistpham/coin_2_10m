import React, { Suspense } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "../src/theme/Theme";
import createEmotionCache from "../src/createEmotionCache";
import { Provider } from "react-redux";
import Store from "../src/store/Store";
import RTL from "./../src/layouts/full/shared/customizer/RTL";
import { useSelector } from "../src/store/Store";
import { AppState } from "../src/store/Store";
import BlankLayout from "../src/layouts/blank/BlankLayout";
import FullLayout from "../src/layouts/full/FullLayout";
import "../styles/globals.css"

import "../src/_mockApis";

// CSS FILES
import "react-quill/dist/quill.snow.css";
import "./forms/form-quill/Quill.css";
import "./apps/calendar/Calendar.css";
import "../src/components/landingpage/testimonial/testimonial.css";
import "../src/components/landingpage/demo-slider/demo-slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SnackbarProvider } from "notistack";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider2 from "../src/contexts/JWTContext"
import store2 from "../src/redux/dashboard/account/store";
import { socket as SocketWeb, SocketContext as SocketContextWeb } from "../src/contexts/socketWeb";
import { socket, SocketContext } from '../src/contexts/socket'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  }: any = props;
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;

  return (
    <SnackbarProvider preventDuplicate autoHideDuration={3000} maxSnack={3} >
      <HelmetProvider>
        <AuthProvider2>
          {/* <Provider store={store2}> */}
            <CacheProvider value={emotionCache}>
              <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>Modernize NextJs Admin template</title>
              </Head>
              <SocketContextWeb.Provider value={SocketWeb}>
                <ThemeProvider theme={theme}>
                    <RTL direction={customizer.activeDir}>
                      <CssBaseline />
                      <Layout>
                        {/* <Provider store={store2}> */}
                          <Component {...pageProps} />
                        {/* </Provider> */}
                      </Layout>
                    </RTL>
                </ThemeProvider>
              </SocketContextWeb.Provider>
            </CacheProvider>
        </AuthProvider2>
      </HelmetProvider>
    </SnackbarProvider>
  );
};

export default (props: MyAppProps) => (
  <Provider store={Store}>
    <MyApp {...props} />
  </Provider>
);
