/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import ReusableGrid from "app/components/ReusableGrid/ReusableGrid";
import React, { useContext, useEffect, useState } from "react";
import ProfileForm from "./ProfileForm";
import { number } from "prop-types";
import { Box, styled } from "@mui/system";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import FilterAdvance from "../../components/Filter/FilterAdvance/FilterAdvance";
import fileDownload from "js-file-download";
import { ConfirmationDialog } from "app/components";
import {
  deleteProfileDetails,
  getProfileDetails,
  getProfileSearchDetails,
  getProfileCV,
  patchProfileDetails,
  postProfileDetails,
  postProfileExportAllDetails,
  postProfileSearchDetails,
  postCandidateInvite,
  postWithoutCvDetails,
} from "app/redux/actions/ProfileActions";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import LoadingBar from "app/components/LoadingBar/LoadingBar";
import { validate } from "app/utils/validation";
import {
  HeaderContextMenu,
  headerMenu,
} from "app/components/HeaderMenu/HeaderMenu";
import {
  deleteIcon,
  editIcon,
  tableIconColWidth,
  tableContentColWidth,
  selectItem,
  tableCheckIconColWidth,
  tableCheckjobRolColWidth,
  tableHeightProfile,
  apiLimit200,
  piPageNo1,
  apiPageNo1,
  localStorageUserRole
} from "app/utils/constant";
import { getCurrentUserDetails } from "app/redux/actions/CurrentUserActions";
import {
  atleastOneRow,
  createMessage,
  deleteMessage,
  editMessage,
  labelCurrentLocation,
  labelEdit,
  labelCV,
  labelExperience,
  labelInvite,
  labelLastName,
  labelNoticePeriod,
  labelPhoneNo,
  labelPrimarySkills,
  labelWithoutCv,
  modalTextProfile,
  modalTitle,
  profileInvite,
  labelCheckBox,
  labelDelete,
  labelUpdatedOn,
  labelCreatedBy,
  buttonInvite,
  modalInviteTextProfile,
  labelStatus,
  noResume,
  labelFirstName,
  labelName,
  CVDownload,
  tooltipDownloadProfileList,
} from "app/utils/constantForms";
import API from "app/apiManager/endpoints";
import useSelectDataTable from "app/hooks/useSelectTableData";
import axios from "axios";
const ContentBox = styled(Box)(() => ({
  margin: "0rem 1rem 1rem 1rem",
  '& .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title':{
fontWeight:'bold'
  }
}));
const ContainerDiv = styled("div")(() => ({
  border: "1px dashed rgba(52, 49, 76, 0.54)",
  position: "absolute",
  right: "0rem",
  padding: "0.3rem",
  display: "flex",
  height: "35px",
  top: "2.2rem",
}));
const ContentBoxDiv = styled(Box)(() => ({
  margin: "1rem 1rem 0rem 1rem",
  height: "2.3rem",
  position: "relative",
}));
export default function Profile(props) {
  let checkValidation = false;
  const [profiledata, setProfiledata] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, seterrors] = useState([]);
  const [filteroff, setFilteroff] = useState(false);
  const [headerFilterShow, setHeaderFilterShow] = useState(false);
  const [searchData, setSearchData] = React.useState("");
  const [sendObjFilter, setSendObjFilter] = useState({});
  const [sendFilter, setSendFilter] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmInvite, setOpenConfirmInvite] = useState(false);
  const [deleteHelper, setDeleteHelper] = useState({});
  const [withoutCv, setWithoutCv] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [nvmSearchValue, setNVMSearchValue] = useState(""); 
  const [addendpoint, setAddendPoint] = useState(API.PROFILE_API);
  const [searchRemove, setSearchRemove] = useState(false);
  const [recordSelect, setRecordSelect] = useState([]);
  const [hideRemoveColumn, setHideRemoveColumn] = useState(localStorageUserRole() == 'superuser'? false: true);
  const [userRole, setUserRole] = React.useState(() => localStorageUserRole());
  const [sendProfileData, setSendProfileData] = useState({
    name: "",
    email: "",
    phone_no: "",
    current_designation: "",
    current_location: "",
    marital_status: "",
    present_address: "",
    date_of_birth: "",
    current_company: "",
    experience: number,
    status: "",
    education: "",
    primary_skill: [],
    secondary_skill: "",
    education_details: [],
    experience_details: [],
    current_ctc: number,
    expected_ctc: number,
    industry: "",
    current_employment_status: "",
    notice_period: number,
    prefered_location: "",
    ready_to_relocate: "",
    overseas_experience: "",
    having_passport: "",
    passport_validity: "",
    visa: "",
    file_path: "hvh",
    About: "",
  });
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [selectedList, setSelectedList] = useState([]);
  const [filterObj, setFilterObj] = React.useState({});
  const [endpoint, setEndpoint] = React.useState(API.PROFILE_API);
  const [params, setParams] = React.useState({
    limit: apiLimit200,
    page: apiPageNo1,
    filters: {},
    cvNotUpload: "",
    keyword: "",
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
  useEffect(() => {
    currentUserAPI();

    window.addEventListener("UpdatedDetails", function (data) {
      currentUserAPI();
    });
  }, []);

  // calling current user API to get the emailid of login user
  const currentUserAPI = async () => {
    const currentUserApi = await getCurrentUserDetails();
    useSelectDataTable.loginUserEmailId =
      currentUserApi.payload.user.emailAddress;
  };

  const checkclick = (e) => {
    useSelectDataTable.selectItem = e.map((a) => {
      return a;
    });
    return true;
  };
  const columHeader = (event) => {
    GetProfileData();
    setHeaderFilterShow(event.target.checked);
  };

  var downloadIcon = (cell ,data ) => {
    let filePath = cell.getValue();
    let rowData = cell.getRow().getData();
    // eslint-disable-next-line eqeqeq
    let customIcon = filePath && rowData.cv_url
      ? "<i class='fa-sharp fa-solid fa-download' title='Download Profile ' style='color: rgb(9, 182, 109);cursor:pointer;'></i>"
      : `<i class='fa-sharp fa-solid fa-download'  style='opacity:0.5;cursor:pointer;'></i>`;
    return customIcon;
  };

  const ProfileColumns = [
    {
      formatter: "rowSelection",
      resizable: false,
      title: labelCheckBox,
      titleFormatter: "rowSelection",
      width: tableCheckjobRolColWidth,
      headerSort: false,
      cellClick: function (e, cell) {
        cell.getRow();
      },
    },
    {
      field: "action",
      title: labelEdit,
      resizable: false,
      headerSort: false,
      headerTooltip: true,
      width: tableCheckIconColWidth,
      formatter: editIcon,
      hozAlign: "left",
      visible:hideRemoveColumn
    },
    {
      field: "is_cv_uploaded",
      title: labelCV,
      tooltip: false,
      resizable: false,
      headerSort: false,
      headerTooltip: true,
      width: tableCheckIconColWidth,
      formatter: downloadIcon,
      hozAlign: "left",
      
    },
    {
      field: "firstName",
      title: labelFirstName,
      sorter: "string",
      headerTooltip: true,
      headerFilter: !headerFilterShow ? "" : "input",
      hozAlign: "left",
      headerMenu: headerMenu,
      width: tableContentColWidth,
      headerCssClass: 'bold-header'
    },
    {
      field: "lastName",
      title: labelLastName,
      sorter: "string",
      headerTooltip: true,
      headerFilter: !headerFilterShow ? "" : "input",
      hozAlign: "left",
      headerMenu: headerMenu,
      width: tableContentColWidth,
    },
    {
      field: "current_location",
      title: labelCurrentLocation,
      headerTooltip: true,
      hozAlign: "left",
      sorter: "string",
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
    },
    {
      field: "primary_skill",
      title: labelPrimarySkills,
      sorter: "string",
      headerTooltip: true,
      hozAlign: "left",
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
    },
    {
      field: "notice_period",
      title: labelNoticePeriod,
      headerTooltip: true,
      hozAlign: "center",
      sorter: "string",
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
    },
    {
      field: "phone_no",
      title: labelPhoneNo,
      sorter: "string",
      hozAlign: "center",
      headerTooltip: true,
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
    },
    {
      field: "experience",
      title: labelExperience,
      sorter: "string",
      headerTooltip: true,
      hozAlign: "center",
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "number",
      headerMenu: headerMenu,
    },
    {
      field: "status",
      title: labelStatus,
      sorter: "string",
      headerTooltip: true,
      hozAlign: "left",
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
      headerPopup: HeaderContextMenu.bind(this, setParams, "profile"),
      headerPopupIcon: "<i class='fas fa-filter' title='Filter Status'></i>",
    },
    {
      field: "modifiedAt",
      title: labelUpdatedOn,
      sorter: "string",
      headerTooltip: true,
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
    },
    {
      field: "CreatedBy",
      title: labelCreatedBy,
      sorter: "string",
      headerTooltip: true,
      hozAlign: "left",
      width: tableContentColWidth,
      headerFilter: !headerFilterShow ? "" : "input",
      headerMenu: headerMenu,
    },
    {
      title: labelDelete,
      headerTooltip: true,
      field: "remove",
      width: tableCheckIconColWidth,
      resizable: false,
      headerSort: false,
      formatter: deleteIcon,
      visible:hideRemoveColumn
    },
  ];
  const GetProfileData = async () => {
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
    setSendProfileData({
      ...sendProfileData,
      [name]: value < "0" ? "" : value,
    });
    seterrors(validate(name, value));
  };
  const ArrayhandleInput = (e) => {
    name = "primary_skill";
    value = e;
    setSendProfileData({ ...sendProfileData, [name]: value });
  };

  // filter object----------------------------------------------------------
  const [drawerOpen, setDrawerOpen] = React.useState(false);
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
        operator: field === "op" ? value : sendObjFilter[name]?.operator,
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

  // Filter Apply=========================================
  const filterApply = async () => {
    setSearchData("");
    setFilteroff(true);
    //==================
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
      filters: { ...sendObjFilter, ...sendFilter },
    });
    setDrawerOpen(false);
    const classAdvance = document.querySelector(
      ".MuiDrawer-root.MuiDrawer-docked.css-1kdbi4o-MuiDrawer-docked"
    );
    classAdvance?.classList?.remove("blurdata");
  };

  // Get All Export Data
  const GetAllExportData = async () => {
    const pay = {
      keyword: searchData,
      export: true,
      columns: [
        "firstName",
        "lastName",
        "current_location",
        "primary_skill",
        "notice_period",
        "phone_no",
        "experience",
        "status",
      ],
      type: "excel",
      filters: { ...sendObjFilter, ...sendFilter },
    };
    var exportid = [];
    useSelectDataTable.selectItem?.map((el) => exportid.push(el.id));
    const excelExport = {
      ids: exportid,
      columns: [
        "firstName",
        "lastName",
        "current_location",
        "primary_skill",
        "notice_period",
        "phone_no",
        "experience",
        "status",
      ],
    };
    if (!searchData) {
      delete pay.keyword;
    }
    try {
      const postProfileExportAllApi = await postProfileExportAllDetails(
        exportid.length,
        useSelectDataTable.selectItem.length,
        excelExport,
        pay
      );
      fileDownload(postProfileExportAllApi.payload, "resums.xlsx");
      setAlertMsg(tooltipDownloadProfileList);
      setSeverity("success");
      handleClick();
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message);
      setSeverity("info");
      handleClick();
    }
  };

  // Save Handel
  const saveHandel = async (e) => {
    e.preventDefault();
    Object.keys(sendProfileData).some((name) => {
      if (
        (name === "name" ||
          name === "email" ||
          name === "phone_no" ||
          name === "current_location") &&
        !sendProfileData[name]
      ) {
        setAlertMsg("Please enter " + name + " field.");
        setSeverity("info");
        handleClick();
      } else {
        checkValidation = true;
      }
      return !sendProfileData[name];
    });
    if (checkValidation) {
      setLoading(true);
      try {
        const postApi = await postProfileDetails({
          ...sendProfileData,
          source: "MANUAL-RECRUITER",
        });
        if (postApi.payload.status === 201) {
          setAlertMsg(createMessage);
          setSeverity("success");
          handleClick();
          setLoading(false);
          setOpen(false);
        }
        GetProfileData();
      } catch (e) {
        setLoading(false);
        setAlertMsg(e.message);
        setSeverity("info");
        handleClick();
      }
    }
  };

  //Update on onCellClick
  const onCellClick = (e) => {
    setSendProfileData(e.cell);
    setOpen(true);
    setReadOnly(true);
  };

  // Update handle
  const UpdateHandel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const patchApi = await patchProfileDetails(
        sendProfileData.id,
        sendProfileData.firstName,
        sendProfileData.lastName,
        sendProfileData.email,
        sendProfileData.phone_no,
        sendProfileData.current_location,
        sendProfileData.marital_status,
        sendProfileData.status,
        sendProfileData.present_address,
        sendProfileData.date_of_birth,
        sendProfileData.current_company,
        sendProfileData.experience,
        sendProfileData.education,
        sendProfileData.primary_skill,
        sendProfileData.secondary_skill,
        sendProfileData.education_details,
        sendProfileData.experience_details,
        sendProfileData.current_ctc,
        sendProfileData.expected_ctc,
        sendProfileData.current_designation,
        sendProfileData.industry,
        sendProfileData.current_employment_status,
        sendProfileData.notice_period,
        sendProfileData.prefered_location,
        sendProfileData.ready_to_relocate,
        sendProfileData.overseas_experience,
        sendProfileData.having_passport,
        sendProfileData.passport_validity,
        sendProfileData.visa,
        sendProfileData.About
      );
      if (patchApi.payload.status === 200) {
        setLoading(false);
        setAlertMsg(editMessage);
        setSeverity("success");
        handleClick();
        setOpen(false);
        GetProfileData();
      }
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message);
      setSeverity("info");
      handleClick();
    }
  };

  // Delete function
  function DeleteProfileDataConfirm(e) {
    setOpenConfirm(true);
    setDeleteHelper(e);
  }
 
  const DownloadProfile = async (e) => {
    try {
      const date = Date.now();
      setLoading(true);
      const getProfileCVAPI = await getProfileCV(e.cell.id);
      const testing = getProfileCVAPI.payload;
      const url = window.URL.createObjectURL(new Blob([testing]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${e.cell.firstName + e.cell.lastName}-${date}.${e.cell.file_path.split('.').splice(-1)[0]}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
      setAlertMsg(CVDownload);
      setSeverity("success");
      handleClick();
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message ?? 'Error');
      setSeverity("error");
      handleClick();
    }
  };

  function closeConfirmDialog() {
    setOpenConfirm(false);
  }

  function closeConfirmInvite() {
    setOpenConfirmInvite(false);
  }

  async function DeleteProfileData() {
    setLoading(true);
    await deleteProfileDetails(deleteHelper.cell.id);
    GetProfileData();
    setOpenConfirm(false);
    setAlertMsg(deleteMessage);
    setSeverity("success");
    handleClick();
  }

  const handelInputSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handelNvmInputSearch = (event) => {
    setNVMSearchValue(event.target.value)
    // console.log(inputValue,'inputValue');
  };

  const searchInput = async (e) => {
    setSearchRemove(true);
    const searchVal =
      toString.call(e).slice(8, -1) === "String" ? e : searchValue;
    setParams({
      limit: apiLimit200,
      page: apiPageNo1,
      keyword: searchVal,
    });
  };

  const nvmSearchInput = async (e) => {
    setSearchRemove(true);
    // const query = "Give me the list of people having Javascript as a skill";
    // try {
    //   const response = await axios.get("http://3.135.64.140/fetch_result", { query });
    //   // setSearchResult(response.data);
    //   console.log(response.data);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    // setAddendPoint('http://3.135.64.140:5000/fetch_result')
    // setParams({
    //   limit: apiLimit200,
    //   page: apiPageNo1,
    //   query: nvmSearchValue,
    // });
  };
  const searchInputRemove = async (e) => {
    if (searchRemove) {
      setParams({
        limit: apiLimit200,
        page: apiPageNo1,
        keyword: "",
      });
      GetProfileData();
      setSearchRemove(false);
    }
  };

  const sendInvite = async () => {
    setLoading(true);
    if (useSelectDataTable?.selectItem?.length > 0) {
      let email_address = [];
      useSelectDataTable.selectItem.forEach((element) => {
        email_address.push(element.email);
      });
      try {
        const postInviteApi = await postCandidateInvite({
          to: email_address,
          endpointUrl: "session/candidate-signup",
        });
        setLoading(false);
        setAlertMsg(profileInvite);
        setSeverity("success");
        handleClick();
        setOpenConfirmInvite(false);
      } catch (e) {
        setAlertMsg(e.message);
        setSeverity("error");
        handleClick();
        setLoading(false);
        setOpenConfirmInvite(false);
      }
    }
  };

  function inviteClick() {
    if (useSelectDataTable?.selectItem?.length > 0) {
      setOpenConfirmInvite(true);
    } else {
      setAlertMsg(atleastOneRow);
      setSeverity("error");
      handleClick();
    }
  }

  return (
    <>
      <ContentBoxDiv className="profileGrid">
        <Grid container style={{ position: "relative" }}>
          <Grid item xs={4}>
            <ProfileForm
              handleInput={handleInput}
              setOpen={setOpen}
              ArrayhandleInput={ArrayhandleInput}
              open={open}
              saveHandel={saveHandel}
              searchInput={searchInput}
              nvmSearchInput={nvmSearchInput}
              cellData={sendProfileData}
              setCellData={setSendProfileData}
              readOnly={readOnly}
              setReadOnly={setReadOnly}
              UpdateHandel={UpdateHandel}
              seterrors={seterrors}
              errors={errors}
              GetAllExportData={GetAllExportData}
              checkValidation={checkValidation}
              GetProfileData={GetProfileData}
              loading={loading}
              handelInputSearch={handelInputSearch}
              handelNvmInputSearch={handelNvmInputSearch}
              searchInputRemove={searchInputRemove}
            />
          </Grid>
          <Grid item xs={1} style={{ position: "absolute", right: "6rem" }}>
            <FilterAdvance
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
              GetProfileData={GetProfileData}
              autochipHandel={autochipHandel}
              handleDrawerOpen={handleDrawerOpen}
              setDrawerOpen={setDrawerOpen}
              handleDrawerClose={handleDrawerClose}
              drawerOpen={drawerOpen}
            />
          </Grid>
        </Grid>
          {userRole == "superuser" ? "":
        <ContainerDiv>
          <FormGroup style={{ padding: "3px 0px 0px 6px" }}>
            <FormControlLabel
              id="headerFilter"
              control={
                <Checkbox
                  onChange={(event) => {
                    setWithoutCv(event.target.checked);
                    if (!withoutCv) {
                      setParams({
                        limit: apiLimit200,
                        page: apiPageNo1,
                        cvNotUpload: "true",
                      });
                    } else {
                      setParams({
                        limit: apiLimit200,
                        page: apiPageNo1,
                      });
                    }
                  }}
                />
              }
              label={labelWithoutCv}
            />
          </FormGroup>
          <Button
            className="invite-click"
            size="small"
            variant="contained"
            style={{ height: "24px" }}
            onClick={inviteClick}
          >
            {buttonInvite}
          </Button>
        </ContainerDiv>}
      </ContentBoxDiv>
      <ContentBox>
        <ReusableGrid
          endpoint={addendpoint}
          cll='gridProfile'
          params={params}
          divId="createProfile"
          columns={ProfileColumns}
          onCellClick={onCellClick}
          DeleteData={DeleteProfileDataConfirm}
          DownloadProfile={DownloadProfile}
          columHeader={columHeader}
          checkclick={checkclick}
          headerfilter="true"
          tableHeight={tableHeightProfile}
          loading={loading}
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
        text={modalTextProfile}
        title={modalTitle}
        onConfirmDialogClose={closeConfirmDialog}
        onYesClick={DeleteProfileData}
        loading={loading}
      />

      <ConfirmationDialog
        open={openConfirmInvite}
        text={modalInviteTextProfile}
        title={modalTitle}
        onConfirmDialogClose={closeConfirmInvite}
        onYesClick={sendInvite}
        loading={loading}
      />
    </>
  );
}
