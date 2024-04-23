/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Grid, MenuItem, Select, styled, useTheme } from "@mui/material";
import { getDashboardDetails  } from "app/redux/actions/CommonActions";
import { candidateDashboardRoute, defaultCalendarValue, doughnuHeight, doughnutWidth, value100Per } from "app/utils/constant";
import { headingDashboardChart } from "app/utils/constantForms";
import { isMobile } from "app/utils/utils";
import { Fragment, useEffect, useState } from "react";
import DoughnutChart from "./shared/Doughnut";
import StatCards from "./shared/StatCards";
import { useNavigate } from "react-router-dom";
import { headingDashboardChartDays } from "app/utils/constantDropDown";
import SubscriptionTable from "./shared/SubscriptionTable.jsx";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Title = styled("span")(() => ({
  fontSize: "12px",
  fontWeight: "500",
  lineHeight: '1.5',
  whiteSpace: 'normal',
  marginRight: ".5rem",
  textTransform: "none",
  width: "50%",
  display: "inline-grid",
}));

const DropDown = styled(Select)(() => ({
  display: "inline-grid",
  width: "46%",
  height: "44px",
  alignContent: "center",
}));

const Analytics = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [dashboardApi, setDashboardApi] = useState();
  const [calendarValue, setCalendarValue] = useState(defaultCalendarValue);
  const [totalResumes, setTotalResumes] = useState(0);
  const [updatedResumes, setUpdatedResumes] = useState(0);
  const [notUpdatedResumesMoreThan1Year, setNotUpdatedResumesMoreThan1Year] = useState(0);
  const [notUpdatedResumesMoreThan30daysTo1Year, setNotUpdatedResumesMoreThan30daysTo1Year] = useState(0);
  const [uploadByRecruter, setUploadByRecruter] = useState(0);
  const [uploadByCandidate, setUploadByCandidate] = useState(0);
  const [deactivatedResumes, setDeactivatedResumes] = useState(0);

 useEffect(() => {
    if (localStorage.getItem('userRole') === 'candidate') {
      navigate(candidateDashboardRoute);
    } else {
      getDashboardDetails().then((users) => setDashboardApi(users?.payload));
    }
  }, []);

  const dashboardDataGet = async (dashboardApi) => {
    setTotalResumes(Number(dashboardApi?.totalResumes));
    setNotUpdatedResumesMoreThan1Year(
      Number(dashboardApi?.notUpdatedResumes.moreThan1Year)
    );
    setNotUpdatedResumesMoreThan30daysTo1Year(
      Number(dashboardApi?.notUpdatedResumes.moreThan30daysTo1Year)
    );
    setUpdatedResumes(Number(dashboardApi?.updatedResumes.inLast30Days));
    setDeactivatedResumes(Number(dashboardApi?.deActivatedResumes));
    if (calendarValue === "today") {
      setUploadByCandidate(
        Number(dashboardApi?.uploadSummary.byCandidate.today)
      );
      setUploadByRecruter(
        Number(dashboardApi?.uploadSummary.byRecruiter.today)
      );
    } else if (calendarValue === "yesterday") {
      setUploadByCandidate(
        Number(dashboardApi?.uploadSummary.byCandidate.yesterday)
      );
      setUploadByRecruter(
        Number(dashboardApi?.uploadSummary.byRecruiter.yesterday)
      );
    } else if (calendarValue === "week") {
      setUploadByCandidate(
        Number(dashboardApi?.uploadSummary.byCandidate.week)
      );
      setUploadByRecruter(
        Number(dashboardApi?.uploadSummary.byRecruiter.week)
      );
    } else if (calendarValue === "month") {
      setUploadByCandidate(
        Number(dashboardApi?.uploadSummary.byCandidate.month)
      );
      setUploadByRecruter(
        Number(dashboardApi?.uploadSummary.byRecruiter.month)
      );
    }
  };

  useEffect(() => {
    dashboardDataGet(dashboardApi);
  }, [{ calendarValue, dashboardDataGet }]);

  const handleCalendar =(e)=> {
    setCalendarValue(e.target.value);
  }

  return (
    <Fragment>
      <ContentBox className="analytics">
        <div className="dashdoard_main">
        <div className="child dashboard_w">
         <Grid  className="dashdoard_widgets" item lg={8} md={8} sm={12} xs={12}>
            <StatCards
              totalResumes={totalResumes}
              updatedResumes={updatedResumes}
              notUpdatedResumesMoreThan1Year={notUpdatedResumesMoreThan1Year}
              notUpdatedResumesMoreThan30daysTo1Year={
                notUpdatedResumesMoreThan30daysTo1Year
              }/>
          </Grid>
          <div className="dashdoard_table">
          <SubscriptionTable></SubscriptionTable>
          </div>
         </div>
          <div className="child doughnutChart">
          <Grid className="doughnut" item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>{headingDashboardChart}</Title>
              <DropDown
                id="calendar"
                value={calendarValue}
                onChange={(e) => handleCalendar(e)}
              >{headingDashboardChartDays.map((el) => (
                <MenuItem value={el.title}>
                  {el.display}
                </MenuItem>
              ))
                }
              </DropDown>

              <DoughnutChart
                height={doughnuHeight}
                width={!isMobile() ? value100Per : doughnutWidth}
                color={[
                  palette.primary.main,
                  palette.success.main,
                  palette.error.main,
                ]}
                deactivatedResumes={deactivatedResumes}
                uploadByRecruter={uploadByRecruter}
                uploadByCandidate={uploadByCandidate}
              />

            </Card>
          </Grid>
          </div>
        </div>
       
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
