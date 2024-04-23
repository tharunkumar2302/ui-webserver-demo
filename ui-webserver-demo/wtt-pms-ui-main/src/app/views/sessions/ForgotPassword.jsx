import { Box, Button, Card, Grid, styled, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { LoadingButton } from "@mui/lab";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { labelEmailID, labelResetPassword } from "app/utils/constantForms";
import { value100Per } from "app/utils/constant";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    margin: "1rem",
    borderRadius: 12,
  },
}));

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      forgotPassword(email);
    } catch (e) {
    }
    setLoading(false);
  };

  return (
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img
                width="300"
                src="/assets/images/illustrations/dreamer.svg"
                alt=""
              />
            </JustifyBox>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label={labelEmailID}
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: value100Per }}
                />

                <LoadingButton
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={loading}
                >
                  {labelResetPassword}
                  <AutorenewIcon
                    fontSize="small"
                    style={{ paddingLeft: "2px" }}
                  />
                </LoadingButton>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}
                >
                  <KeyboardBackspaceIcon
                    fontSize="small"
                    style={{ paddingRight: "2px" }}
                  />
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ForgotPasswordRoot>
  );
};

export default ForgotPassword;
