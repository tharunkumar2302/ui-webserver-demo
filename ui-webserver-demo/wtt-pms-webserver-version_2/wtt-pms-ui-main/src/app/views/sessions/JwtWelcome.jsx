import { Button, Card, Grid, Typography } from "@mui/material";

import { Box, styled, useTheme } from "@mui/system";
import { Paragraph } from "app/components/Typography";
import { NavLink } from "react-router-dom";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { isMobile } from "app/utils/utils";
import { value100Per } from "app/utils/constant";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));
const HeadingStyle = styled(Typography)(() => ({
  fontWeight: 500,
  color: "#78cd6b",
  paddingBottom: 9,
  marginBottom: !isMobile() ? "auto" : "75%",
}));
const HeadingStyle1 = styled(Typography)(() => ({
  fontWeight: 700,
  paddingBottom: 9,
}));
const HeadingStyle3 = styled(Typography)(() => ({ paddingBottom: 30,fontSize:'1rem' }));

const LogoStyle = styled("img")(() => ({
  padding: "0rem",
  position: !isMobile() ? "inherit" : "absolute",
  top: "7rem",
  right: "1.5rem",
  width: !isMobile() ? value100Per : "87%",
  height: !isMobile() ? "auto" : "65%",
}));
const LogoGrid = styled(Grid)(() => ({
  position: !isMobile() ? "inherit" : "absolute",
  width: "inherit",
}));
const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(Box)(() => ({
  height: "100vh",
  padding:
    !isMobile() ? "9rem 4rem 0rem 7rem" : "2rem 1rem 0rem 1rem",
  position: "relative",
}));

const JWTWELCOME = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "80% !important",
  "& .card": {
    maxWidth: 1600,
    minHeight: 200,
    margin: "0",
    display: "flex",
    borderRadius: 0,
  },
}));

const JwtWelcome = () => {
  const theme = useTheme();
  return (
    <JWTWELCOME>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <HeadingStyle gutterBottom variant="h2">
                EngazeWell
              </HeadingStyle>
              <HeadingStyle1 gutterBottom variant="h5">
                Welcome to Profile Management System
              </HeadingStyle1>
              <HeadingStyle3 gutterBottom variant="h6">
                The Most Effective Way to Manage & Access All Profiles Within
                The System
              </HeadingStyle3>
              <Paragraph>
                <NavLink
                  to="/session/signin"
                  style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                >
                  <Button variant="contained">
                    Get Started
                    <KeyboardDoubleArrowRightIcon fontSize="small" />
                  </Button>
                </NavLink>
              </Paragraph>
            </ContentBox>
          </Grid>

          <LogoGrid item sm={6} xs={12}>
            <JustifyBox
              p={4}
              height={!isMobile() ? value100Per : "55vh"}
              sx={{ minWidth: 320, paddingLeft: 10 }}
            >
              <LogoStyle src="/assets/images/auth/login.png" alt="" />
            </JustifyBox>
          </LogoGrid>
        </Grid>
      </Card>
    </JWTWELCOME>
  );
};

export default JwtWelcome;
