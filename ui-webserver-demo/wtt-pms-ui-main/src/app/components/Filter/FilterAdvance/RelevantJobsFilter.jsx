/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Badge, Button, Checkbox, Chip, Grid, InputLabel, Select, TextField, Tooltip, Typography } from '@mui/material';
// import ChipInput from 'material-ui-chip-input';
import { value100Per, value100PerImp } from 'app/utils/constant';
import { headingAdvanceFilter, labelCompanyName, labelCurrentLocation, labelExpectedCTC, labelExperience, labelJobRole, labelNoticePeriod, labelOperator, placeholderEductionalQualification, placeholderChooseAdvanceFilter, headingChooseEductionalQualification, placeholderNoticePeriod, placeholderCompanyName, placeholderCurrentLocation, placeholderExpectedCTC, placeholderExperience, placeholderJobRole, labelIndustryType, buttonClear, buttonApply, labelEductionalQualification, headingChooseIndustryType, headingChooseJobRole, headingChooseCompanyName, headingChooseCurrentEmploymentStatus, labelCurrentEmploymentStatus } from 'app/utils/constantForms';
import { getJobRoleDetails } from "app/redux/actions/JobRoleActions";
import { getOrganizationDetails } from "app/redux/actions/OrganizationActions";
import { chipFields } from 'app/utils/chipField';


var filterLabel = [
  { title: 'CurrentLocation', display: 'Current Location' },
  { title: 'Experience', display: 'Experience' },
  { title: 'JobRole', display: 'Job Role' },
  { title: 'Company', display: 'Company Name' },
  { title: 'Education', display: 'Educational Qualification' },
  { title: 'JobType', display: 'Current Employment Status' },
]
var eductionList = [
  { title: 'M.Tech' },
  { title: 'MCA' },
  { title: 'B.Tech' },
  { title: 'BCA' },
  { title: 'BSc' },
]

var jobTypeList = [
  { title: 'Work from office' },
  { title: 'Work from home' }
]

// eslint-disable-next-line no-unused-vars
const preferredList = [
  { title: 'Hyderabad' },
  { title: 'Bangalore' },
  { title: 'Delhi' },
  { title: 'Chennai' },
  { title: 'Mumbai' },
]
const drawerWidth = window.innerWidth > 767 ? '325px' : value100Per;
const formControlWidth = window.innerWidth > 767 ? '9vw' : '35vw';

const FilterButton = styled(IconButton)(() => ({
  margin: '0em 0.3em',
  cursor: 'pointer',
  height: 'fit-content',
  padding: '1rem 0rem',
  position: 'absolute',
  right: '8px',
  '&:hover': {
    backgroundColor: 'none!important'
  }
}));
const PaTypro = styled(Typography)(() => ({
  color: '#1976d2',
  fontSize: '15px',
  fontWeight: '500',
  padding: '12px 8px',
  background: 'rgba(0, 0, 0, 0.02)',
  marginBottom: '10px'
}))
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  position: 'fixed',
  width: value100Per,
  zIndex: '2',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
  // eslint-disable-next-line no-dupe-keys
  padding: '0px',
  marginBottom: '10px',
  height: '64px',
  boxShadow: 'rgb(0 0 0 / 6%) 0px 3px 5px -1px, rgb(0 0 0 / 4%) 0px 6px 10px 0px, rgb(0 0 0 / 4%) 0px 1px 18px 0px',
}));
const StyleGrid = styled(Grid)(() => ({
  borderRadius: '8px',
  marginLeft: '10px',
  marginBottom: '12px',
  marginTop: '12px',
  boxShadow: 'rgb(0 0 0 / 6%) 0px 3px 3px -2px, rgb(0 0 0 / 4%) 0px 3px 4px 0px, rgb(0 0 0 / 4%) 0px 1px 8px 0px !important',
  padding: '0px!important',
  width: '94%'
}))
const StyleInputLabel = styled(InputLabel)(() => ({
  top: 'auto',
  padding: '0px'
}))
const SubGrid = styled(Grid)(() => ({
  display: 'flex',
  margin: '7px'
}))
const StyleDrawer = styled(Drawer)(() => ({
  scrollbarColor: '#6b6b6b #2b2b2b',
  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
    backgroundColor: '#fff',
    maxWidth: '0.5rem',
    maxHeight: '0.5rem'
  },
  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
    borderRadius: '8px',
    backgroundColor: 'rgba(43, 50, 76, 0.8)',
    minHeight: '24px',
    border: 'none'
  },
  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
    backgroundColor: '#2b324c'
  },
  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active ': {
    backgroundColor: '#2b324c'
  },
  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#2b324c'
  },
  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
    backgroundColor: '#2b2b2b'
  }
}))
const StyleButton = styled('div')(() => ({
  display: 'inline-flex',
  justifyContent: 'space-evenly',
  padding: 'inherit',
  width: '-webkit-fill-available',
  position: 'fixed',
  boxShadow: 'rgb(0 0 0 / 6%) 0px -4px 4px -2px, rgb(0 0 0 / 4%) 0px 3px 4px 0px, rgb(0 0 0 / 4%) 0px 1px 8px 0px !important',
  bottom: '0px',
  backgroundColor: '#fff',
  zIndex: '1',
  // eslint-disable-next-line no-dupe-keys
  padding: '10px'
}))

