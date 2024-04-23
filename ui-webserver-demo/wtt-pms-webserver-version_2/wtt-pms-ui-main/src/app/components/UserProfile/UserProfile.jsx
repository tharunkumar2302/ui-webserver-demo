/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  getCurrentUserDetails,
  getUserProfileDetails,
  patchCurrentUserDetails,
  patchCandidateUserDetails,
} from "app/redux/actions/CurrentUserActions";
import AlertMsg from "../AlertMsg/AlertMsg";
import { buttonCancel, buttonSave, editMessage, headingBasicInformation, labelDesignation, labelFirstName, labelJobRole, labelLastName, labelOrganizationName, placeholderDesignation, placeholderFirstName, placeholderJobRole, placeholderLastName, placeholderOrganization } from "app/utils/constantForms";
import LoadingBar from "../LoadingBar/LoadingBar";
import StepperForm from "../Stepper/StepperForm";
import { buttonNext, buttonUpdate, labelAbout, labelCompanyLocation, labelCompanyName, labelCurrentCompany, labelCurrentCTC, labelCurrentDesignation, labelCurrentEmploymentStatus, labelCurrentLocation, labelDateOfJoining, labelDescription, labelDOB, labelDraft, labelEductionalQualification, labelEmailID, labelEmploymentType, labelExpectedCTC, labelExperience, labelHavingPassport, labelHeadline, labelIndustry, labelInstitute, labelJobTitle, labelLastEmployedDate, labelMaritalStatus, labelMarks, labelName, labelNoticePeriod, labelOverseasExperience, labelPassingDate, labelPassportValidity, labelPhoneNo, labelPreferredLocation, labelPresentAddress, labelPrimarySkills, labelPublished, labelReadyToRelocate, labelSecondarySkills, labelSpecialization, labelStatus, labelVisa, modalClose, placeholderAbout, placeholderCandidateId, placeholderCompanyLocation, placeholderCompanyName, placeholderCurrentCompany, placeholderCurrentCTC, placeholderCurrentDesignation, placeholderCurrentLocation, placeholderDateOfJoining, placeholderDescription, placeholderDOB, placeholderEductionalQualification, placeholderEmailID, placeholderExpectedCTC, placeholderExperience, placeholderHeadline, placeholderIndustry, placeholderInstitute, placeholderJobTitle, placeholderLastEmployedDate, placeholderMarks, placeholderName, placeholderNoticePeriod, placeholderPassingDate, placeholderPassportValidity, placeholderPhoneNo, placeholderPresentAddress, placeholderPrimarySkills, placeholderSecondarySkills, placeholderSpecialization, savedMessage, tooltipCreateProfile, tooltipDownloadProfileList, tooltipEmailSender, tooltipExportTemplate, tooltipImportProfile, tooltipUploadResume } from "app/utils/constantForms";
import { blockInvalidChar, localStorageUserRole } from "app/utils/constant";
import { validate } from "app/utils/validation";
import { UserProfileCurrentEmploymentStatus, UserProfileEduction, UserProfileEmployment_Type, UserProfileMarital_Status, UserProfilePrefered_location, UserProfileStatus, UserProfileYes_No } from "app/utils/constantDropDown";
import { chipFields } from "app/utils/chipField";

