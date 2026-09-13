import { getHeaderTemplate } from "./template.js";

function init() {
    renderHeader();
   
}


function renderHeader() {
  document.getElementById("header").innerHTML = getHeaderTemplate();
}

init();