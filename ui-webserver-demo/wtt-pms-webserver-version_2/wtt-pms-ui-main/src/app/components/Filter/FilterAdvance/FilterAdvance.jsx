/* eslint-disable no-unused-vars */
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Button,
  Checkbox,
  Chip,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { blockInvalidChar, value100Per, value100PerImp } from "app/utils/constant";
import { isMobile } from "app/utils/utils";
import { headingAdvanceFilter, labelCurrentEmploymentStatus, labelCurrentLocation, labelExpectedCTC, labelExperience, labelNoticePeriod, labelOperator, labelPreferredLocation, labelPrimarySkills, placeholderChooseAdvanceFilter, headingChooseCurrentEmploymentStatus, headingChooseEductionalQualification, placeholderNoticePeriod, headingChoosePreferredLocation, placeholderCurrentLocation, placeholderExpectedCTC, placeholderExperience, placeholderPrimarySkills, tooltipAdvanceFilter, buttonClear, buttonApply, labelEductionalQualification } from "app/utils/constantForms";
import { filterOpraterValue } from "app/utils/constantDropDown";
import { chipFields } from "app/utils/chipField";

var filterLabel = [
  { title: "CurrentLocation", display: 'Current Location' },
  { title: "Experience", display: 'Experience' },
  { title: "Education", display: 'Educational Qualification' },
  { title: "PrimarySkills", display: 'Primary Skills' },
  { title: "ExpectedCTC", display: 'Expected CTC' },
  { title: "CurrentEmploymentStatus", display: 'Current Employment Status' },
  { title: "NoticePeriod", display: 'Notice Period' },
  { title: "PreferredLocation", display: 'Preferred Location' },
];
var eductionList = [
  { title: "M.Tech" },
  { title: "MCA" },
  { title: "B.Tech" },
  { title: "BCA" },
  { title: "BSc" },
];
const employmentStatusList = [{ title: "Working" }, { title: "Not Working" }];
const preferredList = [
  { title: "Hyderabad" },
  { title: "Bangalore" },
  { title: "Delhi" },
  { title: "Chennai" },
  { title: "Mumbai" },
];
const drawerWidth = !isMobile() ? "400px" : value100Per;
const formControlWidth = !isMobile() ? "8vw" : "35vw";
const textFieldWidth = !isMobile() ? "13.3vw" : "52.7vw";
const ExptextFieldWidth = !isMobile() ? "12vw" : "52.7vw";


const FilterButton = styled(IconButton)(() => ({
  margin: "0em 0.3em",
  cursor: "pointer",
  padding: "0rem",
  "&:hover": {
    backgroundColor: "none!important",
  },
}));
const PaTypro = styled(Typography)(() => ({
  color: "#1976d2",
  fontSize: "13px",
  fontWeight: "500",
  padding: "8px 8px",
  background: "rgba(0, 0, 0, 0.02)",
  marginBottom: "0px",
}));
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  position: "fixed",
  width: value100Per,
  zIndex: "2",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
  padding: "0px",
  marginBottom: "10px",
  height: "64px",
  boxShadow:
    "rgb(0 0 0 / 6%) 0px 3px 5px -1px, rgb(0 0 0 / 4%) 0px 6px 10px 0px, rgb(0 0 0 / 4%) 0px 1px 18px 0px",
}));
const StyleGrid = styled(Grid)(() => ({
  borderRadius: "8px",
  marginLeft: "10px",
  marginTop: "12px",
  boxShadow:
    "rgb(0 0 0 / 6%) 0px 3px 3px -2px, rgb(0 0 0 / 4%) 0px 3px 4px 0px, rgb(0 0 0 / 4%) 0px 1px 8px 0px !important",
  padding: "0px!important",
  width: "94%",
}));
const StyleInputLabel = styled(InputLabel)(() => ({
  top: "auto",
  padding: "0px",
}));
const SubGrid = styled(Grid)(() => ({
  display: "flex",
  margin: "7px",
}));
const StyleDrawer = styled(Drawer)(() => ({
  scrollbarColor: "#6b6b6b #2b2b2b",
  "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
    backgroundColor: "#fff",
    maxWidth: "0.5rem",
    maxHeight: "0.5rem",
  },
  "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
    borderRadius: "8px",
    backgroundColor: "rgba(43, 50, 76, 0.8)",
    minHeight: "24px",
    border: "none",
  },
  "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
    backgroundColor: "#2b324c",
  },
  "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active ": {
    backgroundColor: "#2b324c",
  },
  "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#2b324c",
  },
  "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
    backgroundColor: "#2b2b2b",
  },
}));
const StyleButton = styled("div")(() => ({
  display: "inline-flex",
  justifyContent: "space-evenly",
  width: "-webkit-fill-available",
  position: "fixed",
  boxShadow:
    "rgb(0 0 0 / 6%) 0px -4px 4px -2px, rgb(0 0 0 / 4%) 0px 3px 4px 0px, rgb(0 0 0 / 4%) 0px 1px 8px 0px !important",
  bottom: "0px",
  backgroundColor: "#fff",
  zIndex: "1",
  padding: "10px",
}));
const FilterBottomButton = styled(Button)(() => ({
  width: value100PerImp,
  color: "#fff!important",
  padding: "6px 16px!important",
  borderRadius: "4px!important",
}));
const FilterIcon = styled(FilterListIcon)(() => ({
  margin: "0em 0.3em !important",
  cursor: "pointer !important",
  color: "#1A2038 !important",
  width: "20px !important",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04) !important",
    borderRadius: "50% !important",
  },
}));

