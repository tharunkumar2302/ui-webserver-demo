/* eslint-disable no-unused-vars */
// drag drop file component
import {
  Typography,
  styled,
  Button,
  Icon,
  IconButton,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  postUploadS3Details,
} from "app/redux/actions/ProfileActions";
import { isMobile } from "app/utils/utils";
import { multipliResume, singleResume, buttonUpload, modalClose, multipleBrowse, multipleDragDrop, singleBrowse, singleDragDrop, singleFileUpload, supportFileDocPdfError, supportLimitDocPdf, supportLimitError, supportMsg, supportMsgError, fileUploadMessage, supportFileSuggestion, } from "app/utils/constantForms";
import { value100Per } from "app/utils/constant";
import LoadingBar from "../LoadingBar/LoadingBar";

const fontStyle = {
  fontSize: "0.7rem",
};

const errorfontStyle = {
  fontSize: "0.7rem",
  color: "red",
};

const Container = styled("form")(() => ({
  height: "25rem",
  width: !isMobile() ? "40rem" : "28rem",
  maxWidth: value100Per,
  textAlign: "center",
  position: "relative",
  backgroundColor: "#fff",
  display: "block",
  padding: "1.3rem 2rem",
  borderRadius: "15px",
}));

const Section = styled("div")(() => ({
  height: "13rem",
  width: value100Per,
  display: "flex",
  verticalAlign: "middle",
  alignItems: "center",
  margin: !isMobile() ? "3% 0%" : "7% 0%",
}));

const Input = styled("input")(() => ({
  display: "none",
}));

const Label = styled("label")(() => ({
  height: value100Per,
  width: value100Per,
  display: "block",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: "2px",
  borderRadius: "1rem",
  borderStyle: "dashed",
  borderColor: "#cbd5e1",
  backgroundColor: "#f8fafc",
  padding: "5% 7%",
}));

const DragDropDiv = styled("div")(() => ({
  display: "block",
}));

const DragFileElement = styled("div")(() => ({
  position: "absolute",
  width: value100Per,
  height: value100Per,
  borderRadius: "1rem",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px",
}));

const BrowseButton = styled("button")(() => ({
  cursor: "pointer",
  padding: "0.5rem",
  fontSize: "0.7rem",
  border: "none",
  color: "rgb(25, 118, 210)",
  backgroundColor: "transparent",
  "&:hover": {
    color: "rgb(25, 118, 210)",
    textDecorationLine: "underline",
  },
}));
const UploadButton = styled(Button)(() => ({
  margin: "1rem",
  width: "13rem",
}));

const UploadIcon = styled(CloudUploadIcon)(() => ({
  color: "rgb(25, 118, 210)",
  width: "3em",
  height: "3em",
}));
const Heading = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: "600",
  textAlign: "left",
}));
const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));


