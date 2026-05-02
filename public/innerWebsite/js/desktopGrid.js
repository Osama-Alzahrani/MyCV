
let WindowWidth = $(window).width();
let WindowHeight = $(window).height();
let clickedIcon;
let selectables = [];

// Make sort for index form selected index to fit the screen like if i drag doom so doom is first then the others
for (let i = 9; i < (WindowHeight / WindowWidth) * 280 + 3+9; i++) {
    $(".desktop-grid").append('<div class="desktop-cell dropzone" id="cell-' + i + '"></div>');
}

// 1. Make each icon draggable
$(".desktop-icon").on("dragstart", function (event) {
    // Set the data transfer with the icon's ID
    if ($(".intersected").length > 1) {
        console.log("Multiple selectables, not dragging single icon.");
        console.log($(".selectable").length);
        const selected = $(".selectable.intersected");
        const ids = selected.map((_, el) => el.id).get();
        // console.log($(".selectable"));
        
        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify(ids));
    }else{
        event.originalEvent.dataTransfer.setData("text/plain", $(this).attr("id"));
    }
    console.log($(this).attr("id"));
    
});

// 2. Enable each cell as a drop zone
$(".dropzone").on("dragover", function (event) {
    // Prevent default to allow drop
    event.preventDefault();
});

$(".dropzone").on("drop", function (event) {
    event.preventDefault();
    if ($(this).children().length > 0) {
        return; // Cell already occupied
    }
    const iconId = event.originalEvent.dataTransfer.getData("text/plain");
    if (iconId[0] === "[") {
        console.log("Multiple icons dropped.");
        
        let ids = null;
         try { 
            ids = JSON.parse(iconId); 
         } catch {
            console.error("Error parsing dropped data:", iconId);
            ids = []; 
        }
        let thisID = Number($(this).attr("id").split("-")[1]);
        console.log(ids,ids.length);
        if (ids.length > thisID) {
            thisID = ids.length;
        }
        let icon = $("#" + ids[0]);
        const AiconIDNum = Number(icon.closest(".desktop-cell").attr("id").split("-")[1]);
        console.log(AiconIDNum,thisID);
        
        const bigDiff = thisID - AiconIDNum;


        
        // console.log(min);
        
        for (let i = 0; i < ids.length; i++) {
            icon = $("#" + ids[i]);
            const iconIDNum = Number(icon.closest(".desktop-cell").attr("id").split("-")[1]);
            if (icon.length) {
                // if (bigDiff < 0){
                // console.log(thisID,ids.length);
                
                // if (thisID <= ids.length){
                    
                    // $("#cell-"+Math.abs(iconIDNum+bigDiff-2)).append(icon);
                    // console.log("#cell-"+Math.abs(iconIDNum+bigDiff));   
                    // console.log(Math.abs((iconIDNum+bigDiff)),i+1);
                    
                    // console.log("#cell2-"+Math.abs((iconIDNum+bigDiff-2)));   
                    // console.log("Location of Org #cell-"+Math.abs(iconIDNum));   
                // }else{
                if (iconIDNum+bigDiff === ids.length){
                    thisID = Number($(this).attr("id").split("-")[1]);
                    for (let j = i; j < ids.length; j++) {
                        icon = $("#" + ids[j]);
                        const iconIDNumInner = Number(icon.closest(".desktop-cell").attr("id").split("-")[1]);
                        $("#cell-"+Math.abs(iconIDNumInner+bigDiff+(thisID-ids.length))).append(icon);
                        console.log("#cell-"+Math.abs(iconIDNumInner+bigDiff+(thisID-ids.length)));  
                        
                    }
                    break;
                }
                    $("#cell-"+Math.abs(iconIDNum+bigDiff)).append(icon);
                    console.log("#cell-"+Math.abs(iconIDNum+bigDiff));   
                    // console.log("Location of Org #cell-"+Math.abs(iconIDNum));   
                // }


                // }else {
                //     $("#cell-"+Math.abs(iconIDNum-bigDiff)).append(icon);
                //     console.log("#cell-"+Math.abs(iconIDNum-bigDiff));   
                //     console.log("Location of Org #cell-"+Math.abs(iconIDNum));   
                //     continue;
                // }
                // $("#cell-"+Math.abs(iconIDNum+Math.abs(bigDiff))).append(icon);
                // console.log("#cell-"+Math.abs(iconIDNum+Math.abs(bigDiff)));   
                // console.log("Location of Org #cell-"+Math.abs(iconIDNum));   
            }
        };
        
    } else {
        let icon = $("#" + iconId);
        if (icon.length) {
            $(this).append(icon);
        }
        // console.log(selectables);
    }
    refreshSelectablePositions();
    
});

  // --- Init ---
