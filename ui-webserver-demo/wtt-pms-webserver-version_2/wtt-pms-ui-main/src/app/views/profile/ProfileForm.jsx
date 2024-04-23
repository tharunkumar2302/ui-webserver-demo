/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable eqeqeq */
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import ProfileUpload from "app/components/ProfileUpload/ProfileUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FilterSearch from "../../components/Filter/FilterSearch/FilterSearch";
import ProfileImport from "app/components/ProfileImport/ProfileImport";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import NotificationsEmail from "../../components/NotificationsEmail/NotificationsEmail";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";
import { blockInvalidChar, value100Per, localStorageUserRole } from "app/utils/constant";
import { isMobile } from "app/utils/utils";
import { buttonCreateProfile, buttonNext, buttonSave, buttonSaveYourEducationDetails, buttonSaveYourExperienceDetails, buttonUpdate, headingCreateProfile, headingEditProfile, labelAbout, labelArchive, labelCandidateId, labelCompanyLocation, labelCompanyName, labelCurrentCompany, labelCurrentCTC, labelCurrentDesignation, labelCurrentEmploymentStatus, labelCurrentJobRole, labelCurrentLocation, labelDateOfJoining, labelDescription, labelDOB, labelDraft, labelEductionalQualification, labelEmailID, labelEmploymentType, labelExpectedCTC, labelExperience, labelFirstName, labelHavingPassport, labelHeadline, labelIndustry, labelInstitute, labelJobTitle, labelLastEmployedDate, labelLastName, labelMaritalStatus, labelMarks, labelName, labelNoticePeriod, labelOverseasExperience, labelPassingDate, labelPassportValidity, labelPhoneNo, labelPreferredLocation, labelPresentAddress, labelPrimarySkills, labelPublished, labelReadyToRelocate, labelSecondarySkills, labelSpecialization, labelStatus, labelVisa, modalClose, placeholderAbout, placeholderCandidateId, placeholderCompanyLocation, placeholderCompanyName, placeholderCurrentCompany, placeholderCurrentCTC, placeholderCurrentDesignation, placeholderCurrentLocation, placeholderDateOfJoining, placeholderDescription, placeholderDOB, placeholderEductionalQualification, placeholderEmailID, placeholderExpectedCTC, placeholderExperience, placeholderFirstName, placeholderHeadline, placeholderIndustry, placeholderInstitute, placeholderJobTitle, placeholderLastEmployedDate, placeholderLastName, placeholderMarks, placeholderName, placeholderNoticePeriod, placeholderPassingDate, placeholderPassportValidity, placeholderPhoneNo, placeholderPresentAddress, placeholderPrimarySkills, placeholderSecondarySkills, placeholderSpecialization, savedMessage, selectCheckboxMessage, tooltipCreateProfile, tooltipDownloadProfileList, tooltipEmailSender, tooltipImportProfile, tooltipUploadResume } from "app/utils/constantForms";
import StepperForm from "app/components/Stepper/StepperForm";
import { UserProfileCurrentEmploymentStatus, UserProfileEduction, UserProfileEmployment_Type, UserProfileMarital_Status, UserProfilePrefered_location, UserProfileStatus, UserProfileYes_No } from "app/utils/constantDropDown";
import useSelectDataTable from "app/hooks/useSelectTableData";
import xlsImportIcon from './../../components/icons/xlsImportIcon.png'
import xlsExportIcon from './../../components/icons/xlsExportIcon.png'
import { chipFields } from "app/utils/chipField";
import NvmSearch from "app/components/Filter/FilterSearch/Nvmsearch";

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
const StepperStyle = styled(Stepper)(() => ({
  display: isMobile() && "grid",
  gridGap: isMobile() && "10px",
  paddingBottom: isMobile() && "1em",
}));
const CreateBtn = styled(Button)(() => ({
  color: "#ffffff !important",
  backgroundColor: "#1976d2 !important",
  borderRadius: "4px !important",
  padding: " 6px 16px !important",
}));

