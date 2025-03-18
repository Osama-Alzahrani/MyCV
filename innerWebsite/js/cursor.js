const cursor = $("#cursor");
document.addEventListener('mousemove', (e) => {
    cursor.css({
        left:`${e.clientX}px`,
        top:`${e.clientY}px`
    })
});