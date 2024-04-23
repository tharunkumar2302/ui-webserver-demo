/* eslint-disable no-unused-vars */
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Autocomplete,
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import { CardContent, Grid } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { getJobRoleDetails } from "app/redux/actions/JobRoleActions";
import { buttonCreateJob, buttonSave, buttonUpdate, headingCreateJobOpening, headingEditJobOpening, labelArchive, labelDepartment, labelDescription, labelDraft, labelDuration, labelEductionalQualification, labelEmploymentType, labelIndustryType, labelJobRole, labelLocation, labelMaxExperience, labelMinExperience, labelPublished, labelResponsibilities, labelSkills, labelStatus, labelTags, labelTotalOpenings, labelWorkMode, modalClose, placeholderDepartment, placeholderDescription, placeholderEductionalQualification, placeholderEmailBody, placeholderIndustryType, placeholderLocation, placeholderMaxExperience, placeholderMinExperience, placeholderResponsibilities, placeholderPrimarySkills,placeholderSecondarySkills, placeholderTags, placeholderTotalOpenings,placeholderShortJD , labelShortJD} from "app/utils/constantForms";
import JoditEditor from "jodit-react";
import { JobOpeningEmploymentType, JobOpeningMonths, JobOpeningWorkMode, UserProfileStatus } from "app/utils/constantDropDown";
import { blockInvalidChar } from "app/utils/constant";

const tags = [
  { title: "Reactjs", year: 1994 },
  { title: "Nodejs", year: 1972 },
  { title: "Angular", year: 1974 },
];

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  right: "2%",
  top: "1%",
}));
const config = {
  readonly: false,
  placeholder: placeholderDescription,
};
const Repsconfig = {
  readonly: false,
  placeholder: placeholderResponsibilities,
};
const PrimarySkillsconfig = {
  readonly: false,
  placeholder: placeholderPrimarySkills,
};
const SecondarySkillsconfig = {
  readonly: false,
  placeholder: placeholderSecondarySkills,
};
const Label = styled(Typography)(() => ({
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '1.5',
  textTransform: 'none',
  whiteSpace: 'normal',
  marginBottom: '0.5rem'
}));

