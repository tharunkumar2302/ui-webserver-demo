import { Button, Icon, IconButton, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { localStorageUserRole, value100Per } from "app/utils/constant";
import { modalClose, placeholderSearch, tooltipApplySearchBox, tooltipCloseSearchBox, tooltipSearchBox } from "app/utils/constantForms";
import { isMobile } from "app/utils/utils";
import React, { useState } from "react";
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';

const SearchButton = styled(Button)(() => ({
  height: isMobile() ? '2.6rem' : '2.4rem',
  minWidth: isMobile() ? '48px' : '75px',
  left: '0.1rem'
}));

const SearchContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "-2px",
  left: !isMobile() ? "9.5rem" : "-7px",
  zIndex: 9,
  width: !isMobile() ? "62%" : "99%",
  display: "flex",
  alignItems: "center",
  height: !isMobile() ? "40px" : "42px",
  borderRadius: "8px",
  margin: "0rem 0.35rem",
  background: "#ffffff",
  border: "2px solid rgb(224, 224, 224)",
  "&::placeholder": {
    color: theme.palette.text.primary,
  },
}));

const SearchInput = styled("input")(({ theme }) => ({
  width: value100Per,
  border: "none",
  outline: "none",
  fontSize: "14px",
  paddingLeft: "20px",
  height: "calc(100% - 5px)",
  background: "ffffff",
  color: theme.palette.text.primary,
  "&::placeholder": { color: theme.palette.text.primary },
}));

const FilterSearch = (props) => {
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = React.useState(() => localStorageUserRole());
  const toggle = () => {
    setOpen(!open);
  };

  const { palette } = useTheme();
  const textColor = palette.text.primary;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      props.searchInput();
    }
  };

  return (
    <React.Fragment>
      {!open && (
        <Tooltip title={tooltipSearchBox}>
          <IconButton
            onClick={toggle}
            className="searchBtn"
            style={{
              position: "absolute",
              padding: '0.5rem',
              right: !isMobile() ? userRole == 'superuser'?'6%':'21%': userRole == 'superuser'?'15%':"62%",
              zIndex: 1
            }}
          >
            <Icon sx={{ color: textColor }}>search</Icon>
          </IconButton>
        </Tooltip>
      )}

      {open && (
        <SearchContainer className="relevantStyle">
          <SearchInput
            type="text"
            placeholder={placeholderSearch}
            onChange={props.handelInputSearch}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Tooltip title={tooltipCloseSearchBox}>
            <IconButton
              onClick={toggle}
              sx={{ mx: 2, verticalAlign: "middle", margin: "0px" }}
            >
              <Icon
                sx={{ color: textColor, width: "20px" }}
                onClick={props.searchInputRemove}
              >
                {modalClose}
              </Icon>
            </IconButton>
          </Tooltip>

          <Tooltip title={tooltipApplySearchBox}>
            <SearchButton size="medium" variant="contained" onClick={props.searchInput} endIcon={<SubdirectoryArrowLeftIcon />}>
            </SearchButton>
          </Tooltip>
        </SearchContainer>
      )}
    </React.Fragment>
  );
};

export default FilterSearch;
