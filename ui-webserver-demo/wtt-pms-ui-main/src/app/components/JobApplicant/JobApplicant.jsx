import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Dialog, DialogContent, DialogTitle, Drawer, Icon, Typography } from '@mui/material';
import ReusableGrid from 'app/components/ReusableGrid/ReusableGrid';
import { styled, useTheme } from '@mui/material/styles';
import { jobApplicantColumns } from 'app/components/TableColumns/jobApplicantColumns';
import { isMobile } from 'app/utils/utils';
import { headingShowApplicants, modalClose, headingApplicantDetails } from 'app/utils/constantForms';
import { CandidateJobApplicantStatus, value100Per } from 'app/utils/constant';
import LoadingBar from '../LoadingBar/LoadingBar';
import UserProfile from '../UserProfile/UserProfile';
import { patchJobApplicantDetails, postJobApplicantDetails } from 'app/redux/actions/JobOpeningActions';

const drawerWidth = isMobile() ? value100Per : '600px';
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
  padding: '0px',
  marginBottom: '10px',
  height: '64px',
  boxShadow: 'rgb(0 0 0 / 6%) 0px 3px 5px -1px, rgb(0 0 0 / 4%) 0px 6px 10px 0px, rgb(0 0 0 / 4%) 0px 1px 18px 0px',
}));
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
export default function JobApplicant(props) {

  console.log(props.jobApplicantData);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedResume, setselectedResume] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  const showProfile = (e) => {
    setselectedResume(e.cell.user.resume)
    setOpen(true);
  }
  // CandidateJobApplicantStatus
  const showStatus = async (e) => {
    const data = CandidateJobApplicantStatus;
    const index = data.indexOf(e.cell.status?.toLowerCase()) + 1; 
    if(index <  data.length)
    await patchJobApplicantDetails(e.cell.id,data[index],data[index]+" for the angular developer");
    props.GetJobAppliedData(props.jobCellId)
  }
  const rejectedStatus = async (e) => {   
    await patchJobApplicantDetails(e.cell.id,"rejected","developer");
    props.GetJobAppliedData(props.jobCellId)
  }

  const CloseButton = styled(IconButton)(() => ({
    position: "absolute",
    right: "2%",
    top: "1%",
  }));

  return (
    <>
      <CssBaseline />
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
          <Typography variant="h6">{headingShowApplicants}</Typography>
        </DrawerHeader>

        <div style={{ marginTop: "4.5rem" }}>
          <ReusableGrid
          endpoint={props.endpoint}
          params = {props.params}
            divId='jobApplicant'
            tableHeight='87vh'
            tableData={props.jobApplicantData}
            columns={jobApplicantColumns}
            showProfile={showProfile}
            showStatus={showStatus}
            rejectedStatus={rejectedStatus}
          />
          <LoadingBar loading={props.loading} />
        </div>

      </StyleDrawer>
      <Dialog open={open} maxWidth onClose={handleClose}>
        <DialogTitle>
          {headingApplicantDetails}
        </DialogTitle>
        <CloseButton
          onClick={handleClose}
          style={{ position: "absolute", padding: "8px" }}
        >
          <Icon className="icon">{modalClose}</Icon>
        </CloseButton>
        <DialogContent>
          <UserProfile
            display={true}
            selectedResume={selectedResume}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
