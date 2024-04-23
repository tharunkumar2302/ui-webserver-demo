/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Card, Grid, TextField } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { labelConfirmPassword, labelEmailID, labelFirstName, labelLastName, labelPassword, labelPhoneNo, placeholderPhoneNo } from "app/utils/constantForms";
import { blockInvalidChar, value100Per } from "app/utils/constant";
import { themeColors } from "../../components/MatxTheme/themeColors";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(JustifyBox)(() => ({
  height: value100Per,
  padding: "32px",
  background: "rgba(0, 0, 0, 0.01)",
}));

const ErrorMsg = styled(Box)(() => ({
  color: "#FF3D57",
  fontSize: "0.75rem",
  letterSpacing: "0.03333em",
  margin: "3px 14px 0px",
}));

const RegisterDiv = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

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
    .email("Invalid Email Id")
    .required("Email Id is required!"),
  mobileNumber: Yup.string()
    .max(10, "Phone number must be 10 digits length")
    .min(10, "Phone number must be 10 digits length")
    .required("Phone number is required!"),
});

const CandidateRegister = () => {
  const theme = useTheme();
  const textError = themeColors.errorColor;
  const { candidateRegister } = useAuth();
  const { getCurrentProfileData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    "email": "",
    "password": "",
    "firstName": "",
    "lastName": "",
    "mobileNumber": "",
    "designation": "",
    "organizationName": "",
  })
  const [values, setValues] = useState({});
  const [navigateUrl, setnavigateUrl] = useState("session/candidate-signup");
  const [tokenInvite, setTokenInvite] = useState();
  const [responseData, setResponseData] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');
   const [confirmFlag, setConfirmFlag] = useState(false);
  const getCurrentProfile = async (inviteToken) => {
    setTokenInvite(inviteToken);
    const getCurrentProfileDataAPI = await getCurrentProfileData(inviteToken);
    const responseHelper = getCurrentProfileDataAPI.payload.data;
    setResponseData(responseHelper)
    setInitialValues({
      email: responseHelper.emailAdress ? responseHelper.emailAdress : '',
      password: '',
      firstName: responseHelper.firstName ? responseHelper.firstName : '',
      lastName: responseHelper.lastName ? responseHelper.lastName : '',
      mobileNumber: responseHelper.mobileNumber ? responseHelper.mobileNumber : '',
      designation: '',
      organizationName: responseHelper.organisation ? responseHelper.organisation : ''
    })
  }

  useMemo(() => {
    const data = document.location.hash?.split("?")[1];
    const searchParams = new URLSearchParams(data)
    const inviteToken = searchParams.get("token");
    if (inviteToken) {
      getCurrentProfile(inviteToken)
      setnavigateUrl("session/candidate-signup?token=" + inviteToken)
    }
  }, [])

  const handleFormSubmit = (values) => {
    setConfirmFlag(false);
    if (values.password !== confirmPassword) {
      setConfirmFlag(true);
      return;
    }
    values.role = 'candidate';
    values.organizationName = initialValues.organizationName ? initialValues.organizationName : 'N/A';
    values.designation = 'N/A';
    setLoading(true);

    try {
      candidateRegister(values.email, values.password, values.firstName, values.lastName, values.mobileNumber, values.designation, values.organizationName, values.role, navigateUrl, tokenInvite);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  let name, value;
  const handleInputChange = (e) => {
    setConfirmFlag(false);
    name = e.target.name;
    value = e.target.value;
    setInitialValues({ ...initialValues, [name]: value < '0' ? '' : value });
    setValues({ ...initialValues, [name]: value < '0' ? '' : value });
    if (name === 'password') {
      setConfirmPassword(value);
      
    }
  
    if (name === 'confirmpassword') {
      setConfirmPassword(value);
     
    }
  };
  return (
    <RegisterDiv>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width={value100Per}
                alt="Register"
                src="/assets/images/auth/signup.png"
              />
            </ContentBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box p={4} height={value100Per}>
              <Formik
                enableReinitialize={true}
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
                      type="text"
                      name="firstName"
                      label={labelFirstName}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={initialValues.firstName ? initialValues.firstName : values.firstName}
                      onChange={handleInputChange}
                      helperText={touched.firstName && errors.firstName}
                      error={Boolean(errors.firstName && touched.firstName)}
                      sx={{ mb: 3 }}
                      required
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="lastName"
                      label={labelLastName}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={initialValues.lastName ? initialValues.lastName : values.lastName}
                      onChange={handleInputChange}
                      helperText={touched.lastName && errors.lastName}
                      error={Boolean(errors.lastName && touched.lastName)}
                      sx={{ mb: 3 }}
                      required
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      name="mobileNumber"
                      label={labelPhoneNo}
                      placeholder={placeholderPhoneNo}
                      variant="outlined"
                      onBlur={handleBlur}
                      onKeyDown={blockInvalidChar}
                      value={initialValues.mobileNumber ? initialValues.mobileNumber : values.mobileNumber}
                      onChange={handleInputChange}
                      helperText={touched.mobileNumber && errors.mobileNumber}
                      error={Boolean(
                        errors.mobileNumber && touched.mobileNumber
                      )}
                      sx={{ mb: 3 }}
                      required
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label={labelEmailID}
                      disabled={(responseData && responseData.email) ? true : false}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={initialValues.email ? initialValues.email : values.email}
                      onChange={handleInputChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                      required
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label={labelPassword}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={initialValues.password ? initialValues.password : values.password}
                      onChange={handleInputChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 2 }}
                      required
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="confirmpassword"
                      type="password"
                      label={labelConfirmPassword}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.confirmpassword}
                      onChange={handleInputChange}
                      helperText={touched.confirmpassword && errors.confirmpassword}
                      error={Boolean(errors.confirmpassword && touched.confirmpassword)}
                      sx={{ mb: 2 }}
                      required
                    />
                    {confirmFlag === true && (
                  <ErrorMsg textcolor={textError}>
                    Password doesn't matched
                  </ErrorMsg>
                )}
                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Register <KeyboardArrowRightIcon fontSize="small" />
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{
                          color: theme.palette.primary.main,
                          marginLeft: 5,
                        }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </RegisterDiv>
  );
};

export default CandidateRegister;
