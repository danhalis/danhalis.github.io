let tabletScreen = window.matchMedia("(min-width: 768px").matches;
let belowLaptopScreen = window.matchMedia("(max-width: 1024px)").matches;

let currentSlides = null;
let bundles = document.getElementsByClassName("bundle-of-img");

let dotsWrapper = document.getElementById("dots-wrapper");
let dots = null;

let bundle = null; // the bundle of images chosen //

if (bundles != null) {
    currentSlides = [0];
    for (let i = 0; i < bundles.length - 1; i++) {
        currentSlides.push(0);
    }    
}

let toolTips = document.getElementsByClassName("tool-tip");
let stackIcons = document.getElementsByClassName("stack-icon");

let navBar = document.getElementsByTagName("nav")[0];
let popup = document.getElementById("popup");

let navigatorArea = document.getElementsByClassName("navigator-area");
let prevButton = document.getElementById("to-left");
let nextButton = document.getElementById("to-right");
let navigatorButtonSize = null;

// global info about slider //
let slider = {
    bundleIndex: null,
    currentSlide: null,
    firstTouchX: null,
    currentTouchX: null,
    moveVector: null,
    longTouch: null
}

// Test if user's device is a touch screen //
let touchScreen = null;
try {  
    document.createEvent("TouchEvent");
    touchScreen = true; 
} 
catch (e) {  
    touchScreen = false; 
}  

function PopUpImage() {
    popup.style.display = "flex";
    popup.style.maxWidth = window.innerWidth + "px";

    // Relocate popup section (navBar becomes bigger on tablet or > ) //
    popup.style.top = navBar.offsetHeight + "px";

    // if this is just a single image
    if (this.parentNode.className === "img-wrapper") {
        // Update the source //
        document.getElementById("popup-img").innerHTML += "<img>";
        let imgToDisplay = document.querySelector("#popup-img img");
        imgToDisplay.src = this.previousElementSibling.previousElementSibling.src;
        imgToDisplay.alt = this.previousElementSibling.previousElementSibling.alt;

        if (!belowLaptopScreen) {
            imgToDisplay.parentNode.style.justifyContent = "center";
            imgToDisplay.style.maxHeight = window.innerHeight / 100 * 70 + "px";
            imgToDisplay.style.width = window.innerHeight / 100 * 70 + "px";
        }

        // When the image is loaded ...
        imgToDisplay.addEventListener("load", CenterPopUp);

        // if device is a tablet //
        if (tabletScreen) {
            // set height for caption to fit with the image //
            imgToDisplay.addEventListener("load", SetCaptionHeight);
        }

        // Fill caption //
        let popupCaption = document.querySelector("#popup-caption");
        popupCaption.innerHTML = this.previousElementSibling.innerHTML;
    }

    else {
        // if this is a video //
        if (this.parentNode.className === "video-wrapper") {
            // Update the source //
            document.getElementById("popup-img").innerHTML += "<video controls autoplay><source type='video/mp4'></video>"
            let videoToDisplay = document.querySelector("#popup-img video source");
            videoToDisplay.src = this.previousElementSibling.previousElementSibling.previousElementSibling.children[0].children[0].src;

            // Set video height suitable for viewport //
            if (belowLaptopScreen) {
                videoToDisplay.parentNode.style.maxHeight = window.innerHeight / 100 * 50 + "px";
            }
            else {
                // videoToDisplay.parentNode.style.width = window.innerWidth / 100 * 80 + "px";
                videoToDisplay.parentNode.style.maxHeight = "400px";
            }

            // When the video is loaded ...
            videoToDisplay.parentNode.addEventListener("loadeddata", CenterPopUp);

            // if device is a tablet //
            if (tabletScreen) {
                // set height for caption to fit with the image //
                videoToDisplay.parentNode.addEventListener("load", SetCaptionHeight);
            }

            // Fill caption //
            let popupCaption = document.querySelector("#popup-caption");
            popupCaption.innerHTML = this.previousElementSibling.innerHTML;
        }

        // if this is a bundle of images //
        else {
            let targetBundle = this.previousElementSibling.previousElementSibling.previousElementSibling;
            let caption = this.previousElementSibling.innerHTML;
    
            // Check index of this bundle //
            for (let i = 0; i < bundles.length; i++) {
                if (bundles[i] == targetBundle) {
                    slider.bundleIndex = i;
                }
            }
    
            // Check out its current slide //
            slider.currentSlide = currentSlides[slider.bundleIndex];
    
            // Get its children images //
            bundle = targetBundle.children;
    
            // Fill the slider with those images //
            let sliderWrap = document.getElementById("popup-img");
            for (const img of bundle) {
                sliderWrap.innerHTML += img.outerHTML;
            }
    
            // When the first image is loaded ...
            sliderWrap.children[0].addEventListener("load", CenterPopUp);
    
            // if device is a tablet //
            if (tabletScreen) {
                // set height for caption to fit with the image //
                sliderWrap.children[0].addEventListener("load", SetCaptionHeight);
            }
    
            // When all images are loaded ...
            sliderWrap.children[bundle.length - 1].addEventListener("load", function() {
                // Scroll to the current slide //
                ScrollImage();
            });
    
            // Fill caption //
            let popupCaption = document.querySelector("#popup-caption");
            popupCaption.innerHTML = caption;
    
            document.getElementById("slide-indicator").style.display = "flex";
            for (let i = 0; i < bundle.length; i++) {
                dotsWrapper.innerHTML += "<span class='dot'></span>"
            }
    
            dots = document.getElementsByClassName("dot");
    
            // Set suitable width for dots wrapper //
            dotsWrapper.style.width = (bundle.length * dots[0].offsetWidth + 5 * (bundle.length - 1)) + "px";
    
            // Highlight current slide //
            dots[slider.currentSlide].style.backgroundColor = "white";
    
            sliderWrap.addEventListener("touchstart", ReadFirstTouch);
            sliderWrap.addEventListener("touchmove", ReadTouchMove);
            sliderWrap.addEventListener("touchend", ReadTouchEnd);
    
            // Prevent scrolling on touchpad when on laptop //
            sliderWrap.addEventListener("mousewheel", function(event){
                event.preventDefault();
            });
    
            // if user's device is not a touch screen //
            if (!touchScreen) {   
                // When the first image is loaded ...
                sliderWrap.children[0].addEventListener("load", CenterNavigatorButtons);
    
                document.getElementById("popup-img-and-buttons").addEventListener("mouseover", DisplayNavigator);
                document.getElementById("popup-img-and-buttons").addEventListener("mouseout", HideNavigator);
            }
        }
    }
}

