import{r,l as g,j as t}from"./index-20cd5d80.js";/* empty css               */const j=d=>{const{rideId:o,role:a,handleChangeTheChatState:i}=d,[s,h]=r.useState(null),[u,x]=r.useState([]),[l,c]=r.useState("");r.useEffect(()=>{const e=g("https://bookat.fun/",{transports:["websocket"]});return h(e),e.on("connect",()=>{console.log("Connected to the Socket.IO server")}),e.emit("join-chat",o),e.on("chat-message",(n,m)=>{console.log("chat-message",n),n&&m==o&&x(n)}),()=>{s==null||s.disconnect(),e.disconnect()}},[]);const b=()=>{if(l.trim()!==""){const e={sender:a,content:l,timestamp:new Date};s==null||s.emit("update-chat-message",{rideId:o,message:e}),c("")}};return t.jsx(t.Fragment,{children:t.jsx("div",{className:"fixed inset-0 flex  justify-end h-screen z-50 bg-gray-700 bg-opacity-50",children:t.jsxs("div",{className:"bg-green-200 m-3 w-96 p-6 rounded-lg shadow-lg relative",children:[t.jsxs("div",{className:"flex border-b-2 border-b-gray-50 p-2  justify-between items-center ",children:[t.jsx("h2",{className:"text-xl font-bold",children:"Chat"}),t.jsx("h2",{className:"text-xl font-bold",children:a=="driver"?"Driver":"User"}),t.jsx("button",{className:"text-gray-500 hover:text-gray-700 focus:outline-none ",onClick:()=>i(),children:"Close"})]}),t.jsx("div",{className:"w-96  h-5/6 overflow-y-auto scrollbar-hide",children:u.map((e,n)=>t.jsx("div",{className:`mb-2 ${e.sender===a?"flex justify-end chat chat-end me-9":"flex justify-start chat chat-start"}`,children:t.jsx("div",{className:`p-2 chat-bubble  transition duration-300 ease-in-out text-black border rounded-xl ${e.sender==="driver"?" self-end chat chat-end":"self-start chat chat-start "} ${e.sender==a?"bg-green-400":"bg-gray-300"}`,children:e.content})},n))}),t.jsxs("div",{className:"absolute bottom-2 m-2 border-2 border-gray-300 rounded-xl left-0 right-0 flex items-center",children:[t.jsx("input",{type:"text",value:l,onChange:e=>c(e.target.value),className:"flex-1 p-2 border rounded-s-xl focus:outline-none",placeholder:"Type your message..."}),t.jsx("button",{onClick:b,className:"bg-blue-500 text-white p-2 rounded-r hover:bg-blue-700 focus:outline-none",children:"Send"})]})]})})})};export{j as default};
