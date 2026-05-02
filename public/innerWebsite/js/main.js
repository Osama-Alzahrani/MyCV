window.addEventListener("click", (event) => {
  event.stopPropagation();

  startMouseSound();
  if (event.target.closest("#audio-settings")) return;
  if (event.target === $("#audio")[0]) return;
  $("#audio-settings").css("display", "none");
});

const KEYBOARD_AUDIO = Array.from(
  { length: 11 },
  (_, i) => new Audio(`media/audio/keyboard/keyboard_click-${i}.wav`)
);

function startKeyboardSound() {
  const rnd = Math.floor(Math.random() * 11);
  KEYBOARD_AUDIO[rnd].currentTime = 0; // Reset in case it's still playing
  KEYBOARD_AUDIO[rnd]
    .play()
    .catch((error) => console.error("Error playing sound:", error));
}
const MOUSE_AUDIO = Array.from(
  { length: 4 },
  (_, i) => new Audio(`media/audio/mouse/mouse_click-${i}.wav`)
);
function startMouseSound() {
  const rnd = Math.floor(Math.random() * 4);
  MOUSE_AUDIO[rnd].currentTime = 0; // Reset in case it's still playing
  MOUSE_AUDIO[rnd]
    .play()
    .catch((error) => console.error("Error playing sound:", error));
}

$("body").keyup(function (e) {
  startKeyboardSound();
});

DargResizeHandler();

$("#running-apps").sortable({
  axis: "x",
  activate: function (event, ui) {
    console.log($(ui.item[0]).css("box-shadow", "none"));
  },
  deactivate: function (event, ui) {
    console.log($(ui.item[0]).attr("style", ""));
  },
  containment: "parent",
});
function DargResizeHandler() {
  apps=["myCV","doom","digger"];
  $.each(apps,function(index,appId){
    console.log($(`#${appId} #active-container`));
    
    $(`#${appId}`).draggable({ handle: $(`#${appId} #dragger`), containment: $("#active-container") });
    // $(`#${appId}`).resizable({ containment: `#active-container` });
    $(function () {
      $(`#${appId}`).resizable({
        containment: `#active-container`,
        alsoResize: $(`#${appId} #CV-body`),
        minWidth: 300,
      });
    });
  });

}



loadDos();

async function loadDos() {
    await import("https://v8.js-dos.com/latest/js-dos.js");
}