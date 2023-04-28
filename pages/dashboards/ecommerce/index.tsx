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
  return (
    <PageContainer>
      <Box mt={3}>
        <br />
        <div style={{width: "100%"}}>
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

            <div style={{width: "100%"}}>
              <CrmAward />
            </div>
            <div style={{width: "100%"}}>
              <SalesOverview />
            </div>
            <div style={{width: "100%"}}>
              <SalesOverview />
            </div>
            <div style={{width: "100%"}}>
              <SalesOverview />
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
