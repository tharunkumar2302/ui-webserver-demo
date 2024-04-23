import { Button } from "@mui/material";
import { Card, TextField } from "@mui/material";
import { themeColors } from "../../components/MatxTheme/themeColors";
import { Box, styled } from "@mui/system";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import {
  buttonSave,
  labelConfirmPassword,
  labelNewPassword,
  labelOldPassword,
  labelChangePassword,
} from "app/utils/constantForms";
import { value100Per } from "app/utils/constant";
import LoadingBar from "app/components/LoadingBar/LoadingBar";

const ContentBox = styled(Box)(() => ({
  height: value100Per,
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const ErrorMsg = styled(Box)(() => ({
  color: "#FF3D57",
  fontSize: "0.75rem",
  letterSpacing: "0.03333em",
  margin: "3px 14px 0px",
}));

const ButtonWrapper = styled("div")(() => ({
  display: "flex",
  gap: "20px",
  flexFlow: "wrap",
  marginTop:"10px"
}));

const ChangeBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",

  "& .card": {
    maxWidth: 600,
    minHeight: 300,
    margin: "6rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

// inital change password credentials
const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// form field validation schema
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(8, "Password must be 8 character length")
    .required("Password is required!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
      "Password must contain One capital letter, one digit and one special character"
    ),
  newPassword: Yup.string()
    .min(8, "Password must be 8 character length")
    .required("Password is required!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
      "Password must contain One capital letter, one digit and one special character"
    ),
  confirmPassword: Yup.string()
    .min(8, "Password must be 8 character length")
    .required("Password is required!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
      "Password must contain One capital letter, one digit and one special character"
    ),
});

const ChangePassword = () => {
  const textError = themeColors.errorColor;
  const [loading, setLoading] = useState(false);
  const [confirmFlag, setConfirmFlag] = useState(false);

  const { changePassword } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    setConfirmFlag(false);
    try {
      if (values.newPassword === values.confirmPassword) {
        await changePassword(values.newPassword, values.oldPassword);
        setLoading(false);
      } else {
        setConfirmFlag(true);
        values.newPassword = "";
        values.confirmPassword = "";
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <ChangeBox>
      <Card className="card">
        <ContentBox>
          <span className="labelChangePassword">{labelChangePassword}</span>
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
                  name="oldPassword"
                  type="password"
                  label={labelOldPassword}
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.oldPassword}
                  onChange={handleChange}
                  helperText={touched.oldPassword && errors.oldPassword}
                  error={Boolean(errors.oldPassword && touched.oldPassword)}
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  name="newPassword"
                  type="password"
                  label={labelNewPassword}
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.newPassword}
                  onChange={handleChange}
                  helperText={touched.newPassword && errors.newPassword}
                  error={Boolean(errors.newPassword && touched.newPassword)}
                  sx={{ mb: 1.5 }}
                />

                <TextField
                  fullWidth
                  size="small"
                  name="confirmPassword"
                  type="password"
                  label={labelConfirmPassword}
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  error={Boolean(
                    errors.confirmPassword && touched.confirmPassword
                  )}
                  sx={{ mb: 1.5 }}
                />

                {confirmFlag === true && (
                  <ErrorMsg textcolor={textError}>
                    Password doesn't matched
                  </ErrorMsg>
                )}

                <ButtonWrapper>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={goBack}
                  >
                    Cancel
                  </Button>

                  <Button
                    style={{ width: "78px" }}
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    {buttonSave}
                  </Button>
                </ButtonWrapper>
              </form>
            )}
          </Formik>
        </ContentBox>
        <LoadingBar loading={loading} />
      </Card>
    </ChangeBox>
  );
};

export default ChangePassword;
