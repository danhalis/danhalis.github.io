let tabletScreen = window.matchMedia("(min-width: 768px").matches;

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

let images = document.getElementsByClassName("img-to-display");
let stackIcons = document.getElementsByClassName("stack-icon");

let navBar = document.getElementsByTagName("nav")[0];
let popup = document.getElementById("popup");

let prevButton = document.getElementById("to-left");
let nextButton = document.getElementById("to-right");
let navigatorButtonWidth = null;
prevButton.addEventListener("click", PrevButton);
nextButton.addEventListener("click", NextButton);

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
    if (this.parentNode.className != "bundle-of-img" && this.className.baseVal != "stack-icon") {
        // Update the source //
        document.getElementById("popup-img").innerHTML += "<img>";
        let imgToDisplay = document.querySelector("#popup-img img");
        imgToDisplay.src = this.src;
        imgToDisplay.alt = this.alt;

        // When the image is loaded ...
        imgToDisplay.addEventListener("load", CenterPopUp);

        // if device is a tablet //
        if (tabletScreen) {
            // set height for caption to fit with the image //
            imgToDisplay.addEventListener("load", SetCaptionHeight);
        }

        // Fill caption //
        let popupCaption = document.querySelector("#popup-caption");
        popupCaption.innerHTML = this.nextElementSibling.innerHTML;
    }

    // if this is a bundle of images //
    else {
        let targetBundle = null;
        let caption = null;
        // if stack icon is clicked //
        if (this.className.baseVal === "stack-icon") {
            targetBundle = this.previousElementSibling;
            caption = this.nextElementSibling.innerHTML;
        }
        // if image is clicked //
        else {
            targetBundle = this.parentNode;
            caption = targetBundle.nextElementSibling.nextElementSibling.innerHTML;
        }

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

        if (!touchScreen) {   
            // Display img navigator buttons //
            prevButton.style.display = "flex";
            nextButton.style.display = "flex";

            if (navigatorButtonWidth == null) {
                navigatorButtonWidth = prevButton.offsetHeight;
                sliderWrap.children[0].addEventListener("load", CenterNavigatorButtons);
                prevButton.style.padding = "0 " + ((navigatorButtonWidth - prevButton.offsetWidth) / 2) + "px";
                nextButton.style.padding = "0 " + ((navigatorButtonWidth - nextButton.offsetWidth) / 2) + "px";
            }

            prevButton.style.display = "none";
            nextButton.style.display = "none";

            document.getElementById("popup-img-and-buttons").addEventListener("mouseover", DisplayNavigator);
            document.getElementById("popup-img-and-buttons").addEventListener("mouseout", HideNavigator);
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
    prevButton.style.top = (document.getElementById("popup-img").offsetHeight / 2) - (navigatorButtonWidth / 2) + "px";
    nextButton.style.top = (document.getElementById("popup-img").offsetHeight / 2) - (navigatorButtonWidth / 2) + "px";
}

function DisplayNavigator() {
    prevButton.style.display = "flex";
    nextButton.style.display = "flex";
}

function HideNavigator() {
    prevButton.style.display = "none";
    nextButton.style.display = "none";
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
        dotsWrapper.innerHTML = "";
        document.getElementById("slide-indicator").style.display = "none";
        popup.style.display = "none";
    }
}

for (const img of images) {
    img.addEventListener("click", PopUpImage);
}

for (const icon of stackIcons) {
    icon.addEventListener("click", PopUpImage);
}

popup.addEventListener("click", CloseImage);