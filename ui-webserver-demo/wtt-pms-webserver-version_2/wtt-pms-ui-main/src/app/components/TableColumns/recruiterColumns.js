import { labelCheckBox, labelEmailID, labelFirstName, labelLastName, labelPhoneNo } from "app/utils/constantForms";
const { editIcon, tableContentColGrow, tableCheckIconColWidth } = require("app/utils/constant");
const { headerMenu } = require("../HeaderMenu/HeaderMenu");

export const recruiterColumns = (headerFilterShow) => [
    // {
    //     formatter: "rowSelection",
    //     resizable: false,
    //     title: labelCheckBox,
    //     titleFormatter: "rowSelection",
    //     headerSort: false,
    //     cellClick: function (e, cell) {
    //         cell.getRow().toggleSelect();
    //     }
    // },
    {
        field: 'action',
        title: '',
        resizable: false,
        headerTooltip: true,
        headerSort: false,
        width: tableCheckIconColWidth,
        formatter: editIcon,
    },
    {
        field: 'firstName',
        title: labelFirstName,
        sorter: 'string',
        headerTooltip: true,
        hozAlign: 'left',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
    {
        field: 'lastName',
        title: labelLastName,
        sorter: 'string',
        headerTooltip: true,
        hozAlign: 'left',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
    {
        field: 'emailAddress',
        title: labelEmailID,
        sorter: 'string',
        headerTooltip: true,
        hozAlign: 'left',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
    {
        field: 'mobileNumber',
        title: labelPhoneNo,
        headerTooltip: true,
        hozAlign: 'center',
        sorter: 'string',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu,
        headerFilter: !headerFilterShow ? "" : "input",
    },
];