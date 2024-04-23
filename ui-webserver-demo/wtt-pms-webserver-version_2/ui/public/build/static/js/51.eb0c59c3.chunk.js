(this["webpackJsonpmatx-react"]=this["webpackJsonpmatx-react"]||[]).push([[51],{730:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return C}));var i=a(5),r=a(6),n=a(267),c=a(136),o=a(328),l=a(194),s=a(7),d=a(4),b=a(1),j=a(8),u=a(101),h=a(320),p=a(15),m=a(16),x=a(77),O=a(69);function v(e){return Object(O.a)("MuiFab",e)}var f=Object(x.a)("MuiFab",["root","primary","secondary","extended","circular","focusVisible","disabled","colorInherit","sizeSmall","sizeMedium","sizeLarge","info","error","warning","success"]),g=a(2),y=["children","className","color","component","disabled","disableFocusRipple","focusVisibleClassName","size","variant"],w=Object(r.a)(h.a,{name:"MuiFab",slot:"Root",shouldForwardProp:function(e){return Object(r.b)(e)||"classes"===e},overridesResolver:function(e,t){var a=e.ownerState;return[t.root,t[a.variant],t["size".concat(Object(p.a)(a.size))],"inherit"===a.color&&t.colorInherit,t[Object(p.a)(a.size)],t[a.color]]}})((function(e){var t,a,r=e.theme,n=e.ownerState;return Object(d.a)({},r.typography.button,Object(i.a)({minHeight:36,transition:r.transitions.create(["background-color","box-shadow","border-color"],{duration:r.transitions.duration.short}),borderRadius:"50%",padding:0,minWidth:0,width:56,height:56,zIndex:(r.vars||r).zIndex.fab,boxShadow:(r.vars||r).shadows[6],"&:active":{boxShadow:(r.vars||r).shadows[12]},color:r.vars?r.vars.palette.text.primary:null==(t=(a=r.palette).getContrastText)?void 0:t.call(a,r.palette.grey[300]),backgroundColor:(r.vars||r).palette.grey[300],"&:hover":{backgroundColor:(r.vars||r).palette.grey.A100,"@media (hover: none)":{backgroundColor:(r.vars||r).palette.grey[300]},textDecoration:"none"}},"&.".concat(f.focusVisible),{boxShadow:(r.vars||r).shadows[6]}),"small"===n.size&&{width:40,height:40},"medium"===n.size&&{width:48,height:48},"extended"===n.variant&&{borderRadius:24,padding:"0 16px",width:"auto",minHeight:"auto",minWidth:48,height:48},"extended"===n.variant&&"small"===n.size&&{width:"auto",padding:"0 8px",borderRadius:17,minWidth:34,height:34},"extended"===n.variant&&"medium"===n.size&&{width:"auto",padding:"0 16px",borderRadius:20,minWidth:40,height:40},"inherit"===n.color&&{color:"inherit"})}),(function(e){var t=e.theme,a=e.ownerState;return Object(d.a)({},"inherit"!==a.color&&"default"!==a.color&&null!=(t.vars||t).palette[a.color]&&{color:(t.vars||t).palette[a.color].contrastText,backgroundColor:(t.vars||t).palette[a.color].main,"&:hover":{backgroundColor:(t.vars||t).palette[a.color].dark,"@media (hover: none)":{backgroundColor:(t.vars||t).palette[a.color].main}}})}),(function(e){var t=e.theme;return Object(i.a)({},"&.".concat(f.disabled),{color:(t.vars||t).palette.action.disabled,boxShadow:(t.vars||t).shadows[0],backgroundColor:(t.vars||t).palette.action.disabledBackground})})),N=b.forwardRef((function(e,t){var a=Object(m.a)({props:e,name:"MuiFab"}),i=a.children,r=a.className,n=a.color,c=void 0===n?"default":n,o=a.component,l=void 0===o?"button":o,b=a.disabled,h=void 0!==b&&b,x=a.disableFocusRipple,O=void 0!==x&&x,f=a.focusVisibleClassName,N=a.size,z=void 0===N?"large":N,k=a.variant,S=void 0===k?"circular":k,F=Object(s.a)(a,y),C=Object(d.a)({},a,{color:c,component:l,disabled:h,disableFocusRipple:O,size:z,variant:S}),D=function(e){var t=e.color,a=e.variant,i=e.classes,r=e.size,n={root:["root",a,"size".concat(Object(p.a)(r)),"inherit"===t?"colorInherit":t]},c=Object(u.a)(n,v,i);return Object(d.a)({},i,c)}(C);return Object(g.jsx)(w,Object(d.a)({className:Object(j.a)(D.root,r),component:l,disabled:h,focusRipple:!O,focusVisibleClassName:Object(j.a)(D.focusVisible,f),ownerState:C,ref:t},F,{classes:D,children:i}))})),z=a(78),k=a(47),S=Object(r.a)("div")((function(e){var t,a=e.theme;return t={margin:"30px"},Object(i.a)(t,a.breakpoints.down("sm"),{margin:"16px"}),Object(i.a)(t,"& .breadcrumb",Object(i.a)({marginBottom:"30px"},a.breakpoints.down("sm"),{marginBottom:"16px"})),Object(i.a)(t,"& .button",{margin:a.spacing(1)}),Object(i.a)(t,"& .input",{display:"none"}),t})),F=Object(r.a)(n.a)((function(e){return{margin:e.theme.spacing(1)}}));function C(){return Object(g.jsxs)(S,{children:[Object(g.jsx)(c.a,{className:"breadcrumb",children:Object(g.jsx)(z.a,{routeSegments:[{name:"Material",path:"/material"},{name:"Buttons"}]})}),Object(g.jsxs)(z.l,{title:"contained buttons",children:[Object(g.jsx)(F,{variant:"contained",color:"inherit",children:"Default"}),Object(g.jsx)(F,{variant:"contained",color:"primary",children:"Primary"}),Object(g.jsx)(F,{variant:"contained",color:"secondary",children:"Secondary"}),Object(g.jsx)(F,{variant:"contained",color:"secondary",disabled:!0,children:"Disabled"}),Object(g.jsx)(F,{variant:"contained",href:"#contained-buttons",children:"Link"}),Object(g.jsx)("input",{accept:"image/*",className:"input",id:"contained-button-file",multiple:!0,type:"file"}),Object(g.jsx)("label",{htmlFor:"contained-button-file",children:Object(g.jsx)(F,{variant:"contained",component:"span",children:k.u})})]}),Object(g.jsx)(c.a,{py:"12px"}),Object(g.jsxs)(z.l,{title:"text buttons",children:[Object(g.jsx)(F,{children:"Default"}),Object(g.jsx)(F,{color:"primary",children:"Primary"}),Object(g.jsx)(F,{color:"secondary",children:"Secondary"}),Object(g.jsx)(F,{disabled:!0,children:"Disabled"}),Object(g.jsx)(F,{href:"#text-buttons",children:"Link"}),Object(g.jsx)("input",{accept:"image/*",className:"input",id:"text-button-file",multiple:!0,type:"file"}),Object(g.jsx)("label",{htmlFor:"text-button-file",children:Object(g.jsx)(F,{component:"span",children:k.u})})]}),Object(g.jsx)(c.a,{py:"12px"}),Object(g.jsxs)(z.l,{title:"outlined buttons",children:[Object(g.jsx)(F,{variant:"outlined",children:"Default"}),Object(g.jsx)(F,{variant:"outlined",color:"primary",children:"Primary"}),Object(g.jsx)(F,{variant:"outlined",color:"secondary",children:"Secondary"}),Object(g.jsx)(F,{variant:"outlined",disabled:!0,children:"Disabled"}),Object(g.jsx)(F,{variant:"outlined",href:"#outlined-buttons",children:"Link"}),Object(g.jsx)("input",{accept:"image/*",className:"input",id:"outlined-button-file",multiple:!0,type:"file"}),Object(g.jsx)("label",{htmlFor:"outlined-button-file",children:Object(g.jsx)(F,{variant:"outlined",component:"span",children:k.u})}),Object(g.jsx)(F,{variant:"outlined",color:"inherit",children:"Inherit"})]}),Object(g.jsx)(c.a,{py:"12px"}),Object(g.jsxs)(z.l,{title:"icon buttons",children:[Object(g.jsx)(o.a,{className:"button","aria-label":"Delete",children:Object(g.jsx)(l.a,{children:"delete"})}),Object(g.jsx)(o.a,{className:"button","aria-label":"Delete",disabled:!0,color:"primary",children:Object(g.jsx)(l.a,{children:"delete"})}),Object(g.jsx)(o.a,{color:"secondary",className:"button","aria-label":"Add an alarm",children:Object(g.jsx)(l.a,{children:"alarm"})}),Object(g.jsx)(o.a,{color:"primary",className:"button","aria-label":"Add to shopping cart",children:Object(g.jsx)(l.a,{children:"add_shopping_cart"})}),Object(g.jsx)("input",{accept:"image/*",className:"input",id:"icon-button-file",type:"file"}),Object(g.jsx)("label",{htmlFor:"icon-button-file",children:Object(g.jsx)(o.a,{color:"primary",component:"span",className:"button","aria-label":"Upload picture",children:Object(g.jsx)(l.a,{children:"photo_camera"})})})]}),Object(g.jsx)(c.a,{py:"12px"}),Object(g.jsxs)(z.l,{title:"different size buttons",children:[Object(g.jsx)(N,{size:"small",color:"secondary","aria-label":"Add",className:"button",children:Object(g.jsx)(l.a,{children:"add"})}),Object(g.jsx)(N,{size:"medium",color:"secondary","aria-label":"Add",className:"button",children:Object(g.jsx)(l.a,{children:"add"})}),Object(g.jsx)(N,{color:"secondary","aria-label":"Add",className:"button",children:Object(g.jsx)(l.a,{children:"add"})})]}),Object(g.jsx)(c.a,{py:"12px"}),Object(g.jsxs)(z.l,{title:"outlined buttons",children:[Object(g.jsx)(N,{color:"primary","aria-label":"Add",className:"button",children:Object(g.jsx)(l.a,{children:"add"})}),Object(g.jsx)(N,{color:"secondary","aria-label":"Edit",className:"button",children:Object(g.jsx)(l.a,{children:"edit_icon"})}),Object(g.jsxs)(N,{variant:"extended","aria-label":"Delete",className:"button",children:[Object(g.jsx)(l.a,{sx:{mr:4},children:"navigation"}),"Extended"]}),Object(g.jsx)(N,{disabled:!0,"aria-label":"Delete",className:"button",children:Object(g.jsx)(l.a,{children:"delete"})})]})]})}}}]);
//# sourceMappingURL=51.eb0c59c3.chunk.js.map