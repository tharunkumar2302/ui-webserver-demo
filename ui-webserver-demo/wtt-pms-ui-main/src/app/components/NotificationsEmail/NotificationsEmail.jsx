/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Typography,
  styled,
  Button,
  Icon,
  IconButton,
  Grid,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import JoditEditor from "jodit-react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Alert, Snackbar } from "@mui/material";
import { postNotificationsEmail } from "app/redux/actions/CommonActions";
import { getJobOpeningDetails } from "app/redux/actions/JobOpeningActions";
import { isMobile } from "app/utils/utils";
import { buttonSend, headingNotifyCandidates, labelBccList, labelCcList, labelJobOpening, labelSubject, labelToList, modalClose, notificationMessage, placeholderBccList, placeholderCcList, placeholderEmailBody, placeholderSubject, placeholderToList, requiredFiled } from "app/utils/constantForms";
import { value100Per } from "app/utils/constant";
import SelectDataTableContext from "app/contexts/SelectTableDataContext";
import useSelectDataTable from "app/hooks/useSelectTableData";
const alertStyle = {
  top: "-28rem",
  left: "auto",
  right: "1.3rem",
};

const Container = styled("form")(() => ({
  maxHeight:"32rem",
  width: !isMobile() ? "40rem" : "28rem",
  maxWidth: value100Per,
  textAlign: "left",
  position: "relative",
  backgroundColor: "#fff",
  display: "block",
  padding: "2rem 2rem",
  borderRadius: "15px",
  overflowY: "scroll",
  scrollbarWidth: "thin",
}));

const SendButton = styled(Button)(() => ({
  margin: "1rem",
  marginLeft: "13rem",
  width: "10rem",
  marginTop: "2.5rem",
}));

