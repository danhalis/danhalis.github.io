let images = document.getElementsByClassName("img-to-display");
let closeButtons = document.getElementsByClassName("close-button");

function PopUpImage() {
    document.querySelector("#sketches-popup").style.display = "flex";
    let imgToDisplay = document.querySelector("#sketches-img div.popup-img img");
    imgToDisplay.src = this.src;
    imgToDisplay.alt = this.alt;
}

function CloseImage() {
    document.querySelector("#sketches-popup").style.display = "none";
}

for (const img of images) {
    img.addEventListener("click", PopUpImage);
}

for (const closeButton of closeButtons) {
    closeButton.addEventListener("click", CloseImage);
}



