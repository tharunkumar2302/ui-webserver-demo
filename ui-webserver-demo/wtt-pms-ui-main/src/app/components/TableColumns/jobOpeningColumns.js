import {profileIcon, archiveIcon, editIcon, tableIconColWidth, tableContentColWidth, headingShowApplicantsIcon, tableCheckIconColWidth } from "app/utils/constant";
import { headingShowApplicants, headingShortlistApplicants, labelEmploymentType, labelJobRole, labelLocation, labelPrimarySkills, labelSecondarySkills, labelStatus, labelTotalOpenings, labelUpdatedBy, labelUpdatedOn } from "app/utils/constantForms";

const { headerMenu, HeaderContextMenu } = require("../HeaderMenu/HeaderMenu");

export const jobOpeningColumns = (setParams, headerFilterShow) => [
  {
    field: 'applicants',
    title: headingShowApplicants,
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    width: tableIconColWidth,
    formatter: headingShowApplicantsIcon,

  },
  {
    field: 'shortlisted',
    title: headingShortlistApplicants,
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    width: tableIconColWidth,
    formatter: profileIcon,

  },
  {
    field: 'action',
    resizable: false,
    headerTooltip: true,
    headerSort: false,
    hozAlign: "center",
    width: tableCheckIconColWidth,
    formatter: editIcon,
  },
  {
    field: 'archive',
    headerTooltip: true,
    title:"Archive",
    resizable: false,
    headerSort: false,
    hozAlign: "center",
    width: tableCheckIconColWidth,
    formatter: archiveIcon,
  },
  {
    field: 'jobRole.name',
    title: labelJobRole,
    headerTooltip: true,
    hozAlign: 'left',
    width: tableContentColWidth,
    headerMenu: headerMenu,
    editor: "input",
    headerFilter: !headerFilterShow ? "" : "list",
    headerFilterParams: { valuesLookup: true, clearable: true }
  },
  {
    field: 'location',
    title: labelLocation,
    headerTooltip: true,
    hozAlign: 'left',
    width: tableContentColWidth,
    sorter: 'string',
    headerMenu: headerMenu,
    headerFilter: !headerFilterShow ? "" : "input",
  },
  {
    field: 'skillsRequired',
    title: labelPrimarySkills,
    headerTooltip: true,
    hozAlign: 'left',
    sorter: 'string',
    width: tableContentColWidth,
    headerMenu: headerMenu,
    formatter: "html",
    headerFilter: !headerFilterShow ? "" : "input",
  },
  {
    field: 'secondarySkills',
    title: labelSecondarySkills,
    headerTooltip: true,
    hozAlign: 'left',
    sorter: 'string',
    width: tableContentColWidth,
    headerMenu: headerMenu,
    formatter: "html",
    headerFilter: !headerFilterShow ? "" : "input",
  },
  {
    field: 'employmentType',
    title: labelEmploymentType,
    headerTooltip: true,
    hozAlign: 'left',
    width: tableContentColWidth,
    sorter: 'string',
    headerMenu: headerMenu,
  },
  {
    field: 'status',
    title: labelStatus,
    headerTooltip: true,
    hozAlign: 'left',
    width: tableContentColWidth,
    sorter: 'string',
    headerMenu: headerMenu,
    headerPopup: HeaderContextMenu.bind(this, setParams, 'job'),
    headerPopupIcon: "<i class='fas fa-filter' title='Filter Status'></i>"
  },
  {
    field: 'totalOpenings',
    title: labelTotalOpenings,
    headerTooltip: true,
    width: tableContentColWidth,
    sorter: 'string',
    headerMenu: headerMenu,
  },

  {
    field: 'modifiedAt',
    title: labelUpdatedOn,
    width: tableContentColWidth,
    headerTooltip: true,
    sorter: 'string',
    headerMenu: headerMenu,

  },
  {
    field: 'createdByUserId.firstName',
    title: labelUpdatedBy,
    headerTooltip: true,
    hozAlign: 'left',
    width: tableContentColWidth,
    sorter: 'string',
    headerMenu: headerMenu,
  }

];