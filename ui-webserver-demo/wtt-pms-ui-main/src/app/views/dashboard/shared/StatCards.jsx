/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { Box, Card, Grid, Icon, styled, Modal } from '@mui/material';
import ProfileUpload from 'app/components/ProfileUpload/ProfileUpload';
import { Small, Paragraph } from 'app/components/Typography';
import { localStorageCandidate } from 'app/utils/constant';
import { uploaded } from 'app/utils/constantForms';
import { isMobile } from 'app/utils/utils';
import { useState } from 'react';

const StyledIcon = styled(Icon)(() => ({
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.9!important'
  }
}))

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const SmallHeading = styled(Small)(() => ({
  fontSize: '9px',
}));
const SubHeading = styled(Paragraph)(() => ({
  fontSize:"11px",
      fontWeight:"500",
      lineHeight:"2.0",
      color:"#34314c8a"
}));

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: '67px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

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

const StatCards = ({ totalResumes, updatedResumes, notUpdatedResumesMoreThan30daysTo1Year, notUpdatedResumesMoreThan1Year, resumeUploaded, cvUploadedDate, headingColor,emailActual,emailRemaining,emailValue,profileActual,profileValue,profileRemaining,recruiterValue ,recruiterRemaining,recruiterActual,DownloadProfile}) => {
  const [open1, setOpen1] = useState(false);

  const cardList = [
    { name: 'Total Profiles', subName: '', amount: totalResumes, icon: 'group' },
    { name: 'Updated Profiles', subName: ' in Last 30 days', amount: updatedResumes, icon: 'done_all' },
    { name: 'Recently Updated Profiles', subName: 'More than 30 days to 1 year', amount: notUpdatedResumesMoreThan30daysTo1Year, icon: 'edit' },
    { name: 'Old Profiles', subName: 'More than 1 year', amount: notUpdatedResumesMoreThan1Year, icon: 'edit' },
  ];

  const cardListCandidate = [
    { name: 'CV Upload', subName: `(Last updated: ${cvUploadedDate?.split("T")[0]})`, amount: resumeUploaded, icon: 'cloud_upload' },
    { name: 'Download Profile', icon: 'cloud_download' }
  ];

  const updatedCardList = localStorageCandidate()?.role?.name === 'candidate' ? cardListCandidate : cardList

  const handleModal1Open = () => setOpen1(true);
  const handleModal1Close = () => setOpen1(false);

  return (
    <>
      <Grid container spacing={3} sx={{ mb: '24px' }}>
        {updatedCardList.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <StyledCard className='dashboard_cards' elevation={6}>
              <ContentBox>
                {localStorageCandidate()?.role?.name === 'candidate' && item.icon !=="cloud_download" && <StyledIcon className="icon" onClick={handleModal1Open} style={{ 'cursor': 'pointer' }}>{item.icon}</StyledIcon>}
                {localStorageCandidate()?.role?.name === 'candidate' && item.icon !=="cloud_upload" && <StyledIcon className="icon" onClick={DownloadProfile} style={{ 'cursor': 'pointer' }}>{item.icon}</StyledIcon>}
                {localStorageCandidate()?.role?.name !== 'candidate' && <Icon className="icon">{item.icon}</Icon>}
                <Box ml="12px">
                  <Small>{item.name}</Small>
                  <Heading style={{ 'color': headingColor }}>{item.amount}</Heading>
                  {localStorageCandidate()?.role?.name !== 'candidate' && <SmallHeading>{item.subName}</SmallHeading>}
                  {localStorageCandidate()?.role?.name !== 'candidate' && <SubHeading>{item.Heading}</SubHeading>}
                  {(localStorageCandidate()?.role?.name === 'candidate' && resumeUploaded === uploaded) && <SmallHeading>{item.subName}</SmallHeading>}
                </Box>
              </ContentBox>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Box>
        <Modal
          open={open1}
          onClose={handleModal1Close}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DragDropBox>
            <ProfileUpload setOpen1={setOpen1} />
          </DragDropBox>
        </Modal>
      </Box>
    </>
  );
};

export default StatCards;
