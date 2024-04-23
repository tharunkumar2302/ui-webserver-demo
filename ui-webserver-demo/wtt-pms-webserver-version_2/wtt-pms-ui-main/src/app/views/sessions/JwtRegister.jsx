import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Card, Grid, TextField } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { labelDesignation, labelEmailID, labelFirstName, labelLastName, labelOrganizationName, labelPassword, labelPhoneNo, placeholderPhoneNo ,labelSubscription ,pricingPlansError} from "app/utils/constantForms";
import { blockInvalidChar, value100Per } from "app/utils/constant";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getPricingPlanDetails } from "app/redux/actions/ProfileActions";
import AlertMsg from "app/components/AlertMsg/AlertMsg";


const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(JustifyBox)(() => ({
  height: value100Per,
  padding: "32px",
  background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRegister = styled(JustifyBox)(() => ({
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

// inital login credentials
const initialValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  mobileNumber: "",
  designation: "",
  organizationName: "",
  pricingPlan: "" ,
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
    .email("Invalid Email Id")
    .required("Email Id is required!"),
  mobileNumber: Yup.string()
    .max(10, "Phone number must be 10 digits length")
    .min(10, "Phone number must be 10 digits length")
    .required("Phone number is required!"),
});

const JwtRegister = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const getPricingPlans = (data)=>{
    const dropdownPricingPlanApi = data?.payload?.results;
    setSubscriptionOptions(dropdownPricingPlanApi)
    console.log(dropdownPricingPlanApi,"84");
}

  useEffect(() => {
    getPricingPlanDetails().then((users)=> 
    {
    
        getPricingPlans(users);
     
    }).catch(err=>{
      console.log("error while getting pricing details",err)
      setAlertMsg(pricingPlansError);
      setAlertOpen(true);
      setSeverity("error");
      handleClick();
    }) 
  
  }, []);
 
  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleClick = () => {
    setAlertOpen(true);
  };

  const handleFormSubmit = (values) => {
    setLoading(true);

    try {
      register(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        values.mobileNumber,
        values.designation,
        values.organizationName,
        values.pricingPlan,
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <JWTRegister>
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
            <Box pt={2} pb={2} pl={3} pr={3} height={value100Per}>
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
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="organizationName"
                      label={labelOrganizationName}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.organizationName}
                      onChange={handleChange}
                      helperText={
                        touched.organizationName && errors.organizationName
                      }
                      error={Boolean(
                        errors.organizationName && touched.organizationName
                      )}
                      sx={{ mb: 3 }}
                      required
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="firstName"
                      label={labelFirstName}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.firstName}
                      onChange={handleChange}
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
                      value={values.lastName}
                      onChange={handleChange}
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
                      onKeyDown={blockInvalidChar}
                      label={labelPhoneNo}
                      placeholder={placeholderPhoneNo}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.mobileNumber}
                      onChange={handleChange}
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
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
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
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 2 }}
                      required
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="designation"
                      label={labelDesignation}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.designation}
                      onChange={handleChange}
                      helperText={touched.designation && errors.designation}
                      error={Boolean(errors.designation && touched.designation)}
                      sx={{ mb: 3 }}
                      required
                    />
                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                      <InputLabel id="pricing-plan-label">
                        {labelSubscription}
                      </InputLabel>
                        <Select
                          labelId="pricing-plan-label"
                          id="pricingPlan"
                          name="pricingPlan"
                          variant="outlined"
                          value={values.pricingPlan}
                          label={labelSubscription}
                          onChange={(event) => {
                            handleChange(event);
                            const selectedPricingPlan = event.target.value;
                            setFieldValue("pricingPlan", selectedPricingPlan);
                          }}
                          onBlur={handleBlur}
                          sx={{ mb: 0.1 }}
                          required
                        >
                          {subscriptionOptions.sort((a,b)=> a.sequence - b.sequence).map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                            {option.name}
                          </MenuItem>
                           ))} 
                           
                        </Select>
                        
                    </FormControl>
                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 1 }}
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
      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
     
    </JWTRegister>
    
  );
};

export default JwtRegister;
