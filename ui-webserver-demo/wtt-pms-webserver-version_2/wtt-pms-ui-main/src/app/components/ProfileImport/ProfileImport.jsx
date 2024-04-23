/* eslint-disable no-unused-vars */
// drag drop file component
import {
  Typography,
  styled,
  Button,
  Icon,
  IconButton,
  Tooltip
} from "@mui/material";
import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { postProfileImportDetails } from "app/redux/actions/ProfileActions";
import { isMobile } from "app/utils/utils";
import {
  buttonUpload,
  headingImportProfiles,
  modalClose,
  multipleBrowse,
  multipleDragDrop,
  supportFileXlsError,
  supportLimitXls,
  supportMsgError,
  fileUploadMessage,
  tooltipExportTemplate,
} from "app/utils/constantForms";
import { value100Per } from "app/utils/constant";
import AlertMsg from "../AlertMsg/AlertMsg";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportTemplate } from "../ExportTemplate/ExportTemplate";

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
const alertStyle = {
  top: "-28rem",
  left: "auto",
  right: "2.3rem",
};

const ProfileImport = ({ setOpen2 }) => {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  let [count, setCount] = React.useState(0);
  let [fileList, setFileList] = React.useState([]);
  let [disableValue, setDisableValue] = React.useState(true);
  let [fileType, setFileType] = React.useState();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("");
  const [alertMsg, setAlertMsg] = React.useState("");
  // ref
  const inputRef = React.useRef(null);

  const handleClick = () => {
    setAlertOpen(true);
  };

  // handle drag events
  const handleDrag =(e)=> {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e)=> {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    let data = e.dataTransfer.files;
    setFileList(data);
    setCount(data.length);
    setFileType(true);
    setDisableValue(false);
  };

  // triggers when file is selected with click
  const handleChange = (e)=> {
    e.preventDefault();
    let data = e.target.files;
    setFileList(data);
    setCount(data.length);
    setFileType(true);
    setDisableValue(false);
  };

  //Alert massage fuction
  const handleClose =(_, reason)=> {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      if (
        fileList[i].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        formData.append("resumes", fileList[i]);
        try {
          const xlsImport = await postProfileImportDetails(formData);
          if (
            xlsImport.payload.status === 200 ||
            xlsImport.payload.status === 201
          ) {
            setFileType(true);
            setDisableValue(false);
            setAlertMsg(fileUploadMessage);
            setSeverity("success");
            handleClick();
            setTimeout(() => {
              setOpen2(false);
            }, 1000);
          }
        } catch (e) {
          setAlertMsg(e.message);
          setSeverity("error");
          handleClick();
        }
      } else {
        setFileType(false);
        setDisableValue(true);
        setAlertMsg(supportFileXlsError);
        setSeverity("error");
        handleClick();
        return 0;
      }
    }
  };
  const handleClosePopup = () => {
    setOpen2(false);
  };
  return (
    <Container
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <Heading>{headingImportProfiles}</Heading>
      <CloseButton onClick={handleClosePopup}>
        <Icon className="icon">{modalClose}</Icon>
      </CloseButton>
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
            <UploadIcon />
            <Typography style={{ fontSize: "1rem", fontWeight: "600" }}>
              {multipleDragDrop}
            </Typography>
            <BrowseButton className="upload-button" onClick={onButtonClick}>
              {multipleBrowse}
            </BrowseButton>
            <Typography style={{ fontSize: "0.5rem" }}>
              {supportLimitXls}
            </Typography>
          </DragDropDiv>
        </Label>
      </Section>
      <ExportTemplate  />
      {count !== 0 && fileType === true && (
        <Typography style={fontStyle}>
          You have select {count} files.
        </Typography>
      )}
      {count !== 0 && fileType === true && (
        <Typography style={fontStyle}>
          {supportMsgError}
        </Typography>
      )}
      {fileType === false && (
        <Typography style={errorfontStyle}>
          {supportFileXlsError}
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

      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
    </Container>
  );
};

export default ProfileImport;