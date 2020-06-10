// localStorage.clear();

let images = document.getElementsByClassName("img-to-display");

function PopUpImage(event) {
    document.querySelector("#popup").style.display = "flex";

    // if this is just a single image
    if (event.currentTarget.parentNode.className != "bundle-of-img") {
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
    else {
        bundle = event.currentTarget.parentNode.children;

        let sliderWrap = document.getElementById("popup-img");
        for (const img of bundle) {
            sliderWrap.innerHTML += img.outerHTML;
        }

        // When the first image is loaded ...
        sliderWrap.children[0].addEventListener("load", CenterPopUp);

        sliderWrap.addEventListener("touchstart", ReadFirstTouch);
        sliderWrap.addEventListener("touchmove", ReadTouchMove);
        sliderWrap.addEventListener("touchend", ReadTouchEnd);
    }
}

let bundle = null;

let slider = {
    currentSlide: 0,
    firstTouchX: null,
    currentTouchX: null,
    moveVector: null,
    longTouch: null
}

function ReadFirstTouch(event) {
    // Test for flick //
    slider.longTouch = false;
    setTimeout(function() {
        slider.longTouch = true;
    }, 250);

    // Get X position of first touch //
    slider.firstTouchX = event.touches[0].clientX;
    console.log(slider.firstTouchX);
}

function ReadTouchMove(event) {
    // Get X position of current touch on screen //
    slider.currentTouchX = event.touches[0].clientX;

    // Get move vector: distance and direction //
    slider.moveVector = slider.firstTouchX - slider.currentTouchX;
}

function ReadTouchEnd() {
    let moveDistance = Math.abs(slider.moveVector);
    if (moveDistance > (document.getElementById("popup-content").offsetWidth / 3) || !slider.longTouch) {
        if (slider.moveVector > 0 && slider.currentSlide < bundle.length - 1) {
            slider.currentSlide++;
        }
        else {
            if (slider.moveVector < 0 && slider.currentSlide > 0) {
                slider.currentSlide--;
            }
        }
    }

    document.getElementById("popup-img").scrollTo(slider.currentSlide * document.getElementById("popup-content").offsetWidth, 0);
}

function CenterPopUp() {
    // Setting the popup content in the middle of the screen //
    let paddingTop = ((window.innerHeight - 50 - document.getElementById("popup-content").offsetHeight) / 2) + "px";
    document.querySelector("#popup").style.paddingTop = paddingTop;
}

function CloseImage(event) {
    if (event.target.id === "close-button" || event.target.id === "popup") {
        document.getElementById("popup-img").innerHTML = "";
        document.querySelector("#popup").style.display = "none";
    }
}

for (const img of images) {
    img.addEventListener("click", PopUpImage);
}

document.querySelector("#popup").addEventListener("click", CloseImage);