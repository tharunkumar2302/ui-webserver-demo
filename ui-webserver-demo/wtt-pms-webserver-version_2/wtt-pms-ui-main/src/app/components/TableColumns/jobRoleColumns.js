/* eslint-disable no-unused-vars */
import { deleteIcon, editIcon, tableCheckIconColWidth, tableCheckjobRolColWidth, tableContentColGrow, localStorageUserRole } from "app/utils/constant";
import { labelActive, labelCheckBox, labelDescription, labelName, labelOrganizationName,} from "app/utils/constantForms";
import React, { useState ,useEffect } from "react";


const { headerMenu } = require("app/components/HeaderMenu/HeaderMenu");

function GetJobRoleColumns() {
    // const [hideRemoveColumn, setHideRemoveColumn] = useState(false);
    const [hideRemoveColumn, setHideRemoveColumn] = useState(localStorageUserRole() == 'employer'? false: true);
    
  
    return [
      // {
      //   formatter: "rowSelection",
      //   resizable: false,
      //   title: labelCheckBox,
      //   titleFormatter: "rowSelection",
      //   width: tableCheckjobRolColWidth,
      //   headerSort: false,
      //   cellClick: function (e, cell) {
      //       cell.getRow().toggleSelect();
      //   },
      // },
      {
        field: 'action',
        resizable: false,
        headerSort: false,
        headerTooltip: true,
        width: tableCheckIconColWidth,
        formatter: editIcon,
        visible: hideRemoveColumn 
      },
      {
        field: 'name',
        title: labelName,
        headerTooltip: true,
        hozAlign: 'left',
        sorter: 'string',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu
      },
      {
        field: 'organization.name',
        title: labelOrganizationName,
        headerTooltip: true,
        hozAlign: 'left',
        sorter: 'string',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu
      },
      {
        field: 'description',
        title: labelDescription,
        headerTooltip: true,
        hozAlign: 'left',
        sorter: 'string',
        formatter: "html",
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu
      },
      {
        field: 'isActive',
        title: labelActive,
        headerTooltip: true,
        hozAlign: 'left',
        sorter: 'string',
        widthGrow: tableContentColGrow,
        headerMenu: headerMenu
    },
      {
        headerTooltip: true,
        field: "remove",
        width: tableCheckIconColWidth,
        resizable: false,
        headerSort: false,
        color: "primary",
        formatter: deleteIcon,
        visible: hideRemoveColumn
      }
    ];
  }
  
  export { GetJobRoleColumns };