const StyleButton = styled(Button)(() => ({
  padding: "6px 16px !important",
  borderRadius: "4px !important",
}));
const alertStyle = {
  top: "-28rem",
  left: "auto",
  right: "1.3rem",
};
const EmailsendIcon = styled(EmailIcon)(() => ({
  margin: "0em 0.3em !important",
  cursor: "pointer !important",
  color: "#1A2038 !important",
  width: "20px !important",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04) !important",
    borderRadius: "50% !important",
  },
}));
const UploadIcon = styled(CloudUploadIcon)(() => ({
  margin: "0em 0.3em !important",
  cursor: "pointer !important",
  color: "#1A2038 !important",
  width: "20px !important",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04) !important",
    borderRadius: "50%",
  },
}));

const AddBtnIcon = styled(PersonAddIcon)(() => ({
  margin: "0.3em 0.3em !important",
  cursor: "pointer !important",
  color: "#1A2038 !important",
  width: "20px !important",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04) !important",
    borderRadius: "50% !important",
  },
}));

const FilterBox = styled(Box)(() => ({
  position: "absolute",
  right: "2.5rem",
  top: "0.5rem",
}));

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));

export default function ProfileForm(props) {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [userRole, setUserRole] = React.useState(() => localStorageUserRole());
  function handlelose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }
  function handleClick() {
    setAlertOpen(true);
  }

  // Stepper
  const steps = [
    "Basic Information",
    "Professional Information",
    "Experience Details",
    "Education Details",
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [nextHide, setNextHide] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  //empExperience====================
  const [empExperience, setEmpExperience] = React.useState({
    job_title: "",
    employment_type: "",
    company_name: "",
    location: "",
    Working: "",
    industry: "",
    headline: "",
    date_of_joining: "",
    last_date: "",
    description: "",
  });
  let name, value;
  //Experience HandleInput
  const ExperienceHandleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setEmpExperience({ ...empExperience, [name]: value });
  };
  const ExpAdd = () => {
    if (!props.cellData.experience_details)
      props.cellData.experience_details = [];
    props.cellData.experience_details.push(empExperience);
    setAlertMsg(savedMessage);
    setSeverity("success");
    handleClick();
  };

  //educationExperience=========
  const [educationExperience, setEducationExperience] = React.useState({
    qualification: "",
    institute: "",
    specialization: "",
    year_of_passing: "",
    marks_in_percentage: "",
  });

  //enable and disble next button of basic information
  React.useEffect(() => {
    const namereg = /^[a-z0-9\s]+$/i;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    var pattern =
      /(((^[\+,0][9][1])(((\s[0-9]{7,10})|(\S[0-9]{7,10}))|([-]\S[0-9]{7,10})))|((^[\+,0][2]{2,2})((\S[0-9]{7,8})|((([-])[0-9]{7,8})|(\s[0-9]{7,8})))))|(((^[6,7,8,9][0-9]{9,9}))|(^[0,\+](([9][1)|[6,7,8,9]))[0-9]{8,9}))/gm;
    if (
      props.cellData.firstName &&
      namereg.test(props.cellData.firstName) &&
      props.cellData.firstName.trim().length != 0 &&
      props.cellData.lastName &&
      namereg.test(props.cellData.lastName) &&
      props.cellData.lastName.trim().length != 0 &&
      props.cellData.email &&
      regex.test(props.cellData.email) &&
      props.cellData.phone_no &&
      // pattern.test(props.cellData.phone_no) &&
      props.cellData.current_location &&
      props.cellData.current_location != "" &&
      props.cellData.status &&
      props.cellData.status != ""
    ) {
      setNextHide(1);
    } else {
      setNextHide(0);
    }
  }, [
    props.cellData.firstName,
    props.cellData.lastName,
    props.cellData.email,
    props.cellData.phone_no,
    props.cellData.current_location,
    props.cellData.status,
  ]);

  //data get education_details
  React.useEffect(() => {
    // eslint-disable-next-line array-callback-return
    props.cellData.education_details?.length &&
      props.cellData.education_details.map((e) => {
        setEducationExperience(e);
      });
  }, [props.cellData.education_details]);

  React.useEffect(()=>{
    chipFields();
  })

  //data get experience_details
  React.useEffect(() => {
    // eslint-disable-next-line array-callback-return
    props.cellData.experience_details?.length &&
      props.cellData.experience_details.map((e) => {
        setEmpExperience(e);
      });
  }, [props.cellData.experience_details]);

  //Education HandleInput
  const EducationHandleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setEducationExperience({ ...educationExperience, [name]: value });
  };
  const EducationHandleInputAdd = () => {
    if (!props.cellData.education_details)
      props.cellData.education_details = [];
    props.cellData.education_details.push(educationExperience);
    setAlertMsg(savedMessage);
    setSeverity("success");
    handleClick();
  };
  const handleModal1Open = () => setOpen1(true);
  const handleModal1Close = () => setOpen1(false);
  const handleModal2Open = () => setOpen2(true);
  const handleModal2Close = () => setOpen2(false);
  const handleEmailOpen = () => {
    if (useSelectDataTable?.selectItem?.length > 0) {
      setOpen3(true);
    } else {
      setAlertMsg(selectCheckboxMessage);
      setSeverity("error");
      handleClick();
    }
  };
  const handleEmailClose = () => setOpen3(false);
  // Form render
  const array = [
    // basic information=====================
    <>
      <Grid xs={12} sm={6} item>
        <TextField
          disabled
          placeholder={placeholderCandidateId}
          label={labelCandidateId}
          variant="outlined"
          name="id"
          value={props.cellData.id}
          fullWidth
          required
        />
      </Grid>

      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderEmailID}
          onChange={props.handleInput}
          label={labelEmailID}
          variant="outlined"
          name="email"
          error={props.errors.email}
          helperText={props.errors.email}
          value={props.cellData.email}
          InputProps={{
            readOnly: props.readOnly,
          }}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderFirstName}
          onChange={props.handleInput}
          label={labelFirstName}
          error={props.errors.firstName}
          helperText={props.errors.firstName}
          variant="outlined"
          name="firstName"
          value={props.cellData.firstName}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderLastName}
          onChange={props.handleInput}
          label={labelLastName}
          error={props.errors.lastName}
          helperText={props.errors.lastName}
          variant="outlined"
          name="lastName"
          value={props.cellData.lastName}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderPhoneNo}
          // type="number"
          onChange={props.handleInput}
          label={labelPhoneNo}
          variant="outlined"
          name="phone_no"
          // onKeyDown={blockInvalidChar}
          // error={props.errors.phone_no}
          // helperText={props.errors.phone_no}
          value={props.cellData.phone_no}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCurrentLocation}
          onChange={props.handleInput}
          label={labelCurrentLocation}
          variant="outlined"
          name="current_location"
          error={props.errors.current_location}
          helperText={props.errors.current_location}
          value={props.cellData.current_location}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">{labelStatus} *</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.status}
            label={`${labelStatus} *`}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                status: event.target.value,
              });
            }}
          >{UserProfileStatus.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderPresentAddress}
          onChange={props.handleInput}
          label={labelPresentAddress}
          variant="outlined"
          name="present_address"
          value={props.cellData.present_address}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderDOB}
          onChange={props.handleInput}
          label={labelDOB}
          variant="outlined"
          error={props.errors.date_of_birth}
          helperText={props.errors.date_of_birth}
          name="date_of_birth"
          value={props.cellData.date_of_birth}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelMaritalStatus}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.marital_status}
            label={labelMaritalStatus}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                marital_status: event.target.value,
              });
            }}
          >{UserProfileMarital_Status.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
    </>,
    //Company=================
    <>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCurrentDesignation}
          onChange={props.handleInput}
          label={labelCurrentDesignation}
          variant="outlined"
          name="current_designation"
          value={props.cellData.current_designation}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCurrentCompany}
          onChange={props.handleInput}
          label={labelCurrentCompany}
          variant="outlined"
          name="current_company"
          value={props.cellData.current_company}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderExperience}
          type="number"
          onChange={props.handleInput}
          label={labelExperience}
          variant="outlined"
          name="experience"
          onKeyDown={blockInvalidChar}
          error={props.errors.experience}
          helperText={props.errors.experience}
          value={props.cellData?.experience}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelEductionalQualification}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.education}
            label={labelEductionalQualification}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                education: event.target.value,
              });
            }}
          >{UserProfileEduction.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <Autocomplete
          multiple
          id="tags-filled"
          options={[]}
          defaultValue={props?.cellData?.primary_skill}
          freeSolo
          onChange={(e, value) => {
            props.setCellData({
              ...props.cellData, primary_skill: value,
            })
          }}
          renderTags={(value, getTagProps) =>
            value.map((data, index) => (
              <Chip variant="outlined" label={data} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={labelPrimarySkills}
              placeholder={placeholderPrimarySkills}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderSecondarySkills}
          onChange={props.handleInput}
          label={labelSecondarySkills}
          variant="outlined"
          name="secondary_skill"
          value={props.cellData?.secondary_skill}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderCurrentCTC}
          type="number"
          onChange={props.handleInput}
          label={labelCurrentCTC}
          variant="outlined"
          name="current_ctc"
          onKeyDown={blockInvalidChar}
          error={props.errors.current_ctc}
          helperText={props.errors.current_ctc}
          value={props.cellData.current_ctc}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderExpectedCTC}
          type="number"
          onChange={props.handleInput}
          label={labelExpectedCTC}
          variant="outlined"
          name="expected_ctc"
          onKeyDown={blockInvalidChar}
          error={props.errors.expected_ctc}
          helperText={props.errors.expected_ctc}
          value={props.cellData.expected_ctc}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelCurrentEmploymentStatus}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.current_employment_status}
            label={labelCurrentEmploymentStatus}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                current_employment_status: event.target.value,
              });
            }}
          >{UserProfileCurrentEmploymentStatus.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderIndustry}
          onChange={props.handleInput}
          label={labelIndustry}
          variant="outlined"
          name="industry"
          value={props.cellData.industry}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderNoticePeriod}
          type="number"
          onChange={props.handleInput}
          label={labelNoticePeriod}
          variant="outlined"
          name="notice_period"
          onKeyDown={blockInvalidChar}
          error={props.errors.notice_period}
          helperText={props.errors.notice_period}
          value={props.cellData.notice_period}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelPreferredLocation}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.prefered_location}
            label={labelPreferredLocation}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                prefered_location: event.target.value,
              });
            }}
          >{UserProfilePrefered_location.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelReadyToRelocate}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.ready_to_relocate}
            label={labelReadyToRelocate}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                ready_to_relocate: event.target.value,
              });
            }}
          >{UserProfileYes_No.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelOverseasExperience}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.overseas_experience}
            label={labelOverseasExperience}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                overseas_experience: event.target.value,
              });
            }}
          >{UserProfileYes_No.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelHavingPassport}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.having_passport}
            label={labelHavingPassport}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                having_passport: event.target.value,
              });
            }}
          >{UserProfileYes_No.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderPassportValidity}
          onChange={props.handleInput}
          label={labelPassportValidity}
          variant="outlined"
          name="passport_validity"
          value={props.cellData.passport_validity}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">{labelVisa}</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={props.cellData.visa}
            label={labelVisa}
            onChange={(event) => {
              props.setCellData({
                ...props.cellData,
                visa: event.target.value,
              });
            }}
          >{UserProfileYes_No.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderAbout}
          onChange={props.handleInput}
          label={labelAbout}
          variant="outlined"
          name="About"
          value={props.cellData.About}
          fullWidth
        />
      </Grid>
    </>,
    //Experience=====================================
    <>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderJobTitle}
          onChange={ExperienceHandleInput}
          label={labelJobTitle}
          variant="outlined"
          name="job_title"
          value={empExperience?.job_title}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            {labelEmploymentType}
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={empExperience?.employment_type}
            label={labelEmploymentType}
            onChange={(event) => {
              setEmpExperience({
                ...empExperience,
                employment_type: event.target.value,
              });
            }}
          >{UserProfileEmployment_Type.map((el) => (
            <MenuItem value={el.title}>
              {el.display}
            </MenuItem>
          ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCompanyName}
          onChange={ExperienceHandleInput}
          label={labelCompanyName}
          variant="outlined"
          name="company_name"
          value={empExperience?.company_name}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCompanyLocation}
          onChange={ExperienceHandleInput}
          label={labelCompanyLocation}
          variant="outlined"
          name="location"
          value={empExperience?.location}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderIndustry}
          onChange={ExperienceHandleInput}
          label={labelIndustry}
          variant="outlined"
          name="industry"
          value={empExperience?.industry}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderHeadline}
          onChange={ExperienceHandleInput}
          label={labelHeadline}
          variant="outlined"
          name="headline"
          value={empExperience?.headline}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderDateOfJoining}
          onChange={ExperienceHandleInput}
          label={labelDateOfJoining}
          variant="outlined"
          name="date_of_joining"
          value={empExperience?.date_of_joining}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        {empExperience?.Working == true ? (
          ""
        ) : (
          <TextField
            type="text"
            placeholder={placeholderLastEmployedDate}
            onChange={ExperienceHandleInput}
            label={labelLastEmployedDate}
            variant="outlined"
            name="last_date"
            value={empExperience?.last_date}
            fullWidth
          />
        )}
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderDescription}
          onChange={ExperienceHandleInput}
          label={labelDescription}
          variant="outlined"
          name="description"
          value={empExperience?.description}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => {
                  setEmpExperience({
                    ...empExperience,
                    Working: event.target.checked,
                  });
                }}
                checked={empExperience?.Working}
              />
            }
            label={labelCurrentJobRole}
          />
        </FormGroup>
      </Grid>

      <Grid xs={12} sm={6} item>
        <Button variant="contained" onClick={ExpAdd} style={{ backgroundColor: "rgb(9, 182, 109)" }}>

          <SaveAltIcon
            fontSize="small"
            style={{ marginRight: "0.5rem" }}
          />
          {buttonSaveYourExperienceDetails}
        </Button>
      </Grid>
    </>,
    //Education==========================
    <>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderEductionalQualification}
          onChange={EducationHandleInput}
          label={labelEductionalQualification}
          variant="outlined"
          name="qualification"
          value={educationExperience?.qualification}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderInstitute}
          onChange={EducationHandleInput}
          label={labelInstitute}
          variant="outlined"
          name="institute"
          value={educationExperience?.institute}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderSpecialization}
          onChange={EducationHandleInput}
          label={labelSpecialization}
          variant="outlined"
          name="specialization"
          value={educationExperience?.specialization}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderPassingDate}
          onChange={EducationHandleInput}
          label={labelPassingDate}
          variant="outlined"
          name="year_of_passing"
          value={educationExperience?.year_of_passing}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderMarks}
          type="number"
          onChange={EducationHandleInput}
          label={labelMarks}
          error={props.errors.Marks_in_Percentage}
          helperText={props.errors.Marks_in_Percentage}
          variant="outlined"
          name="marks_in_percentage"
          onKeyDown={blockInvalidChar}
          value={educationExperience?.marks_in_percentage}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item></Grid>
      <Grid xs={12} sm={6} item>
        <Button variant="contained" onClick={EducationHandleInputAdd} style={{ backgroundColor: "rgb(9, 182, 109)" }}>

          <SaveAltIcon
            fontSize="small"
            style={{ marginRight: "0.5rem" }}
          />
          {buttonSaveYourEducationDetails}
        </Button>
      </Grid>
    </>,
  ];
  const handleNext = () => {
    document.querySelector(".customClass").parentElement.scrollTop = 0
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClickOpen = () => {
    props.setOpen(true);
    props.setReadOnly(false);
    props.setCellData({});
    props.seterrors({})
    setEducationExperience({});
    setEmpExperience({});
    setActiveStep(0);
  };

  const handleClose = () => {
    props.setOpen(false);
    props.setCellData({});
    props.seterrors({})
    setEducationExperience({});
    setEmpExperience({});
    setActiveStep(0);
  };


  // Get All Export Template
  // const exportTemplateData = async () => {
  //   let getExportTemplate = await getExportTemplateDetails();
  //   fileDownload(getExportTemplate.payload, "resumeImportTemplate_1.xlsx");
  // };

  const downloadProfileList = () => {
    if (useSelectDataTable.selectItem?.length > 0) {
      props.GetAllExportData();
    } else {
      setAlertMsg(selectCheckboxMessage);
      setSeverity("error");
      handleClick();
    }
  };
  return (
    <>
    {/*
    //as per discussion hide the create profile button
       {!isMobile() ? (
        <CreateBtn
          variant="contained"
          onClick={handleClickOpen}
          style={{ padding: "6px", minWidth: "8rem" }}
        >
          <AddIcon fontSize="small" style={{ marginRight: "0.3rem" }} /> {buttonCreateProfile}
        </CreateBtn>
      ) : (
        <Tooltip title={tooltipCreateProfile}>
          <AddBtnIcon onClick={handleClickOpen} />
        </Tooltip>
      )} */}
      {userRole == "superuser" ? "":
      <FilterBox>
        <Tooltip title={tooltipEmailSender}>
          <EmailsendIcon onClick={handleEmailOpen} />
        </Tooltip>
        <Tooltip title={tooltipUploadResume}>
          <UploadIcon onClick={handleModal1Open} />
        </Tooltip>
        <Tooltip title={tooltipDownloadProfileList}>
          <img src={xlsExportIcon} alt="Export-icon" style={{ marginBottom: "4px" ,marginRight: "9px", marginLeft: "5px",width: "19px", cursor: "pointer !important"}} onClick={downloadProfileList} />
        </Tooltip>
        <Tooltip title={tooltipImportProfile}>
          <img src={xlsImportIcon} alt="import-icon" style={{ marginBottom: "4px" ,width: "19px", cursor: "pointer !important"}} onClick={handleModal2Open} />
        </Tooltip>
       </FilterBox>}
      <FilterSearch 
        searchInput={props.searchInput}
        searchInputRemove={props.searchInputRemove}
        handelInputSearch={props.handelInputSearch}
      />
      <NvmSearch 
         nvmSearchInput={props.nvmSearchInput}
        searchInputRemove={props.searchInputRemove}
        handelNvmInputSearch={props.handelNvmInputSearch}
      />
      <Box>
        <Modal
          open={open1}
          onClose={handleModal1Close}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DragDropBox>
            <ProfileUpload setOpen1={setOpen1}  />
          </DragDropBox>
        </Modal>
      </Box>
      <Box>
        <Modal
          open={open2}
          onClose={handleModal2Close}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DragDropBox>
            <ProfileImport setOpen2={setOpen2} />
          </DragDropBox>
        </Modal>
      </Box>
      <Box>
        <Modal
          open={open3}
          onClose={handleEmailClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DragDropBox>
            <NotificationsEmail
              setOpen3={setOpen3}
            />
          </DragDropBox>
        </Modal>
      </Box>
      <Dialog open={props.open} maxWidth={"md"} onClose={handleClose}>
        <DialogTitle>
          {props.readOnly ? headingEditProfile : headingCreateProfile}
        </DialogTitle>
        <CloseButton
          onClick={handleClose}
          style={{ position: "absolute", padding: "8px" }}
        >
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
        <DialogContent>
          <StepperForm
            step={steps}
            load={props.loading}
            formList={array}
            currentStep={activeStep}
            handelReset={handleReset}
          />

        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <StyleButton
              variant="contained"
              color="secondary"
              onClick={activeStep !== 0 && handleBack}
              disabled={activeStep === 0}
              sx={{ mr: 1 }}
              style={{
                backgroundColor:
                  activeStep === 0
                    ? "rgba(0, 0, 0, 0.12)"
                    : "rgb(255, 175, 56)",
                marginRight: "8px",
              }}
            >
              Back
            </StyleButton>
            <Box sx={{ flex: "1 1 auto" }} />

            <StyleButton
              variant="contained"
              style={{
                backgroundColor:
                  nextHide === 0 ? "rgba(0, 0, 0, 0.12)" : activeStep === steps.length - 1
                    ? props.readOnly
                      ? 'rgb(255, 158, 67)'
                      : 'rgb(9, 182, 109)'
                    : "rgb(25,118,210)",
                color: nextHide === 0 ? "" : activeStep === steps.length - 1
                  ? props.readOnly
                    ? '#000000'
                    : "#ffffff"
                  : "#ffffff",
              }}
              disabled={nextHide === 0}
              onClick={
                activeStep === steps.length - 1
                  ? props.readOnly
                    ? props.UpdateHandel
                    : props.saveHandel
                  : handleNext
              }
            >
              {activeStep === steps.length - 1
                ? props.readOnly
                  ? buttonUpdate
                  : buttonSave
                : buttonNext}
            </StyleButton>
          </Box>
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handlelose}
            style={alertStyle}
          >
            <Alert
              onClose={handlelose}
              severity={severity}
              sx={{ width: value100Per }}
              variant="filled"
            >
              {JSON.parse(JSON.stringify(alertMsg))}
            </Alert>
          </Snackbar>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handlelose}
        style={alertStyle}
      >
        <Alert
          onClose={handlelose}
          severity={severity}
          sx={{ width: value100Per }}
          variant="filled"
        >
          {JSON.parse(JSON.stringify(alertMsg))}
        </Alert>
      </Snackbar>
    </>
  );
}