export default function JobOpeningForm(props) {
  const [jobRole, setJobRole] = React.useState([]);
  const [rol, setRol] = React.useState([]);
  let [description, setDescription] = React.useState('');
  const [shortJDError, setShortJDError] = React.useState("");
  let jobdisable=false;
  React.useEffect(() => {
    getJobRoleData();
  }, []);

  const getJobRoleData = async () => {
    const getJobRoleApi = await getJobRoleDetails();
    var JobRoleArray = [];
    for (var property of getJobRoleApi.payload.results) {
      const jobRoleDropdown = {
        ...property,
        label: property.name,
      };
      JobRoleArray.push(jobRoleDropdown);
     if(!JobRoleArray.length){
      jobdisable = true
     }else{
      jobdisable=false
     }
    }
    setJobRole(JobRoleArray);
  };

  const getvalue = (value) => {
    if (typeof value === "object") {
      return value.id;
    }
    return value;
  };
  const handleClickOpen = () => {
    props.setCellData({});
    props.setOpen(true);
    props.setReadOnly(false);
  };

  const handleClose = () => {
    setDescription('');
    setShortJDError("")
    props.setOpen(false);
  };
  const _selectJobRole = (e, data) => {

    props.setCellData({ ...props.cellData, description: jobRole?.find((e)=> e.label === data.props.children)?.description })
    setDescription(jobRole?.find((e)=> e.label === data.props.children)?.description);
     !props.readOnly
    ? props.handleInput(e, data)
    : props.UpdatehandleInput(e, data);
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        <AddIcon fontSize="small" style={{ marginRight: "0.5rem" }} /> {buttonCreateJob}
      </Button>
      <Dialog open={props.open} onClose={handleClose} maxWidth>
        <DialogTitle>
          {props.readOnly ? headingEditJobOpening : headingCreateJobOpening}
        </DialogTitle>
        <CloseButton onClick={handleClose}>
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
        <DialogContent>
          <Grid>
            <Card>
              <CardContent>
                <form>
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={6} item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">
                          {labelJobRole} *
                        </InputLabel>
                        <Select
                          labelId="jobRole"
                          name="jobRole"
                          id="jobRole"
                          fullWidth
                          value={getvalue(props.cellData.jobRole)}
                          label={labelJobRole}
                          disabled={jobdisable}
                          onChange={
                            _selectJobRole
                          }
                          helperText={props.errors.jobRole}
                          error={props.errors.jobRole}
                        >
                          {jobRole.map((item) => (
                            <MenuItem value={item?.id}>{item.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        placeholder={placeholderLocation}
                        label={labelLocation}
                        variant="outlined"
                        onChange={props.handleInput}
                        helperText={props.errors.location}
                        error={props.errors.location}
                        value={props.cellData.location}
                        name="location"
                        id="location"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <TextField
                        label={labelShortJD}
                        placeholder={placeholderShortJD}
                        variant="outlined"
                        name="ShortJD"
                        multiline
                        value={props.cellData.shortJD}
                        onChange={(event) => {
                          const inputText = event.target.value;
                          const words = inputText.trim().split(/\s+/);
                          if (words.length <= 100) {
                            props.setCellData({ ...props.cellData, shortJD: inputText });
                            setShortJDError(""); 
                          } else {
                            setShortJDError("Short JD cannot exceed 100 words.");
                          }
                        }}
                        onBlur={() => {
                          if (shortJDError) {
                            props.setCellData({ ...props.cellData, shortJD: "" });
                          }
                        }}
                        error={shortJDError !== ""}
                        helperText={shortJDError}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <Label>Description *</Label>
                      <JoditEditor
                        variant="outlined"
                        value={ description.trim().length > 0?description : props.cellData.description}
                        config={config}
                        onChange={(newContent) => props.setCellData({ ...props.cellData, description: newContent })}
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <Label>Responsibilities *</Label>
                      <JoditEditor
                        variant="outlined"
                        value={props.cellData.responsibilities}
                        config={Repsconfig}
                        onChange={(newContent) => props.setCellData({ ...props.cellData, responsibilities: newContent })}
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <Label>Primary skills *</Label>
                      <JoditEditor
                        variant="outlined"
                        value={props.cellData.skillsRequired}
                        config={PrimarySkillsconfig}
                        onChange={(newContent) => props.setCellData({ ...props.cellData, skillsRequired: newContent })}
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <Label>Secondary skills *</Label>
                      <JoditEditor
                        variant="outlined"
                        value={props.cellData.secondarySkills}
                        config={SecondarySkillsconfig}
                        onChange={(newContent) => props.setCellData({ ...props.cellData, secondarySkills: newContent })}
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        placeholder={placeholderEductionalQualification}
                        label={labelEductionalQualification}
                        variant="outlined"
                        onChange={props.handleInput}
                        helperText={props.errors.qualification}
                        error={props.errors.qualification}
                        value={props.cellData.qualification}
                        name="qualification"
                        id="qualification"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        type="number"
                        placeholder={placeholderTotalOpenings}
                        label={labelTotalOpenings}
                        variant="outlined"
                        onKeyDown={blockInvalidChar}
                        onChange={props.handleInput}
                        helperText={props.errors.totalOpenings}
                        error={props.errors.totalOpenings}
                        value={props.cellData.totalOpenings}
                        name="totalOpenings"
                        id="totalOpenings"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={6} sm={3} item>
                      <TextField
                        type="number"
                        placeholder={placeholderMinExperience}
                        label={labelMinExperience}
                        variant="outlined"
                        onKeyDown={blockInvalidChar}
                        onChange={props.handleInput}
                        helperText={props.errors.minExperience}
                        error={props.errors.minExperience}
                        value={props.cellData.minExperience}
                        name="minExperience"
                        id="minExperience"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={6} sm={3} item>
                      <TextField
                        type="number"
                        placeholder={placeholderMaxExperience}
                        label={labelMaxExperience}
                        variant="outlined"
                        onChange={props.handleInput}
                        onKeyDown={blockInvalidChar}
                        helperText={props.errors.maxExperience}
                        error={props.errors.maxExperience}
                        value={props.cellData.maxExperience}
                        name="maxExperience"
                        id="maxExperience"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid xs={12} sm={6} item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">
                          {labelEmploymentType} *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={props.cellData.employmentType}
                          label={labelEmploymentType}
                          onChange={(event) => {
                            props.setCellData({
                              ...props.cellData,
                              employmentType: event.target.value,
                            });
                          }}
                        >{JobOpeningEmploymentType.map((el) => (
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
                          {labelDuration} *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={props.cellData.duration}
                          label={labelDuration}
                          onChange={(event) => {
                            props.setCellData({
                              ...props.cellData,
                              duration: event.target.value,
                            });
                          }}
                        >
                          {JobOpeningMonths.map((el) => (
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
                          {labelWorkMode} *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={props.cellData.workMode}
                          label={labelWorkMode}
                          onChange={(event) => {
                            props.setCellData({
                              ...props.cellData,
                              workMode: event.target.value,
                            });
                          }}
                        >
                          {JobOpeningWorkMode.map((el) => (
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
                          {labelStatus} *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={props.cellData.status}
                          label={labelStatus}
                          onChange={(event) => {
                            props.setCellData({
                              ...props.cellData,
                              status: event.target.value,
                            });
                          }}
                        >
                          {UserProfileStatus.map((el) => (
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
                        placeholder={placeholderDepartment}
                        label={labelDepartment}
                        onChange={props.handleInput}
                        helperText={props.errors.department}
                        error={props.errors.department}
                        value={props.cellData.department}
                        name="department"
                        id="department"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <TextField
                        placeholder={placeholderIndustryType}
                        label={labelIndustryType}
                        variant="outlined"
                        onChange={props.handleInput}
                        helperText={props.errors.industryType}
                        error={props.errors.industryType}
                        value={props.cellData.industryType}
                        name="industryType"
                        id="industryType"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        onChange={(e, data) => {
                          props.handleInput({ target: { name: "tags" } }, data);
                        }}
                        options={tags.map((option) => option.title)}
                        defaultValue={props.cellData.tags}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              label={option}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={labelTags}
                            placeholder={placeholderTags}
                            fullWidth
                            required
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      position: "relative",
                      bottom: "30rem",
                      left: "35rem",
                    }}
                  >
                    {props.loading ? <CircularProgress /> : ""}
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={props.readOnly ? props.Updatehandle : props.handleSave}
            style={{
              backgroundColor: props.readOnly ? 'rgb(255, 158, 67)' : 'rgb(9, 182, 109)',
              color: props.readOnly ? "#000000" : "#ffffff",
            }}
          >
            {props.readOnly ? buttonUpdate : buttonSave}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
