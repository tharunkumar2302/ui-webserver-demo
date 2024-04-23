/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Dialog, Grid, Select, styled, useTheme } from "@mui/material";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import { Box } from "@mui/system";
import { SimpleCard } from "app/components";
import SimpleTable from "app/components/SimpleTable/SimpleTable";
import { getCandidateDashboardDetails } from "app/redux/actions/CommonActions";
import { doughnuHeight, doughnuHeightCand, doughnutWidth, doughnutWidthCand, localStorageUserfile, value100Per } from "app/utils/constant";
import { notUploaded, uploaded, headingCandidateDashboardChart, processing, DownloadProfileCandidate,candidateProfileError } from "app/utils/constantForms";
import { isMobile } from "app/utils/utils";
import { Fragment, useContext, useEffect, useState } from "react";
import DoughnutChart from "./shared/Doughnut";
import StatCards from "./shared/StatCards";
import ProfileUpload from "app/components/ProfileUpload/ProfileUpload";
import { getCandidateProfileDownload } from "app/redux/actions/ProfileActions";
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const SimpleCardBox = styled(Box)(() => ({
  height: "auto!important"
}));

const Title = styled("span")(() => ({
  fontSize: "15px",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize",
  width: "50%",
  display: "inline-grid",
}));

const DropDown = styled(Select)(() => ({
  display: "inline-grid",
  width: "46%",
  height: "44px",
  alignContent: "center",
}));

const DragDropDialog = styled(Dialog)(() => ({

}));
const DragDropBox = styled(Box)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: !isMobile() ? "50%" : 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
}));

