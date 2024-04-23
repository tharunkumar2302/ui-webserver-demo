import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { localStorageAccessToken } from "app/utils/constant";
import { tooltipEmailSender,CVDownload,selectCheckboxMessage } from "app/utils/constantForms";
import { isMobile } from "app/utils/utils";
import React, { useState, useEffect } from "react";
import { getProfileCV } from "app/redux/actions/ProfileActions";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody,Box } from "@mui/material";
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from "@mui/icons-material/Email";
import Modal from "@mui/material/Modal";
import NotificationsEmail from "app/components/NotificationsEmail/NotificationsEmail";

const ShortlistedPopup = (props) => {
  const [data, setData] = useState([]);
  const [table, setTable] = useState(true);
  const { palette } = useTheme();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [open3, setOpen3] = React.useState(false);
  const textColor = palette.text.primary;
  
  const EmailsendIcon = styled(EmailIcon)(() => ({
    margin: "0em  1em !important",
    cursor: "pointer !important",
    color: "#1A2038 !important",
    width: "20px !important",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04) !important",
      borderRadius: "50% !important",
    },
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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://18.219.239.115:5000/fetch_result?query=${props.cellData.shortJD}&org_id=${id()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageAccessToken()}`,
            },
          }
        );

        setData(response.data.response.results[0].matches);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (props.open) {
      fetchData();
    }
  }, [props.open]);
  
  useEffect(() => {
    if (!props.open) {
      setSelectedItems([]);
      setData([]);
      setSelectAll(false);
      props.onClose();
    }
  }, [props.open]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const id =()=>{
    const organizationId = JSON.parse(localStorage.getItem('userDetails')?? '{}')?.organization?.id;
  return organizationId;
  }

  const DownloadProfile = async (item) => {
    try {
      const resumeId = item?.metadata?.resume_id;
      // Check if resumeId is defined before making the API call
      if (!resumeId) {
        setAlertMsg("Resume ID is not available.");
        setSeverity("error");
        handleClick();
        return;
      }
      const FirstName = item?.metadata?.firstName;
      const lastName = item.metadata?.lastName;
      const filePath = item?.metadata?.file_path;
      const date = Date.now();
      // setLoading(true);
      const getProfileCVAPI = await getProfileCV(resumeId);
      const testing = getProfileCVAPI.payload;
      const url = window.URL.createObjectURL(new Blob([testing]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${FirstName + lastName}-${date}.${filePath.split('.').splice(-1)[0]}`
      );
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      // setLoading(false);
      setAlertMsg(CVDownload);
      setSeverity("success");
      handleClick();
    } catch (e) {
      // setLoading(false);
      setAlertMsg(e.message ?? 'ERROR');
      setSeverity("error");
      handleClick();
    }
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleClick = () => {
    setAlertOpen(true);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };


  const handleEmailOpen = () => {
    if (selectedItems?.length > 0) {
      setSelectedItemsData(data.filter((e)=> selectedItems.includes(e.id)).map((e)=> {
        return {...e, ...e.metadata};
      }));
      setOpen3(true);
    } else {
      setAlertMsg(selectCheckboxMessage);
      setSeverity("error");
      handleClick();
    }
  };

  const handleEmailClose = () => setOpen3(false);

  return (
    <>
      <Box>
      <Modal
        open={open3}
        onClose={handleEmailClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DragDropBox>
          <NotificationsEmail
           selectedItems = {selectedItemsData}
           jobopeiningData={props.cellData}
           setOpen3={setOpen3}
          />
        </DragDropBox>
       </Modal>
       </Box>
       <Dialog maxWidth="md" open={props.open} onClose={props.close} >
       <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={props.onClose}
              style={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        <Tooltip title={tooltipEmailSender}>
          <EmailsendIcon onClick={handleEmailOpen} />
        </Tooltip>
       <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell width="6%">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                    <TableCell width="6%">CV</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>Primary Skills</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Current Company</TableCell>
                    <TableCell>Phone Number</TableCell>
                  </TableRow>
                </TableHead>
               {table ? ( <TableBody>
                  {data.map((item ,index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                  </TableCell>
                      <TableCell><i className={`fa-sharp fa-solid fa-download `}  
                      style={{
                        color: item?.metadata?.cv_url ? "rgb(9, 182, 109)" : "",
                        cursor: item?.metadata?.cv_url ? 'pointer' : 'none',
                        opacity: item?.metadata?.cv_url ? 1 : 0.5,
                        pointerEvents: item?.metadata?.cv_url ? 'auto' : 'none'
                      }}onClick={DownloadProfile.bind(this,item)}></i></TableCell>
                      <TableCell>{truncateText(item.metadata.firstName, 10)}</TableCell>
                      <TableCell>{truncateText(item.metadata.lastName, 10)}</TableCell>
                      <TableCell>{truncateText(item.metadata.primary_skill, 10)}</TableCell>
                      <TableCell>{truncateText(item.metadata.location, 10)}</TableCell>
                      <TableCell>{truncateText(item.metadata.current_company, 10)}</TableCell>
                      <TableCell>{truncateText(item.metadata.phone_no, 10)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>)
                : (
                "" )
               }
              </Table>
            </TableContainer>   
            <AlertMsg
           open={alertOpen}
           handle={handleClose}
           severity={severity}
           Msg={alertMsg}
         />         
          </DialogContent>
    </Dialog>
    </>
  

  );
};

export default ShortlistedPopup;