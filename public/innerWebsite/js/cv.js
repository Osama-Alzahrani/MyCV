
    

    $(document).on("click",".hide-btn",function(e){
        e.stopPropagation();
        const app = $(this).closest('.app')
        app.hide();
        app.removeClass("activeApp");
        console.log(app);
        
        openedGames.map(game=>{
        if(game.id === app.attr('id')){
            console.log("Pausing",game.id);
            
            game.instance.setPaused(true);
        }
    });
    });
    $(document).on("click",".app",function(){
        setActiveWindow($(this).attr('id'));
    });

    let maximized = false;
    let CVPos;
    $(document).on("click",".maximize-btn",function(){
        
        // console.log(CVPos);
        const appId = $(this).closest('.app').attr('id');

        // console.log($(`#${appId} #CV-body`));
        
        
        if(!maximized){
            // CVPos= $("#myCV").position();
            $(`#${appId}`).css("width",$("#active-container")[0].clientWidth)
            $(`#${appId}`).css("height",$("#active-container")[0].clientHeight)
            $(`#${appId}`).css("box-shadow","none")
            $(`#${appId}`).css("top","0")
            $(`#${appId}`).css("left","0")
            $(`#${appId} #CV-body`).css("margin","0")
            $(`#${appId} #CV-body`).css("border-radius","0")
            // console.log($(`#${appId}`));
            $(`#${appId} #CV-body`).css("height","97%");
            $(`#${appId} #CV-body`).css("width","");
            $(`#${appId}`).resizable('disable');
            $(`#${appId}`).draggable('disable');
            maximized=true;
            
        }else{
            $(`#${appId}`).css("width","")
            $(`#${appId}`).css("height","")
            $(`#${appId} #CV-body`).css("margin","")
            $(`#${appId} #CV-body`).css("border-radius","")
            $(`#${appId}`).css("box-shadow","")
            // $(`#${appId}`).css("top",CVPos.top+"px")
            // $(`#${appId}`).css("left",CVPos.left+"px")
            $(`#${appId} #CV-body`).css("height","90vh");
            $(`#${appId}`).resizable('enable');
            $(`#${appId}`).draggable('enable');
            maximized=false;
        }

    });

    $(document).on("click",".close-btn",function() {
        
        const appId = $(this).closest('.app').attr('id');

        if($(this).closest('.app').attr('id') === "myCV"){

            $(`#${appId}`).hide();
        }else{
            $(`#${appId}`).remove();
        }
        removeFromRunningApps(appId);
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
            $("#CV-personal-info .CV-Title").get(0),
            $("#CV-Experience .CV-Title").get(0),
            $("#CV-Projects .CV-Title")[0],
            $("#CV-Education .CV-Title").get(0),
            $("#CV-Contact .CV-Title").get(0),
        ];

        // IntersectionObserver options
        var observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        };

        // Callback to run each time the observer sees a change
        function observerCallback(entries, observer) {
            $.each(entries, function(index, entry) {
            if (entry.isIntersecting) {
                
                // The ID of the intersecting section
                var sectionId = $(entry.target).attr('nav-id');
                

                var active = $("#"+sectionId+"_Nav");
                
                active.addClass('active-nav');
                
                // Remove active-nav from others
                $.each(sections, function(key, item) {
                    // console.log((item.id+"_Nav"));
                    // console.log(active[0].id);
                    const text = $(item).attr('nav-id');

                    if (text+"_Nav" !== active[0].id) {
                        $("#"+text+"_Nav").removeClass('active-nav');
                        
                    
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
        const currentShownTime = $("#task-bar-time").text()
        setTimeout(startTime, 1000);
        if(n === currentShownTime) return;
        
        
        $("#time-h").text(n.substring(0,2));
        $("#time-min").text(n.substring(3,5));
        $("#time-type").text(n.substring(6,8));
        $("#task-bar-time").text(n);
        
        
    }


    let Previewing = false;
    
    $(document).on("click", ".can-preview", function(){
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
        // console.log(e);
    });



    $(document).on("mouseleave", ".can-preview", function(){
        $("#image-previewer").remove();
        sameImage = null;
    });

async function populateCV() {
    try {
        const data = await fetchCV(1);

        $('#cv-window-title').text(`${data.name} CV`);
        $('#cv-name').text(data.name);
        $('#cv-name-menu').text(data.name);
        $('#cv-bio').html(`<b>${data.name}</b> is a <strong>${data.title}</strong>. ${data.bio}`);

        if (data.profileImage && Object.keys(data.profileImage).length > 0) {
            $('#cv-profile-img').attr('src', bytesToImageUrl(data.profileImage));
        }

        $('#cv-education-details').html(
            `<strong>${data.educationDegree}</strong>, ${data.educationUniversity}<br>
             GPA: ${data.educationGpa}<br>
             ${data.educationCoursework}`
        );

        const linkedinUsername = data.linkedin.split('/in/')[1]?.replace(/\/$/, '') || data.linkedin;
        $('#cv-linkedin').attr('href', data.linkedin).text(linkedinUsername);
        $('#cv-email').attr('href', `mailto:${data.email}`).text(data.email);
        $('#cv-address').text(data.address);

        if (data.coderhub) {
            $('#cv-coderhub').attr('href', data.coderhub).text(data.coderhub);
        } else {
            $('#cv-coderhub-row').hide();
        }

        const githubUsername = data.github.split('github.com/')[1]?.replace(/\/$/, '') || data.github;
        $('#cv-github').attr('href', data.github).text(githubUsername);

        const $list = $('#cv-projects-list');
        $list.empty();
        data.projects.forEach((project, i) => {
            if (i > 0) $list.append('<hr class="CV-Sperater">');
            $list.append(`
                <div>
                    <b>${project.title}</b><br />
                    <i>${project.technologies}</i><br />
                    ${project.description}
                    <p class="creation-date">${project.year}</p>
                    ${project.previewImage && Object.keys(project.previewImage).length > 0 ? `<img src="${bytesToImageUrl(project.previewImage)}" class="can-preview preview" loading="lazy" style="width:100%">` : ''}
                    ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank">View on GitHub</a>` : ''}
                </div>
            `);
        });
        $list.append(`
            <hr class="CV-Sperater">
            <div style="margin-bottom: 60px;">
                <b>Other Projects</b><br />
                Additional projects available on my <a href="${data.github}" target="_blank">GitHub</a>.
            </div>
        `);

    } catch (err) {
        console.error('Failed to load CV data:', err);
    }
}

populateCV();