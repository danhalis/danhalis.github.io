let currentSlides = null;
let bundles = document.getElementsByClassName("bundle-of-img");
let bundle = null; // the bundle chosen //

if (bundles != null) {
    currentSlides = [0];
    for (let i = 0; i < bundles.length - 1; i++) {
        currentSlides.push(0);
    }    
}

let images = document.getElementsByClassName("img-to-display");
let stackIcons = document.getElementsByClassName("stack-icon");

// global info about slider //
let slider = {
    bundleIndex: null,
    currentSlide: null,
    firstTouchX: null,
    currentTouchX: null,
    moveVector: null,
    longTouch: null
}

function PopUpImage() {
    document.querySelector("#popup").style.display = "flex";

    // if this is just a single image
    if (this.parentNode.className != "bundle-of-img" && this.previousElementSibling.className != "bundle-of-img") {
        // Update the source //
        document.getElementById("popup-img").innerHTML += "<img>";
        let imgToDisplay = document.querySelector("#popup-img img");
        imgToDisplay.src = this.src;
        imgToDisplay.alt = this.alt;

        // When the image is loaded ...
        imgToDisplay.addEventListener("load", CenterPopUp);

        // Fill caption //
        let popupCaption = document.querySelector("#popup-caption");
        popupCaption.innerHTML = this.nextElementSibling.innerHTML;
    }

    // if this is a bundle of images //
    else {
        let targetBundle = null;
        let caption = null;
        if (this.className.baseVal === "stack-icon") {
            targetBundle = this.previousElementSibling;
            caption = this.nextElementSibling.innerHTML;
        }
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

        // When all images are loaded ...
        sliderWrap.children[bundle.length - 1].addEventListener("load", function() {
            // Scroll to the current slide //
            document.getElementById("popup-img").scrollTo(slider.currentSlide * document.getElementById("popup-content").offsetWidth, 0);
        });

        // Fill caption //
        let popupCaption = document.querySelector("#popup-caption");
        popupCaption.innerHTML = caption;

        sliderWrap.addEventListener("touchstart", ReadFirstTouch);
        sliderWrap.addEventListener("touchmove", ReadTouchMove);
        sliderWrap.addEventListener("touchend", ReadTouchEnd);
    }
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
    if (moveDistance > (document.getElementById("popup-content").offsetWidth / 6) || !slider.longTouch) {
        if (slider.moveVector > 0 && slider.currentSlide < bundle.length - 1) {
            slider.currentSlide++;
        }
        else {
            if (slider.moveVector < 0 && slider.currentSlide > 0) {
                slider.currentSlide--;
            }
        }

        currentSlides[slider.bundleIndex] = slider.currentSlide;
    }

     // Scroll to the current slide //
    document.getElementById("popup-img").scrollTo(slider.currentSlide * document.getElementById("popup-content").offsetWidth, 0);
}

function CenterPopUp() {
    // Setting the popup content in the middle of the screen //
    let paddingTop = ((window.innerHeight - 50 - document.getElementById("popup-content").offsetHeight) / 2) + "px";
    document.querySelector("#popup").style.paddingTop = paddingTop;
}

function CloseImage(event) {
    if (event.target.id === "close-button" || event.target.id === "popup") {
        // Clear the popup //
        document.getElementById("popup-img").innerHTML = "";
        document.querySelector("#popup").style.display = "none";
    }
}

for (const img of images) {
    img.addEventListener("click", PopUpImage);
}

for (const icon of stackIcons) {
    icon.addEventListener("click", PopUpImage);
}

document.querySelector("#popup").addEventListener("click", CloseImage);