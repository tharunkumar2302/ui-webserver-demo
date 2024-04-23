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
import {
  buttonCreateRecruiter,
  buttonSave,
  buttonUpdate,
  headingCreateRecruiter,
  headingEditRecruiter,
  labelEmailID,
  labelFirstName,
  labelLastName,
  labelPhoneNo,
  modalClose,
  placeholderEmailID,
  placeholderFirstName,
  placeholderLastName,
  placeholderPhoneNo,
} from "app/utils/constantForms";
import { blockInvalidChar } from "app/utils/constant";

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));

export default function RecruiterForm(props) {
  const handleClickOpen = () => {
    props.setOpen(true);
    props.setCellData({
      firstName: "",
      emailAddress: "",
      mobileNumber: "",
      lastName: "",
    });
    props.setReadOnly(false);
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        <AddIcon fontSize="small" style={{ marginRight: "0.5rem" }} />
        {buttonCreateRecruiter}
      </Button>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>
          {!props.readOnly ? headingCreateRecruiter : headingEditRecruiter}
        </DialogTitle>
        <CloseButton onClick={handleClose}>
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
        <DialogContent>
          <Grid>
            <Card>
              <CardContent>
                <form>
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        placeholder={placeholderFirstName}
                        onChange={props.handleInput}
                        label={labelFirstName}
                        error={props.errors.firstName}
                        helperText={props.errors.firstName}
                        variant="outlined"
                        value={props.cellData.firstName}
                        name="firstName"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        placeholder={placeholderLastName}
                        onChange={props.handleInput}
                        label={labelLastName}
                        value={props.cellData.lastName}
                        variant="outlined"
                        error={props.errors.lastName}
                        helperText={props.errors.lastName}
                        name="lastName"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
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
                          readOnly: props.readOnly,
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        type="number"
                        placeholder={placeholderPhoneNo}
                        onChange={props.handleInput}
                        label={labelPhoneNo}
                        variant="outlined"
                        error={props.errors.mobileNumber}
                        value={props.cellData.mobileNumber}
                        helperText={props.errors.mobileNumber}
                        onKeyDown={blockInvalidChar}
                        name="mobileNumber"
                        fullWidth
                        required
                      />
                    </Grid>
                    <LoadingBar loading={props.loading} />
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Dialog>
    </>
  );
}
