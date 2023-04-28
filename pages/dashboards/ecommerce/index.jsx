import React from "react";
import { Box, Grid } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";

import WeeklyStats from "../../../src/components/dashboards/modern/WeeklyStats";
import YearlySales from "../../../src/components/dashboards/ecommerce/YearlySales";
import PaymentGateways from "../../../src/components/dashboards/ecommerce/PaymentGateways";
import WelcomeCard from "../../../src/components/dashboards/ecommerce/WelcomeCard";
import Payment from "../../../src/components/dashboards/ecommerce/Payment";
import SalesProfit from "../../../src/components/dashboards/ecommerce/SalesProfit";
import RevenueUpdates from "../../../src/components/dashboards/ecommerce/RevenueUpdates";
import SalesOverview from "../../../src/components/dashboards/ecommerce/SalesOverview";
import TotalEarning from "../../../src/components/dashboards/ecommerce/TotalEarning";
import ProductsSold from "../../../src/components/dashboards/ecommerce/ProductsSold";
import MonthlyEarnings from "../../../src/components/dashboards/ecommerce/MonthlyEarnings";
import ProductPerformances from "../../../src/components/dashboards/ecommerce/ProductPerformances";
import RecentTransactions from "../../../src/components/dashboards/ecommerce/RecentTransactions";
import Slider from "react-slick";
import CrmAward from "../../../src/views/dashboards/crm/CrmAward";
// ** MUI Imports

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Component Import
import CardStatisticsVertical from "src/@core/components/card-statistics/card-stats-vertical";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Demo Components Imports

import {
  CircularProgress,
  IconButton,
  useTheme,
  Card,
  CardContent,
  MenuItem,
  Button,
} from "@mui/material";
import Iconify from "src/component/Iconify";
import useLocales from "src/hooks2/useLocales";
import { useContext, useEffect, useState } from "react";
import useIsMountedRef from "src/hooks2/useIsMountedRef";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { getExchange } from "src/redux/dashboard/account/action";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import CalendarMonth from "src/views/dashboards/crm/CalendarMonth";
import WidgetTotalTarget from "src/views/dashboards/crm/WidgetTotalTarget";
import SettingDetails from "src/views/dashboards/crm/SettingDetails";
import { API_EXCHANGE, API_WALLET } from "src/apis";
import { FormProvider, RHFTextField } from "src/component/hook-form";
import { WalletDialog } from "src/sections/@dashboard/general/account";
import { SocketContext } from "../../../src/contexts/socket";
import WidgetStatic from "../../../src/views/dashboards/crm/WidgetStatic";

