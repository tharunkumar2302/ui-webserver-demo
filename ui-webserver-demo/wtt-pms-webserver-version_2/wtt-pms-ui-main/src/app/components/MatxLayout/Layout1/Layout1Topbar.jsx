/* eslint-disable no-unused-vars */
import {
  Avatar,
  Hidden,
  Icon,
  IconButton,
  MenuItem,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/system";
import { MatxMenu } from "app/components";
import { themeShadows } from "app/components/MatxTheme/themeColors";
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import { profileRoute,changePasswordRoute, topBarHeight, value100Per } from "app/utils/constant";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Span } from "../../../components/Typography";
import { getCurrentUserDetails } from "app/redux/actions/CurrentUserActions";
import AlertMsg from "app/components/AlertMsg/AlertMsg";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: "all 0.3s ease",
  boxShadow: themeShadows[8],
  height: topBarHeight,
}));
const NameProfile = styled("span")(({ theme }) => ({
  fontSize: '12px',
  fontWeight: '500',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif'
}));

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: value100Per,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: 14,
    paddingRight: 16,
  },
}));

const UserMenu = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: 24,
  padding: 4,
  "& span": { margin: "0 8px" },
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: value100Per,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

const Layout1Topbar = () => {

  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const [updateValue, setUpdateValue] = useState({});
  const { logout } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [role, setRole] =  useState('');
  const alertStyle = {
    top: "-28rem",
    left: "auto",
    right: "1.3rem",
  };
  useEffect(() => {
    currentUserAPI();
    window.addEventListener("UpdatedDetails", function (data) {
      currentUserAPI();
    });
  }, []);

  const currentUserAPI = async () => {
    const currentUserApi = await getCurrentUserDetails();
    setUpdateValue(currentUserApi.payload.user);
    setRole(currentUserApi.payload.user.role.name);
    console.log(currentUserApi.payload.user.role,'108')
    
  };

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  const handleClose =(_, reason)=> {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>
        </Box>
        <AlertMsg
          open={alertOpen}
          handle={handleClose}
          severity={severity}
          Msg={alertMsg}
        />
        <Box display="flex" alignItems="center">
          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <NameProfile>
                    Hi
                    <strong>
                      {!updateValue.resume?" " + updateValue?.firstName + " " + updateValue?.lastName:" " + updateValue?.resume.firstName + " " + updateValue?.resume.lastName}
                    </strong>
                  </NameProfile>
                </Hidden>
                <Stack>
                  <Avatar src="/assets/images/auth/Profile-Avtar.jpg" alt="" style={{ borderRadius: '50%', border: '3px solid black' }} />
                </Stack>
              </UserMenu>
            }
          >
          <StyledItem>
             <Link to={role === "superuser" ? "/dashboard/profile" : "/"}>
               <Icon> home </Icon>
               <Span> Home </Span>
             </Link>
           </StyledItem> 

            <StyledItem>
              <Link to={profileRoute}>
                <Icon> person </Icon>
                <Span> Profile </Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to={changePasswordRoute}>
          
              <Icon> create Password </Icon>
              <Span> Change Password </Span>
              </Link>
            </StyledItem>

            <StyledItem onClick={logout}>
              <Icon> logout </Icon>
              <Span> Logout </Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);
