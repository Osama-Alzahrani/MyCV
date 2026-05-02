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

let prevAudioVolume = 1.0;
$("#audio").click(function () {
  $("#audio-settings").toggle();
  
});

$("#audio-changer").click(function () {
  const volume = $("#volumeControl").val();
  if (volume > 0) {
    prevAudioVolume = volume;
    audioVolumeChange(0);
    $("#volumeControl").val(0);
    $("#audio-changer").attr("src", "media/images/audio-volume-muted.png");
    $("#audio").attr("src", "media/images/audio-volume-muted-symbolic.svg");
  } else {
    audioVolumeChange(prevAudioVolume);
    $("#volumeControl").val(prevAudioVolume);
    $("#audio-changer").attr("src", "media/images/audio-volume-high.png");
    $("#audio").attr("src", "media/images/audio-volume-high-symbolic.svg");
  }
  
});
$("#volumeControl").change(function () {
  const volume = $(this).val();
  console.log(volume);
  if (volume <= 3) {
    $("#audio-changer").attr("src", "media/images/audio-volume-muted.png");
    $("#audio").attr("src", "media/images/audio-volume-muted-symbolic.svg");
  }else if (volume >= 100) {
    $("#audio-changer").attr("src", "media/images/audio-volume-high.png");
    $("#audio").attr("src", "media/images/audio-volume-high-symbolic.svg");
  }else if (volume >= 50) {
    $("#audio-changer").attr("src", "media/images/audio-volume-medium.png");
    $("#audio").attr("src", "media/images/audio-volume-medium-symbolic.svg");
    
  }else if (volume >= 3) {
    $("#audio-changer").attr("src", "media/images/audio-volume-low.png");
    $("#audio").attr("src", "media/images/audio-volume-low-symbolic.svg");
    
  }
  audioVolumeChange(volume);

});

function audioVolumeChange(volume) {
  // MOUSE_AUDIO.forEach((audio) => {
  //   audio.volume = volume / 100;
  // });
  openedGames.forEach(game => {
    game.instance.setVolume(volume / 100);
  });

}