const FilterBottomButton = styled(Button)(() => ({
  width: value100PerImp,
  color: '#fff!important',
  padding: '6px 16px!important',
  borderRadius: '4px!important'
}))
const FilterIcon = styled(FilterListIcon)(() => ({
  margin: '0em 0.3em',
  cursor: 'pointer',
  color: '#1A2038',
  width: '20px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: '50%'
  }
}));

export default function RelevantJobsFilter(props) {
  const [jobRole, setJobRole] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]);

  const getJobRoleData = async () => {
    const getJobRoleApi = await getJobRoleDetails();
    var JobRoleArray = [];
    for (var property of getJobRoleApi.payload.results) {
      const jobRoleDropdown = {
        ...property,
        title: property.name,
      };
      JobRoleArray.push(jobRoleDropdown);
    }
    setJobRole(JobRoleArray);
  };

  const getOrganizationData = async () => {
    const getOrganizationApi = await getOrganizationDetails();
    var OrganizationArray = [];
    for (var property of getOrganizationApi.payload.results) {
      const OrganizationDropdown = {
        ...property,
        title: property.name,
      };
      OrganizationArray.push(OrganizationDropdown);
    }
    setOrganizationOptions(OrganizationArray);
  };



  useEffect(() => {
    getJobRoleData();
    getOrganizationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    chipFields();
  })

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const theme = useTheme();



  const clearFilter = () => {
    props?.setFilterObj({});
    props?.setSendFilter({});
    props?.setClientFilter({});
    props?.GetProfileData();
    props?.setFilterBadge(0);
    document?.querySelector('.MuiAutocomplete-clearIndicator')?.click();
  }

  return (
    <Box sx={{ display: 'flex', marginTop: '-0.5rem' }} id="relevantFilter">
      <CssBaseline />
      <FilterButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={props.handleDrawerOpen}
        sx={{ ...(props.drawerOpen) }}
      >
        <Tooltip title={headingAdvanceFilter}>
          <Badge badgeContent={props.filterBadge} color="primary">
            <FilterIcon />
          </Badge>
        </Tooltip>
      </FilterButton>

      <Main open={props.drawerOpen} style={{ padding: '0px' }}> </Main>
      <StyleDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
          // eslint-disable-next-line no-dupe-keys
          width: 'fit-content'
        }}
        variant="persistent"
        anchor="right"
        open={props.drawerOpen}
      >
        <DrawerHeader>
          <IconButton onClick={props.handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography variant="h6">{headingAdvanceFilter}</Typography>


        </DrawerHeader>

        {/* Form   ------------------------------------------------------------ */}
        <Grid container spacing={2} style={{ width: value100Per, margin: '0px', padding: '70px 0px' }}>
          <Grid item xs={12} style={{ padding: '0px', margin: '10px' }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={filterLabel}
              defaultValue={Object.keys(props.filterObj).map((data) => { return { title: data } })}
              disableCloseOnSelect
              onChange={props.drop}
              getOptionLabel={
                (option) => option.display
              }
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
                return <TextField {...params} label={placeholderChooseAdvanceFilter} />
              }}
            />
          </Grid>
          {props.filterObj.CurrentLocation ? <StyleGrid item >
            <PaTypro paragraph>
              {placeholderCurrentLocation}
            </PaTypro>
            <Autocomplete
              multiple
              options={[]}
              id="tags-filled"
              defaultValue={props.sendFilter.location}
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
          </StyleGrid> : ''}

          {props.filterObj.Experience ? <StyleGrid >
            <PaTypro paragraph>
              {placeholderExperience}
            </PaTypro>
            {props.filterObj.Experience ? <Grid item>
              <TextField autoComplete='off' fullWidth type='number' placeholder={placeholderExperience} value={props.sendObjFilter?.experience?.number} helperText={props.errors.experience} error={props.errors.experience} inputProps={{ min: 0, max: 100 }} label={labelExperience} onChange={props.handleFilterobj} variant="outlined" name="experience" />
            </Grid> : ''}
          </StyleGrid> : ''}

          {props.filterObj.JobRole ? <StyleGrid item >
            <PaTypro paragraph>
              {headingChooseJobRole}
            </PaTypro>

            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={jobRole}
              disableCloseOnSelect
              onChange={(event, e) => {
                props.chipClientFilter({ target: { value: e.map((el) => el.title), name: 'jobRole' } });
              }}
              getOptionLabel={
                (option) => option.title
              }
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
                return <TextField {...params} label={labelJobRole} />
              }}
            />
          </StyleGrid> : ''}

          {props.filterObj.Company ? <StyleGrid item >
            <PaTypro paragraph>
              {headingChooseCompanyName}
            </PaTypro>

            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={organizationOptions}
              disableCloseOnSelect
              onChange={(event, e) => {
                props.chipClientFilter({ target: { value: e.map((el) => el.title), name: 'organization' } });
              }}
              getOptionLabel={
                (option) => option.title
              }
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
                return <TextField {...params} label={labelCompanyName} />
              }}
            />
          </StyleGrid> : ''}
          {props.filterObj.JobType ? <StyleGrid item>
            <PaTypro paragraph>
              {headingChooseCurrentEmploymentStatus}
            </PaTypro>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              defaultValue={props.sendFilter.jobType?.map((data) => { return { title: data } })}
              options={jobTypeList}
              disableCloseOnSelect
              onChange={(event, e) => {
                props.autochipHandel({ target: { value: e.map((el) => el.title), name: 'jobType' } });
              }}
              getOptionLabel={
                (option) => option.title
              }
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
                return <TextField {...params} label={labelCurrentEmploymentStatus} />
              }}
            />
          </StyleGrid> : ''}

          {props.filterObj.Education ? <StyleGrid item >
            <PaTypro paragraph>
              {placeholderEductionalQualification}
            </PaTypro>
            <Autocomplete
              multiple
              options={[]}
              id="tags-filled"
              defaultValue={props.sendFilter.education}
              freeSolo
              onChange={(e, value) => {
                props.setSendFilter({
                  ...props.sendFilter, education: value,
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
                  label={labelEductionalQualification}
                  placeholder={placeholderEductionalQualification}
                  fullWidth
                />
              )}
            />
          </StyleGrid> : ''}

          <StyleButton>
            <Grid xs={4} sm={4} item>
              <FilterBottomButton type='sumbit' variant="contained" onClick={clearFilter} style={{ backgroundColor: 'rgb(255, 158, 67)' }}>{buttonClear}</FilterBottomButton>
            </Grid>
            <Grid xs={4} sm={4} item>
              <FilterBottomButton variant="contained" onClick={props.filterApply} style={{ backgroundColor: 'rgb(9, 182, 109)' }}>{buttonApply}</FilterBottomButton>
            </Grid>
          </StyleButton>
        </Grid>
      </StyleDrawer>
    </Box>
  );
}
