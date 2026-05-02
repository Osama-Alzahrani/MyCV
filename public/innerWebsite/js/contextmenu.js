const contextMenu = $("#running-apps-context");
let activeAppContextMenu;

$(document).on("click", function(e) {
    // e.preventDefault()
    if (e.target.offsetParent != contextMenu) {
    contextMenu.css({
        visibility: "hidden",
        width: ""
    });
  }
});


$(document).on('contextmenu','.app-running', function(e){
    e.preventDefault()
    activeAppContextMenu = e.target.name;
    const closeMenu = $(contextMenu).find('.close-window')
    closeMenu.show();
    closeMenu.attr("app-id",activeAppContextMenu);

    showContextMenu(e);
});

$(document).on('contextmenu','.taskbar-icon', function(e){
    activeAppContextMenu = e.target.name;
    console.log(activeAppContextMenu, e.target, "taskbar-icon");
    
    if(!$(this).hasClass('app-running')){
        $(contextMenu).find('.close-window').hide();
    }
    showContextMenu(e);
});

function showContextMenu(e){
    contextMenu.css({
        visibility: "visible",
        width: ""
      });
  
    const rect = e.target.getBoundingClientRect();  // get target bounding box
    const menuHeight = contextMenu[0].offsetHeight;    // the height of your context menu
    const menuWidth = contextMenu[0].offsetWidth;    // the height of your context menu

    contextMenu.css({
        top:  `${rect.top - menuHeight}px`,
        left: `${rect.left - menuWidth / 2}px`,
        width: "100%"
    });
}


$(".close-window").click(function(){
    const appId = $(this).attr("app-id");
    $(`#${appId}`).hide();
    removeFromRunningApps(appId);
});

$(".pin-app").click(function(){
    element = $(".app-running[name="+activeAppContextMenu+"]")
    taskbar = $(".taskbar-icon[name="+activeAppContextMenu+"]")
    
    console.log(element,taskbar,activeAppContextMenu);
    
    if(taskbar.length > 0){
        taskbar.removeClass("taskbar-icon");
        if(taskbar.hasClass("app-running")){
            $("#running-apps").append(element);
        }else{
            taskbar.remove();
        }
        
        return;
    }

    element.addClass("taskbar-icon");
    $("#pinned-apps").append(element);
});

$(".running-context-item").hover(function(){
    $(this).addClass("running-context-item-hover");
    }, function(){
    $(this).removeClass("running-context-item-hover");
  });