//   for (let i = 0; i < 50; i++) {
//     $('<div>')
//       .addClass('selectable')
//       .css('background-color', `hsl(${Math.random() * 360}, 100%, 50%)`)
//       .appendTo('body');
//   }

  // --- Main ---
  
  const $selectableElems = $('.selectable');
  refreshSelectablePositions();
  function refreshSelectablePositions() {
    selectables = [];
    $selectableElems.each(function () {
        // console.log(this);
        
        const $el = $(this);
        const off = $el.offset(); // document coords (includes scroll)
        const width = $el.outerWidth();
        const height = $el.outerHeight();
        selectables.push({ x: off.left, y: off.top, width, height, $elem: $el });
        $el.attr('data-info', JSON.stringify({ x: off.left, y: off.top, width, height }));
    });
  }

  function checkSelected($selectAreaElem) {
    const off = $selectAreaElem.offset(); // document coords
    const width = $selectAreaElem.outerWidth();
    const height = $selectAreaElem.outerHeight();
    const r1 = { x: off.left, y: off.top, width, height };

    
    

    for (const s of selectables) {
      if (checkRectIntersection(r1, s)) {
        // console.log(s.$elem);
        s.$elem.addClass('intersected');
      } else {
        s.$elem.removeClass('intersected');
      }
    }
  }

  // stackoverflow.com/a/13390495
  function checkRectIntersection(r1, r2) {
    return !(
      r1.x + r1.width  < r2.x ||
      r2.x + r2.width  < r1.x ||
      r1.y + r1.height < r2.y ||
      r2.y + r2.height < r1.y
    );
  }

  $('.desktop-grid').on('pointerdown', function (event) { // stackoverflow.com/a/75902998
    
    const startX = event.pageX;
    const startY = event.pageY;
    
    // event.target 
    
    if ($(event.target).closest('.selectable').length > 0) {
        return; // don't start drag-select if clicking on a selectable
    }
    event.preventDefault();
    
    const $div = $('<div>')
      .addClass('drag-select')
      .css({
        position: 'absolute',
        width: 0,
        height: 0,
        left: startX + 'px',
        top: startY + 'px'
      })
      .appendTo('body');

    function resize(e) {
      const diffX = e.pageX - startX;
      const diffY = e.pageY - startY;

      $div.css({
        left: (diffX < 0 ? startX + diffX : startX) + 'px',
        top: (diffY < 0 ? startY + diffY : startY) + 'px',
        width: Math.abs(diffX) + 'px',
        height: Math.abs(diffY) + 'px'
      });

      checkSelected($div); // extra line 1
    }

    // extra line 2
    selectables.forEach(s => s.$elem.removeClass('intersected'));

    $(document).on('pointermove.dragSelect', resize);
    $(document).one('pointerup.dragSelect', function () {
      $(document).off('pointermove.dragSelect', resize);
      $div.remove();
    });
  });




$(".desktop-icon").click(function(e){
    e.preventDefault();
    $(".desktop-icon").css("background-color", "transparent");
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


