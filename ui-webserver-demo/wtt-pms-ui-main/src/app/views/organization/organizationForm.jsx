import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Card, CardContent, Grid, Icon, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styled from "@emotion/styled";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import { getPricingPlanDetails } from "app/redux/actions/ProfileActions";
import {
  buttonCreateOrganization,
  buttonSave,
  buttonUpdate,
  headingCreateOrganization,
  headingEditOrganization,
  labelOrganizationName,
  labelEmailID,
  labelFirstName,
  labelLastName,
  labelPhoneNo,
  labelDesignation,
  labelSubscription,
  modalClose,
  placeholderEmailID,
  placeholderFirstName,
  placeholderLastName,
  placeholderPhoneNo,
  pricingPlansError,
} from "app/utils/constantForms";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import { blockInvalidChar } from "app/utils/constant";
import {FormControl,MenuItem,InputLabel,Select } from "@mui/material";
import {useState, useEffect} from "react";

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));

export default function OrganizationForm(props) {
    const [subscriptionOptions, setSubscriptionOptions] = useState([]);
    const [alertMsg, setAlertMsg] = useState("");
    const [severity, setSeverity] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
   
    const isEditable = props.cellData.status === "Draft";
    const isReinvited = props.cellData.status === "Re-invited";
    const isInvited = props.cellData.status === "Invited";
    const isVerified = props.cellData.status === "Verified";
    const isExpired = props.cellData.status === "Expired";
   

    const handleClickOpen = () => {
    props.setOpen(true);
    props.setCellData({
      // organizationName: "", 
      firstName: "",
      emailAddress: "",
      mobileNumber: "",
      lastName: "",
      designation: "",
      pricingPlan: "",
      organization: {
        name: "", // Initialize organization name here
      },
    });
    props.setReadOnly(false);
  };

  const handleClose = () => {
    props.setOpen(false);
  };
  const getPricingPlans = (data)=>{
   const dropdownPricingPlanApi = data?.payload?.results;
    setSubscriptionOptions(dropdownPricingPlanApi)
}
useEffect(()=>{
  // props.setCellData({...props.cellData, organizationName:props.cellData.organizationName || props.cellData.organization?.name});
  props.cellData.organizationName = props.cellData.organizationName || props.cellData.organization?.name;
  
}, [props.cellData])

  useEffect(() => {
   
        getPricingPlanDetails().then((users)=> 
        {
        
            getPricingPlans(users);

        }).catch(err=>{
          console.log("error while getting pricing details",err)
          setAlertMsg(pricingPlansError);
          setAlertOpen(true);
          setSeverity("error");
          handleAlertClick();
        }) 
      
      }, []);

      const handleAlertClose = (_, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setAlertOpen(false);
      };
    
      const handleAlertClick = () => {
        setAlertOpen(true);
      };
  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        <AddIcon fontSize="small" style={{ marginRight: "0.5rem" }} />
        {buttonCreateOrganization}
      </Button>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>
        {!props.readOnly ? headingCreateOrganization : (isInvited || isVerified || isReinvited ? "Read-only" : headingEditOrganization)}
          
        </DialogTitle>
        <CloseButton onClick={handleClose}>
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
        <DialogContent >
          <Grid>
            <Card>
              <CardContent sm={6}>
                <form>
                    
                  <Grid container spacing={1.5}>
                    <Grid xs={12} sm={6} item>
                    <TextField
                      fullWidth
                      size="small"
                      // type="text"
                      name="organizationName"
                      label={labelOrganizationName}
                      variant="outlined"
                    //   onBlur={handleBlur}
                      InputProps={{
                      readOnly: isVerified || isInvited ||isReinvited || isExpired,
                    }}
                   
                    value={ props.cellData.organizationName} 
                    onChange={props.handleInput}
                    error={props.errors.organizationName} 
                    
                      required
                    />
                    </Grid>

                    <Grid xs={12} sm={6} item>
                      <TextField
                      size="small"
                        placeholder={placeholderFirstName}
                        onChange={props.handleInput}
                        label={labelFirstName}
                        error={props.errors.firstName}
                        helperText={props.errors.firstName}
                        variant="outlined"
                        value={props.cellData.firstName}
                        name="firstName"
                        fullWidth
                        InputProps={{
                          readOnly: isVerified || isInvited ||isReinvited || isExpired,
                        }}
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                      size="small"
                        placeholder={placeholderLastName}
                        onChange={props.handleInput}
                        label={labelLastName}
                        value={props.cellData.lastName}
                        variant="outlined"
                        error={props.errors.lastName}
                        helperText={props.errors.lastName}
                        name="lastName"
                        InputProps={{
                          readOnly: isVerified || isInvited ||isReinvited || isExpired,
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                      size="small"
                        type="email"
                        placeholder={placeholderEmailID}
                        onChange={props.handleInput}
                        label={labelEmailID}
                        variant="outlined"
                        value={props.cellData.emailAddress}
                        error={props.errors.emailAddress}
                        helperText={props.errors.emailAddress}
                        name="emailAddress"
                        InputProps={{
                          readOnly: isVerified || isInvited ||isReinvited || isExpired,
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        type="number"
                        size="small"
                        placeholder={placeholderPhoneNo}
                        onChange={props.handleInput}
                        label={labelPhoneNo}
                        variant="outlined"
                        error={props.errors.mobileNumber}
                        value={props.cellData.mobileNumber}
                        helperText={props.errors.mobileNumber}
                        onKeyDown={blockInvalidChar}
                        InputProps={{
                          readOnly: isVerified || isInvited ||isReinvited || isExpired,
                        }}
                        name="mobileNumber"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="designation"
                      label={labelDesignation}
                      variant="outlined"
                      InputProps={{
                      readOnly: isVerified || isInvited ||isReinvited || isExpired,
                    }}
                      value={props.cellData.designation}
                      onChange={props.handleInput}
                      error={props.errors.designation}
                      required
                    />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                    <FormControl fullWidth size="small" >
                      <InputLabel id="pricing-plan-label">
                        {labelSubscription}
                      </InputLabel>
                        <Select
                          labelId="pricing-plan-label"
                        
                            readOnly= {isVerified || isInvited ||isReinvited || isExpired}
                          
                          id="pricingPlan"
                          name="pricingPlan"
                          variant="outlined"                          
                          value={props.cellData.pricingPlan?.name}
                          label={labelSubscription}
                          error={props.errors.pricingPlan}
                          onChange={(event) => {
                            const selectedPricingPlan = event.target.value;
                            props.setCellData((prevData) => ({
                              ...prevData,
                              pricingPlan: { name: selectedPricingPlan },
                            }));
                          }}
                           required
                        >
                          {subscriptionOptions.sort((a,b)=> a.sequence - b.sequence).map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                            {option.name}
                          </MenuItem>
                           ))} 
                           
                        </Select>
                       
                        
                    </FormControl>
                    </Grid>
                    <LoadingBar loading={props.loading} />
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </DialogContent>
        <DialogActions>
        {!props.readOnly && (
          <>
         
              <Button
                variant="contained"
                onClick={() => props.handleSave("Draft")}
                style={{ backgroundColor: "rgb(255, 158, 67)", color: "#000000" }}
              >
                Save as Draft
              </Button>
              <Button
                variant="contained"
                onClick={props.handleInvite}
                style={{ backgroundColor: "rgb(9, 182, 109)", color: "#ffffff" }}
              >
                Invite
              </Button>
          </>
         )} 
        {isEditable && (
          <>
          <Button
            variant="contained"
            onClick={() =>props.Updatehandle("Draft")}
            style={{ backgroundColor: "rgb(255, 158, 67)", color: "#000000" }}
          >
            Update
          </Button>
            <Button
            variant="contained"
            onClick={props.handleInvite}
            style={{ backgroundColor: "rgb(9, 182, 109)", color: "#ffffff" }}
          >
            Invite
          </Button>
          </>
          
        )}
          {isExpired && (
            <Button
              variant="contained"
              onClick={props.handleReInvite}
              style={{ backgroundColor: "rgb(9, 182, 109)", color: "#ffffff" }}
            >
              Re-Invite
            </Button>
          )}
        </DialogActions> 
        {/* <DialogActions>
        <Button
          variant="contained"
          onClick={props.readOnly ? props.Updatehandle : props.handleSave}
          style={{
            backgroundColor: props.readOnly ? 'rgb(255, 158, 67)' : 'rgb(9, 182, 109)',
            color: props.readOnly ? "#000000" : "#ffffff",
          }}
        >
          {props.readOnly ? buttonUpdate : buttonSave}
        </Button>
  </DialogActions> */}
      </Dialog>
      <AlertMsg
        open={alertOpen}
        handle={handleAlertClose}
        severity={severity}
        Msg={alertMsg}
      />
    </>
  );
}

