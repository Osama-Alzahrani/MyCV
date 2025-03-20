$("#showDesktop").click(function () {
  $("#myCV").hide();
});

// Start Menu
let isMenuVisible = false;

let startMenu = $("#start-menu");

$("#start-menu-button").click(function (e) {
  startMouseSound();
  e.stopPropagation();

  isMenuVisible = !isMenuVisible;
  startMenu.css("visibility", isMenuVisible ? "visible" : "hidden");
  $("#searchInput").focus();
  $("#searchInput").val("");
});

$(window).click(function (e) {
  //Hide the menus if visible
  if (!startMenu.is(e.target) && startMenu.has(e.target).length === 0) {
    isMenuVisible = false;
    startMenu.css("visibility", "hidden");
  }
});

//TODO: Maybe Remove it
const search = document.querySelector("#searchInput");
search.addEventListener("keyup", function (e) {
  const searchValue = search.value.toLowerCase();
  const appsList = document.querySelectorAll("#apps-list.app-icon");
});