function CenterPopUp() {
    // Setting the popup content in the middle of the screen //
    let navBar = document.getElementsByTagName("nav")[0];
    let paddingTop = ((window.innerHeight - navBar.offsetHeight - document.getElementById("popup-content").offsetHeight) / 2) + "px";
    popup.style.paddingTop = paddingTop;
}

function SetCaptionHeight() {
    let forBorders = document.getElementById("for-borders");
    let captionBlock = document.getElementById("caption-block");
    let popupCaption = document.getElementById("popup-caption");
    let top = document.getElementById("top"); 
    let bottom = document.getElementById("bottom");
    let captionHeight = null;
    for (const paragraph of popupCaption.children) {
        captionHeight += paragraph.offsetHeight;
    }
    popupCaption.style.height = captionHeight + 25 + "px";
    popupCaption.style.maxHeight = (document.getElementById("popup-img").offsetHeight 
                                    + document.getElementById("slide-indicator").offsetHeight 
                                    - 2 * parseFloat(window.getComputedStyle(forBorders, null).getPropertyValue('row-gap')) 
                                    - parseFloat(window.getComputedStyle(captionBlock, null).getPropertyValue('padding-top')) 
                                    - parseFloat(window.getComputedStyle(captionBlock, null).getPropertyValue('padding-bottom')) 
                                    - top.offsetHeight
                                    - bottom.offsetHeight) + "px";
}

function ScrollImage() {
    let popupImage = document.getElementById("popup-img");
    let extraBorderWidth = parseFloat(window.getComputedStyle(popupImage, null).getPropertyValue('border-right-width'));

    popupImage.scrollTo(slider.currentSlide * (popupImage.offsetWidth - extraBorderWidth), 0);
    
    // Highlight current slide //
    dots[slider.currentSlide].style.backgroundColor = "white";
}


function ReadFirstTouch(event) {
    // Test for flick //
    slider.longTouch = false;
    setTimeout(function() {
        slider.longTouch = true;
    }, 250);

    // Get X position of first touch //
    slider.firstTouchX = event.touches[0].clientX;
}

let momentum = null;

function ReadTouchMove(event) {
    // Disable momentum while scrolling //
    event.preventDefault();

    // Get X position of current touch on screen //
    slider.currentTouchX = event.touches[0].clientX;

    // Get move vector: distance and direction //
    slider.moveVector = slider.firstTouchX - slider.currentTouchX;
}

