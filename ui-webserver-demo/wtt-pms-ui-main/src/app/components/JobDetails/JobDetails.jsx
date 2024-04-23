/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import { Alert, Box, Button, Container, Dialog, DialogContent, Divider, Grid, Icon, IconButton, Paper, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessIcon from '@mui/icons-material/Business';
import {
  getJobDetails,
  postJobDetails,
  patchJobDetails,
} from "app/redux/actions/JobDetailsActions";
import {
  appliedJob,
  labelCompanyName,
  labelExperience,
  labelPostedOn,
  labelTotalOpenings,
  labelApplicants,
  labelJobDescription,
  labelJobDetails,
  labelResponsibilities,
  labelRequiredSkills,
  buttonWithdraw,
  buttonApply,
  widthDrawJob,
  modalClose,
  labelEductionalQualification,
} from "app/utils/constantForms";
import { localStorageCandidate, value100Per } from 'app/utils/constant';
import UndoIcon from '@mui/icons-material/Undo';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { isMobile } from 'app/utils/utils';

export default function JobDetails(props) {
  const [currentdetails, setCurrentDetails] = useState({});
  const data = document.location.hash?.split("?")[1];
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(localStorageCandidate()?.id);
  const [statusBadge, setStatusBadge] = useState()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")
  const [severity, setSeverity] = useState("")

  const alertStyle = {
    top: '-28rem',
    left: 'auto',
    right: '1.3rem',
  }

  const Item = styled('div')(() => ({
    padding: '20px 20px 5px 20px',
  }));

  const StyleDiv = styled('div')(() => ({
    margin: '12px 0px 5px 0px',
    fontSize: '13px'
  }));

  const StyleDivFont = styled('div')(() => ({
    fontSize: '13px'
  }));

  const PaperStyling = styled(Paper)(() => ({
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
    boxShadow: 'rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px'
  }));

  const CloseButton = styled(IconButton)(() => ({
    position: "absolute",
    right: "2%",
    top: "1%",
  }));


  const handleClick = () => {
    setAlertOpen(true);
  }

  //Alert message fuction
  const handleClose = (_, reason) => {
    if (reason === "clickaway") { return; }
    setAlertOpen(false);
  }

  const closeDetails = () => {
    props?.setOpenDetails(false);
    props?.setJobId("");
  }

  const JobDetails = async () => {
    try {
      const getJobDetailsApi = await getJobDetails(props?.jobId);
      setCurrentDetails(getJobDetailsApi.payload);
      props.setloading(false);
      props.setOpenDetails(true)
      getJobDetailsApi?.payload?.applicants?.results?.forEach(element => {
        // eslint-disable-next-line eqeqeq
        if (element.createdByUserId == userId) {
          setStatusBadge(element.status);
        }
      });

    } catch (e) {
      setAlertMsg(e.message);
      setSeverity("error");
      handleClick();
    }
  }

  useEffect(() => {
    JobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyJob = async () => {
    try {
      const postJobDetailsApi = await postJobDetails({ "jobApplication": props?.jobId });
      setAlertMsg(appliedJob);
      setSeverity("success");
      handleClick();
      JobDetails();
    } catch (e) {
      setAlertMsg(e.message);
      setSeverity("error");
      handleClick();
    }
  }

  const withdrawJob = async () => {
    try {
      const patchJobDetailsApi = await patchJobDetails({ "jobApplication": props?.jobId, "status": "withDraw" });
      setAlertMsg(widthDrawJob);
      setSeverity("success");
      handleClick();
      JobDetails();
      setStatusBadge("");
    } catch (e) {
      setAlertMsg(e.message);
      setSeverity("error");
      handleClick();
    }
  }

  const checkApplied = () => {
    var showButton = false
    if (currentdetails?.applicants?.results?.length > 0) {
      currentdetails.applicants.results.forEach(element => {
        if (element.createdByUserId == userId) {
          if (element.status == "applied") {
            showButton = true;
          }
        }
      });
    }

    return showButton;
  }
  return (
    <>
      <Dialog open={props?.openDetails} maxWidth={"lg"} fullWidth={true} onClose={closeDetails}>
        <CloseButton
          onClick={closeDetails}
          style={{ position: "absolute", padding: "8px" }}
        >
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
        <DialogContent style={{ padding: isMobile && "20px 15px" }}>
          <Container maxWidth="m" style={{ padding: isMobile ? "20px 0px" : "20px" }}>
            {Object.keys(currentdetails).length != 0 ?
              <div>
                <PaperStyling>
                  <Item>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      {currentdetails?.jobRole && <Typography variant="h5" gutterBottom><b>{currentdetails.jobRole.name}</b></Typography>}
                      {statusBadge && <div className={statusBadge + "-badge"}>{statusBadge && statusBadge.replace(/^\w/, c => c.toUpperCase())}</div>}
                    </div>
                    {currentdetails.organization && currentdetails.organization.name && <StyleDiv >
                      <BusinessIcon sx={{ fontSize: 20, top: "3px", position: "relative" }} /><Typography variant="h7" gutterBottom style={{ marginLeft: "8px" }}><b style={{ fontWeight: "500" }}>{labelCompanyName}</b> : {currentdetails.organization.name}</Typography>
                    </StyleDiv>}
                    {currentdetails.minExperience && currentdetails.maxExperience && <StyleDiv >
                      <WorkOutlineIcon sx={{ fontSize: 20, top: "3px", position: "relative" }} /><Typography variant="h7" gutterBottom style={{ marginLeft: "8px" }}><b style={{ fontWeight: "500" }}>{labelExperience}</b> : {currentdetails.minExperience} - {currentdetails.maxExperience} years</Typography>
                    </StyleDiv>}
                    {currentdetails.location && currentdetails.location && <StyleDiv >
                      <LocationOnIcon sx={{ fontSize: 20, top: "3px", position: "relative" }} /><Typography variant="h7" gutterBottom style={{ marginLeft: "8px" }}>{currentdetails.location.toString()}</Typography>
                    </StyleDiv>}
                    <Divider />
                    <Grid container spacing={1} style={{ padding: "5px", fontSize: "11px" }}>
                      {currentdetails.createdAt && <>
                        <Grid item ><Typography variant="h7" gutterBottom><b style={{ fontWeight: "500" }}>{labelPostedOn}</b> : {new Date((currentdetails.createdAt)?.toString())?.toLocaleString()?.split(',')[0]}</Typography></Grid>
                        <Grid item ><Divider orientation='vertical' /></Grid></>}
                      {currentdetails.totalOpenings && <>
                        <Grid item >{currentdetails.totalOpenings && <Typography variant="h7" gutterBottom><b style={{ fontWeight: "500" }}>{labelTotalOpenings}</b> : {currentdetails.totalOpenings}</Typography>}</Grid>
                        <Grid item ><Divider orientation='vertical' /></Grid></>}
                      {currentdetails.applicants && <>
                        <Grid item >{currentdetails.applicants && <Typography variant="h7" gutterBottom><b style={{ fontWeight: "500" }}>{labelApplicants}</b> : {currentdetails.applicants.totalRecords}</Typography>}</Grid></>}
                    </Grid>

                  </Item>
                </PaperStyling>

                <PaperStyling style={{ marginTop: '20px' }}>
                  <Item>
                    <Typography variant="h6" gutterBottom><b style={{ fontWeight: "500" }}>{labelJobDetails}</b> :</Typography>
                    <Typography variant="h7" gutterBottom><b>{labelJobDescription}</b> :</Typography>
                    <StyleDivFont><span dangerouslySetInnerHTML={{ __html: currentdetails.description }}></span></StyleDivFont>
                    {currentdetails.responsibilities && <StyleDiv >
                      <Typography variant="h7" gutterBottom><b>{labelResponsibilities}</b> : </Typography>
                      <div><span dangerouslySetInnerHTML={{ __html: currentdetails.responsibilities }}></span></div>
                    </StyleDiv>}
                    {currentdetails.skillsRequired && <StyleDiv >
                      <Typography variant="h7" gutterBottom><b>{labelRequiredSkills}</b>: <span dangerouslySetInnerHTML={{ __html: currentdetails.skillsRequired }}></span></Typography>
                    </StyleDiv>}
                    {currentdetails.qualification && <StyleDiv >
                      <Typography variant="h7" gutterBottom><b style={{ fontWeight: "500" }}>{labelEductionalQualification}</b> : </Typography>
                      <div>{currentdetails.qualification}</div>
                    </StyleDiv>}
                    <Divider />
                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse', pt: 2 }}>
                      {checkApplied() ? <Button variant="contained" color="error" onClick={withdrawJob}><UndoIcon fontSize="small" style={{ marginRight: "0.5rem" }} /> {buttonWithdraw}</Button>
                        : <Button variant="contained" style={{ backgroundColor: "rgb(9, 182, 109)" }} onClick={applyJob}><TaskAltIcon fontSize="small" style={{ marginRight: "0.5rem" }} /> {buttonApply}</Button>}
                    </Box>

                  </Item>
                </PaperStyling>
              </div>
              : ""}
          </Container>
        </DialogContent>
      </Dialog>
      <div> </div>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleClose} style={alertStyle}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: value100Per }} variant="filled">
          {JSON.parse(JSON.stringify(alertMsg))}
        </Alert>
      </Snackbar>
    </>
  )
}
