import React, { useEffect, useState } from "react";
import ReusableGrid from "../../components/ReusableGrid/ReusableGrid";
import "./JobOpening";
import JobOpeningForm from "./JobOpeningForm";
import { ConfirmationDialog } from "app/components";
import API from "app/apiManager/endpoints";
import {
  getJobApplicantDetails,
  getJobOpeningDetails,
  patchJobOpeningArchive,
  patchJobOpeningDetails,
  postJobOpeningDetails,
} from "app/redux/actions/JobOpeningActions";
import { validate } from "app/utils/validation";
import { jobOpeningColumns } from "app/components/TableColumns/jobOpeningColumns";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import {
  archivedMessage,
  createMessage,
  editMessage,
  modalTextArchive,
  modalTitle,
  headingShowApplicants,
} from "app/utils/constantForms";
import JobApplicant from "../../components/JobApplicant/JobApplicant";
import {
  tableHeightJobOpening,
  apiLimit200,
  apiPageNo1,
} from "app/utils/constant";
import ShortlistedPopup from "./shortlistedPopup"

export default function JobOpening() {
  const [rowdata, setrowdata] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [Roledrop, setRoledrop] = useState();
  const [loading, setLoading] = useState(false);
  const [applicantLoading, setApplicantLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [errors, seterrors] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteHelper, setDeleteHelper] = useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [jobApplicantData, setJobApplicantData] = React.useState([]);
  const [shortlistedPopupOpen, setShortlistedPopupOpen] = useState(false);
  let checkValidation = false;
  const [endpoint, setEndpoint] = React.useState(API.JOBOPENING_API);
  const [params, setParams] = React.useState({
    limit: apiLimit200,
    page: apiPageNo1,
  });
  const [headerFilterShow, setHeaderFilterShow] = useState(false);
  const [jobopeningData, setjobopeningData] = useState({
    department: "",
    industryType: "",
    responsibilities: "",
    skillsRequired: "",
    secondarySkills:"",
    shortJD:"",
    description: "",
    qualification: "",
    location: [],
    minExperience: "",
    maxExperience: "",
    employmentType: "",
    duration: "",
    workMode: "",
    jobRole: "",
    status: "",
    totalOpenings: "",
    tags: [],
  });
  const [jobCellId, setJobCellId] = useState();

  const columHeader = (event) => {
    GetJobopeningData();
    setHeaderFilterShow(event.target.checked);
  };

  //create new job handler
  let id, value;
  const handleInput = (e, data) => {
    id = e.target.id || e.target.name;
    value = data || e.target.value;
    setjobopeningData({ ...jobopeningData, [id]: value < "0" ? "" : value });
    seterrors(validate(id, value));
  };
  const UpdatehandleInput = (e, data) => {
    id = e.target.id || e.target.name;
    value = e.target.value;
    setjobopeningData({ ...jobopeningData, [id]: value });
  };

  //Alert massage fuction
  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleClick = () => {
    setAlertOpen(true);
  };

  // Save Function
  const handleSave = async (e) => {
    e.preventDefault();
    Object.keys(jobopeningData).some((name) => {
      // eslint-disable-next-line no-mixed-operators
      if (!jobopeningData[name]) {
        setAlertMsg("Please enter " + name + " field.");
        setSeverity("info");
        handleClick();
      } else {
        checkValidation = true;
      }
      return !jobopeningData[name];
    });
    if (checkValidation) {
      setLoading(true);
      try {
        const ressDtaa = {
          ...jobopeningData,
          jobRole: jobopeningData?.jobRole?.props?.value,
          location: jobopeningData.location?.split(",") || [],
          tags: jobopeningData.tags,
        };
        const postApi = await postJobOpeningDetails(ressDtaa);
        setOpen(false);
        if (postApi.payload.status === 201) {
          setAlertMsg(createMessage);
          setSeverity("success");
          handleClick();
          setLoading(false);
          setOpen(false);
        }
        GetJobopeningData();
      } catch (e) {
        setLoading(false);
        setAlertMsg(e.message);
        setSeverity("info");
        handleClick();
      }
    }
  };

  // Get Table job opening Data
  const GetJobopeningData = async () => {
    setLoading(true);
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
    });
    setLoading(false);
  };

  // onCellClick
  const onCellClick = (e) => {
    setjobopeningData(e.cell);
    setReadOnly(true);
    setOpen(true);
  };

  // update Function
  const Updatehandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      jobopeningData.location =
        toString.call(jobopeningData.location).slice(8, -1) === "Array"
          ? jobopeningData.location
          : jobopeningData.location?.split(",") || [];
      const patchApi = await patchJobOpeningDetails(
        jobopeningData.id,
        jobopeningData.department,
        jobopeningData.industryType,
        jobopeningData.responsibilities,
        jobopeningData.skillsRequired,
        jobopeningData.secondarySkills,
        jobopeningData.shortJD,
        jobopeningData.description,
        jobopeningData.qualification,
        jobopeningData.location,
        jobopeningData.minExperience,
        jobopeningData.maxExperience,
        toString.call(jobopeningData.jobRole).slice(8, -1) === "String"
          ? jobopeningData.jobRole
          : jobopeningData.jobRole.id,
        jobopeningData.employmentType,
        jobopeningData.duration,
        jobopeningData.workMode,
        jobopeningData.status,
        jobopeningData.tags,
        jobopeningData.totalOpenings
      );
      if (patchApi.payload.status === 200) {
        setLoading(false);
        setAlertMsg(editMessage);
        setSeverity("success");
        handleClick();
        setOpen(false);
        GetJobopeningData();
      }
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message);
      setSeverity("info");
      handleClick();
    }
  };
  // Get Table job opening Data
  const ArchiveData = async (e) => {
    await patchJobOpeningArchive(deleteHelper.cell.id, "Archived");
    setOpenConfirm(false);
    GetJobopeningData();
    setAlertMsg(archivedMessage);
    setSeverity("success");
    handleClick();
  };
  const closeConfirmDialog = () => {
    setOpenConfirm(false);
  };

  const DeleteProfileDataConfirm = (e) => {
    setOpenConfirm(true);
    setDeleteHelper(e);
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

  const onCellApplicants = (e) => {
    setJobCellId(e.cell.id);
    GetJobAppliedData(e.cell.id);
    setDrawerOpen(true);
  };
  const GetJobAppliedData = async (data) => {
    setParams({
      limit: apiLimit200,
      jobApplication: data,
      page: apiPageNo1,
    });
  };
  const onCellShortlisted =(e) => {
    setjobopeningData(e.cell);
    setShortlistedPopupOpen(true);
  }

  return (
    <div style={{ backgroundColor: "#f9fafd" }}>
      <div className="main-div-recruiter">
        <div style={{ margin: "1rem" }}>
          <JobOpeningForm
            handleSave={handleSave}
            handleInput={handleInput}
            UpdatehandleInput={UpdatehandleInput}
            Updatehandle={Updatehandle}
            cellData={jobopeningData}
            setCellData={setjobopeningData}
            open={open}
            setOpen={setOpen}
            readOnly={readOnly}
            setReadOnly={setReadOnly}
            roledata={Roledrop}
            setRoledrop={setRoledrop}
            errors={errors}
            loading={loading}
          />
        </div>
        <div style={{ margin: "1rem" }}>
          <ReusableGrid
            endpoint={API.JOBOPENING_API}
            params={params}
            divId="jobOpening"
            columns={jobOpeningColumns(setParams, headerFilterShow)}
            onCellClick={onCellClick}
            ArchiveData={DeleteProfileDataConfirm}
            onCellApplicants={onCellApplicants}
            onCellShortlisted={onCellShortlisted}
            columHeader={columHeader}
            headerfilter="true"
            tableHeight={tableHeightJobOpening}
          />
        </div>
        {params.jobApplication && (
          <div>
            <JobApplicant
              endpoint={
                API.JOBAPPLICANT_API +
                "?jobApplication=" +
                params.jobApplication
              }
              params={params}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerClose={handleDrawerClose}
              setJobApplicantData={setJobApplicantData}
              GetJobAppliedData={GetJobAppliedData}
              jobApplicantData={jobApplicantData}
              loading={applicantLoading}
              jobCellId={jobCellId}
            />
          </div>
        )}
        <div>
        <ShortlistedPopup
        open={shortlistedPopupOpen}
        onClose={() => setShortlistedPopupOpen(false)}
        cellData={jobopeningData}
        />
        </div>
      </div>
      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
      <LoadingBar loading={loading} />
      <ConfirmationDialog
        open={openConfirm}
        text={modalTextArchive}
        title={modalTitle}
        onConfirmDialogClose={closeConfirmDialog}
        onYesClick={ArchiveData}
      />
    </div>
  );
}
