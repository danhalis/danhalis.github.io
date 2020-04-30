$(document).ready(function()
{
    let timesClicked = 0;

    $("#burger-menu-button").click(function()
    {
        timesClicked++;

        if (timesClicked%2==0) {
            $("#dropdown-content").css("display", "none");
        } else {
            $("#dropdown-content").css("display", "flex");
        }
    });

    // $("#see-more-button").click(function()
    // {
    //     $("#see-more-button").css("display", "none");
    //     $("#profile-info").css("height", "unset");
    //     $("#see-less-button").css("display", "flex");
    // });

    // $("#see-less-button").click(function()
    // {
    //     $("#see-less-button").css("display", "none");
    //     $("#profile-info").css("height", "160px");
    //     $("#see-more-button").css("display", "flex");
    // });
});

let slide1 = { currentIndex: 0}; 
let slide2 = { currentIndex: 0};
let slides1 = "img-slide-1";
// let dots1 = "dot-1";
let slides2 = "img-slide-2";
// let dots2 = "dot-2";

showSlide(slide1, slides1/*, dots1*/);
showSlide(slide2, slides2/*, dots2*/);

$(".prev-1").click(function() 
{
    changeSlide(-1, slide1, slides1/*, dots1*/)
});

$(".next-1").click(function() 
{
    changeSlide(1, slide1, slides1/*, dots1*/)
});

$(".prev-2").click(function() 
{
    changeSlide(-1, slide2, slides2/*, dots2*/)
});

$(".next-2").click(function() 
{
    changeSlide(1, slide2, slides2/*, dots2*/)
});

function changeSlide(step, targetSlide, slidesToChange/*, dotsToChange*/) 
{
    targetSlide.currentIndex += step; // change current slide index //
    showSlide(targetSlide, slidesToChange/*, dotsToChange*/); 
};

function updateSlideIndex1(newSlideIndex) 
{
    slide1.currentIndex = newSlideIndex;
    showSlide(slide1, slides1/*, dots2*/);
};

function updateSlideIndex2(newSlideIndex) 
{
    slide2.currentIndex = newSlideIndex;
    showSlide(slide2, slides2/*, dots2*/);
};

function showSlide(dtargetSlide, dslidesToChange/*, ddotsToChange*/) {
    let slides = document.getElementsByClassName(dslidesToChange);
    // let dots = document.getElementsByClassName(ddotsToChange);

    // reset the index if overflow //
    if (dtargetSlide.currentIndex > slides.length-1)
        // surpass last index //
    {
        dtargetSlide.currentIndex = 0;
    }

    if (dtargetSlide.currentIndex < 0) 
        // before first index //
    {
        dtargetSlide.currentIndex = slides.length-1;
    }

    for (let i = 0; i < slides.length; i++) // wipe out all imgs
    {
        slides[i].style.display = "none";
    }

    // for (let i = 0; i < dots.length; i++) // deactivate all dots
    // {
    //     dots[i].className = dots[i].className.replace(" active", "");
    // }

    slides[dtargetSlide.currentIndex].style.display = "flex"; // show img at current index
    // dots[dtargetSlide.currentIndex].className += " active"; // activate dot at current index
};