const CandidateAnalytics = () => {
  const { palette } = useTheme();
  const [dashboardApi, setDashboardApi] = useState();
  const [resumeUploaded, setResumeUploaded] = useState("");
  const [cvUploadedDate, setCvUploadedDate] = useState("");
  const [basicDetailsPercentage, setBasicDetailsPercentage] = useState(0);
  const [educationDetailsPercentage, setEducationDetailsPercentage] = useState(0);
  const [experienceDetailsPercentage, setExperienceDetailsPercentage] = useState(0);
  const [professionalInfoPercentage, setProfessionalInfoPercentage] = useState(0);
  const [skillSetPercentage, setSkillSetPercentage] = useState(0);
  const [cvUploadPercent, setCvUploadPercent] = useState(0);
  const [applied, setApplied] = useState(0);
  const [proccessed, setProccessed] = useState(0);
  const [scheduled, setScheduled] = useState(0);
  const [selected, setSelected] = useState(0);
  const [notSelected, setNotSelected] = useState(0);
  const [withDraw, setWithDraw] = useState(0);
  const [open, setOpen] = useState(!(localStorageUserfile()));
  const [open1, setOpen1] = useState(!(localStorageUserfile()));
  const [singleUpload, setSingleUpload] = useState(true);
  const [headingColor, setHeadingColor] = useState();
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    getCandidateDashboardDetails().then((users) => setDashboardApi(users?.payload?.data));
  }, []);

  useEffect(() => {
    dashboardApi?.resumeUploaded === false ?
      (localStorageUserfile() === 'uploaded' ?
        setHeadingColor('rgb(255, 175, 56)') :
        setHeadingColor('rgb(255, 61, 87)')) :
      (resumeUploaded === uploaded && localStorageUserfile()) ?
        setHeadingColor('rgb(8, 173, 108)') :
        setHeadingColor('rgb(25, 118, 210)')
  })

  const dashboardDataGet = async (dashboardApi) => {
    setResumeUploaded(dashboardApi?.resumeUploaded === false ? (localStorageUserfile() === 'uploaded' ? processing : notUploaded) : uploaded);
    setCvUploadedDate(dashboardApi?.cvUploadedDate);

    setBasicDetailsPercentage(Number(dashboardApi?.detailFilled?.basicDetailsPercentage));
    setEducationDetailsPercentage(Number(dashboardApi?.detailFilled?.educationDetailsPercentage));
    setExperienceDetailsPercentage(Number(dashboardApi?.detailFilled?.experienceDetailsPercentage));
    setProfessionalInfoPercentage(Number(dashboardApi?.detailFilled?.professionalInfoPercentage));
    setSkillSetPercentage(Number(dashboardApi?.detailFilled?.primarySkillPercentage));
    setCvUploadPercent(Number(dashboardApi?.detailFilled?.cvUploadPercent));
    setApplied(dashboardApi?.appliedjobData.hasOwnProperty("applied") === true ? Number(dashboardApi?.appliedjobData?.applied) : 0);
    setProccessed(dashboardApi?.appliedjobData.hasOwnProperty("proccessed") === true ? Number(dashboardApi?.appliedjobData?.proccessed) : 0);
    setScheduled(dashboardApi?.appliedjobData.hasOwnProperty("scheduled") === true ? Number(dashboardApi?.appliedjobData?.scheduled) : 0);
    setSelected(dashboardApi?.appliedjobData.hasOwnProperty("selected") === true ? Number(dashboardApi?.appliedjobData?.selected) : 0);
    setNotSelected(dashboardApi?.appliedjobData.hasOwnProperty("close") === true ? Number(dashboardApi?.appliedjobData?.notSelected) : 0);
    setWithDraw(dashboardApi?.appliedjobData.hasOwnProperty("withDraw") === true ? Number(dashboardApi?.appliedjobData?.withDraw) : 0);
  };

  useEffect(() => {
    dashboardDataGet(dashboardApi);
  }, [{ dashboardDataGet }]);

  const invokeHelper = () => {
    localStorage.setItem("userfile", "uploaded");
    setTimeout(function () {
      setOpen1(false);
      setOpen(false);
    }, 1000)

  }
  const DownloadProfile = async () => {
    try {
      const filePath = JSON.parse(localStorage.getItem('userDetails')?? '{}')?.resume?.file_path?.split('/').slice(-1)[0];
      const getCandidateProfileDownloadAPI = await getCandidateProfileDownload();
      const testing = getCandidateProfileDownloadAPI.payload;
      const url = window.URL.createObjectURL(new Blob([testing]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        filePath
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setAlertMsg(DownloadProfileCandidate);
      setSeverity("success");
      handleClick();
    } catch (e) {
      console.log("error while downloading the candidate profile",e);
      setAlertMsg(candidateProfileError);
      setSeverity("error");
      handleClick();
    }
  };

    const handleClose = (_, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setAlertOpen(false);
    };

    const handleClick = () => {
      setAlertOpen(true);
    };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <StatCards
              resumeUploaded={resumeUploaded}
              cvUploadedDate={cvUploadedDate}
              headingColor={headingColor}
              DownloadProfile={DownloadProfile}
            />
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <Card sx={{ px: 2, py: 2, mb: 3 }}>
              <Title>{headingCandidateDashboardChart} : {parseInt(basicDetailsPercentage+educationDetailsPercentage+experienceDetailsPercentage+professionalInfoPercentage+skillSetPercentage+cvUploadPercent) ? parseInt(basicDetailsPercentage+educationDetailsPercentage+experienceDetailsPercentage+professionalInfoPercentage+skillSetPercentage+cvUploadPercent):0}% </Title>
              <></>
              {/* <DoughnutChart
                height={doughnuHeightCand}
                width={!isMobile() ? value100Per : doughnutWidthCand}
                color={[
                  palette.error.main,
                  palette.secondary.main,
                  palette.primary.main,
                  palette.success.main,
                ]}
                basicDetailsPercentage={basicDetailsPercentage}
                educationDetailsPercentage={educationDetailsPercentage}
                experienceDetailsPercentage={experienceDetailsPercentage}
                professionalInfoPercentage={professionalInfoPercentage}
              /> */}
            </Card>
          </Grid>
        </Grid>
      </ContentBox>
      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
      <>
        <DragDropDialog open={open} id="candidateDashboradProfileUpload">
          <ProfileUpload setOpen1={setOpen1} invokeHelper={invokeHelper} singleUpload={singleUpload} />
        </DragDropDialog>
      </>
    </Fragment>
  );
};

export default CandidateAnalytics;