const ProfileUpload = ({ ...props }) => {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  let [count, setCount] = React.useState(0);
  let [fileList, setFileList] = React.useState([]);
  let [disableValue, setDisableValue] = React.useState(true);
  let [fileType, setFileType] = React.useState();
  let [fileSize, setFileSize] = React.useState();
  const [alertMsg, setAlertMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [alertOpen, setAlertOpen] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  // Alert Function
  const alertStyle = {
    top: "-28rem",
    left: "auto",
    right: "1.3rem",
  };


  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleClosed = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }

  const handleClick = () => {
    setAlertOpen(true);
  }

  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    let data = e.dataTransfer.files;
    if (props.singleUpload) {
      if (data.length > 1) {
        setAlertMsg(singleFileUpload);
        setSeverity("info");
        setAlertOpen(true);
        return;
      }
    }
    setFileList(data);
    setCount(data.length);
    setFileType(true);
    setFileSize(true);
    setDisableValue(false);
  };

  // triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault();
    let data = e.target.files;
    if (props.singleUpload) {
      if (data.length > 1) {
        setAlertMsg(singleFileUpload);
        setSeverity("info");
        setAlertOpen(true);
        return;
      }
    }
    setFileList(data);
    setCount(data.length);
    setFileType(true);
    setFileSize(true);
    setDisableValue(false);
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  let UploadCondition = false;

  //  handles appending files to FormData
  const handleFiles = async () => {
    setLoading(true);
    const formData = new FormData();
    let count = 0;
    for (let i = 0; i < fileList.length; i++) {
      formData.append("resumefiles", fileList[i]);
      count += fileList[i].size;
    }

   
    for (let i = 0; i < fileList.length; i++) {
      if (count <= 5000000) {
        //limit of  5MB
        setFileSize(true);
        if (
          fileList[i].type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileList[i].type === "application/pdf" ||
          fileList[i].type === "application/msword"||
          fileList[i].type === "application/vnd.google-apps.document"

        ){
          UploadCondition=true;         
        } else {
          setLoading(false);
          setFileType(false);
          setDisableValue(true);
          setLoading(false);
          setAlertMsg(supportFileDocPdfError);
          setSeverity("error");
          handleClick();
          return 0;
        }
      } else {
        setLoading(false);
        setFileSize(false);
        setDisableValue(true);
        return 0;
      }
    }
    if(UploadCondition){
      try{
        const resUploadS3 = await postUploadS3Details(formData,fileList.length);
        setFileType(true);
        setDisableValue(false);
        if ((resUploadS3.payload.status === 200) || (resUploadS3.payload.status === 201)) {
          setAlertMsg(fileUploadMessage);
          setSeverity("success");
          handleClick();            
          if (props.invokeHelper) {
            props.invokeHelper();
          }
          setTimeout(() => {
            props.setOpen1(false)
          }, 1000);
        } else {
          setAlertMsg(resUploadS3.payload.data.message);
          setSeverity("error");
          handleClick();

        }
      }
      catch(e){
        setAlertMsg(e.message);
        setSeverity("error");
        handleClick();
      }
    }
    setLoading(false);
  };
  const handleClose = () => {
    props.setOpen1(false);
  };
  return (
    <Container
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >

      <LoadingBar loading={loading} />

      <Heading>{props.singleUpload ? singleResume : multipliResume}</Heading>
      {props.singleUpload ? "" :
        <CloseButton onClick={handleClose}>
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
      }
      <Section>
        <Input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <Label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <DragDropDiv>
            <Typography style={{ fontSize: "1rem" }}>
              {supportFileSuggestion}
            </Typography>
            <UploadIcon />
            <Typography style={{ fontSize: "1rem", fontWeight: "600" }}>
              {props.singleUpload ? singleDragDrop : multipleDragDrop}
            </Typography>
            <BrowseButton className="upload-button" onClick={onButtonClick}>
              {props.singleUpload ? singleBrowse : multipleBrowse}

            </BrowseButton>
            <Typography style={{ fontSize: "0.5rem" }}>
              {supportLimitDocPdf}
            </Typography>
          </DragDropDiv>
        </Label>
      </Section>
      {count !== 0 && fileType === true && fileSize === true && (
        <Paper elevation={1} style={{ borderRadius: "6px", backgroundColor: "rgba(68,156,68,255)", color: "#fff" }}>
          <Typography style={{ fontSize: "1rem", fontWeight: "500" }}>
            {props.singleUpload ? "You have selected " + count + " file." : "You have selected " + count + " files."}
          </Typography>
        </Paper>
      )}
      {count !== 0 && fileType === true && fileSize === true && (
        <Typography style={{ marginTop: "6px", fontSize: "0.8rem", fontWeight: "400", justifyContent: "center" }}>
          {supportMsgError}
        </Typography>
      )}
      {fileType === false && (
        <Typography style={errorfontStyle}>
          {supportFileDocPdfError}
        </Typography>
      )}
      {fileSize === false && (
        <Typography style={errorfontStyle}>
          {supportLimitError}
        </Typography>
      )}
      <UploadButton
        variant="contained"
        className="upload-button"
        onClick={handleFiles}
        disabled={disableValue}
      >
        {buttonUpload}
      </UploadButton>
      {dragActive && (
        <DragFileElement
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></DragFileElement>
      )}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleClosed}
        style={alertStyle}
      >
        <Alert
          onClose={handleClosed}
          severity={severity}
          sx={{ width: value100Per }}
          variant="filled"
        >
          {JSON.parse(JSON.stringify(alertMsg))}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileUpload;
