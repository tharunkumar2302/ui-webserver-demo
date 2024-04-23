import { headingApplicantName, labelAppliedDate, labelProfile, labelStatus } from "app/utils/constantForms";

const { tableContentColGrow, tableIconColWidth, tableIconColGrow, tableButton, editIcon, tableCheckIconColWidth, editJobApplicantIcon, rejectedJobApplicantIcon } = require("app/utils/constant");
const { headerMenu } = require("../HeaderMenu/HeaderMenu");

export const jobApplicantColumns = [
  {
    field: 'profile',
    title: labelProfile,
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    hozAlign: "center",
    widthGrow: tableIconColGrow,
    formatter: tableButton
  },
  {
    field: 'applicantName',
    title: headingApplicantName,
    sorter: 'string',
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    headerMenu: headerMenu
  },
  {
    field: 'createdAt',
    title: labelAppliedDate,
    sorter: 'string',
    headerTooltip: true,
    hozAlign: 'center',
    widthGrow: tableContentColGrow,
    headerMenu: headerMenu
  },
  {
    field: 'status',
    title: labelStatus,
    sorter: 'string',
    headerTooltip: true,
    hozAlign: 'left',
    width: tableIconColWidth,
    headerMenu: headerMenu
  },  
  {
    field: 'StatusEdit',
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    hozAlign: "center",
    width: tableCheckIconColWidth,
    formatter: editJobApplicantIcon
  },
  {
    field: 'rejected',
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    hozAlign: "center",
    width: tableCheckIconColWidth,
    formatter: rejectedJobApplicantIcon
  },
];