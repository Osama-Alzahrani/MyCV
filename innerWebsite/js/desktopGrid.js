let WindowWidth = $(window).width();
let WindowHeight = $(window).height();
let clickedIcon;

for (let i = 0; i < (WindowHeight / WindowWidth) * 280 + 3; i++) {
    $(".desktop-grid").append('<div class="desktop-cell dropzone" id="cell-' + i + '"></div>');
}

// 1. Make each icon draggable
$(".desktop-icon").on("dragstart", function (event) {
    // Set the data transfer with the icon's ID
    event.originalEvent.dataTransfer.setData("text/plain", $(this).attr("id"));
});

// 2. Enable each cell as a drop zone
$(".dropzone").on("dragover", function (event) {
    // Prevent default to allow drop
    event.preventDefault();
});

$(".dropzone").on("drop", function (event) {
    event.preventDefault();
    let iconId = event.originalEvent.dataTransfer.getData("text/plain");
    let icon = $("#" + iconId);
    if (icon.length) {
        $(this).append(icon);
    }
});



$(".desktop-icon").click(function(e){
    e.preventDefault();
    $(this).css("background-color", 'rgba(135,206,250,0.5)');
    clickedIcon = $(this);
});


$(window).click(function(e) {
    //Hide the menus if visible
    target = $(e.target);
    // if (!target.is(clickedIcon)) { // Use .is() to compare correctly
    if(clickedIcon)
    if (!clickedIcon.is(e.target) && clickedIcon.has(e.target).length === 0){
        clickedIcon.css("background-color", "transparent");
    }
    
});