const Heading = styled(Typography)(() => ({
  fontSize: "1.1rem",
  fontWeight: "600",
  textAlign: "center",
  marginBottom: "1.2rem",
}));
const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));
const Label = styled(Typography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '1.5',
  textTransform: 'none',
  whiteSpace: 'normal',
  marginBottom: '0.5rem'
}));
const NotificationsEmail = (props) => {
  //filter mail id's for sending emails to candiadtes
  let allRecord = props.selectedItems? props.selectedItems : useSelectDataTable.selectItem;
  let selectedRecordsEmailId;
  let selectedRecordsEmailIdArray = [];
  for (const data in allRecord) {
    selectedRecordsEmailId = allRecord[data].email;
    selectedRecordsEmailIdArray.push(selectedRecordsEmailId);
  }
  const [input, setInput] = React.useState("");
  const [input1, setInput1] = React.useState(selectedRecordsEmailIdArray);
  const [input2, setInput2] = React.useState([useSelectDataTable.loginUserEmailId ?? JSON.parse(localStorage.getItem('userDetails')?? '{}').emailAddress]);
  const [input3, setInput3] = React.useState([]);
  const [jobOpenings, setjobOpenings] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedDropdown, setSelectedDrpdown] = useState("");
  const [content, setContent] = useState("");
  const [selectjobid, setSelectjobId] = useState("");
  //Alert message fuction
  const handleCloseAlert =(_, reason)=> {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }

  const handleClickAlert=()=> {
    setAlertOpen(true);
  }

  useEffect(() => {
    GetJobopeningData();
    if (selectedDropdown?.[0]?.id) {
      setSelectjobId(selectedDropdown?.[0]?.jobRole.id)
      setInput(`Job opening for ${selectedDropdown?.[0]?.jobRole.name} in WTT`);
      setContent(`<p>Hi Candidate,</p>
      <p>Hope this email help you, we have job opening for ${selectedDropdown?.[0]?.jobRole.name} at EngazeWell Technologies with the below criteria, <br/>JobDescription : ${selectedDropdown?.[0]?.description} <br/> Responsibilities : ${selectedDropdown?.[0]?.responsibilities}.</p>
      For detailed job description details please visit this link,<a href="${window.location.origin}/#/jobdescription?jobid=${selectedDropdown?.[0].id}" style="text-decoration:underline">Click here</a>
      <p>Thank You,<br/>
      EngazeWell Technologies , TA team</p>`)
    }
  }, [selectedDropdown?.[0]?.jobRole.name]);

  const onChangeEmails = React.useCallback(
    (event1) => {
      var bcclist = event1.target.value;
      var bcclistarray = bcclist?.split(",");
      setInput1(bcclistarray);
    },
    [input1, selectedRecordsEmailIdArray]
  );

  const onChangeloginEmail = React.useCallback(
    (event2) => {
      var tolist = event2.target.value;
      var tolistarray = tolist?.split(",");
      setInput2(tolistarray);
    },
    [input2, useSelectDataTable.loginUserEmailId]
  );

  const onChangeSubject = React.useCallback(
    (event) => {
      setInput(event.target.value);
    },
    [input, selectedDropdown?.[0]?.id]
  );

  const onChangeCclist = React.useCallback(
    (event3) => {
      if (event3.target.value != "") {
        var cclist = event3.target.value;
        var cclistarray = cclist?.split(",");
        setInput3(cclistarray);
      } else {
        setInput3(event3.target.value);
      }
    },
    [input3]
  );

  const onChangeBody = React.useCallback(
    (event4) => {
      setContent(event4)
    },
    [content,selectedDropdown?.[0]?.id]
  );

  const GetJobopeningData=async()=> {
    let getJobOpeningApi = await getJobOpeningDetails();
    let jobOpeningData = props.jobopeiningData ?  getJobOpeningApi.payload.results.filter((e)=> e.id == props.jobopeiningData.id) : getJobOpeningApi.payload.results;
  
    setjobOpenings(jobOpeningData);
    props.jobopeiningData &&
    setSelectedDrpdown(jobOpeningData);
  }
  const handleDropdown = (event) => {
    const selectedData = jobOpenings.filter((e) => e.id === event.target.value);
    setSelectedDrpdown(selectedData);
  };

  const handleSendEmail = async () => {
    try {
      if (
        input2 == "" ||
        input1.length == 0 ||
        !input1[0] ||
        input == null ||
        content == null
      ) {
        setAlertMsg(requiredFiled);
        setSeverity("info");
        handleClickAlert();
      } else {
        const postApi = await postNotificationsEmail(
          selectjobid, // selected jobid
          input2, // tolist
          input1, // bcc list
          input3, // cc list
          input, // subject
          content // body
        );
        setAlertMsg(notificationMessage);
        setSeverity("success");
        setTimeout(function () {
          handleClose();
        }, 1000);
        handleClickAlert();
      }
    } catch (error) {
      setAlertMsg(error.message);
      setSeverity("error");
      handleClickAlert();
    }
  };

  const handleClose = () => {
    props.setOpen3(false);
  };
  const config = {
    readOnly: false,
    placeholder: placeholderEmailBody,
  };
  return (
    <Container id="form-file-upload" onSubmit={(e) => e.preventDefault()}>
      <Heading>{headingNotifyCandidates}</Heading>
      <CloseButton onClick={handleClose}>
        <Icon className="icon">{modalClose}</Icon>
      </CloseButton>
      {jobOpenings && (
        <Grid container spacing={2}>
          <Grid xs={6} sm={11.7} item>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">
                {selectedDropdown ? '':labelJobOpening}
              </InputLabel>

              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label={selectedDropdown ? '':labelJobOpening}
                onChange={handleDropdown}
                disabled = {props.jobopeiningData}
                value={selectedDropdown ? selectedDropdown[0]?.id: null}
                autoWidth
              >
                {jobOpenings.map((e) => (
                  <MenuItem value={e.id}>
                    {e.id +
                      " -" +
                      e.jobRole.name +
                      " -" +
                      e.location.map((e) => e)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={6} sm={11.7} item>
            <TextField
              placeholder={placeholderToList}
              label={labelToList}
              variant="outlined"
              name="ToList"
              value={input2}
              onChange={onChangeloginEmail}
              fullWidth
              required
            />
          </Grid>
          <Grid xs={6} sm={11.7} item>
            <TextField
              placeholder={placeholderBccList}
              label={labelBccList}
              variant="outlined"
              name="BccList"
              value={input1}
              onChange={onChangeEmails}
              fullWidth
              required
            />
          </Grid>
          <Grid xs={6} sm={11.7} item>
            <TextField
              placeholder={placeholderCcList}
              label={labelCcList}
              variant="outlined"
              name="CcList"
              onChange={onChangeCclist}
              fullWidth
            />
          </Grid>
          <Grid xs={6} sm={11.7} item>
            <TextField
              placeholder={placeholderSubject}
              label={labelSubject}
              variant="outlined"
              name="Subject"
              value={input}
              onChange={onChangeSubject}
              fullWidth
              required
            />
          </Grid>
          <Grid xs={6} sm={11.7} item> 
          <Label>Body *</Label>         
            <JoditEditor
              // config={config}
              value={content}
              onChange={event4=>onChangeBody(event4)}
            />
          </Grid>
        </Grid>
      )}
      <SendButton
        variant="contained"
        className="send-button"
        onClick={handleSendEmail}
      >
        {buttonSend}
      </SendButton>
      <div>
        <Snackbar
          open={alertOpen}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          style={alertStyle}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={severity}
            sx={{ width: value100Per }}
            variant="filled"
          >
            {JSON.parse(JSON.stringify(alertMsg))}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
};

export default NotificationsEmail;
