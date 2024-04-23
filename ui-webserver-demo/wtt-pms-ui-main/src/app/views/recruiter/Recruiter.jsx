import ReusableGrid from "app/components/ReusableGrid/ReusableGrid";
import React, { useEffect, useState } from "react";
import RecruiterForm from "./RecruiterForm";
import { Box, styled } from "@mui/system";
import {
  getRecruiterDetails,
  patchRecruiterDetails,
  postRecruiterDetails,
} from "app/redux/actions/RecruiterActions";
import API from "app/apiManager/endpoints";
import { validate } from "app/utils/validation";
import { recruiterColumns } from "app/components/TableColumns/recruiterColumns";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import { editMessage, jobCreateMessage } from "app/utils/constantForms";
import { apiLimit200, apiPageNo1 } from "app/utils/constant";
const ContentBox = styled(Box)(() => ({
  margin: "1rem",
}));

export default function Recruiter() {
  const [open, setOpen] = React.useState(false);
  const [rowdata, setrowdata] = useState([]);
  const [headerFilterShow, setHeaderFilterShow] = useState(false);
  const [errors, seterrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [paginationcount, setPaginationcount] = useState([]);
  let checkValidation = false;
  const [recruiterData, setrecruiterData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    mobileNumber: "",
  });
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [endpoint, setEndpoint] = React.useState(API.JOBOPENING_API);
  const [params, setParams] = React.useState({
    limit: apiLimit200,
    page: apiPageNo1,
  });
  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };
  const handleClick = () => {
    setAlertOpen(true);
  };

  const columHeader = (event) => {
    GetRecruiterData();
    setHeaderFilterShow(event.target.checked);
  };

  // Get Table Recruiter Data
  const GetRecruiterData = async () => {
    setLoading(true);
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
    });
    setLoading(false);
  };

  // Onchange Handle
  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setrecruiterData({ ...recruiterData, [name]: value });
    seterrors(validate(name, value));
  };

  // Save Function
  const handleSave = async (e) => {
    e.preventDefault();
    Object.keys(recruiterData).some((name) => {
      if (
        (name === "firstName" ||
          name === "lastName" ||
          name === "emailAddress" ||
          name === "mobileNumber") &&
        !recruiterData[name]
      ) {
        setAlertMsg("Please enter " + name + " field.");
        setSeverity("info");
        handleClick();
      } else {
        checkValidation = true;
      }
      return !recruiterData[name];
    });
    if (checkValidation) {
      setLoading(true);
      try {
        const postApi = await postRecruiterDetails({ ...recruiterData });
        if (postApi.payload.status === 201) {
          setAlertMsg(jobCreateMessage);
          setSeverity("success");
          handleClick();
          setLoading(false);
          setOpen(false);
          GetRecruiterData();
        }
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
    setrecruiterData(e.cell);
    setOpen(true);
    setReadOnly(true);
  };

  // update Function
  const Updatehandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const patchApi = await patchRecruiterDetails(
        recruiterData.id,
        recruiterData.firstName,
        recruiterData.lastName,
        recruiterData.mobileNumber,
        recruiterData.emailAddress
      );
      if (patchApi.payload.status === 200) {
        setLoading(false);
        setAlertMsg(editMessage);
        setSeverity("success");
        handleClick();
        setOpen(false);
        GetRecruiterData();
      }
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message);
      setSeverity("info");
      handleClick();
    }
  };

  return (
    <>
      <ContentBox>
        <RecruiterForm
          handleInput={handleInput}
          handleSave={handleSave}
          Updatehandle={Updatehandle}
          errors={errors}
          cellData={recruiterData}
          setCellData={setrecruiterData}
          setOpen={setOpen}
          open={open}
          readOnly={readOnly}
          setReadOnly={setReadOnly}
          loading={loading}
        />
      </ContentBox>
      <ContentBox>
        <ReusableGrid
          divId="recruiter"
          endpoint={API.RECRUITER_API}
          params={params}
          tableData={rowdata}
          columns={recruiterColumns(headerFilterShow)}
          onCellClick={onCellClick}
          paginationcount={paginationcount}
          headerfilter="true"
          columHeader={columHeader}
        />
      </ContentBox>
      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
      <LoadingBar loading={loading} />
    </>
  );
}
