import * as React from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import { value100Per } from "app/utils/constant";
import { isMobile } from "app/utils/utils";

const StepperStyle = styled(Stepper)(() => ({
  display: isMobile() && "grid",
  gridGap: isMobile() && "10px",
  paddingBottom: isMobile() && "1em",
}));

export default function StepperForm(props) {
  return (
    <Box className = "customClass" sx={{ width: value100Per }}>
      <StepperStyle activeStep={props.currentStep}>
        {props.step.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </StepperStyle>
      {props.currentStep === props.step.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All step completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={props.handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Grid>
            <Card>
              <CardContent>
                <form>
                  <Grid container spacing={3} key={props.currentStep}>
                    {props.formList[props.currentStep]}
                  </Grid>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "16rem",
                      left: "35rem",
                    }}
                  >
                    {props.load ? <CircularProgress /> : ""}
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </React.Fragment>
      )}
    </Box>
  );
}