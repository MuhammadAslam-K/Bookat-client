import{j as e,r as m,Q as d}from"./index-fa6f2772.js";/* empty css               */function p(n){const{transactions:s}=n;function r(t){const i={year:"numeric",month:"long",day:"numeric"},a=new Date(t),c=a.toLocaleDateString("en-US",i),l=a.toLocaleTimeString("en-US");return`${c} ${l}`}const o=[{name:"Date",selector:t=>r(t.date)},{name:"Amount",selector:t=>t.amount},{name:"Status",cell:t=>e.jsx("p",{className:t.status==="Credited"?"text-green-600":"text-red-600",children:t.status})},{name:"Details",selector:t=>t.details}];return e.jsx("div",{className:"mt-10 w-10/12 lg:ms-32 ms-6 bg-white p-6 rounded-3xl shadow-2xl justify-center",children:e.jsx(m.Suspense,{children:e.jsx(d,{style:{zIndex:"-1"},columns:o,data:s,fixedHeader:!0,highlightOnHover:!0,pagination:!0})})})}export{p as default};
