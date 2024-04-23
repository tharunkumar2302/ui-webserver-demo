/* eslint-disable no-unused-vars */
import BulkUpload from "browser-bulk-upload";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import API from 'app/apiManager/endpoints';
import React, { useState } from "react";
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  postUploadS3Details,
} from "app/redux/actions/ProfileActions";
import {
  Typography,
  styled,
  Button,
  Icon,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Card,
  Divider,
  Grid,
} from "@mui/material";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import { localStorageAccessToken } from 'app/utils/constant';
import requestClient from "app/apiManager/interceptors";
const Heading = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: "600",
  textAlign: "center",
  lineHeight: '5rem'
}));
const CardStyle = styled(Card)(() => ({
  height: '150px',
  textAlign: 'center',
  width: '200px'
}));
const Iconstyle = styled(UploadFileRoundedIcon)(() => ({
  color: 'white'
}));
// const Input = styled("input")(() => ({
//   margin: "1rem",
//   width: "13rem",
//   marginLeft: "25rem"
// }));
// const alertStyle = {
//   top: "-28rem",
//   left: "auto",
//   right: "1.15px",
// };
// const buttons = {
//   marginLeft: "30px",
//   height: "30px",
//   width: "130px"
// }
export default function ProfileUpload({ ...props }) {
  const inputRef = React.useRef(null);
  const handleClick = () => {
    setAlertOpen(true);
  }
  const handleClosed = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }
  const [loading, setLoading] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [completedUploads, setCompletedUploads] = useState(0);
  const [failedUploads, setFailedUploads] = useState(0);
  const [inQueue, setInQueue] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  let [selectedFiles, setSelectedFiles] = useState([]);
  // Update the status values whenever the files object changes
  const bulkUpload = new BulkUpload({
    concurrency: 5,
    //synchronous function for returning axios request args
    requestArguments: ({ file, fileHierarchy }) => {
      //fileHierarchy -> please refer isFileHierarchy flag comment below
      const formData = new FormData();
      formData.append("resumefiles", file);
      // console.log(files,'files')
      // for (let i = 0; i < files.length; i++) {
      //     formData.append("resumefiles", files[i]);
      //   }
      // const res = await postUploadS3Details(formData);
      // console.log(res)
      const res = {
        url: `${API.POST_UPLOAD_S3_API}?filesCount=${selectedFiles.length}`,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorageAccessToken()}`,
        },
        data: formData,
      };
      return res

      

    },
    lastProgressUpload: 100, //for every 100ms download/upload progress will be updated and onUpdate callback will be invoked
    onUpdate: ({
      IN_QUEUE /**MAP -> [(name) => FileObj]**/,
      IN_PROGRESS /**MAP -> [(name) => FileObj]**/,
      FAILED_UPLOADS /**MAP -> [(name) => FileObj]**/,
      COMPLETED_UPLOADS /**Number */,

    }) => {
      //on complete, failed, inQueue & inProgress structure update callback is invoked
      onUploadUpdate({
        IN_QUEUE,
        IN_PROGRESS,
        FAILED_UPLOADS,
        COMPLETED_UPLOADS,
      });
    },
    onUploadComplete: () => {
      console.log("request completed");
    },
    requestOptions: {
      uploadProgress: true, //send request upload percentage
      // downloadProgress: true, send request download percentage
    },
    isFileHierarchy: false /**enable this flag if you have a requirement of sending folders as a BFS like Google-Drive folder upload to fetch all folder path(s), 
  please use this library : https://www.npmjs.com/package/files-hierarchy 
  **/,
  });

  const { cancel, destroy, retry, updateQueue } = bulkUpload.getControls();
  /**
   * cancel -> cancel failed request -> cancel(FileObj)
   * destroy -> cancel all inprogress and remove all inqueue request(s) -> destroy()
   * retry -> retry only failed request -> retry([FileObj])
   * updateQueue -> update existing queue upload. Please note if you start upload again internally updateQueue is been called
   */
  function onUploadUpdate({
    IN_QUEUE,
    IN_PROGRESS,
    FAILED_UPLOADS,
    COMPLETED_UPLOADS, //number
  }) {

    // console.log(COMPLETED_UPLOADS,'COMPLETED_UPLOADS')
    // console.log(IN_QUEUE,'Queue')
    // console.log(FAILED_UPLOADS,'FAILED_UPLOADS')
    // console.log(IN_PROGRESS,'IN_PROGRESS')


    setCompletedUploads(COMPLETED_UPLOADS);
    setFailedUploads(FAILED_UPLOADS.size);
    setInQueue(IN_QUEUE.size);
    setInProgress(IN_PROGRESS.size);
    /**FAILED|IN_QUEUE, IN_PROGRESS -> 
      MAP{ FILE_NAME_ID -> 
     FileObj = {
        file: File | null;
        fileHierarchy: FileHierarchy | null;
        status: FileStatus;
        uploadCount?: number;
        downloadCount?: number;
        isCancelled?: boolean; //if cancelled by user else request failed
        id: string;
        lastProgressUpdated?: number;
      };
      }**/
  }
  //start the upload
  return (
    <>
      <Card>
        <Heading>Resumes Bulk Uploads</Heading>
        <Grid style={{ display: 'flex', justifyContent: 'end', marginRight: '1rem' }}>
          <Button variant="contained" component="label" endIcon={<CloudUploadIcon />}>
          Resumes Bulk Upload  ({selectedFiles.length})
            <input hidden multiple type="file" onChange={async(e) => {
               const response = await requestClient.get(API.CURRENTUSER_API)
              selectedFiles = e.target.files;
              setSelectedFiles(e.target.files);
              const allowedFileTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            
              let isValid = true;

            // Check if all selected files have allowed file types
            for (let i = 0; i < e.target.files.length; i++) {
              if (!allowedFileTypes.includes(e.target.files[i].type)) {
                isValid = false;
                break;
              }
            }

            setTimeout(()=>{
              if (isValid) {
              bulkUpload.start(e.target.files);
            } else {
              setAlertOpen(true);
              setSeverity("error");
              setAlertMsg("Only PDF, DOC, and DOCX files are allowed.");
            }
            });
          }} />
          </Button>
        </Grid>
        <Card sx={{ height: 300, flexGrow: 1 }} style={{ display: "flex", justifyContent:'space-between', height: '100%', padding: '5rem' }}>
          <CardStyle style={{border: '2px solid #0080004f'}}>
            <Typography level="body3" style={{ marginTop: '4rem', fontSize: '15px' }} sx={{ fontWeight: '500' }}>
              Completed
            </Typography>
            <Typography level="body3" sx={{ fontWeight: 'md' }}>
              {completedUploads}
            </Typography>
          </CardStyle>
          <CardStyle style={{border: '2px solid red'}}>
            <Typography level="body3" style={{ marginTop: '4rem', fontSize: '15px' }} sx={{ fontWeight: '500' }}>
              Failed
            </Typography>

            <Typography level="body3" sx={{ fontWeight: 'md' }}>
              {failedUploads}
            </Typography>
          </CardStyle>
          <CardStyle style={{border: '2px solid #0049ff66'}}>
            <Typography level="body3" style={{ marginTop: '4rem', fontSize: '15px' }} sx={{ fontWeight: '500' }}>
              In Queue
            </Typography>

            <Typography level="body3" sx={{ fontWeight: 'md' }}>
              {inQueue}
            </Typography>
          </CardStyle>
          <CardStyle style={{border: '2px solid #dcdc5ac4'}}>
            <Typography level="body3" style={{ marginTop: '4rem', fontSize: '15px' }} sx={{ fontWeight: '500' }}>
              In Progress
            </Typography>

            <Typography level="body3" sx={{ fontWeight: 'md' }}>
              {inProgress}
            </Typography>
          </CardStyle>
        </Card>      
      </Card>
      <AlertMsg
        open={alertOpen}
        handle={handleClosed}
        severity={severity}
        Msg={alertMsg}
      />

    </>
  );
};
