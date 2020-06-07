let images = document.getElementsByClassName("img-to-display");

function PopUpImage() {
    document.querySelector("#popup").style.display = "flex";

    // Update the source //
    let imgToDisplay = document.querySelector("#popup-img img");
    imgToDisplay.src = this.src;
    imgToDisplay.alt = this.alt;

    // Fill caption //
    let popupCaption = document.querySelector("#popup-caption");
    popupCaption.innerHTML = this.nextElementSibling.innerHTML;
}

function CloseImage(event) {
    if (event.target.id === "close-button" || event.target.id === "popup")
    document.querySelector("#popup").style.display = "none";
}

for (const img of images) {
    img.addEventListener("click", PopUpImage);
}

// When the image is loaded ...
document.querySelector("#theImage").addEventListener("load", (event) => {
    // Setting the popup content always in the middle of the screen //
    let paddingTop = ((window.innerHeight - 50 - document.getElementById("popup-content").offsetHeight) / 2) + "px";
    document.querySelector("#popup").style.paddingTop = paddingTop;
});

document.querySelector("#popup").addEventListener("click", CloseImage)



