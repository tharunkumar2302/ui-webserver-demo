import { Box, Button, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  maxWidth: 380,
  flexDirection: "column",
  justifyContent: "center",
}));

const IMG = styled("img")(() => ({
  width: "60%",
  marginBottom: "32px",
}));

const EmailVerifiedRoot = styled(FlexBox)(() => ({
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh !important",
  fontSize:"15px"
}));

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <EmailVerifiedRoot>
      <JustifyBox>
      <IMG src="/assets/images/illustrations/email-verification-icon.svg" alt="" />
        <h2>Your email has been verified</h2>
        <p>Please check your email for login details</p>
      </JustifyBox>
    </EmailVerifiedRoot>
  );
};

export default EmailVerified;