function ReadTouchEnd() {
    let moveDistance = Math.abs(slider.moveVector);
    if (moveDistance > (document.getElementById("popup-img").offsetWidth / 6) || !slider.longTouch) {

        if (slider.moveVector > 0 && slider.currentSlide < bundle.length - 1) {
            // Turn off old slide //
            dots[slider.currentSlide].style.backgroundColor = "unset";

            slider.currentSlide++;
            currentSlides[slider.bundleIndex] = slider.currentSlide;

            // Scroll to new current slide //
            ScrollImage();
        }
        else {
            if (slider.moveVector < 0 && slider.currentSlide > 0) {
                // Turn off old slide //
                dots[slider.currentSlide].style.backgroundColor = "unset";

                slider.currentSlide--;
                currentSlides[slider.bundleIndex] = slider.currentSlide;

                // Scroll to new current slide //
                ScrollImage();
            }
        }
    }
}

function CenterNavigatorButtons() {
    let sliderWrap = document.getElementById("popup-img");

    // Make navigator area visible to get the buttons height //
    DisplayNavigator();

    if (navigatorButtonSize == null) {
        navigatorButtonSize = prevButton.offsetHeight;
    }

    if (prevButton.style.padding === "") {
        // Set button width with padding //
        prevButton.style.padding = "0 " + ((navigatorButtonSize - prevButton.offsetWidth) / 2) + "px";
        nextButton.style.padding = "0 " + ((navigatorButtonSize - nextButton.offsetWidth) / 2) + "px";
    }

    // Center the buttons //
    prevButton.style.top = (sliderWrap.offsetHeight / 2) - (navigatorButtonSize / 2) + "px";
    nextButton.style.top = (sliderWrap.offsetHeight / 2) - (navigatorButtonSize / 2) + "px";

    // After all the maths, hide the navigator area again //
    HideNavigator();
}

function DisplayNavigator() {
    for (const area of navigatorArea) {
        area.style.display = "flex";
    }
}

function HideNavigator() {
    for (const area of navigatorArea) {
        area.style.display = "none";
    }
}

function PrevButton() {
    if (slider.currentSlide > 0) {
        // Turn off old slide //
        dots[slider.currentSlide].style.backgroundColor = "unset";

        slider.currentSlide--;
        currentSlides[slider.bundleIndex] = slider.currentSlide;

        // Scroll to new curent slide //
        ScrollImage();
    }
}

function NextButton() {
    if (slider.currentSlide < bundle.length - 1) {
        // Turn off old slide //
        dots[slider.currentSlide].style.backgroundColor = "unset";

        slider.currentSlide++;
        currentSlides[slider.bundleIndex] = slider.currentSlide;

        // Scroll to new curent slide //
        ScrollImage();
    }
} 

function CloseImage(event) {
    if (event.target.id === "close-button" || event.target.id === "popup") {
        // Reset everything //
        if (!touchScreen) {
            document.getElementById("popup-img-and-buttons").removeEventListener("mouseover", DisplayNavigator);
            document.getElementById("popup-img-and-buttons").removeEventListener("mouseout", HideNavigator);
        }
        document.getElementById("popup-img").innerHTML = "";
        document.getElementById("popup-img").style.justifyContent = "unset";
        dotsWrapper.innerHTML = "";
        document.getElementById("slide-indicator").style.display = "none";
        popup.style.display = "none";
    }
}

function DisplayToolTip() {
    this.children[this.children.length - 1].style.display = "flex";
}

function HideToolTip() {
    this.children[this.children.length - 1].style.display = "none";
}

let imgWrapper = document.getElementsByClassName("img-wrapper");
for (const wrapper of imgWrapper) {
    wrapper.addEventListener("mouseover", DisplayToolTip);
    wrapper.addEventListener("mouseout", HideToolTip);
}

let bundleWrapper = document.getElementsByClassName("bundle-wrapper");
for (const wrapper of bundleWrapper) {
    wrapper.addEventListener("mouseover", DisplayToolTip);
    wrapper.addEventListener("mouseout", HideToolTip);
}

let videoWrapper = document.getElementsByClassName("video-wrapper");
for (const wrapper of videoWrapper) {
    wrapper.addEventListener("mouseover", DisplayToolTip);
    wrapper.addEventListener("mouseout", HideToolTip);

    if (parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('grid-template-rows')) < parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('grid-template-columns'))) {
        wrapper.style.height = parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('grid-template-columns')) + "px";
    }
}

for (const toolTip of toolTips) {
    toolTip.style.display = "none";
    toolTip.addEventListener("click", PopUpImage);
}

for (const icon of stackIcons) {
    icon.addEventListener("click", PopUpImage);
}

if (!touchScreen) {
    navigatorArea[0].addEventListener("click", PrevButton);
    navigatorArea[1].addEventListener("click", NextButton);
}

popup.addEventListener("click", CloseImage);