const Ecommerce = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const isMountedRef = useIsMountedRef();

  const socket = useContext(SocketContext);

  const { translate } = useLocales();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  const exchangeAccounts = useSelector(
    (state) => state.exchangeAccountsLogined
  );

  useEffect(() => {
    getExchangeAccount();
  }, []);

  useEffect(() => {
    if (exchangeAccounts && exchangeAccounts.length > 0) {
      setValue("linkAccountId", exchangeAccounts[0]._id);
      handleChangeAccount(null);
    }
  }, [exchangeAccounts]);

  const defaultValues = {
    linkAccountId:
      exchangeAccounts && exchangeAccounts.length > 0
        ? exchangeAccounts[0]._id
        : "",
    accountType: "LIVE",
  };

  const CreateSettingSchema = Yup.object().shape({
    linkAccountId: Yup.string().required(
      translate("please_choose_a_trading_account")
    ),
    accountType: Yup.string().required(
      translate("Vui lòng chọn loại tài khoản")
    ),
  });

  const methods = useForm({
    resolver: yupResolver(CreateSettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [balance, setBalance] = useState({
    demo: 0,
    real: 0,
  });

  useEffect(() => {
    handleChangeAccount(null);
  }, []);

  const [linkAccountId, setLinkAccountId] = useState();

  const [isLoading, setLoading] = useState(false);

  const handleChangeAccount = useCallback(
    async (e) => {
      setLoading(true);
      try {
        const linkAccountId =
          e === null ? getValues("linkAccountId") : e.target.value;
        if (linkAccountId) {
          setLinkAccountId(linkAccountId);
          showStaticLinkAccount(linkAccountId);
          setValue("linkAccountId", linkAccountId);
          const response = await API_WALLET.getBalance(linkAccountId);
          if (isMountedRef.current) {
            if (response.data.ok && response.data.d) {
              setBalance({
                demo: response.data.d.demoBalance,
                real: response.data.d.availableBalance,
              });

              return;
            }
            if (!response.data.ok) {
              setBalance({
                demo: 0,
                real: 0,
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [isMountedRef]
  );

  const handleUpdateBotHistory = (data) => {
    try {
      data.botData =
        typeof data.botData === "string"
          ? JSON.parse(data.botData)
          : data.botData;
      if (
        data.botData.linkAccountId.toString() === getValues("linkAccountId")
      ) {
        handleChangeAccount(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateHistoryTrading = (data) => {
    try {
      if (data.linkAccountId === getValues("linkAccountId")) {
        handleChangeAccount(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    socket?.current?.on("update_history_trading", handleUpdateHistoryTrading);
    socket?.current?.on("update_bothistory", handleUpdateBotHistory);

    return () => {
      socket?.current?.off(
        "update_history_trading",
        handleUpdateHistoryTrading
      );
      socket?.current?.off("update_bothistory", handleUpdateBotHistory);
    };
  }, [socket]);

  const [statics, setStatics] = useState({
    profitDay: 0,
    totalProfit: 0,
    winDay: 0,
    loseDay: 0,
    volumeDay: 0,
  });

  const showStaticLinkAccount = useCallback(
    async (_id) => {
      try {
        const response = await API_EXCHANGE.getLinkAccount(_id);
        if (isMountedRef.current) {
          if (response.data.ok) {
            if (getValues("accountType").toUpperCase() === "DEMO") {
              const data = response.data.d;
              setStatics({
                profitDay: data.profitDay_Demo,
                totalProfit: data.totalProfit_Demo,
                winDay: data.winDay_Demo,
                loseDay: data.loseDay_Demo,
                volumeDay: data.volumeDay_Demo,
                totalTakeProfit: data.totalTakeProfit_Demo || 0,
                totalStopLoss: data.totalStopLoss_Demo || 0,
              });

              return;
            }
            if (getValues("accountType").toUpperCase() === "LIVE") {
              const data = response.data.d;
              setStatics({
                profitDay: data.profitDay_Live,
                totalProfit: data.totalProfit_Live,
                winDay: data.winDay_Live,
                loseDay: data.loseDay_Live,
                volumeDay: data.volumeDay_Live,
                totalTakeProfit: data.totalTakeProfit_Live || 0,
                totalStopLoss: data.totalStopLoss_Live || 0,
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMountedRef]
  );

  const onSubmit = () => {};

  const [openWallet, setOpenWallet] = useState(false);
  const [linkAccountIdWallet, setLinkAccountIdWallet] = useState(0);

  const handleResetLinkAccount = async (type) => {
    try {
      const response = await API_EXCHANGE.resetLinkAccount(
        linkAccountId,
        type,
        getValues("accountType").toUpperCase()
      );

      if (response.data.ok) {
        enqueueSnackbar(translate("success"), { variant: "success" });
        if (getValues("accountType").toUpperCase() === "DEMO") {
          const data = response.data.d;
          setStatics({
            profitDay: data.profitDay_Demo,
            totalProfit: data.totalProfit_Demo,
            winDay: data.winDay_Demo,
            loseDay: data.loseDay_Demo,
            volumeDay: data.volumeDay_Demo,
            totalTakeProfit: data.totalTakeProfit_Demo || 0,
            totalStopLoss: data.totalStopLoss_Demo || 0,
          });

          return;
        }
        if (getValues("accountType").toUpperCase() === "LIVE") {
          const data = response.data.d;
          setStatics({
            profitDay: data.profitDay_Live,
            totalProfit: data.totalProfit_Live,
            winDay: data.winDay_Live,
            loseDay: data.loseDay_Live,
            volumeDay: data.volumeDay_Live,
            totalTakeProfit: data.totalTakeProfit_Live || 0,
            totalStopLoss: data.totalStopLoss_Live || 0,
          });
        }

        return;
      }
      enqueueSnackbar(translate("failed"), { variant: "error" });
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenWallet = () => {
    setOpenWallet(true);
  };

  const handleCloseWallet = () => {
    setOpenWallet(false);
  };
  return (
    <PageContainer>
      <Box mt={3}>
        <br />
        <div className={"wrap-1"} style={{ width: "100%" }}>
          <Slider {...settings}>
            {/* column */}
            {/* <Grid item xs={12} lg={8}>
              <WelcomeCard />
            </Grid> */}

            {/* column */}
            {/* <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Payment />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ProductsSold />
                </Grid>
              </Grid>
            </Grid> */}

            <div style={{ width: "100%", margin: "0 10px", height: "inherit" }}>
              <CrmAward />
            </div>
            <div style={{ width: "100%" }}>
              <WidgetStatic
                title={translate("balance")}
                isMoney={false}
                total={
                  isLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <span style={{ color: "#44a963", fontSize: 30 }}>
                      {getValues("accountType") === "DEMO"
                        ? parseFloat(balance.demo.toFixed(2))
                        : parseFloat(balance.real.toFixed(2))}
                      $
                    </span>
                  )
                }
                actions={
                  <IconButton onClick={() => handleChangeAccount(null)}>
                    <Iconify
                      icon={"ion:refresh-circle-sharp"}
                      sx={{ color: "warning.main" }}
                    />
                  </IconButton>
                }
                color="success"
                icon={"clarity:wallet-solid"}
              />
              
            </div>
            <div style={{ width: "100%" }}>
              <WidgetStatic
                title={translate("profit_day")}
                isMoney={false}
                actions={
                  <IconButton
                    onClick={() => {
                      handleResetLinkAccount("profit_day");
                    }}
                  >
                    <Iconify
                      icon={"ion:refresh-circle-sharp"}
                      sx={{ color: "primary.main" }}
                    />
                  </IconButton>
                }
                total={
                  isLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <span style={{ color: "#4488a9", fontSize: 30 }}>
                      {parseFloat(statics.profitDay.toFixed(2))} $
                    </span>
                  )
                }
                color="info"
                icon={"fa6-solid:circle-dollar-to-slot"}
              />
            </div>
            <div style={{ width: "100%" }}>
              <WidgetStatic
                title={translate("volume_day")}
                isMoney={false}
                total={
                  isLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <span
                      style={{ color: "#a99844", fontSize: 30, fontSize: 30 }}
                    >
                      {parseFloat(statics.volumeDay.toFixed(2))} $
                    </span>
                  )
                }
                color="warning"
                actions={
                  <IconButton
                    onClick={() => {
                      handleResetLinkAccount("volumeDay");
                    }}
                  >
                    <Iconify
                      icon={"ion:refresh-circle-sharp"}
                      sx={{ color: "info.main" }}
                    />
                  </IconButton>
                }
                icon={"fa6-solid:sack-dollar"}
              />
            </div>

            {/* <Grid item xs={12} sm={6} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TotalEarning />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SalesProfit />
                </Grid>
                <Grid item xs={12}>
                  <MonthlyEarnings />
                </Grid>
              </Grid>
            </Grid> */}
            {/* column */}
            {/* <Grid item xs={12} sm={6} lg={4}>
              <WeeklyStats />
            </Grid> */}
            {/* column */}
            {/* <Grid item xs={12} lg={4}>
              <YearlySales />
            </Grid> */}
            {/* column */}
            {/* <Grid item xs={12} lg={4}>
              <PaymentGateways />
            </Grid> */}
            {/* column */}

            {/* <Grid item xs={12} lg={4}>
              <RecentTransactions />
            </Grid> */}
            {/* column */}

            {/* <Grid item xs={12} lg={8}>
              <ProductPerformances />
            </Grid> */}
          </Slider>
        </div>
      </Box>
    </PageContainer>
  );
};

export default Ecommerce;