const UserProfile = (props) => {
  const [updateValue, setUpdateValue] = useState({
    firstName: "firstName",
    lastName: "lastName",
    designation: "designation",
    mobileNumber: "mobileNumber",
    emailAddress: "emailAddress",
    organization: { name: "organization" },
    role: { name: "role" },
    resume: {
      firstName: "firstName",
      lastName: "lastName",
      email: "",
      phone_no: "",
      current_location: "",
      marital_status: "",
      present_address: "",
      date_of_birth: "",
      status: "",
    }
  });
  let checkValidation = false;
  const [userRole, setUserRole] = useState(() => localStorageUserRole());
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [severity, setSeverity] = useState("");
  const [isPostCall, setIsPostCall] = useState(false);

  const steps = [
    "Basic Information",
    "Professional Information",
    "Experience Details",
    "Education Details",
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [nextHide, setNextHide] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [errors, seterrors] = useState([]);


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
  let name, value, finalName;

  const StyleButton = styled(Button)(() => ({
    padding: "6px 16px !important",
    borderRadius: "4px !important",
  }));

  //Experience HandleInput
  const ExperienceHandleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setEmpExperience({ ...empExperience, [name]: value });
  };
  const ExpAdd = () => {
    if (!updateValue.resume.experience_details)
      updateValue.resume.experience_details = [];
    updateValue.resume.experience_details.push(empExperience);
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

  const EducationHandleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setEducationExperience({ ...educationExperience, [name]: value });
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleInputResume = (e) => {
    name = e.target.name;
    value = e.target.value;
    finalName = { ...updateValue, [name]: value };
    finalName.resume[name] = value
    setUpdateValue(finalName);
    seterrors(validate(name, value));
  }

  const ArrayhandleInput = (e) => {
    name = 'primary_skill';
    value = e;
    finalName = { ...updateValue, [name]: value };
    finalName.resume[name] = value
    setUpdateValue(finalName);
  }

  const handleNext = () => {
    document.querySelector('.userProfileParent').parentElement.parentElement.scrollTop = 0;
    document.querySelector('.userProfileParent').parentElement.scrollTop = 0;
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
  React.useEffect(() => {
    chipFields();
  })

  const currentUserAPI = async () => {
    const getCurrentUserDetailsApi = await getCurrentUserDetails();
    if (getCurrentUserDetailsApi.payload.user.resume) {
      setEmpExperience(getCurrentUserDetailsApi.payload.user.resume.experience_details[0]);
      setEducationExperience(getCurrentUserDetailsApi.payload.user.resume.education_details[0]);
    } else {
      setIsPostCall(true);
      getCurrentUserDetailsApi.payload.user['resume'] = {
        firstName: getCurrentUserDetailsApi.payload.user.firstName,
        lastName: getCurrentUserDetailsApi.payload.user.lastName,
        email: getCurrentUserDetailsApi.payload.user.emailAddress,
        phone_no: getCurrentUserDetailsApi.payload.user.mobileNumber,
        status: "Published"
      };
    }
    setUpdateValue(getCurrentUserDetailsApi.payload.user);
  };

  const userProfileAPI = async (resumeId) => {
    const getUserProfileDetailsApi = await getUserProfileDetails(resumeId);
    setUpdateValue({ ...updateValue, resume: getUserProfileDetailsApi.payload });
    if (getUserProfileDetailsApi.payload) {
      setEmpExperience(getUserProfileDetailsApi.payload.experience_details[0]);
      setEducationExperience(getUserProfileDetailsApi.payload.education_details[0]);
    }
  };

  useEffect(() => {
    if (props.selectedResume) {
      userProfileAPI(props.selectedResume);
    } else {
      currentUserAPI();
    }
  }, []);

  let array = [];
  //if (updateValue.resume) {
  array = [
    // basic information=====================
    <>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderFirstName}
          onChange={handleInputResume}
          label={labelFirstName}
          error={errors.name}
          helperText={errors.name}
          variant="outlined"
          name="firstName"
          value={updateValue.resume?.firstName || updateValue.firstName}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderLastName}
          onChange={handleInputResume}
          label={labelLastName}
          error={errors.name}
          helperText={errors.name}
          variant="outlined"
          name="lastName"
          value={updateValue.resume?.lastName || updateValue.lastName}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          disabled
          placeholder={placeholderEmailID}
          onChange={handleInputResume}
          label={labelEmailID}
          variant="outlined"
          name="email"
          error={errors.email}
          helperText={errors.email}
          value={updateValue.resume?.email || updateValue.emailAddress}
          InputProps={{
            readOnly: readOnly,
          }}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderPhoneNo}
          type="number"
          onKeyDown={blockInvalidChar}
          onChange={handleInputResume}
          label={labelPhoneNo}
          variant="outlined"
          name="phone_no"
          error={errors.phone_no}
          helperText={errors.phone_no}
          value={updateValue.resume?.phone_no || updateValue.mobileNumber}
          fullWidth
          required
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCurrentLocation}
          onChange={handleInputResume}
          label={labelCurrentLocation}
          variant="outlined"
          name="current_location"
          error={errors.current_location}
          helperText={errors.current_location}
          value={updateValue.resume?.current_location}
          fullWidth
          required
        />
      </Grid>
      {userRole == "candidate" ? "" :
        <Grid xs={12} sm={6} item>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-helper-label">{labelStatus} *</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={updateValue.resume?.status}
              label={`${labelStatus} *`}
              onChange={(event) => {
                finalName = { ...updateValue, status: event.target.value };
                finalName.resume.status = event.target.value
                setUpdateValue({ ...finalName });
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
      }
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderPresentAddress}
          onChange={handleInputResume}
          label={labelPresentAddress}
          variant="outlined"
          name="present_address"
          value={updateValue.resume?.present_address}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderDOB}
          onChange={handleInputResume}
          label={labelDOB}
          variant="outlined"
          name="date_of_birth"
          value={updateValue.resume?.date_of_birth}
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
            value={updateValue.resume?.marital_status}
            label={labelMaritalStatus}
            onChange={(event) => {
              finalName = { ...updateValue, marital_status: event.target.value };
              finalName.resume.marital_status = event.target.value
              setUpdateValue({ ...finalName });
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
          onChange={handleInputResume}
          label={labelCurrentDesignation}
          variant="outlined"
          name="current_designation"
          value={updateValue.resume?.current_designation}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          type="text"
          placeholder={placeholderCurrentCompany}
          onChange={handleInputResume}
          label={labelCurrentCompany}
          variant="outlined"
          name="current_company"
          value={updateValue.resume?.current_company}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderExperience}
          type="number"
          onKeyDown={blockInvalidChar}
          onChange={handleInputResume}
          label={labelExperience}
          variant="outlined"
          name="experience"
          error={errors.experience}
          helperText={errors.experience}
          value={updateValue.resume?.experience}
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
            value={updateValue.resume?.education}
            label={labelEductionalQualification}
            onChange={(event) => {
              finalName = { ...updateValue, education: event.target.value };
              finalName.resume.education = event.target.value
              setUpdateValue({ ...finalName });
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
          defaultValue={updateValue.resume?.primary_skill}
          freeSolo
          onChange={(e, value) => {
            ArrayhandleInput(value);
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
          onChange={handleInputResume}
          label={labelSecondarySkills}
          variant="outlined"
          name="secondary_skill"
          value={updateValue.resume?.secondary_skill}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderCurrentCTC}
          type="number"
          onChange={handleInputResume}
          label={labelCurrentCTC}
          variant="outlined"
          onKeyDown={blockInvalidChar}
          name="current_ctc"
          error={errors.current_ctc}
          helperText={errors.current_ctc}
          value={updateValue.resume?.current_ctc}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderExpectedCTC}
          type="number"
          onChange={handleInputResume}
          label={labelExpectedCTC}
          variant="outlined"
          name="expected_ctc"
          onKeyDown={blockInvalidChar}
          error={errors.expected_ctc}
          helperText={errors.expected_ctc}
          value={updateValue.resume?.expected_ctc}
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
            value={updateValue.resume?.current_employment_status}
            label={labelCurrentEmploymentStatus}
            onChange={(event) => {
              finalName = { ...updateValue, current_employment_status: event.target.value };
              finalName.resume.current_employment_status = event.target.value
              setUpdateValue({ ...finalName });
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
          onChange={handleInputResume}
          label={labelIndustry}
          variant="outlined"
          name="industry"
          value={updateValue.resume?.industry}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          placeholder={placeholderNoticePeriod}
          type="number"
          onChange={handleInputResume}
          label={labelNoticePeriod}
          variant="outlined"
          name="notice_period"
          onKeyDown={blockInvalidChar}
          error={errors.notice_period}
          helperText={errors.notice_period}
          value={updateValue.resume?.notice_period}
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
            value={updateValue.resume?.prefered_location}
            label={labelPreferredLocation}
            onChange={(event) => {
              finalName = { ...updateValue, prefered_location: event.target.value };
              finalName.resume.prefered_location = event.target.value
              setUpdateValue({ ...finalName });
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
            value={updateValue.resume?.ready_to_relocate}
            label={labelReadyToRelocate}
            onChange={(event) => {
              finalName = { ...updateValue, ready_to_relocate: event.target.value };
              finalName.resume.ready_to_relocate = event.target.value
              setUpdateValue({ ...finalName });
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
            value={updateValue.resume?.overseas_experience}
            label={labelOverseasExperience}
            onChange={(event) => {
              finalName = { ...updateValue, overseas_experience: event.target.value };
              finalName.resume.overseas_experience = event.target.value
              setUpdateValue({ ...finalName });
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
            value={updateValue.resume?.having_passport}
            label={labelHavingPassport}
            onChange={(event) => {
              finalName = { ...updateValue, having_passport: event.target.value };
              finalName.resume.having_passport = event.target.value
              setUpdateValue({ ...finalName });
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
          onChange={handleInputResume}
          label={labelPassportValidity}
          variant="outlined"
          name="passport_validity"
          value={updateValue.resume?.passport_validity}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">{labelVisa}</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={updateValue.resume?.visa}
            label={labelVisa}
            onChange={(event) => {
              finalName = { ...updateValue, visa: event.target.value };
              finalName.resume.visa = event.target.value
              setUpdateValue({ ...finalName });
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
          onChange={handleInputResume}
          label={labelAbout}
          variant="outlined"
          name="About"
          value={updateValue.resume?.About}
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
          error={errors.Marks_in_Percentage}
          helperText={errors.Marks_in_Percentage}
          onKeyDown={blockInvalidChar}
          variant="outlined"
          name="marks_in_percentage"
          value={educationExperience?.marks_in_percentage}
          fullWidth
        />
      </Grid>
    </>,
  ];

  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUpdateValue({ ...updateValue, [name]: value });
  };

  const cancelButton = (e) => {
    e.preventDefault();
    currentUserAPI();
  }

  const profileSumbit = async (e) => {
    e.preventDefault();
    let errorFieldname = "";
    const data = Object.keys(updateValue).some((name) => {
      errorFieldname = name;
      return (
        (name === "firstName" ||
          name === "lastName" ||
          name === "mobileNumber" ||
          name === "designation") &&
        !updateValue[name]
      );
    });
    if (data) {
      setAlertMsg("Please enter " + errorFieldname + " field.");
      setSeverity("info");
      handleClick();
    } else {
      checkValidation = true;
    }
    if (checkValidation) {
      setLoading(true);
      try {
        const postApi = await patchCurrentUserDetails(
          updateValue.firstName,
          updateValue.lastName,
          updateValue.designation,
          updateValue.mobileNumber,
          updateValue.emailAddress
        );
        if (postApi.payload.status === 200) {
          setAlertMsg(editMessage);
          setSeverity("success");
          handleClick();
        }
        window.dispatchEvent(
          new CustomEvent("UpdatedDetails", { details: updateValue })
        );
        setLoading(false)
      } catch (e) {
        setAlertMsg(e.message);
        setSeverity("info");
        handleClick();
        setLoading(false)
      }
    }

  }

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  }

  const handleClick = () => {
    setAlertOpen(true);
  }

  // Update handle
  const UpdateHandel = async (e) => {
    e.preventDefault();
  }

  const saveHandel = async (e) => {
    e.preventDefault();
    updateValue.resume.experience_details = [];
    updateValue.resume.experience_details.push(empExperience);
    updateValue.resume.education_details = [];
    updateValue.resume.education_details.push(educationExperience);

    //patch call
    let errorFieldname = "";
    const data = Object.keys(updateValue).some((name) => {
      errorFieldname = name;
      return (
        (name === "firstName" ||
          name === "lastName" ||
          name === "mobileNumber" ||
          name === "designation") &&
        !updateValue[name]
      );
    });
    if (data) {
      setAlertMsg("Please enter " + errorFieldname + " field.");
      setSeverity("info");
      handleClick();
    } else {
      checkValidation = true;
    }
    if (checkValidation) {
      setLoading(true);
      try {
        const postApi = await patchCandidateUserDetails(
          updateValue.resume.firstName,
          updateValue.resume.lastName,
          updateValue.resume.email,
          updateValue.resume.phone_no,
          updateValue.resume.current_location,
          updateValue.resume.marital_status,
          updateValue.resume.present_address,
          updateValue.resume.date_of_birth,
          updateValue.resume.current_designation,
          updateValue.resume.current_company,
          updateValue.resume.experience,
          updateValue.resume.education,
          updateValue.resume.primary_skill,
          updateValue.resume.secondary_skill,
          updateValue.resume.education_details,
          updateValue.resume.experience_details,
          updateValue.resume.current_ctc,
          updateValue.resume.expected_ctc,
          updateValue.resume.current_employment_status,
          updateValue.resume.industry,
          updateValue.resume.notice_period,
          updateValue.resume.prefered_location,
          updateValue.resume.ready_to_relocate,
          updateValue.resume.overseas_experience,
          updateValue.resume.having_passport,
          updateValue.resume.passport_validity,
          updateValue.resume.visa,
          updateValue.resume.created_by,
          updateValue.resume.uploaded_by,
          updateValue.resume.About,
          updateValue.resume.status
        );
        if (postApi.payload.status === 200) {
          setAlertMsg(editMessage);
          setSeverity("success");
          handleClick();
        }
        window.dispatchEvent(
          new CustomEvent("UpdatedDetails", { details: updateValue })
        );
        setLoading(false)
      } catch (e) {
        setAlertMsg(e.message);
        setSeverity("info");
        handleClick();
        setLoading(false)
      }
    }
  }

  return (

    <Grid className="userProfileParent">
      <Card style={{ padding: "20px 5px", margin: "0 auto" }}>
        <CardContent>
          {userRole == "candidate" || (props.display) ?
            <>
              {/* stepper start */}
              <div style={{ pointerEvents: props.display ? "none" : "auto" }}>
                <StepperForm
                  step={steps}
                  load={false}
                  formList={array}
                  currentStep={activeStep}
                  handelReset={handleReset}

                />
              </div>
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
                {activeStep === steps.length - 1 && props.display ? "" :
                  <StyleButton
                    variant="contained"
                    style={{
                      backgroundColor: activeStep === steps.length - 1
                        ? readOnly
                          ? "rgb(255, 158, 67)"
                          : "rgb(9, 182, 109)"
                        : "rgb(25,118,210)",
                      color: activeStep === steps.length - 1
                        ? readOnly
                          ? "#000000"
                          : "#ffffff"
                        : "#ffffff",
                    }}
                    disabled={nextHide === -1}
                    onClick={
                      activeStep === steps.length - 1
                        ? saveHandel
                        : handleNext
                    }
                  >
                    {activeStep === steps.length - 1
                      ? readOnly
                        ? buttonUpdate
                        : buttonSave
                      : buttonNext}
                  </StyleButton>
                }
              </Box>
              {/* stepper end */}
            </> :
            <>
              <Typography gutterBottom variant="h5">
                {headingBasicInformation}
              </Typography>
              <form>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      placeholder={placeholderFirstName}
                      onChange={handleInput}
                      label={labelFirstName}
                      variant="outlined"
                      name="firstName"
                      value={updateValue.firstName}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      placeholder={placeholderLastName}
                      onChange={handleInput}
                      label={labelLastName}
                      variant="outlined"
                      name="lastName"
                      value={updateValue.lastName}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      disabled
                      placeholder={placeholderEmailID}
                      onChange={handleInput}
                      label={labelEmailID}
                      variant="outlined"
                      name="emailAddress"
                      value={updateValue.emailAddress}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      disabled
                      placeholder={placeholderJobRole}
                      onChange={handleInput}
                      label={labelJobRole}
                      variant="outlined"
                      name="role"
                      value={updateValue.role.name}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      disabled
                      placeholder={placeholderOrganization}
                      onChange={handleInput}
                      label={labelOrganizationName}
                      variant="outlined"
                      name="organization"
                      value={updateValue.organization.name}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      type="number"
                      placeholder={placeholderPhoneNo}
                      onChange={handleInput}
                      label={labelPhoneNo}
                      variant="outlined"
                      name="mobileNumber"
                      onKeyDown={blockInvalidChar}
                      value={updateValue.mobileNumber}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      placeholder={placeholderDesignation}
                      label={labelDesignation}
                      onChange={handleInput}
                      variant="outlined"
                      name="designation"
                      value={updateValue.designation}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item></Grid>
                  <Grid xs={12} sm={4} item></Grid>
                  <Grid xs={6} sm={2} item style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={cancelButton}
                    >
                      {buttonCancel}
                    </Button>
                  </Grid>
                  <Grid xs={6} sm={2} item style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={profileSumbit}
                      style={{
                        backgroundColor: "rgb(9, 182, 109)",
                        minWidth: '77px'
                      }}
                    >
                      {buttonSave}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          }
        </CardContent>
      </Card>
      <AlertMsg
        open={alertOpen}
        handle={handleClose}
        severity={severity}
        Msg={alertMsg}
      />
      <LoadingBar loading={loading} />
    </Grid>
  );
};

export default UserProfile;
