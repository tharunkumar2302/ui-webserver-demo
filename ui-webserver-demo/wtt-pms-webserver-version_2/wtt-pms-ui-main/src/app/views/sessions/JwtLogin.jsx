/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Card,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/system";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import LoginIcon from "@mui/icons-material/Login";
import { emailNotVerifiedMessage, emailVerifiedMessage, labelEmailID, labelPassword } from "app/utils/constantForms";
import { value100Per, value100PerImp } from "app/utils/constant";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(Box)(() => ({
  height: value100Per,
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: value100PerImp,
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

// inital login credentials
const initialValues = {
  email: "",
  password: "",
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 character length")
    .required("Password is required!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
      "Password must contain One capital letter, one digit and one special character"
    ),
  email: Yup.string()
    .email("Invalid Email address")
    .required("Email is required!"),
});

const JwtLogin = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  let [verify, setVerify] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");

  const { login } = useAuth();
  const alertStyle = {
    top: "-28rem",
    left: "auto",
    right: "1.3rem",
  };

  useMemo(() => {
    const searchParams = new URLSearchParams(document.location.search);
    setVerify(searchParams.get("status"));
    if (!verify) return 0;
  }, [verify]);

  useMemo(() => {
    if (verify === "success") {
      setAlertMsg(emailVerifiedMessage);
      setSeverity("info");
      handleClick();
    } else if (verify === "error") {
      setAlertMsg(emailNotVerifiedMessage);
      setSeverity("error");
      handleClick();
    }
  }, []);

  const handleClose =(_, reason) =>{
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }

  const handleClick =()=> {
    setAlertOpen(true);
  }

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (e) {
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height={value100Per} sx={{ minWidth: 320 }}>
              <img src="/assets/images/auth/login.png" width={value100Per} alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label={labelEmailID}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label={labelPassword}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                      <LoginIcon
                        fontSize="small"
                        style={{ paddingLeft: "2px" }}
                      />
                    </LoadingButton>

                    {/* <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{
                          color: theme.palette.primary.main,
                          marginLeft: 5,
                        }}
                      >
                        Register
                      </NavLink>
                    </Paragraph> */}
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          style={alertStyle}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: value100Per }}
            variant="filled"
          >
            {JSON.parse(JSON.stringify(alertMsg))}
          </Alert>
        </Snackbar>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;
