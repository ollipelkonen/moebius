const electron = require("electron");

function send(channel, opts) {
    electron.ipcRenderer.send(channel, {id: electron.remote.getCurrentWindow().getParentWindow().id, ...opts});
}

function send_parent(channel, opts) {
    electron.remote.getCurrentWindow().getParentWindow().send(channel, opts);
}

function ok() {
    send("close_modal");
}

function prefs() {
  const img = document.getElementById("reference_image");
  let values = {
    size: img?.style.backgroundSize,
    repeat: img?.style.backgroundRepeat,
    position: img?.style.backgroundPosition,
    positionX: img?.style.backgroundPositionX,
    positionY: img?.style.backgroundPositionY,
    transform: img?.transform
  };

  document.getElementById("reference_image_size").value = values.size && values.size != "" ? values.size : "100%"
  document.getElementById("reference_image_position_x").value = values.positionX && values.positionX != "" ? values.positionX : "0px";
  document.getElementById("reference_image_position_y").value = values.positionY && values.positionY != "" ? values.positionY : "0px";
  document.getElementById("reference_image_transform").value = values.transform && values.transform != "" ? values.transform : "rotate(0deg)"

  if ( values.position && values.position == "center" )
    document.getElementById("reference_image_centered").setAttribute("checked", true);

  if ( values.backgroundRepeat && values.backgroundRepeat == "repeat" )
    document.getElementById("reference_image_repeat").setAttribute("checked", true);
}


document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("ok").addEventListener("click", event => ok(), true);
    document.getElementById("reference_image_position_x").addEventListener("change", event => {
      document.getElementById("reference_image_centered").checked = false;
      send_parent("modify_reference_image", {name: "backgroundPositionX", value: event.target.value});
    }, true);
    document.getElementById("reference_image_position_x").addEventListener("keyup", event => {
      document.getElementById("reference_image_centered").checked = false;
      send_parent("modify_reference_image", {name: "backgroundPositionX", value: event.target.value});
    }, true);
    document.getElementById("reference_image_position_y").addEventListener("change", event => {
      document.getElementById("reference_image_centered").checked = false;
      send_parent("modify_reference_image", {name: "backgroundPositionY", value: event.target.value});
    }, true);
    document.getElementById("reference_image_position_y").addEventListener("keyup", event => {
      document.getElementById("reference_image_centered").checked = false;
      send_parent("modify_reference_image", {name: "backgroundPositionY", value: event.target.value});
    }, true);
    document.getElementById("reference_image_centered").addEventListener("change", event => {
      document.getElementById("reference_image_position_x").value = "center";
      document.getElementById("reference_image_position_y").value = "center";
      send_parent("modify_reference_image", {name: "backgroundPosition", value: "center"});
    }, true);
    document.getElementById("reference_image_repeat").addEventListener("change", event => {
      send_parent("modify_reference_image", {name: "backgroundRepeat", value: event.target.checked ? "repeat" : ""});
    }, true);
    document.getElementById("reference_image_size").addEventListener("change", event => {
      send_parent("modify_reference_image", {name: "backgroundSize", value: event.target.value});
    }, true);
    document.getElementById("reference_image_size").addEventListener("keyup", event => {
      send_parent("modify_reference_image", {name: "backgroundSize", value: event.target.value});
    }, true);
    document.getElementById("reference_image_transform").addEventListener("change", event => {
      send_parent("modify_reference_image", {name: "transform", value: event.target.value});
    }, true);
    document.getElementById("reference_image_transform").addEventListener("keyup", event => {
      send_parent("modify_reference_image", {name: "transform", value: event.target.value});
    }, true);

}, true);

document.addEventListener("keydown", (event) => {
    if (event.code == "Enter" || event.code == "Escape") {
        ok();
    }
}, true);

electron.ipcRenderer.on("ok", (event) => ok());
electron.ipcRenderer.on("prefs", (event, opts) => { event.returnValue=true; prefs(opts); } );

