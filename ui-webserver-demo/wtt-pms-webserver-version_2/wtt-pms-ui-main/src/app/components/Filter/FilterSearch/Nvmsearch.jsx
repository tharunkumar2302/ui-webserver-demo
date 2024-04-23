import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { localStorageAccessToken, value100Per,localStorageUserRole } from "app/utils/constant";
import { modalClose, placeholderSearch, tooltipApplySearchBox, tooltipCloseSearchBox, tooltipSearchBox ,tooltipNlpSearchBox ,CVDownload } from "app/utils/constantForms";
import { isMobile } from "app/utils/utils";
import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';
import React, { useState, useEffect } from "react";
import { getProfileCV } from "app/redux/actions/ProfileActions";
import AlertMsg from "app/components/AlertMsg/AlertMsg";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from 'axios';

const NvmSearch = (props) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [table, setTable] = useState(true);
  const { palette } = useTheme();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [userRole, setUserRole] = useState(() => localStorageUserRole());
  const textColor = palette.text.primary;

  const toggle = () => {
    setOpen(!open);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  
  const handleSearchClick = async () => {
  if (searchText.trim() !== "") {
    try {
      const response = await axios.get(`http://18.219.239.115:5000/fetch_result?query=${searchText}&org_id=${id()}`, {
        headers: {
          Authorization:`Bearer ${localStorageAccessToken()}`,
          // Add any other required headers
        },
      });
  
     
      setData(response.data.response.results[0].matches);
      setTable(true); 
      } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  const handleSearchClear = (e) => {
    setTable(false);
    setSearchText("");
   };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };
  
  const handelCloseModel = (e) => {
    setTable(false);
    setSearchText("");
    toggle();
  }
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

  return (
    <React.Fragment>
      {!open && (
        <Tooltip title={tooltipNlpSearchBox}>
          <IconButton
            onClick={toggle}
            className="searchBtn"
            style={{
              position: "absolute",
              padding: '0.4rem',
              right: !isMobile() ? "18%" : "62%",
              zIndex: 1
            }}
          >
           {userRole == 'superuser' ? "":<PsychologySharpIcon />}
          </IconButton>
        </Tooltip>
      )}

      {open && (
        <Dialog maxWidth="md" open={open} onClose={toggle}>
          {/* <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={toggle}
              style={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle> */}
          <DialogContent>
            <div style={{display:'flex'}}>
              <input
                type="text"
                placeholder={placeholderSearch}
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
                style={{
                  width: value100Per,
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  paddingLeft: "20px",
                  height: "40px",
                  borderRadius: "8px",
                  margin: "0 0.35rem",
                  background: "#ffffff",
                  border: "2px solid rgb(224, 224, 224)",
                  color: textColor,
                }}
              />
              <Button onClick={handleSearchClear}>Clear</Button>
              <Button onClick={handleSearchClick}>Search</Button>
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="8%">CV</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>Primary Skills</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Current Company</TableCell>
                    <TableCell>Phone Number</TableCell>
                    {/* Add more table headers as needed */}
                  </TableRow>
                </TableHead>
               {table ? ( <TableBody>
                  {data.map((item ,index) => (
                    <TableRow key={item.id}>
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
                      
                      {/* Add more table cells based on your data structure */}
                    </TableRow>
                  ))}
                </TableBody>)
                : (
                "" )
               }
              </Table>
            </TableContainer>            
          </DialogContent>
          <DialogActions>
            <Button onClick={handelCloseModel}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
       <AlertMsg
           open={alertOpen}
           handle={handleClose}
           severity={severity}
           Msg={alertMsg}
         />
    </React.Fragment>
  );
};

export default NvmSearch;
