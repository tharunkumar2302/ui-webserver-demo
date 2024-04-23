(this["webpackJsonpmatx-react"]=this["webpackJsonpmatx-react"]||[]).push([[46],{358:function(e,t,a){"use strict";a.d(t,"k",(function(){return i})),a.d(t,"i",(function(){return n})),a.d(t,"g",(function(){return d})),a.d(t,"e",(function(){return r})),a.d(t,"d",(function(){return l})),a.d(t,"j",(function(){return o})),a.d(t,"f",(function(){return u})),a.d(t,"h",(function(){return s})),a.d(t,"l",(function(){return c})),a.d(t,"a",(function(){return m})),a.d(t,"c",(function(){return y})),a.d(t,"b",(function(){return p}));var i=[{title:"equal",display:"Equal To"},{title:"greaterThan",display:"Greater Than"},{title:"lessThan",display:"Less Than"}],n=[{title:"Draft",display:"Draft"},{title:"Published",display:"Published"},{title:"Archived",display:"Archived"}],d=[{title:"Single",display:"Single"},{title:"Married",display:"Married"},{title:"Divorced",display:"Divorced"},{title:"Widowed",display:"Widowed"}],r=[{title:"M.Tech",display:"M.Tech"},{title:"MCA",display:"MCA"},{title:"B.Tech",display:"B.Tech"},{title:"BCA",display:"BCA"},{title:"BSc",display:"BSc"}],l=[{title:"Working",display:"Working"},{title:"Not Working",display:"Not Working"}],o=[{title:"Yes",display:"Yes"},{title:"No",display:"No"}],u=[{title:"Permanent",display:"Permanent"},{title:"Temporary",display:"Temporary"}],s=[{title:"Hyderabad",display:"Hyderabad"},{title:"Bangalore",display:"Bangalore"},{title:"Delhi",display:"Delhi"},{title:"Chennai",display:"Chennai"},{title:"Mumbai",display:"Mumbai"}],c=[{title:"today",display:"Today"},{title:"yesterday",display:"Yesterday"},{title:"week",display:"Last Week"},{title:"month",display:"Last Month"}],m=[{title:"Full Time",display:"Full Time"},{title:"Contract",display:"Contract"}],y=[{title:"Work from home",display:"Work From Home"},{title:"Work from office",display:"Work From Office"}],p=[{title:"6 months",display:"6 months"},{title:"9 months",display:"9 months"},{title:"12 months",display:"12 months"},{title:"Ongoing",display:"Ongoing"},{title:"Permanent",display:"Permanent"}]},689:function(e,t,a){"use strict";a.r(t);var i=a(14),n=a(24),d=a(9),r=a(5),l=a(6),o=a(263),u=a(33),s=a(324),c=a(272),m=a(386),y=a(152),p=a(20),b=a(47),h=a(139),j=a(1),f=a(463),v=a(464),O=a(17),g=a(358),S=a(2),x=Object(l.a)("div")((function(e){var t=e.theme;return Object(r.a)({margin:"30px"},t.breakpoints.down("sm"),{margin:"16px"})})),T=Object(l.a)("span")((function(){return{fontSize:"12px",fontWeight:"500",lineHeight:"1.5",whiteSpace:"normal",marginRight:".5rem",textTransform:"none",width:"50%",display:"inline-grid"}})),k=Object(l.a)(o.a)((function(){return{display:"inline-grid",width:"46%",height:"44px",alignContent:"center"}}));t.default=function(){var e=Object(O.m)(),t=Object(u.a)().palette,a=Object(j.useState)(),r=Object(d.a)(a,2),l=r[0],o=r[1],N=Object(j.useState)(p.defaultCalendarValue),R=Object(d.a)(N,2),C=R[0],w=R[1],W=Object(j.useState)(0),M=Object(d.a)(W,2),B=M[0],D=M[1],A=Object(j.useState)(0),P=Object(d.a)(A,2),Y=P[0],F=P[1],H=Object(j.useState)(0),L=Object(d.a)(H,2),U=L[0],E=L[1],q=Object(j.useState)(0),G=Object(d.a)(q,2),J=G[0],V=G[1],z=Object(j.useState)(0),I=Object(d.a)(z,2),K=I[0],Q=I[1],X=Object(j.useState)(0),Z=Object(d.a)(X,2),$=Z[0],_=Z[1],ee=Object(j.useState)(0),te=Object(d.a)(ee,2),ae=te[0],ie=te[1];Object(j.useEffect)((function(){"candidate"===localStorage.getItem("userRole")?e(p.candidateDashboardRoute):Object(y.b)().then((function(e){return o(null===e||void 0===e?void 0:e.payload)}))}),[]);var ne=function(){var e=Object(n.a)(Object(i.a)().mark((function e(t){return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:D(Number(null===t||void 0===t?void 0:t.totalResumes)),E(Number(null===t||void 0===t?void 0:t.notUpdatedResumes.moreThan1Year)),V(Number(null===t||void 0===t?void 0:t.notUpdatedResumes.moreThan30daysTo1Year)),F(Number(null===t||void 0===t?void 0:t.updatedResumes.inLast30Days)),ie(Number(null===t||void 0===t?void 0:t.deActivatedResumes)),"today"===C?(_(Number(null===t||void 0===t?void 0:t.uploadSummary.byCandidate.today)),Q(Number(null===t||void 0===t?void 0:t.uploadSummary.byRecruiter.today))):"yesterday"===C?(_(Number(null===t||void 0===t?void 0:t.uploadSummary.byCandidate.yesterday)),Q(Number(null===t||void 0===t?void 0:t.uploadSummary.byRecruiter.yesterday))):"week"===C?(_(Number(null===t||void 0===t?void 0:t.uploadSummary.byCandidate.week)),Q(Number(null===t||void 0===t?void 0:t.uploadSummary.byRecruiter.week))):"month"===C&&(_(Number(null===t||void 0===t?void 0:t.uploadSummary.byCandidate.month)),Q(Number(null===t||void 0===t?void 0:t.uploadSummary.byRecruiter.month)));case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();Object(j.useEffect)((function(){ne(l)}),[{calendarValue:C,dashboardDataGet:ne}]);return Object(S.jsx)(j.Fragment,{children:Object(S.jsx)(x,{className:"analytics",children:Object(S.jsxs)(s.a,{container:!0,spacing:3,children:[Object(S.jsx)(s.a,{item:!0,lg:8,md:8,sm:12,xs:12,children:Object(S.jsx)(v.a,{totalResumes:B,updatedResumes:Y,notUpdatedResumesMoreThan1Year:U,notUpdatedResumesMoreThan30daysTo1Year:J})}),Object(S.jsx)(s.a,{item:!0,lg:4,md:4,sm:12,xs:12,children:Object(S.jsxs)(c.a,{sx:{px:3,py:2,mb:3},children:[Object(S.jsx)(T,{children:b.T}),Object(S.jsx)(k,{id:"calendar",value:C,onChange:function(e){return function(e){w(e.target.value)}(e)},children:g.l.map((function(e){return Object(S.jsx)(m.a,{value:e.title,children:e.display})}))}),Object(S.jsx)(f.a,{height:p.doughnuHeight,width:Object(h.b)()?p.doughnutWidth:p.value100Per,color:[t.primary.main,t.success.main,t.error.main],deactivatedResumes:ae,uploadByRecruter:K,uploadByCandidate:$})]})})]})})})}}}]);
//# sourceMappingURL=46.abe72d5c.chunk.js.map