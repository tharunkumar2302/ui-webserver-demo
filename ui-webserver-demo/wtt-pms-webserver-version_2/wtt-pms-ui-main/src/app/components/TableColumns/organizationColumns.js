import { labelEmailID,labelDesignation,labelCreatedBy, labelPhoneNo,labelUpdatedOn ,labelOrganizationName, labelStatus, labelPricingPlan} from "app/utils/constantForms";
const { editIcon, tableCheckIconColWidth,tableContentColWidth } = require("app/utils/constant");
const { headerMenu } = require("../HeaderMenu/HeaderMenu");

export const organizationColumns = (headerFilterShow) => [
   
    {
        field: 'action',
        title: 'Edit',
        resizable: false,
        headerTooltip: true,
        headerSort: false,
        width: tableCheckIconColWidth,
        formatter: editIcon,
    },
    {
        field: 'organization.name',
        title: labelOrganizationName,
        headerTooltip: true,
        hozAlign: 'left',
        sorter: 'string',
        width: tableContentColWidth,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
    {
        field: 'firstName', 
        title: 'Contact person', 
        sorter: 'string',
        headerTooltip: true,
        hozAlign: 'left',
        // widthGrow: tableContentColGrow,
        width: tableContentColWidth,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? '' : 'input',
        formatter: function (cell, formatterParams, onRendered) {
          // Get the first name and last name from the row data
          const firstName = cell.getRow().getData().firstName;
          const lastName = cell.getRow().getData().lastName;
    
          // Concatenate first name and last name with a space in between
          const fullName = firstName + ' ' + lastName;
    
          // Return the concatenated full name
          return fullName;
        },
        // headerFilterLiveFilter: false,
        headerFilterFunc: function (headerValue, rowValue, rowData, filterParams) {
            const firstName = rowData.firstName.toLowerCase();
            const lastName = rowData.lastName.toLowerCase();
            const searchValue = headerValue.toLowerCase();
            return firstName.includes(searchValue) || lastName.includes(searchValue);
        }
    },
    {
        field: 'emailAddress',
        title: labelEmailID,
        sorter: 'string',
        headerTooltip: true,
        hozAlign: 'left',
        width: tableContentColWidth,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
    {
        field: 'status',
        title: labelStatus,
        headerTooltip: true,
        hozAlign: 'left',
        width: tableContentColWidth,
        sorter: 'string',
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
      },
    {
        field: 'mobileNumber',
        title: labelPhoneNo,
        headerTooltip: true,
        hozAlign: 'Left',
        sorter: 'string',
        width: tableContentColWidth,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
    {
        field: 'pricingPlan.name',
        title: labelPricingPlan,
        headerTooltip: true,
        hozAlign: 'Left',
        sorter: 'string',
        width: tableContentColWidth,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    }, {
        field: 'designation',
        title: labelDesignation,
        sorter: 'string',
        headerTooltip: true,
        hozAlign: 'left',
        width: tableContentColWidth,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input"
      },
      {
        field: "modifiedAt",
        title: labelUpdatedOn,
        sorter: "string",
        headerTooltip: true,
        hozAlign: "left",
        width: tableContentColWidth,
        headerFilter: !headerFilterShow ? "" : "input",
        headerMenu: headerMenu,
      },
      {
        field: "createdByUserId.firstName",
        title: labelCreatedBy,
        sorter: "string",
        headerTooltip: true,
        hozAlign: "left",
        width: tableContentColWidth,
        headerFilter: !headerFilterShow ? "" : "input",
        headerMenu: headerMenu,
        formatter: function (cell, formatterParams, onRendered) {
            // Get the first name and last name from the row data
            const firstName = cell.getRow().getData().createdByUserId.firstName;
            const lastName = cell.getRow().getData().createdByUserId.lastName;
      
            // Concatenate first name and last name with a space in between
            const fullName = firstName + ' ' + lastName;
      
            // Return the concatenated full name
            return fullName;
          },
          headerFilterFunc: function (headerValue, rowValue, rowData, filterParams) {
            const firstName = rowData.createdByUserId.firstName.toLowerCase();
            const lastName = rowData.createdByUserId.lastName.toLowerCase();
            const searchValue = headerValue.toLowerCase();
            return firstName.includes(searchValue) || lastName.includes(searchValue);
        }
      },
];