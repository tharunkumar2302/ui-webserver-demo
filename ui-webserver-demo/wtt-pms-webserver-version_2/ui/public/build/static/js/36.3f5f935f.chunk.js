(this["webpackJsonpmatx-react"]=this["webpackJsonpmatx-react"]||[]).push([[36],{341:function(e,t,a){"use strict";a.d(t,"b",(function(){return c})),a.d(t,"c",(function(){return o})),a.d(t,"f",(function(){return _})),a.d(t,"e",(function(){return l})),a.d(t,"g",(function(){return u})),a.d(t,"h",(function(){return p})),a.d(t,"i",(function(){return d})),a.d(t,"d",(function(){return b})),a.d(t,"a",(function(){return O}));a(13),a(141);var r=a(14),n=a(24),s=a(26),i=a(32),c=(a(20),function(){var e=Object(n.a)(Object(r.a)().mark((function e(){var t;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.get(i.a.GET_EXPORT_TEMPLATE_API,{responseType:"blob"});case 2:return t=e.sent,e.abrupt("return",{type:"GET_EXPORT_TEMPLATE_DETAILS",payload:t.data});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()),o=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("".concat(i.a.PROFILE_API,"/downloadresume/").concat(t),{responseType:"blob"});case 2:return a=e.sent,e.abrupt("return",{type:"GET_PROFILE_CV_DOWNLOAD",payload:a.data});case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),_=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a,n;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t,e.next=3,s.a.post(i.a.PROFILE_API,a);case 3:return n=e.sent,e.abrupt("return",{type:"POST_PROFILE_DETAILS",payload:n});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),l=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a,n;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t,e.next=3,s.a.post("".concat(i.a.CANDIDATE_DETAILS_API,"/invite"),a);case 3:return n=e.sent,e.abrupt("return",{type:"POST_CANDIDTE_INVITE",payload:n});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),u=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t,a,n,c){var o,_;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=a?n:c,e.next=3,s.a.post(t?i.a.POST_PROFILE_EXPORTALL_API:i.a.PROFILE_SEARCH_API,o,{responseType:"blob"});case 3:return _=e.sent,e.abrupt("return",{type:"POST_PROFILE_EXPORTALL_DETAILS",payload:_.data});case 5:case"end":return e.stop()}}),e)})));return function(t,a,r,n){return e.apply(this,arguments)}}(),p=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a,n;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t,e.next=3,s.a.post(i.a.POST_PROFILE_IMPORT_API,a);case 3:return n=e.sent,e.abrupt("return",{type:"POST_PROFILE_IMPORT_DETAILS",payload:n});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a,n;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t,e.next=3,s.a.post(i.a.POST_UPLOAD_S3_API,a);case 3:return n=e.sent,e.abrupt("return",{type:"POST_UPLOAD_S3_DETAILS",payload:n});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),b=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t,a,n,c,o,_,l,u,p,d,b,O,f,m,j,v,h,E,P,g,x,D,C,k,T,M,A,I,w,L){var y,R;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return y={firstName:a,lastName:n,email:c,phone_no:o,current_location:_,marital_status:l,status:u,present_address:p,date_of_birth:d,current_company:b,experience:O,education:f,primary_skill:m,secondary_skill:j,education_details:v,experience_details:h,current_ctc:E,expected_ctc:P,current_designation:g,industry:x,current_employment_status:D,notice_period:C,prefered_location:k,ready_to_relocate:T,overseas_experience:M,having_passport:A,passport_validity:I,visa:w,About:L},e.next=3,s.a.patch("".concat(i.a.PROFILE_API,"/").concat(t),y);case 3:return R=e.sent,e.abrupt("return",{type:"PATCH_PROFILE_DETAILS",payload:R});case 5:case"end":return e.stop()}}),e)})));return function(t,a,r,n,s,i,c,o,_,l,u,p,d,b,O,f,m,j,v,h,E,P,g,x,D,C,k,T,M,A){return e.apply(this,arguments)}}(),O=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.delete("".concat(i.a.PROFILE_API,"/").concat(t));case 2:return a=e.sent,e.abrupt("return",{type:"DELETE_PROFILE_DETAILS",payload:a});case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},345:function(e,t,a){"use strict";a.d(t,"a",(function(){return o})),a.d(t,"e",(function(){return _})),a.d(t,"d",(function(){return l})),a.d(t,"c",(function(){return u})),a.d(t,"b",(function(){return p}));var r=a(14),n=a(24),s=a(26),i=a(32),c=a(20),o=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("".concat(i.a.JOBOPENING_API,"?").concat(c.apiLimit1000),{params:{status:t}});case 2:return a=e.sent,e.abrupt("return",{type:"GET_JOBOPENING_DETAILS",payload:a.data});case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),_=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t){var a,n;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t,e.next=3,s.a.post(i.a.JOBOPENING_API,a);case 3:return n=e.sent,e.abrupt("return",{type:"POST_JOBOPENING_DETAILS",payload:n});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),l=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t,a,n,c,o,_,l,u,p,d,b,O,f,m,j,v,h){var E,P;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return E={department:a,industryType:n,responsibilities:c,skillsRequired:o,description:_,qualification:l,location:u,minExperience:p,maxExperience:d,jobRole:b,employmentType:O,duration:f,workMode:m,status:j,tags:v,totalOpenings:h},e.next=3,s.a.patch("".concat(i.a.JOBOPENING_API,"/").concat(t),E);case 3:return P=e.sent,e.abrupt("return",{type:"PATCH_JOBOPENING_DETAILS",payload:P});case 5:case"end":return e.stop()}}),e)})));return function(t,a,r,n,s,i,c,o,_,l,u,p,d,b,O,f,m){return e.apply(this,arguments)}}(),u=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t,a){var n,c;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={status:a},e.next=3,s.a.patch("".concat(i.a.JOBOPENING_API,"/").concat(t),n);case 3:return c=e.sent,e.abrupt("return",{type:"PATCH_JOBOPENING_ARCHIVE",payload:c});case 5:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),p=function(){var e=Object(n.a)(Object(r.a)().mark((function e(t,a,n){var c,o;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c={comments:n,status:a},e.next=3,s.a.patch("".concat(i.a.JOBAPPLICANT_API,"/").concat(t),c);case 3:return o=e.sent,e.abrupt("return",{type:"PATCH_JOBAPPLICANT_DETAILS",payload:o});case 5:case"end":return e.stop()}}),e)})));return function(t,a,r){return e.apply(this,arguments)}}()},347:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var r=function(e,t){var a=/^[a-zA-Z]*$/i,r=/^[a-zA-Z0-9 ,.&()]*$/i,n=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,s=/^[0-9]\d*(\.\d+)?$/i,i=/^[0-9]\d*(\.\d+)?$/i,c=/(((^[\+,0][9][1])(((\s[0-9]{7,10})|(\S[0-9]{7,10}))|([-]\S[0-9]{7,10})))|((^[\+,0][2]{2,2})((\S[0-9]{7,8})|((([-])[0-9]{7,8})|(\s[0-9]{7,8})))))|(((^[6,7,8,9][0-9]{9,9}))|(^[0,\+](([9][1)|[6,7,8,9]))[0-9]{8,9}))/gm,o={};switch(e){case"name":t?a.test(t)||(o.name="Please enter valid name"):o.name="Name is required!";break;case"description":t||(o.description="Description is required!");break;case"firstName":t?a.test(t)||(o.firstName="Please enter valid first name "):o.firstName="First name is required!";break;case"lastName":t?a.test(t)||(o.lastName="Please enter valid last name"):o.lastName="Last name is required!";break;case"mobileNumber":t?c.test(t)?t.length>10&&(o.mobileNumber="Please required 10 digits phone number"):o.mobileNumber="Please enter valid phone number":o.mobileNumber="Phone number is required!";break;case"emailAddress":t?n.test(t)||(o.emailAddress="This is not a valid email format"):o.emailAddress="Email is required!";break;case"date_of_birth":/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/.test(t)||(o.date_of_birth="Invalid date of birth\n");break;case"department":t?r.test(t)||(o.department="Please enter valid department"):o.department="Department is required!";break;case"industryType":t?r.test(t)||(o.industryType="Please enter valid industry type"):o.industryType="Industry type is required!";break;case"responsibilities":t||(o.responsibilities="Responsibilities is required!");break;case"skillsRequired":t||(o.skillsRequired="skill is required");break;case"location":t?r.test(t)||(o.location="Please enter valid location"):o.location="Location is required!";break;case"totalOpenings":t?s.test(t)||(o.totalOpenings="Please enter valid number of total openings"):o.totalOpenings="Total openings is required!";break;case"minExperience":t?s.test(t)||(o.minExperience="Please enter valid number of min experience"):o.minExperience="Min experience is required!";break;case"maxExperience":t?s.test(t)?t>50&&(o.experience="Max experience 50"):o.maxExperience="Please enter valid number of max experience":o.maxExperience="Max experience is required!";break;case"jobRole":t||(o.jobRole="Job role is required!");break;case"phone_no":t?c.test(t)?t.length>10&&(o.phone_no="Please required 10 digits phone number"):o.phone_no="Please enter valid phone number":o.phone_no="Phone number is required!";break;case"email":t?n.test(t)||(o.email="This is not a valid email format"):o.email="Email is required!";break;case"current_location":t||(o.current_location="Current location is required!");break;case"experience":t>50&&(o.experience="Max experience 50");break;case"ctc":i.test(t)?t>=50&&(o.ctc="Max ctc 50"):o.ctc="Please enter valid number of ctc";break;case"noticePeriod":i.test(t)?t>=50&&(o.noticePeriod="Max noticePeriod 50"):o.noticePeriod="Please enter valid number of notice period";break;case"current_ctc":i.test(t)||(o.current_ctc="Please enter valid number of current ctc");break;case"expected_ctc":i.test(t)||(o.expected_ctc="Please enter valid number of expected ctc");break;case"notice_period":i.test(t)||(o.notice_period="Please enter valid number of notice period");break;case"qualification":t?a.test(t)||(o.qualification="Please enter valid name"):o.qualification="Qualification is required"}return o}},348:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return ReusableGrid}));var C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(14),C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(24),C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(13),_mui_material__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(324),_mui_material__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(455),_mui_material__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(456),_mui_material__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(716),app_utils_constant__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(20),app_utils_constantForms__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(47),app_utils_utils__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(139),react__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(1),react__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_10__),tabulator_tables__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(385),app_apiManager_endpoints__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__(32),app_apiManager_interceptors__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__(26),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__(2),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14___default=__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__);function ReusableGrid(props){var _props$params=props.params,filters=_props$params.filters,keyword=_props$params.keyword,cvNotUpload=_props$params.cvNotUpload,status=_props$params.status,showRelvantJobs=_props$params.showRelvantJobs,ajaxParams=Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.a)(Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.a)(Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.a)(Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.a)(Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.a)({},filters&&{filters:filters}),status&&{status:status}),keyword&&{keyword:keyword}),showRelvantJobs&&{showRelvantJobs:showRelvantJobs}),cvNotUpload&&""!==cvNotUpload&&{cvNotUpload:cvNotUpload}),table=!1,isCelLoaded=!1,cellClick=function(){return table.on("cellClick",(function(e,t){"action"===t.getField()?props.onCellClick({cell:t.getData()}):"remove"===t.getField()?props.DeleteData({cell:t.getData()}):"archive"===t.getField()?props.ArchiveData({cell:t.getData()}):"checkbox"===t.getField()?props.onCellClick({cell:t.getData()}):"applicants"===t.getField()?props.onCellApplicants({cell:t.getData()}):"is_cv_uploaded"===t.getField()?props.DownloadProfile({cell:t.getData()}):"profile"===t.getField()?props.showProfile({cell:t.getData()}):"StatusEdit"===t.getField()?props.showStatus({cell:t.getData()}):"rejected"===t.getField()&&props.rejectedStatus({cell:t.getData()})}))};return Object(react__WEBPACK_IMPORTED_MODULE_10__.useEffect)(Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__.a)(Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__.a)().mark((function _callee(){var _props$params2,response,customfilter;return Object(C_Users_WalkingTree_Desktop_wtt_pms_ui_node_modules_babel_runtime_helpers_esm_regeneratorRuntime_js__WEBPACK_IMPORTED_MODULE_0__.a)().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return customfilter=function _customfilter(data,params){for(var conditonConstruct="",i=0;i<Object.keys(params).length;i++)for(var valueSplit=Object.values(params)[i].trim().split(","),j=0;j<valueSplit.length;j++)0==i&&0==j?valueSplit[j]&&(conditonConstruct=conditonConstruct+"((data."+Object.keys(params)[i]+'.name=="'+valueSplit[j]+'")'):i>0&&0==j?valueSplit[j]&&(conditonConstruct=conditonConstruct+" && ((data."+Object.keys(params)[i]+'.name=="'+valueSplit[j]+'")'):conditonConstruct=j==valueSplit.length-1?conditonConstruct+" || (data."+Object.keys(params)[i]+'.name=="'+valueSplit[j]+'"))':conditonConstruct+" || (data."+Object.keys(params)[i]+'.name=="'+valueSplit[j]+'")',1==valueSplit.length&&valueSplit[j]&&(conditonConstruct+=")");return eval(conditonConstruct)},_context.next=3,app_apiManager_interceptors__WEBPACK_IMPORTED_MODULE_13__.a.get(app_apiManager_endpoints__WEBPACK_IMPORTED_MODULE_12__.a.CURRENTUSER_API);case 3:response=_context.sent,table=new tabulator_tables__WEBPACK_IMPORTED_MODULE_11__.a("#".concat(props.divId),{height:props.tableHeight?props.tableHeight:app_utils_constant__WEBPACK_IMPORTED_MODULE_7__.tableHeight,renderHorizontal:"virtual",pagination:!0,paginationMode:"remote",layout:"fitColumns",placeholder:app_utils_constantForms__WEBPACK_IMPORTED_MODULE_8__.Pd,tooltip:!0,paginationCounter:"rows",paginationSizeSelector:app_utils_constant__WEBPACK_IMPORTED_MODULE_7__.paginationSizeSelector,paginationInitialPage:1,paginationSize:null===(_props$params2=props.params)||void 0===_props$params2?void 0:_props$params2.limit,columns:props.columns,dataLoader:!0,columnDefaults:{tooltip:!0},ajaxURL:props.endpoint,dataSendParams:{size:"limit",page:"page"},ajaxParams:ajaxParams,ajaxConfig:{headers:{Authorization:"Bearer ".concat(Object(app_utils_constant__WEBPACK_IMPORTED_MODULE_7__.localStorageAccessToken)())}},ajaxResponse:function(e,t,a){return a.results.forEach((function(e){var t,a,r=null===(t=e.modifiedAt)||void 0===t?void 0:t.split("T")[0];e.modifiedAt=r.split("-").reverse().join("-"),e.CreatedBy=null===e||void 0===e||null===(a=e.createdByUserId)||void 0===a?void 0:a.firstName})),a},dataReceiveParams:{last_row:"totalResults",last_page:"totalPages",data:"results"},ajaxSorting:!0}),table.on("rowSelectionChanged",(function(e,t){(null===props||void 0===props?void 0:props.checkclick)&&props.checkclick(e)})),isCelLoaded||(cellClick(),isCelLoaded=!0),props.filter&&0!=Object.keys(props.filter).length&&table.setFilter(customfilter,props.filter);case 8:case"end":return _context.stop()}}),_callee)}))),[props.params]),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.Fragment,{children:[Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.a,{item:!0,xs:3,children:null!==props&&void 0!==props&&props.headerfilter&&null!==props&&void 0!==props&&props.headerfilter?Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.a,{style:{width:Object(app_utils_utils__WEBPACK_IMPORTED_MODULE_9__.b)()?"55%":"19.5%",padding:"8px"},children:Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.a,{control:Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.a,{onChange:props.columHeader}),label:app_utils_constantForms__WEBPACK_IMPORTED_MODULE_8__.zc,id:"headerFilter"})}):""}),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div",{id:props.divId})]})}},349:function(e,t,a){"use strict";a.r(t),a.d(t,"headerMenu",(function(){return _})),a.d(t,"HeaderContextMenu",(function(){return l}));var r=a(14),n=a(24),s=a(41),i=(a(345),a(341),a(20)),c=a(47),o=[{field:"Published",title:c.tc,sorter:"string",headerTooltip:!0,hozAlign:"left",className:"",headerMenu:l},{field:"Draft",title:c.Db,sorter:"string",headerTooltip:!0,hozAlign:"left",className:"",headerMenu:l},{field:"Archive",title:c.gb,sorter:"string",headerTooltip:!0,hozAlign:"left",className:"fa-regular fa-square",headerMenu:l}],_=function(){var e=[],t=this.getColumns(),a=document.createElement("span");a.textContent="Add or remove columns",a.className="header-class",a.style.cssText="pointer-events:none;font-size: 11px;font-weight: 700;",e.push({label:a,action:function(e){e.stopPropagation()}});var r,n=Object(s.a)(t);try{var i=function(){var t=r.value,a=document.createElement("i");a.classList.add(t.isVisible()?"fa-solid":"fa-regular"),a.classList.add(t.isVisible()?"fa-check-square":"fa-square");var n=document.createElement("span"),s=document.createElement("span");s.textContent=" "+t.getDefinition().title,n.appendChild(a),n.appendChild(s),t.getDefinition().title&&e.push({label:n,action:function(e){e.stopPropagation(),t.toggle(),t.isVisible()?(a.classList.remove("fa-regular"),a.classList.remove("fa-square"),a.classList.add("fa-solid"),a.classList.add("fa-check-square")):(a.classList.remove("fa-solid"),a.classList.remove("fa-check-square"),a.classList.add("fa-regular"),a.classList.add("fa-square"))}})};for(n.s();!(r=n.n()).done;)i()}catch(c){n.e(c)}finally{n.f()}return e},l=function(e,t){var a=[],c=o,_=document.createElement("p");_.textContent="Filter by status",_.style.cssText="pointer-events:none;font-size: 11px;font-weight: 700;",a.push({label:_,action:function(e){e.stopPropagation()}});var l,u=Object(s.a)(c);try{var p=function(){var s=l.value,c=document.createElement("i");c.classList.add(i.statusValues.includes(s.title)?"fa-solid":"fa-regular"),c.classList.add(i.statusValues.includes(s.title)?"fa-check-square":"fa-square");var o=document.createElement("p"),_=document.createElement("span");_.textContent=" "+s.title,o.appendChild(c),o.appendChild(_),o.style.cssText="font-size: 12px;",a.push({label:o,action:function(){var a=Object(n.a)(Object(r.a)().mark((function a(n){var o;return Object(r.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:n.stopPropagation(),"fa-solid fa-check-square"===c.classList.value?(c.classList.remove("fa-solid"),c.classList.remove("fa-check-square"),c.classList.add("fa-regular"),c.classList.add("fa-square"),(o=i.statusValues.indexOf(s.title))>-1&&i.statusValues.splice(o,1)):(c.classList.remove("fa-regular"),c.classList.remove("fa-square"),c.classList.add("fa-solid"),c.classList.add("fa-check-square"),!i.statusValues.includes(s.title)&&i.statusValues.push(s.title)),("profile"===t||"job"===t)&&e({limit:i.apiLimit200,page:i.apiPageNo1,status:0==i.statusValues.length?[""]:i.statusValues});case 3:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()})};for(u.s();!(l=u.n()).done;)p()}catch(b){u.e(b)}finally{u.f()}var d=document.createElement("div");return d.classList.add("contexList"),a.forEach((function(e){e.label.addEventListener("click",e.action),d.appendChild(e.label)})),d}},361:function(e,t,a){"use strict";var r=a(334);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a(335)),s=a(2),i=(0,n.default)((0,s.jsx)("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),"Add");t.default=i},424:function(e,t,a){"use strict";var r=a(4),n=a(7),s=a(1),i=a(8),c=a(101),o=a(327),_=a(6),l=a(16),u=a(356),p=a(148),d=a(2),b=["className","id"],O=Object(_.a)(o.a,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,t){return t.root}})({padding:"16px 24px",flex:"0 0 auto"}),f=s.forwardRef((function(e,t){var a=Object(l.a)({props:e,name:"MuiDialogTitle"}),o=a.className,_=a.id,f=Object(n.a)(a,b),m=a,j=function(e){var t=e.classes;return Object(c.a)({root:["root"]},u.b,t)}(m),v=s.useContext(p.a).titleId,h=void 0===v?_:v;return Object(d.jsx)(O,Object(r.a)({component:"h2",className:Object(i.a)(j.root,o),ownerState:m,ref:t,variant:"h6",id:null!=_?_:h},f))}));t.a=f},426:function(e,t,a){"use strict";var r=a(4),n=a(7),s=a(1),i=a(8),c=a(101),o=a(6),_=a(16),l=a(77),u=a(69);function p(e){return Object(u.a)("MuiCardContent",e)}Object(l.a)("MuiCardContent",["root"]);var d=a(2),b=["className","component"],O=Object(o.a)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(){return{padding:16,"&:last-child":{paddingBottom:24}}})),f=s.forwardRef((function(e,t){var a=Object(_.a)({props:e,name:"MuiCardContent"}),s=a.className,o=a.component,l=void 0===o?"div":o,u=Object(n.a)(a,b),f=Object(r.a)({},a,{component:l}),m=function(e){var t=e.classes;return Object(c.a)({root:["root"]},p,t)}(f);return Object(d.jsx)(O,Object(r.a)({as:l,className:Object(i.a)(m.root,s),ownerState:f,ref:t},u))}));t.a=f},427:function(e,t,a){"use strict";var r=a(7),n=a(4),s=a(1),i=a(8),c=a(101),o=a(6),_=a(16),l=a(77),u=a(69);function p(e){return Object(u.a)("MuiDialogActions",e)}Object(l.a)("MuiDialogActions",["root","spacing"]);var d=a(2),b=["className","disableSpacing"],O=Object(o.a)("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,!a.disableSpacing&&t.spacing]}})((function(e){var t=e.ownerState;return Object(n.a)({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},!t.disableSpacing&&{"& > :not(:first-of-type)":{marginLeft:8}})})),f=s.forwardRef((function(e,t){var a=Object(_.a)({props:e,name:"MuiDialogActions"}),s=a.className,o=a.disableSpacing,l=void 0!==o&&o,u=Object(r.a)(a,b),f=Object(n.a)({},a,{disableSpacing:l}),m=function(e){var t=e.classes,a={root:["root",!e.disableSpacing&&"spacing"]};return Object(c.a)(a,p,t)}(f);return Object(d.jsx)(O,Object(n.a)({className:Object(i.a)(m.root,s),ownerState:f,ref:t},u))}));t.a=f},731:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return N}));var r=a(5),n=a(13),s=a(14),i=a(24),c=a(9),o=a(1),_=a.n(o),l=a(125),u=a(190),p=a(92),d=a(78),b=a(348),O=a(267),f=a(284),m=a(331),j=a(427),v=a(504),h=a(424),E=a(328),P=a(194),g=a(324),x=a(272),D=a(426),C=a(361),k=a.n(C),T=a(158),M=a(142),A=a(47),I=a(20),w=a(2),L=Object(T.a)(E.a)((function(){return{position:"absolute",right:"2%",top:"1%"}}));function y(e){var t=function(){e.setOpen(!1)},a=Object(o.useState)(""),r=Object(c.a)(a,2),n=r[0],s=r[1],i=Object(o.useState)(!1),_=Object(c.a)(i,2),l=_[0],u=_[1];return Object(o.useEffect)((function(){var e=Object(I.localStorageUserRole)();s(e)}),[]),Object(o.useEffect)((function(){u("employer"===n)}),[n]),Object(w.jsxs)(w.Fragment,{children:[l?null:Object(w.jsxs)(O.a,{variant:"contained",onClick:function(){e.setOpen(!0),e.setCellData({name:"",description:""}),e.setReadOnly(!1)},children:[Object(w.jsx)(k.a,{fontSize:"small",style:{marginRight:"0.5rem"}})," ",A.k]}),Object(w.jsxs)(m.a,{open:e.open,onClose:t,children:[Object(w.jsx)(h.a,{children:e.readOnly?A.V:A.Q}),Object(w.jsx)(L,{onClick:t,children:Object(w.jsx)(P.a,{className:"icon",children:A.Nc})}),Object(w.jsx)(v.a,{children:Object(w.jsx)(g.a,{children:Object(w.jsx)(x.a,{children:Object(w.jsx)(D.a,{children:Object(w.jsxs)("form",{children:[Object(w.jsxs)(g.a,{container:!0,spacing:3,children:[Object(w.jsx)(g.a,{xs:12,sm:12,item:!0,children:Object(w.jsx)(f.a,{placeholder:A.Hd,onChange:e.handleInput,label:A.Ub,error:e.errors.name,helperText:e.errors.name,variant:"outlined",value:e.cellData.name,name:"name",fullWidth:!0,required:!0})}),Object(w.jsx)(g.a,{xs:12,sm:12,item:!0,children:Object(w.jsx)(f.a,{placeholder:A.vd,onChange:e.handleInput,label:A.Bb,variant:"outlined",multiline:!0,value:e.cellData.description,error:e.errors.description,helperText:e.errors.description,name:"description",InputProps:{},fullWidth:!0,required:!0})})]}),Object(w.jsx)(M.a,{loading:e.loading})]})})})})}),Object(w.jsx)(j.a,{children:Object(w.jsx)(O.a,{variant:"contained",onClick:e.readOnly?e.Updatehandle:e.handleSave,style:{backgroundColor:e.readOnly?"rgb(255, 158, 67)":"rgb(9, 182, 109)",color:e.readOnly?"#000000":"#ffffff"},children:e.readOnly?A.t:A.p})})]})]})}var R=a(347),S=a(349).headerMenu;function U(){var e=Object(o.useState)(!1),t=Object(c.a)(e,2),a=t[0],r=t[1];return Object(o.useEffect)((function(){var e=Object(I.localStorageUserRole)();r("employer"===e)}),[]),[{field:"action",resizable:!1,headerSort:!1,headerTooltip:!0,width:I.tableCheckIconColWidth,formatter:I.editIcon,visible:!a},{field:"name",title:A.dc,headerTooltip:!0,hozAlign:"left",sorter:"string",widthGrow:I.tableContentColGrow,headerMenu:S},{field:"organization.name",title:A.ic,headerTooltip:!0,hozAlign:"left",sorter:"string",widthGrow:I.tableContentColGrow,headerMenu:S},{field:"description",title:A.Bb,headerTooltip:!0,hozAlign:"left",sorter:"string",widthGrow:I.tableContentColGrow,headerMenu:S},{field:"isActive",title:A.db,headerTooltip:!0,hozAlign:"left",sorter:"string",widthGrow:I.tableContentColGrow,headerMenu:S},{headerTooltip:!0,field:"remove",width:I.tableCheckIconColWidth,resizable:!1,headerSort:!1,color:"primary",formatter:I.deleteIcon,visible:!a}]}var B=a(144),W=a(32),q=Object(l.a)(u.a)((function(){return{margin:"1rem"}}));function N(){var e,t,a=!1,l=_.a.useState(!1),u=Object(c.a)(l,2),O=u[0],f=u[1],m=Object(o.useState)(!1),j=Object(c.a)(m,2),v=j[0],h=j[1],E=Object(o.useState)(!1),P=Object(c.a)(E,2),g=P[0],x=P[1],D=Object(o.useState)(!1),C=Object(c.a)(D,2),k=C[0],T=C[1],L=Object(o.useState)(!1),S=Object(c.a)(L,2),N=S[0],K=S[1],F=Object(o.useState)(""),z=Object(c.a)(F,2),G=z[0],J=z[1],$=Object(o.useState)(""),V=Object(c.a)($,2),H=V[0],X=V[1],Q=Object(o.useState)([]),Z=Object(c.a)(Q,2),Y=Z[0],ee=(Z[1],Object(o.useState)([])),te=Object(c.a)(ee,2),ae=te[0],re=te[1],ne=Object(o.useState)({}),se=Object(c.a)(ne,2),ie=se[0],ce=se[1],oe=Object(o.useState)({name:"",description:""}),_e=Object(c.a)(oe,2),le=_e[0],ue=_e[1],pe=Object(o.useState)({limit:I.apiLimit200,page:I.apiPageNo1}),de=Object(c.a)(pe,2),be=de[0],Oe=de[1],fe=function(){K(!0)},me=function(){var e=Object(i.a)(Object(s.a)().mark((function e(){return Object(s.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:x(!0),Oe({limit:I.apiLimit200,page:I.apiPageNo1}),x(!1);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),je=function(){var e=Object(i.a)(Object(s.a)().mark((function e(t){return Object(s.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),Object.keys(le).some((function(e){return le[e]?a=!0:(J("Please enter "+e+" field."),X("info"),fe()),!le[e]})),!a){e.next=18;break}return x(!0),e.prev=4,e.next=7,Object(p.h)(Object(n.a)({},le));case 7:201===e.sent.payload.status&&(J(A.z),X("success"),fe(),x(!1),f(!1)),me(),e.next=18;break;case 12:e.prev=12,e.t0=e.catch(4),x(!1),J(e.t0.message),X("info"),fe();case 18:case"end":return e.stop()}}),e,null,[[4,12]])})));return function(t){return e.apply(this,arguments)}}(),ve=function(){var e=Object(i.a)(Object(s.a)().mark((function e(t){return Object(s.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),x(!0),e.prev=2,e.next=5,Object(p.g)(le.name,le.description,le.id);case 5:200===e.sent.payload.status&&(x(!1),J(A.B),X("success"),fe(),f(!1),me()),e.next=15;break;case 9:e.prev=9,e.t0=e.catch(2),x(!1),J(e.t0.message),X("info"),fe();case 15:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(t){return e.apply(this,arguments)}}(),he=function(){var e=Object(i.a)(Object(s.a)().mark((function e(t){return Object(s.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(p.e)(ie.cell.id);case 2:me(),h(!1),J(A.A),X("success"),fe();case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)(q,{children:Object(w.jsx)(y,{handleInput:function(a){e=a.target.name,t=a.target.value,ue(Object(n.a)(Object(n.a)({},le),{},Object(r.a)({},e,t))),re(Object(R.a)(e,t))},handleSave:je,Updatehandle:ve,errors:ae,cellData:le,setOpen:f,open:O,readOnly:k,loading:g,setCellData:ue,setReadOnly:T})}),Object(w.jsx)(q,{children:Object(w.jsx)(b.a,{divId:"jobRole",endpoint:W.a.JOBROLE_API,GetJobRole:me,params:be,tableData:Y,columns:U(),onCellClick:function(e){ue(e.cell),f(!0),T(!0)},DeleteData:function(e){!1===e.cell.isActive?(J(A.we),X("warning"),K(!0)):(h(!0),ce(e))}})}),Object(w.jsx)(B.a,{open:N,handle:function(e,t){"clickaway"!==t&&K(!1)},severity:H,Msg:G}),Object(w.jsx)(M.a,{loading:g}),Object(w.jsx)(d.e,{open:v,text:A.Qc,title:A.Sc,onConfirmDialogClose:function(){h(!1)},onYesClick:he})]})}}}]);
//# sourceMappingURL=36.3f5f935f.chunk.js.map