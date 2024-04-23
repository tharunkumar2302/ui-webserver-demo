/* eslint-disable no-useless-concat */
import { labelCompanyName, labelJobRole, labelLocation, labelShowJobDetails, labelSkills, labelStatus, labelTags } from "app/utils/constantForms";

const { tableButton, tableContentColGrow, tableIconColGrow } = require("app/utils/constant");
const { headerMenu } = require("../HeaderMenu/HeaderMenu");

const htmlFormatter =(cell)=> {
  return "<div class=" + cell.getValue() + "-badge" + " style='display:block!important;'>" + cell.getValue().replace(/^\w/, c => c.toUpperCase()) + "</div>"
}

export const appliedJobsColumns = [
  {
    field: 'action',
    title: labelShowJobDetails,
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    hozAlign: "center",
    widthGrow: tableIconColGrow,
    formatter: tableButton
  },
  {
    field: 'jobApplication.jobRole.name',
    title: labelJobRole,
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    sorter: 'string',
    headerMenu: headerMenu,

  },
  {
    field: 'jobApplication.skillsRequired',
    title: labelSkills,
    headerTooltip: true,
    hozAlign: 'left',
    sorter: 'string',
    widthGrow: tableContentColGrow,
    headerMenu: headerMenu,
    formatter: "html",
  },
  {
    field: 'jobApplication.location',
    title: labelLocation,
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    sorter: 'string',
    headerMenu: headerMenu,

  },
  {
    field: 'organization.name',
    title: labelCompanyName,
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    sorter: 'string',
    headerMenu: headerMenu,

  },
  {
    field: 'jobApplication.tags',
    title: labelTags,
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    sorter: 'string',
    headerMenu: headerMenu,

  },
  {
    field: 'status',
    title: labelStatus,
    headerTooltip: true,
    hozAlign: 'center',
    widthGrow: tableIconColGrow,
    sorter: 'string',
    headerMenu: headerMenu,
    formatter: htmlFormatter
  }
];