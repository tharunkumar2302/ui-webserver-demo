/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
/* eslint-disable no-eval */
/* eslint-disable eqeqeq */
import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import {
  paginationSize,
  paginationSizeSelector,
  tableHeight,
} from "app/utils/constant";
import {
  labelShowHeaderFilter,
  placeholderNoResultsFound,
} from "app/utils/constantForms";
import { isMobile } from "app/utils/utils";
import React, { useEffect, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { localStorageAccessToken } from "app/utils/constant";
import API from 'app/apiManager/endpoints';
import requestClient from "app/apiManager/interceptors";
export default function ReusableGrid(props) {
  const { filters, keyword,query, cvNotUpload,status,showRelvantJobs } = props.params;
  const ajaxParams = {
    ...(filters && { filters }),
    ...(status && { status }),
    ...(keyword && { keyword }),
    ...(query && { query }),
    ...(showRelvantJobs && { showRelvantJobs }),
    ...(cvNotUpload && cvNotUpload !== "" && { cvNotUpload }),
  };
  // const dispatch = useDispatch();
  let table = false;
  let isCelLoaded = false;
  const cellClick = () =>
    table.on("cellClick", function (e, cell) {
      if (cell.getField() === "action") {
        props.onCellClick({ cell: cell.getData() });
      } else if (cell.getField() === "remove") {
        props.DeleteData({ cell: cell.getData() });
      } else if (cell.getField() === "archive") {
        props.ArchiveData({ cell: cell.getData() });
      } else if (cell.getField() === "checkbox") {
        props.onCellClick({ cell: cell.getData() });
      } else if (cell.getField() === "applicants") {
        props.onCellApplicants({ cell: cell.getData() });
      } else if (cell.getField() === "shortlisted") {
        props.onCellShortlisted({ cell: cell.getData() });
      } else if (cell.getField() === "is_cv_uploaded") {
        const rowData = cell.getRow().getData(); 
        if(rowData.cv_url){
          props.DownloadProfile({ cell: cell.getData(), data:e});
        }
      } else if (cell.getField() === "profile") {
        props.showProfile({ cell: cell.getData() });
      } else if (cell.getField() === "StatusEdit") {
        props.showStatus({ cell: cell.getData() });
      }else if (cell.getField() === "rejected") {
        props.rejectedStatus({ cell: cell.getData() });
      }
    });
  useEffect(async() => {
    const response = await requestClient.get(API.CURRENTUSER_API)
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    table = new Tabulator(`#${props.divId}`, {
      height: props.tableHeight ? props.tableHeight : tableHeight,
      //selectable: true,
      renderHorizontal: "virtual",
      pagination: true, //enable pagination
      paginationMode: "remote", //enable remote pagination
      layout: "fitColumns",
      placeholder: placeholderNoResultsFound, // Include current page size in the selector
      paginationSize: paginationSize,
      tooltip: true,
      paginationCounter:"rows",
      paginationSizeSelector: paginationSizeSelector,
      paginationInitialPage: 1, // Set initial page
      // paginationSize: props.params?.limit,
      columns: props.columns,
      dataLoader: true,
      columnDefaults: {
        tooltip: true,
      },
      ajaxURL: props.endpoint,
      dataSendParams: {
        size: "limit",
        page: "page",
      },
      ajaxParams: ajaxParams,
      ajaxConfig: {
        headers: {
          Authorization: `Bearer ${localStorageAccessToken()}`,
        },
      },
      ajaxResponse: function (url, params, response) {
        if(response.results[0]?.modifiedAt){
          response.results.sort((b,a)=> (new Date(a.modifiedAt)).getTime() - (new Date(b.modifiedAt)).getTime() );
        }
        response.results.forEach((element) => {
          var date = element.modifiedAt?.split("T")[0];
          element.modifiedAt = date.split("-").reverse().join("-");
          element.CreatedBy = element?.createdByUserId?.firstName;
        });
        
        return response;
      },
      dataReceiveParams: {
        last_row:"totalResults",
        last_page: "totalPages", //the total number of available pages (this value must be greater than 0)
        data: "results",
      },
      ajaxSorting: true, // enable sorting on server side
    });
    // Call the custom function to navigate to the last page
    table.on("rowSelectionChanged", function (data, rows) {
      props?.checkclick && props.checkclick(data);
      //rows - array of row components for the selected rows in order of selection
      //data - array of data objects for the selected rows in order of selection
    });
    if (!isCelLoaded) {
      cellClick();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isCelLoaded = true;
    }
    function customfilter(data, params) {
      var conditonConstruct = "";
      for (let i = 0; i < Object.keys(params).length; i++) {
        let valueSplit = Object.values(params)[i].trim().split(",");
        for (let j = 0; j < valueSplit.length; j++) {
          if (i == 0 && j == 0) {
            valueSplit[j]
              ? (conditonConstruct =
                  conditonConstruct +
                  "((data." +
                  Object.keys(params)[i] +
                  '.name=="' +
                  valueSplit[j] +
                  '")')
              : (conditonConstruct = conditonConstruct);
          } else if (i > 0 && j == 0) {
            valueSplit[j]
              ? (conditonConstruct =
                  conditonConstruct +
                  " && ((data." +
                  Object.keys(params)[i] +
                  '.name=="' +
                  valueSplit[j] +
                  '")')
              : (conditonConstruct = conditonConstruct);
          } else if (j == valueSplit.length - 1) {
            conditonConstruct =
              conditonConstruct +
              " || (data." +
              Object.keys(params)[i] +
              '.name=="' +
              valueSplit[j] +
              '"))';
          } else {
            conditonConstruct =
              conditonConstruct +
              " || (data." +
              Object.keys(params)[i] +
              '.name=="' +
              valueSplit[j] +
              '")';
          }
          if (valueSplit.length == 1) {
            valueSplit[j]
              ? (conditonConstruct = conditonConstruct + ")")
              : (conditonConstruct = conditonConstruct);
          }
        }
      }
      return eval(conditonConstruct);
    }
    if (props.filter) {
      if (Object.keys(props.filter).length != 0) {
        table.setFilter(customfilter, props.filter);
      }
    }
  }, [props.params ,props.endpoint]);
  return (
    <>
      <Grid item xs={3}>
        {props?.headerfilter && props?.headerfilter ? (
          <FormGroup
            style={{ width: !isMobile() ? "19.5%" : "55%", padding: "8px" }}
          >
            <FormControlLabel
              control={<Checkbox onChange={props.columHeader} />}
              label={labelShowHeaderFilter}
              id="headerFilter"
            />
          </FormGroup>
        ) : (
          ""
        )}
      </Grid>
      <div id={props.divId}></div>
    </>
  );
}
