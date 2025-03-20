
    

    $(".hide-btn").click(function(){
        $("#myCV").hide();
    });

    let maximized = false;
    let CVPos;
    $(".maximize-btn").click(function(){
        
        console.log(CVPos);
        
        
        if(!maximized){
            CVPos= $("#myCV").position();
            $("#myCV").css("width",$("#active-container")[0].clientWidth)
            $("#myCV").css("height",$("#active-container")[0].clientHeight)
            $("#myCV").css("left","0")
            $("#myCV").css("top","0")
            $("#myCV").css("box-shadow","none")
            $("#CV-body").css("margin","0")
            $("#CV-body").css("border-radius","0")
            console.log($("#myCV"));
            $("#CV-body").css("height","98%");
            $("#CV-body").css("width","");
            $("#myCV").resizable('disable');
            $("#myCV").draggable('disable');
            maximized=true;
            
        }else{
            $("#myCV").css("width","")
            $("#myCV").css("height","")
            $("#CV-body").css("margin","")
            $("#CV-body").css("border-radius","")
            $("#myCV").css("box-shadow","")
            $("#myCV").css("top",CVPos.top+"px")
            $("#myCV").css("left",CVPos.left+"px")
            $("#CV-body").css("height","90vh");
            $("#myCV").resizable('enable');
            $("#myCV").draggable('enable');
            maximized=false;
        }

    });

    $(".close-btn").click(function(){
        $("#myCV").hide();
        removeFromRunningApps("myCV");
    });

    $(".nav-list-item").click(function() {
        id = $(this).attr("id").split("_").reverse().pop()

        $("#"+id)[0].scrollIntoView({ behavior: "smooth", block: "nearest",inline:"nearest"});

    });

    $(function() {
        startTime()
        // Grab DOM elements (as arrays of raw nodes) via jQuery.
        // .get(0) or [0] fetches the actual DOM element from the jQuery object
        var sections = [
            $("#CV-personal-info").get(0),
            $("#CV-Education").get(0),
            $("#CV-Projects").get(0),
            $("#CV-Contact").get(0),
        ];

        // IntersectionObserver options
        var observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.7
        };

        // Callback to run each time the observer sees a change
        function observerCallback(entries, observer) {
            $.each(entries, function(index, entry) {
            if (entry.isIntersecting) {
                console.log(entry);
                
                // The ID of the intersecting section
                var sectionId = entry.target.id;

                var active = $("#"+sectionId+"_Nav");
                
                active.addClass('active-nav');
                
                // Remove active-nav from others
                $.each(sections, function(key, item) {
                    // console.log((item.id+"_Nav"));
                    // console.log(active[0].id);
                    
                if ((item.id+"_Nav") !== active[0].id) {
                    $("#"+item.id+"_Nav").removeClass('active-nav');
                    
                    
                }
                });
            }
            });
        }

        // Create the IntersectionObserver
        var observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe each section
        $.each(sections, function(index, section) {
            observer.observe(section);
        });



    });

    $(document).ready(function() {
        // Initialize the calendar using the jQuery plugin syntax
        $('#calendar').fullCalendar({
        // Put your options and callbacks here
        defaultView: 'month',
        contentHeight: 'auto',
        });
    });
    
    let startDate = new Date();
    
    $("#task-bar-date").text(startDate.toLocaleDateString("en-GB"));
    

    function startTime() {
        date = new Date();

        if(startDate.getDate() != date.getDate()){
            $("#task-bar-date").text(date.toLocaleDateString("en-GB"));
            startDate = date
        }

        let n = date.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
        });


        // $("#time").text(n);
        $("#time-h").text(n.substring(0,2));
        $("#time-min").text(n.substring(3,5));
        $("#time-type").text(n.substring(6,8));
        $("#task-bar-time").text(n);
        setTimeout(startTime, 1000);
        
    }


    let Previewing = false;
    
    $(".can-preview").click(function(){
        $(this).after("<div id='image-previewerr'><img src="+$(this).attr("src")+"></div>");
        Previewing = true;
    });

    $(document).on('click','#image-previewerr', function(e){
        if (e.target !== this)
            return;
        this.remove();
        Previewing = false;
    });

    $('body').keydown(function(e) {
        if (e.keyCode == 27) {
            if(Previewing){
                $("#image-previewerr").remove();
            }
            
        }
        console.log(e);
    });



    $(".can-preview").mouseleave(function(){
        $("#image-previewer").remove();
        sameImage = null;
    });