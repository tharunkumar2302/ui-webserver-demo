import { Button, Dialog, styled } from '@mui/material';
import LoadingBar from './LoadingBar/LoadingBar';

const DialogBox = styled('div')(() => ({
  minWidth: 280,
  maxWidth: 360,
  padding: '32px',
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const Title = styled('h4')(() => ({
  margin: 0,
  marginBottom: '8px',
  textTransform: 'capitalize',
}));

const Controller = styled('div')(() => ({
  margin: '8px',
  paddingTop: '8px',
  display: 'flex',
  justifyContent: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: '8px',
  paddingLeft: '24px',
  paddingRight: '24px',
  overflow: 'hidden',
  borderRadius: '300px',
  transition: 'all 250ms',
  '&.yesBtn': {
    '&:hover': {
      color: '#ffffff',
      background: `${theme.palette.primary.main} !important`,
      backgroundColor: `${theme.palette.primary.main} !important`,
      fallbacks: [{ color: 'white !important' }],
    },
  },
  '&.noBtn': {
    '&:hover': {
      color: '#ffffff',
      background: `${theme.palette.secondary.main} !important`,
      backgroundColor: `${theme.palette.secondary.main} !important`,
      fallbacks: [{ color: 'white !important' }],
    },
  },
}));

const ConfirmationDialog = ({
  open,
  onConfirmDialogClose,
  text,
  loading,
  title = 'confirm',
  onYesClick,
}) => {
  return (
    <Dialog open={open} onClose={onConfirmDialogClose}>
      <DialogBox>
        <Title>{title}</Title>
        <p>{text}</p>
        <Controller>
          <StyledButton className="yesBtn" variant="outlined" color="primary" onClick={onYesClick}>
            Yes
          </StyledButton>
          <StyledButton
            className="noBtn"
            variant="outlined"
            color="secondary"
            onClick={onConfirmDialogClose}
          >
            No
          </StyledButton>
        </Controller>
        <LoadingBar loading={loading} />
      </DialogBox>
    </Dialog>
  );
};

export default ConfirmationDialog;
