import { labelCompanyName, labelJobRole, labelLocation, labelShowJobDetails, labelSkills, labelTags } from "app/utils/constantForms";

const { tableButton, tableContentColGrow, tableIconColGrow, } = require("app/utils/constant");
const { headerMenu } = require("../HeaderMenu/HeaderMenu");

export const relevantJobsColumns = [
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
    field: 'jobRole.name',
    title: labelJobRole,
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    sorter: 'string',
    headerMenu: headerMenu,

  },
  {
    field: 'skillsRequired',
    title: labelSkills,
    headerTooltip: true,
    hozAlign: 'left',
    sorter: 'string',
    widthGrow: tableContentColGrow,
    headerMenu: headerMenu,
    formatter: "html",
  },
  {
    field: 'location',
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
    sorter: 'string',
    widthGrow: tableContentColGrow,
    headerMenu: headerMenu,

  },
  {
    field: 'tags',
    title: labelTags,
    headerTooltip: true,
    hozAlign: 'left',
    widthGrow: tableContentColGrow,
    sorter: 'string',
    headerMenu: headerMenu,

  }
];