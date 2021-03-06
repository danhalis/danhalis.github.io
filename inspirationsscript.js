let screens = [
    screen_1 = { currentIndex: 0 },
    screen_2 = { currentIndex: 0 }
]
let images = [
    "slided-img-1", 
    "slided-img-2"
];

for (let i = 0; i < images.length; i++)
{
    showSlide(screens[i], images[i]);
}

$(".prev-1").click(function() 
{
    changeSlide(-1, screens[0], images[0])
});

$(".next-1").click(function() 
{
    changeSlide(1, screens[0], images[0])
});

$(".prev-2").click(function() 
{
    changeSlide(-1, screens[1], images[1])
});

$(".next-2").click(function() 
{
    changeSlide(1, screens[1], images[1])
});

function changeSlide(step, targetScreen, imgToSlide) 
{
    targetScreen.currentIndex += step; // change current slide index //
    showSlide(targetScreen, imgToSlide); 
};

function updateSlideIndex1(newSlideIndex) 
{
    screens[0].currentIndex = newSlideIndex;
    showSlide(screens[0], images[0]);
};

function updateSlideIndex2(newSlideIndex) 
{
    screens[1].currentIndex = newSlideIndex;
    showSlide(screens[1], images[1]);
};

function showSlide(targetScreen, imgToSlide) {
    let targetImages = document.getElementsByClassName(imgToSlide);

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

    targetImages[targetScreen.currentIndex].style.display = "flex"; // show img at current index
};