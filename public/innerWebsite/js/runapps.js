

var openedApps = [];

function addToRunningApps(id,icon){
    $("#running-apps").append(`
    <img class="app-running" name="${id}" src="./media/images/${icon}"/>
    `);
    // alert("Running");
}

function tryToRunApp(elm,isItDesktop) {
    $("body").css("cursor", "none");
    $("#cursor").show();

    
    setTimeout(function() {
        $(elm).show();
        
        openedApps.push($(elm).attr('id'));
        if(isItDesktop){
            addToRunningApps($(elm).attr('id'),"cv.png");
        }else{
            $(".taskbar-icon[name=myCV]").addClass("app-running");
        }
        
        
    }, 900);
    setTimeout(function() {
        $("body").css("cursor", "default");
        $("#cursor").hide();
    }, 1000);
}

$(".desktop-icon").dblclick(function(){

    openApp(true);
});


// $(".").click(function(){
$(document).on('click','.taskbar-icon', function(e){
    console.log($(this).attr('name'));

    if($(this).hasClass("app-running"))
    return
    
    if($(this).attr('name') === "myCV"){
        openApp(false);
    }
});

function openApp(isItDesktop){
    if($("#myCV").is(":hidden") ) {
        if(!openedApps.includes("myCV")){
            if(isItDesktop){
                tryToRunApp($("#myCV"),true);
            }else{
                tryToRunApp($("#myCV"),false);
            }

        }else{
            $("#myCV").show();
        }
        
    }else{
        //TODO: Remove it
        alert("Error")
    }
}

$(document).on('click','.app-running', function(){
    const id = $(this).attr("name");
    $("#"+id).toggle();
    console.log("#"+id);
});



    

function removeFromRunningApps(id){
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
    openApp(true);
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
