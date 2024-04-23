/* eslint-disable no-unused-vars */
import { getJobOpeningDetails } from "app/redux/actions/JobOpeningActions";
import { getProfileDetails } from "app/redux/actions/ProfileActions";
import { statusValues,apiLimit200, apiPageNo1 } from "app/utils/constant";
import { statusColumns } from "../TableColumns/statusColumns";

export var headerMenu = function () {
    var menu = [];
    var columns = this.getColumns();
    let infoHeader = document.createElement("span");
    infoHeader.textContent = "Add or remove columns";
    infoHeader.className = "header-class";
    infoHeader.style.cssText = "pointer-events:none;font-size: 11px;font-weight: 700;"
    menu.push({
        label: infoHeader,
        action: function (e) {
            //prevent menu closing
            e.stopPropagation();
        }
    })
    for (let column of columns) {
        let icon = document.createElement("i");
        icon.classList.add(column.isVisible() ? "fa-solid" : "fa-regular");
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");
        let label = document.createElement("span");
        let title = document.createElement("span");
        title.textContent = " " + column.getDefinition().title;
        label.appendChild(icon);
        label.appendChild(title);
        //create menu item
        if(column.getDefinition().title)
        menu.push({
            label: label,
            action: function (e) {
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if (column.isVisible()) {
                    icon.classList.remove("fa-regular");
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-solid");
                    icon.classList.add("fa-check-square");
                } else {
                    icon.classList.remove("fa-solid");
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-regular");
                    icon.classList.add("fa-square");
                }
            }
        });
    }
    return menu;
};

export const HeaderContextMenu = (setParams, type) => {
    //initial default value
    var HeaderContextMenuJson = [];
    var rows = statusColumns;
    let infoHeader = document.createElement("p");
    infoHeader.textContent = "Filter by status";
    infoHeader.style.cssText = "pointer-events:none;font-size: 11px;font-weight: 700;"
    HeaderContextMenuJson.push({
        label: infoHeader,
        action: function (e) {
            e.stopPropagation();
        }
    })

    for (let row of rows) {
        let icon = document.createElement("i");
        icon.classList.add(statusValues.includes(row.title) ? "fa-solid" : "fa-regular");
        icon.classList.add(statusValues.includes(row.title) ? "fa-check-square" : "fa-square");
        let label = document.createElement("p");
        let title = document.createElement("span");
        title.textContent = " " + row.title;
        label.appendChild(icon);
        label.appendChild(title);
        label.style.cssText = "font-size: 12px;"
        HeaderContextMenuJson.push({
            label: label,
            action: async function (e) {
               e.stopPropagation();
                //change menu item icon
                if (icon.classList.value === 'fa-solid fa-check-square') {
                    icon.classList.remove("fa-solid");
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-regular");
                    icon.classList.add("fa-square");
                    const index = statusValues.indexOf(row.title);
                    if (index > -1) { // only splice array when item is found
                        statusValues.splice(index, 1); // 2nd parameter means remove one item only
                    }
                } else {
                    icon.classList.remove("fa-regular");
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-solid");
                    icon.classList.add("fa-check-square");
                    !statusValues.includes(row.title) && statusValues.push(row.title);
                }

                if (type === 'profile') {
                    // eslint-disable-next-line eqeqeq
                    //const test = await getProfileDetails(statusValues.length == 0 ? [''] : statusValues);
                    setParams({limit: apiLimit200,
                        page: apiPageNo1,
                        status:statusValues.length == 0 ? [''] : statusValues})
                } else if (type === 'job') {
                    // eslint-disable-next-line eqeqeq
                    //const test = await getJobOpeningDetails(statusValues.length == 0 ? [''] : statusValues);
                    setParams({limit: apiLimit200,
                        page: apiPageNo1,
                        status:statusValues.length == 0 ? [''] : statusValues})
                }

            }
        });
    }
    const conDiv = document.createElement('div');
    conDiv.classList.add('contexList')
    HeaderContextMenuJson.forEach((data) => {
        data.label.addEventListener('click', data.action);
        conDiv.appendChild(data.label);

    })

    return conDiv;
}
