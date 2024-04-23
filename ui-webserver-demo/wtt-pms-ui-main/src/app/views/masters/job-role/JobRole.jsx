import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/system";
import {
  deleteJobRoleDetails,
  getJobRoleDetails,
  patchJobRoleDetails,
  postJobRoleDetails,
} from "app/redux/actions/JobRoleActions";
import { ConfirmationDialog } from "app/components";
import ReusableGrid from "app/components/ReusableGrid/ReusableGrid";
import JobRoleForm from "./JobRoleForm";
import { validate } from "app/utils/validation";
import { GetJobRoleColumns } from "app/components/TableColumns/jobRoleColumns";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import API from "app/apiManager/endpoints";
import {
  createMessage,
  deleteMessage,
  editMessage,
  modalTextJobRole,
  modalTitle,
  titleActive,
} from "app/utils/constantForms";
import { apiLimit200, apiPageNo1 } from "app/utils/constant";
const ContentBox = styled(Box)(() => ({
  margin: "1rem",
}));

export default function JobRole() {
  let name, value;
  let checkValidation = false;
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [rowdata, setrowdata] = useState([]);
  const [errors, seterrors] = useState([]);
  const [deleteHelper, setDeleteHelper] = useState({});
  const [jobRoleData, setjobRoleData] = useState({ name: "", description: "" });
  const [params, setParams] = useState({
    limit: apiLimit200,
    page: apiPageNo1,
  });
  const closeConfirmDialog = () => {
    setOpenConfirm(false);
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

  // Get Data in Table
  const GetJobRole = async () => {
    setLoading(true);
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
    });
    setLoading(false);
  };

  // Onchange Handle
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setjobRoleData({ ...jobRoleData, [name]: value });
    seterrors(validate(name, value));
  };

  // Save Function
  const handleSave = async (e) => {
    e.preventDefault();
    Object.keys(jobRoleData).some((name) => {
      if (!jobRoleData[name]) {
        setAlertMsg("Please enter " + name + " field.");
        setSeverity("info");
        handleClick();
      } else {
        checkValidation = true;
      }
      return !jobRoleData[name];
    });
    if (checkValidation) {
      setLoading(true);
      try {
        const postApi = await postJobRoleDetails({ ...jobRoleData });
        if (postApi.payload.status === 201) {
          setAlertMsg(createMessage);
          setSeverity("success");
          handleClick();
          setLoading(false);
          setOpen(false);
        }
        GetJobRole();
      } catch (e) {
        setLoading(false);
        setAlertMsg(e.message);
        setSeverity("info");
        handleClick();
      }
    }
  };

  // onCellClick
  const onCellClick = (e) => {
    setjobRoleData(e.cell);
    setOpen(true);
    setReadOnly(true);
  };

  // update Function
  const Updatehandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const patchApi = await patchJobRoleDetails(
        jobRoleData.name,
        jobRoleData.description,
        jobRoleData.id
      );
      if (patchApi.payload.status === 200) {
        setLoading(false);
        setAlertMsg(editMessage);
        setSeverity("success");
        handleClick();
        setOpen(false);
        GetJobRole();
      }
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message);
      setSeverity("info");
      handleClick();
    }
  };

  // Delete function
  const DeleteData = async (e) => {
    await deleteJobRoleDetails(deleteHelper.cell.id);
    GetJobRole();
    setOpenConfirm(false);
    setAlertMsg(deleteMessage);
    setSeverity("success");
    handleClick();
  };

  const DeleteProfileDataConfirm = (e) => {
    if (e.cell.isActive === false) {
      setAlertMsg(titleActive);
      setSeverity("warning");
      setAlertOpen(true);
    } else {
      setOpenConfirm(true);
      setDeleteHelper(e);
    }
  };
  return (
    <>
      <ContentBox>
        <JobRoleForm
          handleInput={handleInput}
          handleSave={handleSave}
          Updatehandle={Updatehandle}
          errors={errors}
          cellData={jobRoleData}
          setOpen={setOpen}
          open={open}
          readOnly={readOnly}
          loading={loading}
          setCellData={setjobRoleData}
          setReadOnly={setReadOnly}
        />
      </ContentBox>
      <ContentBox>
        <ReusableGrid
          divId="jobRole"
          endpoint={API.JOBROLE_API}
          GetJobRole={GetJobRole}
          params={params}
          tableData={rowdata}
          columns={GetJobRoleColumns()}
          onCellClick={onCellClick}
          DeleteData={DeleteProfileDataConfirm}
        />
      </ContentBox>
      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
      <LoadingBar loading={loading} />
      <ConfirmationDialog
        open={openConfirm}
        text={modalTextJobRole}
        title={modalTitle}
        onConfirmDialogClose={closeConfirmDialog}
        onYesClick={DeleteData}
      />
    </>
  );
}
