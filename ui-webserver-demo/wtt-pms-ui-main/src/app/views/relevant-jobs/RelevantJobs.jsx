/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import ReusableGrid from "app/components/ReusableGrid/ReusableGrid";
import { Box } from "@mui/system";
import RelevantJobsFilter from "../../components/Filter/FilterAdvance/RelevantJobsFilter";
import { relevantJobsColumns } from "app/components/TableColumns/relevantJobsColumns";
import { postRelevantJobDetails } from "app/redux/actions/RelevantJobsActions";
import FilterSearch from "../../components/Filter/FilterSearch/FilterSearch";
import API from "app/apiManager/endpoints";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import JobDetails from "app/components/JobDetails/JobDetails";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, styled } from "@mui/material";
import { validate } from "app/utils/validation";
import { apiLimit200, apiPageNo1 } from "app/utils/constant";

export default function RelevantJobs({ dashboardFlag }) {
  const [rowdata, setrowdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [errors, seterrors] = useState([]);
  const [searchData, setSearchData] = React.useState("");
  const [sendObjFilter, setSendObjFilter] = useState({});
  const [sendFilter, setSendFilter] = useState({});
  const [clientFilter, setClientFilter] = useState({});
  const [filterObj, setFilterObj] = React.useState({});
  const [filteroff, setFilteroff] = useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterBadge, setFilterBadge] = useState(0);
  const [openDetails, setOpenDetails] = useState(false);
  const [jobId, setJobId] = useState("");
  const [hideShowData, sethideShowData] = useState(true);
  const [searchRemove, setSearchRemove] = useState(false);
  const [endpoint, setEndpoint] = React.useState(API.JOBOPENING_API);
  const [params, setParams] = React.useState({
    limit: apiLimit200,
    page: apiPageNo1,
    showRelvantJobs: true,
    filters: {},
    keyword: "",
  });

  let value, name;

  //Alert message fuction
  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleClick = () => {
    setAlertOpen(true);
  };

  useEffect(() => {
    sethideShowData(dashboardFlag == undefined ? false : true);
  }, [dashboardFlag]);

  // Get Table job opening Data
  const GetRelevantJobsData = async () => {
    setloading(true);
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
      filters: {},
      showRelvantJobs: true,
      keyword: "",
    });
    setloading(false);
  };

  const handelInputSearch = (e) => {
    setSearchRemove(true);
    setSearchValue(e.target.value);
  };

  //searchInput
  const searchInput = async (e) => {
    const searchVal =
      toString.call(e).slice(8, -1) === "String" ? e : searchValue;
      setParams({
        limit: apiLimit200,
        page: apiPageNo1,
        filters: {},
        showRelvantJobs: true,
        keyword: searchVal,
      });
  };

  const resetsearch = () => {
    GetRelevantJobsData();
  };

  const searchInputRemove = async (e) => {
    if (searchRemove) {
      GetRelevantJobsData();
      setSearchRemove(false);
    }
  };

  // onCellClick
  const onCellClick = (e) => {
    setloading(true);
    setJobId(e.cell.id);
  };

  const handleDrawerOpen = () => {
    const classAdvance = document.querySelector(
      ".MuiDrawer-root.MuiDrawer-docked.css-1kdbi4o-MuiDrawer-docked"
    );
    setDrawerOpen(true);
    classAdvance?.classList?.add("blurdata");
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    const classAdvance = document.querySelector(
      ".MuiDrawer-root.MuiDrawer-docked.css-1kdbi4o-MuiDrawer-docked"
    );
    classAdvance?.classList?.remove("blurdata");
  };

  //filter
  const handleFilterobj = (e, field) => {
    name = e.target.name;
    value = e.target.value;
    setSendObjFilter({
      ...sendObjFilter,
      [name]: {
        number:
          field !== "op"
            ? value < "0"
              ? ""
              : value
            : sendObjFilter[name]?.number,
        operator: field === "op" ? value : "equal",
      },
    });
    seterrors(validate(name, value));
  };

  const drop = (y, e) => {
    setFilterObj({});
    const ob = {};
    // eslint-disable-next-line array-callback-return
    e?.map((el) => {
      ob[el.title] = true;
    });
    return setFilterObj(ob);
  };
  const autochipHandel = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSendFilter({ ...sendFilter, [name]: value });
  };

  const chipClientFilter = (e) => {
    name = e.target.name;
    value = e.target.value;
    let valueCheck = { ...clientFilter, [name]: value.toString() };

    if (value.toString() == "") {
      delete valueCheck[name];
    }
    setClientFilter(valueCheck);
  };

  // Filter Apply=========================================
  const filterApply = async () => {
    setSearchData("");
    setFilteroff(true);
    setParams({
        limit: apiLimit200,
        page: apiPageNo1,
        filters: {...sendObjFilter, ...sendFilter},
        showRelvantJobs: true,
        keyword: searchData,
      });
            setDrawerOpen(false);
      const classAdvance = document.querySelector(
        ".MuiDrawer-root.MuiDrawer-docked.css-1kdbi4o-MuiDrawer-docked"
      );
      classAdvance.classList.remove("blurdata");
  };

  return (
    <>
      {jobId && (
        <JobDetails
          jobId={jobId}
          setJobId={setJobId}
          setOpenDetails={setOpenDetails}
          openDetails={openDetails}
          setloading={setloading}
        />
      )}

      <Box className="job-Relevant-div">
        {hideShowData === false && (
          <div
            style={{ height: "2rem", display: "flex", justifyContent: "end" }}
          >
            <Box>
              <FilterSearch
              endpoint={API.JOBOPENING_API + "/filter?showRelvantJobs=true"}
                searchInput={searchInput}
                GetProfileData={resetsearch}
                searchInputRemove={searchInputRemove}
                handelInputSearch={handelInputSearch}
              />
            </Box>
            <RelevantJobsFilter
              handleFilterobj={handleFilterobj}
              setSendObjFilter={setSendObjFilter}
              sendObjFilter={sendObjFilter}
              filterApply={filterApply}
              sendFilter={sendFilter}
              drop={drop}
              errors={errors}
              setFilterObj={setFilterObj}
              filterObj={filterObj}
              filteroff={filteroff}
              setFilteroff={setFilteroff}
              setSendFilter={setSendFilter}
              GetProfileData={GetRelevantJobsData}
              chipClientFilter={chipClientFilter}
              setClientFilter={setClientFilter}
              autochipHandel={autochipHandel}
              handleDrawerOpen={handleDrawerOpen}
              setDrawerOpen={setDrawerOpen}
              handleDrawerClose={handleDrawerClose}
              drawerOpen={drawerOpen}
              filterBadge={filterBadge}
              setFilterBadge={setFilterBadge}
            />
          </div>
        )}
        <div style={{ margin: "1rem" }}>
          <ReusableGrid
            endpoint={API.JOBOPENING_API + "/filter?"}
            params={params}
            divId="relevantJobs"
            columns={relevantJobsColumns}
            tableData={rowdata}
            onCellClick={onCellClick}
            hideShowData={hideShowData}
            filter={clientFilter}
          />
        </div>

        <AlertMsg
          open={alertOpen}
          handle={handleClose}
          severity={severity}
          Msg={alertMsg}
        />
        <LoadingBar loading={loading} />
      </Box>
    </>
  );
}
