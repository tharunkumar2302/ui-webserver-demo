/* eslint-disable react-hooks/rules-of-hooks */
import ReusableGrid from "app/components/ReusableGrid/ReusableGrid";
import organizationForm from "./organizationForm";
import React, {useState,useEffect} from "react";
import { Box, styled } from "@mui/system";
import {
  getRecruiterDetails,
  patchRecruiterDetails,
  postRecruiterDetails,
} from "app/redux/actions/RecruiterActions";
import {postEmpOrgDetails, patchEmpOrgDetails} from "app/redux/actions/OrganizationActions";
import API from "app/apiManager/endpoints";
import { validate } from "app/utils/validation";
import { organizationColumns } from "app/components/TableColumns/organizationColumns";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import { editMessage, jobCreateMessage } from "app/utils/constantForms";
import { apiLimit200, apiPageNo1 } from "app/utils/constant";
import OrganizationForm from "./organizationForm";
import { Dialog ,DialogActions,DialogTitle ,DialogContent,Button } from "@mui/material";
const ContentBox = styled(Box)(() => ({
  margin: "1rem",
}));

export default function organization() {
    const [open, setOpen] = useState(false);
    const [rowdata, setrowdata] = useState([]);
    const [headerFilterShow, setHeaderFilterShow] = useState(false);
    const [errors, seterrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [paginationcount, setPaginationcount] = useState([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    let checkValidation = false;
    const [recruiterData, setrecruiterData] = useState({
      firstName: "",
      lastName: "",
      emailAddress: "",
      mobileNumber: "",
      organizationName: "",
      designation:"",
      pricingPlan:"",
      status:"" 

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
    // const handleInput = (e) => {
    //     const { name, value } = e.target;
      
    //     // Check if the field being updated is the organization name
    //     if (name === "organizationName") {
    //       // If the payload has an organization property, update its name
    //       if (recruiterData.organization) {
    //         setrecruiterData((prevData) => ({
    //           ...prevData,
    //           organization: {
    //             ...prevData.organization,
    //             name: value,
    //           },
    //         }));
    //       } else {
    //         // Otherwise, update the organizationName directly
    //         setrecruiterData((prevData) => ({
    //           ...prevData,
    //           organizationName: value,
    //         }));
    //       }
    //     } else {
    //       // For other fields, update normally
    //       setrecruiterData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //       }));
    //     }
      
    //     seterrors(validate(name, value));
    //   };

    // const handleInput = (e) => {
    //     const { name, value } = e.target;
    //     if (name === 'organizationName' || name === 'organization.name') {
    //       setrecruiterData((prevData) => ({
    //         ...prevData,
    //         organization: {
    //           ...prevData.organization,
    //           name: value,
    //         },
    //       }));
    //     } else {
    //       setrecruiterData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //       }));
    //     }
    //     seterrors((prevErrors) => ({
    //       ...prevErrors,
    //       [name]: '',
    //     }));
    //   };

    // onCellClick
    const onCellClick = (e) => {
      setrecruiterData({...e.cell, isEdit:true});
      setOpen(true);
      setReadOnly(true);
    };
  
    // update Function
    const Updatehandle = async (e) => {
    //   e.preventDefault();
      setLoading(true);
      try {
        const patchApi = await patchEmpOrgDetails(
          recruiterData.id,
          recruiterData.firstName,
          recruiterData.lastName,
          recruiterData.mobileNumber,
          recruiterData.emailAddress,
          recruiterData.organizationName || recruiterData.organization.name,
          recruiterData.pricingPlan.name,
          recruiterData.designation,
          e
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
    const handleSave = async (status) => {
        if (status === "Draft") {
          await submitForm({ ...recruiterData, status });
        } else if (status === "Invited") {
          setConfirmationOpen(true);
        }
      };
    
      const handleSaveConfirmed = async () => {
        const dataWithStatusInvited = { ...recruiterData, status: "Invited" };
        await submitForm(dataWithStatusInvited);
        setConfirmationOpen(false);
      };

      const handleInvite = async () => {   
        setConfirmationOpen(true);
      };
    
      const handleReInvite = async () => {
        const dataWithStatusReInvited = { ...recruiterData, status: "Re-invited" };
        await submitForm(dataWithStatusReInvited);
      };
    
      const submitForm = async (data) => {
        setLoading(true);
        try {
          const response = data.status === "Draft" || !data.isEdit
            ? await postEmpOrgDetails(data)
            : await patchEmpOrgDetails(
                recruiterData.id,
                recruiterData.firstName,
                recruiterData.lastName,
                recruiterData.mobileNumber,
                recruiterData.emailAddress,
                recruiterData.organizationName || recruiterData.organization.name,
                recruiterData.pricingPlan.name,
                recruiterData.designation,
                data.status
                );
    
          if (response.payload.status === 201 || response.payload.status === 200) {
            setAlertMsg(response.payload.data.message);
            setSeverity("success");
            setAlertOpen(true);
            setLoading(false);
            setOpen(false);
            GetRecruiterData();
          }
        } catch (e) {
          setLoading(false);
          setAlertMsg(e.message);
          setSeverity("error");
          setAlertOpen(true);
        }
      };
    
  
    return (
      <>
        <ContentBox>
            
        <OrganizationForm
          Updatehandle={Updatehandle}
          handleInput={handleInput}
          handleSave={handleSave}
          handleInvite={handleInvite}
          handleReInvite={handleReInvite}
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
            divId="employer"
            endpoint={API.EMPLOYER_ORGANIZATION_TABLE_API}
            params={params}
            tableData={rowdata}
            columns={organizationColumns(headerFilterShow)}
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
        <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Do you want to Invite the organization with the selected <strong>{toString.call(recruiterData.pricingPlan).slice(8,-1) == 'String'? recruiterData.pricingPlan: recruiterData.pricingPlan.name}</strong> plan ?{" "}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveConfirmed}>Yes</Button>
          <Button onClick={() => setConfirmationOpen(false)}>No</Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
  
