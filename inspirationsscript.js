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

let screens = [
    screen_1 = { currentIndex: 0 },
    screen_2 = { currentIndex: 0 }
]
let images = [
    "slided-img-1", 
    "slided-img-2"
];
// let dots1 = "dot-1";
// let dots2 = "dot-2";

for (let i = 0; i < images.length; i++)
{
    showSlide(screens[i], images[i]/*, dots1*/);
}

$(".prev-1").click(function() 
{
    changeSlide(-1, screens[0], images[0]/*, dots1*/)
});

$(".next-1").click(function() 
{
    changeSlide(1, screens[0], images[0]/*, dots1*/)
});

$(".prev-2").click(function() 
{
    changeSlide(-1, screens[1], images[1]/*, dots2*/)
});

$(".next-2").click(function() 
{
    changeSlide(1, screens[1], images[1]/*, dots2*/)
});

function changeSlide(step, targetScreen, imgToSlide/*, dotsToChange*/) 
{
    targetScreen.currentIndex += step; // change current slide index //
    showSlide(targetScreen, imgToSlide/*, dotsToChange*/); 
};

function updateSlideIndex1(newSlideIndex) 
{
    screens[0].currentIndex = newSlideIndex;
    showSlide(screens[0], images[0]/*, dots2*/);
};

function updateSlideIndex2(newSlideIndex) 
{
    screens[1].currentIndex = newSlideIndex;
    showSlide(screens[1], images[1]/*, dots2*/);
};

function showSlide(targetScreen, imgToSlide/*, ddotsToChange*/) {
    let targetImages = document.getElementsByClassName(imgToSlide);
    // let dots = document.getElementsByClassName(ddotsToChange);

    // reset the index if overflow //
    if (targetScreen.currentIndex > targetImages.length-1)
        // surpass last index //
    {
        targetScreen.currentIndex = 0;
    }

    if (targetScreen.currentIndex < 0) 
        // before first index //
    {
        targetScreen.currentIndex = targetImages.length - 1;
    }

    for (let i = 0; i < targetImages.length; i++) // wipe out all imgs
    {
        targetImages[i].style.display = "none";
    }

    // for (let i = 0; i < dots.length; i++) // deactivate all dots
    // {
    //     dots[i].className = dots[i].className.replace(" active", "");
    // }

    targetImages[targetScreen.currentIndex].style.display = "flex"; // show img at current index
    // dots[dtargetSlide.currentIndex].className += " active"; // activate dot at current index
};