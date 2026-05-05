

var openedApps = [];
var openedGames = [];

function addToRunningApps(id,icon){
    $("#running-apps").append(`
    <img class="app-running" name="${id}" src="./media/images/${icon}"/>
    `);
    // alert("Running");
}

function tryToRunApp(appid,isItDesktop,icon,name) {
    console.log(appid);
    console.log(isItDesktop,icon,"icon");

    



    $("body").css("cursor", "none");
    $("#cursor").show();

    
    setTimeout(function() {
        $("#"+appid).show();
        
        

        
        openedApps.push(appid);
        if(isItDesktop){
            addToRunningApps(appid,icon);
        }else{
            $(".taskbar-icon[name="+appid+"]").addClass("app-running");
            if (appid !== "myCV"){
                openGameInEmulator(appid,appid,icon,name);
                return;
            }
        }
        
        
    }, 900);
    setTimeout(function() {
        $("body").css("cursor", "default");
        $("#cursor").hide();
    }, 1000);
}

function getFileNameFromPath(fullPath) {
  // Find the last index of either '/' (Unix-like) or '\' (Windows)
  const lastSlashIndex = fullPath.lastIndexOf('/');
  const lastBackslashIndex = fullPath.lastIndexOf('\\');
  const lastSeparatorIndex = Math.max(lastSlashIndex, lastBackslashIndex);

  // Extract the substring after the last separator
  // If no separator is found, the entire path is considered the file name
  console.log(fullPath);
  if (lastSeparatorIndex === -1) {
    
    return fullPath;
  } else {
    return fullPath.substring(lastSeparatorIndex + 1);
  }
}


$(".desktop-icon").dblclick(function(){
    const appToRun = $(this).attr("run");
    const icon = $(this).find("img").attr("src");
    const name = $(this).attr("name");
    if (appToRun !== "myCV"){
        const game = $(this).attr("game");
        openGameInEmulator(appToRun,game,icon,name);
        return;
    }

    openApp(appToRun,true,icon,name);
});

function openGameInEmulator(appid,game,icon,name){
    // const emulatorBody = $("#GameEmulator #CV-main");

    const newApp = `
            <div id="${appid}" class="top-bar-app window active glass app" hidden icon="${icon}" style="position: absolute; top: 0;">
                <div id="dragger" class="title-bar" >
                    <div class="title-bar-text" style="display: flex; justify-items: center;"><img src="${icon}" width="16" style="margin-right: 5px;">${name}</div>
                    <div class="title-bar-controls">
                    <button aria-label="Minimize" class="hide-btn"></button>
                    <button aria-label="Maximize" class="maximize-btn"></button>
                    <button aria-label="Close" class="close-btn"></button>
                    </div>
                </div>
                <div id="CV-body" class="window-body glass" style="height: 90vh;">
                    <ul role="menubar">
                        <li role="menuitem" tabindex="0">File</li>
                        <li role="menuitem" tabindex="0">Edit</li>
                        <li role="menuitem" tabindex="0">View</li>
                        <li role="menuitem" tabindex="0">Help</li>
                        </ul>
                    <div class="CV-main">
                        <div id="dos" style="width: 100%; height: 100%"></div>
                    </div>
                </div>
        </div>
        `
    $("#dos-container").append(newApp);

    DargResizeHandler();

    const volume = $("#volumeControl").val() / 100;
    const gameDos = Dos($(`#${appid} #dos`)[0], {
        kiosk: true,
        autoStart: true,
        noCursor: true,
        url: `./${game}.jsdos`,
        volume: volume,
    });
    openedGames.push({id: appid, instance: gameDos});
    openApp(appid,true,icon,name);
}


// $(".").click(function(){
$(document).on('click','.taskbar-icon', function(e){
    console.log($(this).attr('name'));

    if($(this).hasClass("app-running"))
        return
    appName = $(this).attr('name');
    if(appName){
        openApp(appName,false,$(this).attr("src"));
    }
});

function openApp(appId,isItDesktop,icon,name){
    const app = $(`#${appId}`);

    if(app.is(":hidden") ) {
        if(!openedApps.includes(appId)){
            if(isItDesktop){
                tryToRunApp(appId,true,getFileNameFromPath(icon),name);
            }else{
                tryToRunApp(appId,false,getFileNameFromPath(icon),name);
            }

        }else{
            app.show();
        }
        
    }else{
        //TODO: Remove it
        console.log(app.length);
        
        if (app.length){
            alert("Error")
        }else{
            tryToRunApp(appId,isItDesktop,getFileNameFromPath(icon),name);
        }
    }
}

function setActiveWindow(id){
    openedApps.map(app=>{
        $("#"+app).removeClass("activeApp");
    });
    $("#"+id).addClass("activeApp");
    openedGames.map(game=>{
        if(game.id === id){
            game.instance.setPaused(false);
        }else{
            game.instance.setPaused(true);
        }
    });
}

$(document).on('click','.app-running', function(){
    const id = $(this).attr("name");
    console.log(openedApps);
    
    
    
    
    if($("#"+id).is(":hidden")){
        $("#"+id).toggle();
    }else if($("#"+id).hasClass("activeApp") && !$("#"+id).is(":hidden")){
        console.log("Hide");
        openedGames.map(game=>{
            game.instance.setPaused(true);            
        });
        $("#"+id).hide();
        return;
    } else

    if($("#"+id).hasClass("activeApp") && $("#"+id).is(":hidden")){
        $("#"+id).show();
    }
    setActiveWindow(id);
    // console.log("#"+id);
});



    

function removeFromRunningApps(id){
    openedGames.filter(game => {
        if(game.id === id){
            game.instance.stop();
        }
    });

    let app = $(".app-running[name="+id+"]");
    if(app.hasClass("taskbar-icon")){
        app.removeClass("app-running");
    }else{
        app.remove();
    }
    
    openedApps = openedApps.filter(item => item!== id);
}


// If page is loaded then run the app
$(function(){
    openApp('myCV',true,'cv.webp','myCV');
});



function startCrachApp(){


}

$("#crashApp").draggable({
    start: function(event, ui) {
        $(this).css("transform", "none");
        
        let left = ui.position.left - $(this).width() / 2;
        let top = ui.position.top - $(this).height() / 2;
        $(this).css({ left: left, top: top });
    },
    handle: $(".title-bar"),
    containment: $("#active-container")
});

$(".crashRun").click(function(){
   
    $("#crashApp_Icon").attr("src", $(this).children().first().attr("src"))
    const programName = $(this).children().last().text()
    $("#crashApp_title").text(programName)
    $("#crashBlue_title").text(programName + " has stopped working")
    
    $("body").css("cursor", "none");
    $("#cursor").show();

    setTimeout(function() {
        $("#crashApp").show();
    }, 1500);
})
function cancelCrashApp() {

    $("#crashApp").append('<div id="hangOverlay"></div>');
    $("#crashApp").draggable('disable');

    $("#hangOverlay").css({
        "position": "fixed",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "background": "rgba(255, 255, 255, 0.8)", // Semi-transparent white
        "z-index": "9999",
        "pointer-events": "none" // Prevents interaction but keeps UI visible
    });

    $("#progressBar").removeClass("marquee");

    setTimeout(function() {
        $("#hangOverlay").remove();
        $("#progressBar").addClass("marquee");
        $("#crashApp").removeAttr("style");
        $("#crashApp").hide();
        $("body").css("cursor", "default");
        $("#cursor").hide();
        $("#crashApp").draggable('enable');
        
    }, 1500);
    

}
