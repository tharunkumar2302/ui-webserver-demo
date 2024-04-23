import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Card,
  CardContent,
  Grid,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styled from "@emotion/styled";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import { buttonCreateJobRole, buttonSave, buttonUpdate, headingCreateJobRole, headingEditJobRole, labelDescription, labelJobRole, modalClose, placeholderDescription, placeholderJobRole } from "app/utils/constantForms";
import { localStorageUserRole } from "app/utils/constant";
import { useState ,useEffect } from "react";
import JoditEditor from "jodit-react";

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));
const Label = styled(Typography)(() => ({
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '1.5',
  textTransform: 'none',
  whiteSpace: 'normal',
  marginBottom: '0.5rem'
}));

const Skillsconfig = {
  readonly: false,
  placeholder: placeholderDescription,
};

export default function JobRoleForm(props) {
  const handleClickOpen = () => {
    props.setOpen(true);
    props.setCellData({ name: "", description: "" });
    props.setReadOnly(false);
  };

  const handleClose = () => {
    props.setOpen(false);
  };


  const [userRole, setUserRole] = useState('');
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Get the user role from local storage
    const role = localStorageUserRole();
    // Update the user role state variable
    setUserRole(role);
  }, []);

  useEffect(() => {
    // Update the hide state variable based on the user role
    setHide(userRole === 'employer');
  }, [userRole]);

  return (
    <>
      {hide ?
        null :
        <Button variant="contained" onClick={handleClickOpen}>
          <AddIcon fontSize="small" style={{ marginRight: "0.5rem" }} /> {buttonCreateJobRole}
        </Button>
      }
      <Dialog open={props.open} maxWidth onClose={handleClose}>
        <DialogTitle>
          {props.readOnly ? headingEditJobRole : headingCreateJobRole}
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
                    <Grid xs={12} sm={12} item>
                      <TextField
                        placeholder={placeholderJobRole}
                        onChange={props.handleInput}
                        label={labelJobRole}
                        error={props.errors.name}
                        helperText={props.errors.name}
                        variant="outlined"
                        value={props.cellData.name}
                        name="name"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                    <Label>Description *</Label>
                    <JoditEditor
                        variant="outlined"
                        label={labelDescription}
                        value={props.cellData.description}
                        config={Skillsconfig}
                        name="description"
                        error={props.errors.description}
                        helperText={props.errors.description}
                        onChange={(newContent) => props.setCellData({ ...props.cellData, description: newContent })}

                        // onChange={props.handleInput}
                        required
                      />
                      {/* <TextField
                        placeholder={placeholderDescription}
                        onChange={props.handleInput}
                        label={labelDescription}
                        variant="outlined"
                        multiline
                        value={props.cellData.description}
                        error={props.errors.description}
                        helperText={props.errors.description}
                        name="description"
                        InputProps={{}}
                        fullWidth
                        required
                      /> */}
                    </Grid>
                  </Grid>
                  <LoadingBar loading={props.loading} />
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