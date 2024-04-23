import React from "react";
import { useState } from "react";
import { Tooltip} from "@mui/material";
import { tooltipExportTemplate } from "app/utils/constantForms";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getExportTemplateDetails } from "app/redux/actions/ProfileActions";
import fileDownload from "js-file-download";



export const ExportTemplate = () => {

  const [clicked, setClicked] = useState(false);


  // Get All Export Template
  const exportTemplateData = async () => {
    let getExportTemplate = await getExportTemplateDetails();
    fileDownload(getExportTemplate.payload, "resumeImportTemplate_1.xlsx");
    setClicked(true);
  };

  return (
<div style={{ display: "flex", alignItems: "center" }}>
  <div style={{ marginRight: "8px" }}>To Export Template:</div>
  <Tooltip title={tooltipExportTemplate}>
    <span onClick={exportTemplateData} style={{ textDecoration: "underline", cursor: "pointer", color: clicked ? "red" : "blue" }}>
      Click here to Export File
    </span>
  </Tooltip>
</div>
  );
};