export default function FilterAdvance(props) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const theme = useTheme();

  React.useEffect(() => {
    chipFields();
  })

  const clearFilter = () => {
    props?.setFilterObj({});
    props?.setSendObjFilter({});
    props?.setSendFilter({});
    props?.GetProfileData();
    document?.querySelector(".MuiAutocomplete-clearIndicator")?.click();
  };

  return (
    <Box sx={{ display: "flex", marginTop: "-0.5rem" }} id="advanceFilter">
      <CssBaseline />
      <FilterButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={props.handleDrawerOpen}
        sx={{ ...props.drawerOpen }}
        style={{
          height: "fit-content",
          padding: "1rem 0rem",
          position: "absolute",
          left: "3.7rem",
          margin: "0px",
        }}
      >
        <Tooltip title={tooltipAdvanceFilter}>
          <FilterIcon />
        </Tooltip>
      </FilterButton>

      <Main open={props.drawerOpen} style={{ padding: "0px" }}>

      </Main>
      <StyleDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
          // eslint-disable-next-line no-dupe-keys
          width: "fit-content",
        }}
        variant="persistent"
        anchor="right"
        open={props.drawerOpen}
      >
        <DrawerHeader>
          <IconButton onClick={props.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Typography variant="h6">{headingAdvanceFilter}</Typography>
        </DrawerHeader>

        {/* Form   ------------------------------------------------------------ */}
        <Grid
          container
          spacing={2}
          style={{ width: value100Per, margin: "0px", padding: "66px 0px 0px 0px" }}
        >
          <Grid item xs={12} style={{ padding: "0px", margin: "10px" }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={filterLabel}
              disableCloseOnSelect
              onChange={props.drop}
              getOptionLabel={(option) => option.display}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.display}
                </li>
              )}
              renderInput={(params) => {
                return <TextField {...params} label={placeholderChooseAdvanceFilter} />;
              }}
            />
          </Grid>
          {props.filterObj.CurrentLocation ? (
            <StyleGrid item>
              <PaTypro paragraph>{placeholderCurrentLocation}</PaTypro>
              <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                freeSolo
                onChange={(e, value) => {
                  props.setSendFilter({
                    ...props.sendFilter, location: value,
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
                    label={labelCurrentLocation}
                    placeholder={placeholderCurrentLocation}
                    fullWidth
                  />
                )}
              />
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.Experience ? (
            <StyleGrid>
              <PaTypro paragraph>{placeholderExperience}</PaTypro>
              <SubGrid>
                {props.filterObj.Experience ? (
                  <Grid xs={5} sm={5} item>
                    <FormControl style={{ width: formControlWidth }}>
                      <StyleInputLabel id="demo-simple-select-helper-label">
                        {labelOperator}
                      </StyleInputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        name="experience"
                        label={labelOperator}
                        onChange={(event) => {
                          props.handleFilterobj(
                            {
                              target: {
                                value: event.target.value,
                                name: "experience",
                              },
                            },
                            "op"
                          );
                        }}
                      >
                        {filterOpraterValue.map((el) => (
                          <MenuItem value={el.title}>
                            {el.display}
                          </MenuItem>
                        ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  ""
                )}
                {props.filterObj.Experience ? (
                  <Grid xs={7} sm={7} item>
                    <TextField
                      autoComplete="off"
                      type="number"
                      placeholder={placeholderExperience}
                      value={props.sendObjFilter?.experience?.number}
                      helperText={props.errors.experience}
                      error={props.errors.experience}
                      onKeyDown={blockInvalidChar}
                      inputProps={{ min: 0, max: 100 }}
                      label={labelExperience}
                      onChange={props.handleFilterobj}
                      variant="outlined"
                      name="experience"
                      style={{ width: ExptextFieldWidth }}
                    />
                  </Grid>
                ) : (
                  ""
                )}
              </SubGrid>
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.Education ? (
            <StyleGrid item>
              <PaTypro paragraph>{headingChooseEductionalQualification}</PaTypro>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={eductionList}
                disableCloseOnSelect
                onChange={(event, e) => {
                  props.autochipHandel({
                    target: {
                      value: e.map((el) => el.title),
                      name: "education",
                    },
                  });
                }}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                renderInput={(params) => {
                  return <TextField {...params} label={labelEductionalQualification} />;
                }}
              />
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.PrimarySkills ? (
            <StyleGrid item>
              <PaTypro paragraph>{placeholderPrimarySkills}</PaTypro>
              <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                freeSolo
                onChange={(e, value) => {
                  props.setSendFilter({
                    ...props.sendFilter, skills: value,
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
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.ExpectedCTC ? (
            <StyleGrid>
              <PaTypro paragraph>{placeholderExpectedCTC}</PaTypro>
              <SubGrid>
                {props.filterObj.ExpectedCTC ? (
                  <Grid xs={5} sm={5} item>
                    <FormControl style={{ width: formControlWidth }}>
                      <StyleInputLabel id="demo-simple-select-helper-label">
                        {labelOperator}
                      </StyleInputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        name="ctc"
                        label={labelOperator}
                        onChange={(event) => {
                          props.handleFilterobj(
                            {
                              target: {
                                value: event.target.value,
                                name: "ctc",
                              },
                            },
                            "op"
                          );
                        }}
                      >{filterOpraterValue.map((el) => (
                        <MenuItem value={el.title}>
                          {el.display}
                        </MenuItem>
                      ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  ""
                )}
                {props.filterObj.ExpectedCTC ? (
                  <Grid xs={7} sm={7} item>
                    <TextField
                      autoComplete="off"
                      type="number"
                      placeholder={placeholderExpectedCTC}
                      value={props.sendObjFilter?.ctc?.number}
                      inputProps={{ min: 0, max: 100 }}
                      label={labelExpectedCTC}
                      variant="outlined"
                      onKeyDown={blockInvalidChar}
                      onChange={props.handleFilterobj}
                      name="ctc"
                      style={{ width: ExptextFieldWidth }}
                    />
                  </Grid>
                ) : (
                  ""
                )}
              </SubGrid>
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.CurrentEmploymentStatus ? (
            <StyleGrid item>
              <PaTypro paragraph>{headingChooseCurrentEmploymentStatus}</PaTypro>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={employmentStatusList}
                disableCloseOnSelect
                onChange={(event, e) => {
                  props.autochipHandel({
                    target: {
                      value: e.map((el) => el.title),
                      name: "employmentStatus",
                    },
                  });
                }}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                renderInput={(params) => {
                  return (
                    <TextField {...params} label={labelCurrentEmploymentStatus} />
                  );
                }}
              />
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.NoticePeriod ? (
            <StyleGrid>
              <PaTypro paragraph>{placeholderNoticePeriod}</PaTypro>
              <SubGrid>
                {props.filterObj.NoticePeriod ? (
                  <Grid xs={5} sm={5} item>
                    <FormControl style={{ width: formControlWidth }}>
                      <StyleInputLabel id="demo-simple-select-helper-label">
                        {labelOperator}
                      </StyleInputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        name="noticePeriod"
                        label={labelOperator}
                        onChange={(event) => {
                          props.handleFilterobj(
                            {
                              target: {
                                value: event.target.value,
                                name: "noticePeriod",
                              },
                            },
                            "op"
                          );
                        }}
                      >{filterOpraterValue.map((el) => (
                        <MenuItem value={el.title}>
                          {el.display}
                        </MenuItem>
                      ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  ""
                )}
                {props.filterObj.NoticePeriod ? (
                  <Grid xs={7} sm={7} item>
                    <TextField
                      autoComplete="off"
                      type="number"
                      placeholder={placeholderNoticePeriod}
                      value={props.sendObjFilter?.noticePeriod?.number}
                      inputProps={{ min: 0, max: 100 }}
                      label={labelNoticePeriod}
                      onChange={props.handleFilterobj}
                      variant="outlined"
                      onKeyDown={blockInvalidChar}
                      name="noticePeriod"
                      style={{ width: textFieldWidth }}
                    />
                  </Grid>
                ) : (
                  ""
                )}
              </SubGrid>
            </StyleGrid>
          ) : (
            ""
          )}

          {props.filterObj.PreferredLocation ? (
            <StyleGrid item>
              <PaTypro paragraph>{headingChoosePreferredLocation}</PaTypro>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={preferredList}
                disableCloseOnSelect
                onChange={(event, e) => {
                  props.autochipHandel({
                    target: {
                      value: e.map((el) => el.title),
                      name: "prefferedLocation",
                    },
                  });
                }}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                renderInput={(params) => {
                  return <TextField {...params} label={labelPreferredLocation} />;
                }}
              />
            </StyleGrid>
          ) : (
            ""
          )}

          <StyleButton>
            <Grid xs={4} sm={4} item>
              <FilterBottomButton
                type="sumbit"
                variant="contained"
                onClick={clearFilter}
                style={{ backgroundColor: "rgb(255, 158, 67)" }}
              >
                {buttonClear}
              </FilterBottomButton>
            </Grid>
            <Grid xs={4} sm={4} item>
              <FilterBottomButton
                variant="contained"
                onClick={props.filterApply}
                style={{ backgroundColor: "rgb(9, 182, 109)" }}
              >
                {buttonApply}
              </FilterBottomButton>
            </Grid>
          </StyleButton>
        </Grid>
      </StyleDrawer>
    </Box>
  );
}
