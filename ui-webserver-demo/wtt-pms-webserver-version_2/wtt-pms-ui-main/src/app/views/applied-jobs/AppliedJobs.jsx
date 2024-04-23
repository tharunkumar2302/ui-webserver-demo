/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ReusableGrid from "app/components/ReusableGrid/ReusableGrid";
import '../applied-jobs/AppliedJobs'
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import {
  getAppliedJobsDetails,
} from "app/redux/actions/AppliedJobsActions";
import { appliedJobsColumns } from 'app/components/TableColumns/appliedJobsColumns'
import { jobDetailRoute, value100Per,apiLimit200, apiPageNo1 } from 'app/utils/constant';
import JobDetails from 'app/components/JobDetails/JobDetails';
import LoadingBar from 'app/components/LoadingBar/LoadingBar';
import API from "app/apiManager/endpoints";
export default function AppliedJobs() {
  const [rowdata, setrowdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")
  const [severity, setSeverity] = useState("");
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState(false);
  const [jobId, setJobId] = useState('');
  const [params, setParams] = React.useState({
    limit: apiLimit200,
    page: apiPageNo1,
  });
  const alertStyle = {
    top: '-28rem',
    left: 'auto',
    right: '1.3rem',
  }

  //create new job handler
  let id;
  //Alert massage fuction
  const handleClose =(_, reason)=> {
    if (reason === "clickaway") { return; }
    setAlertOpen(false);
  }

  const handleClick =()=> {
    setAlertOpen(true);
  }
  // Get Table job opening Data 
  const GetJobAppliedData = async () => {
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
    });
  }

  // onCellClick
  const onCellClick = (e) => {
    //to be filled
    setloading(true);
    setJobId(e.cell.jobApplication.id);
  }
  return (
    <div style={{ backgroundColor: "#f9fafd" }}>
      <div className="main-div-recruiter">
        <div style={{ margin: '4rem' }} />
        <div style={{ margin: '1rem' }}>
          <ReusableGrid
            endpoint={API.JOBAPPLICANT_CURRENT_USER_API}
            params={params}
            divId='appliedJobs'
            columns={appliedJobsColumns}
            onCellClick={onCellClick} />
        </div>

      </div>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose} style={alertStyle}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: value100Per }} variant="filled">
          {JSON.parse(JSON.stringify(alertMsg))}
        </Alert>
      </Snackbar>
      <LoadingBar loading={loading} />
      {jobId &&
        <JobDetails jobId={jobId} setJobId={setJobId} setOpenDetails={setOpenDetails} openDetails={openDetails} setloading={setloading} />}
    </div>
  )
}