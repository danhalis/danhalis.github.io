let images = document.getElementsByClassName("img-to-display");
let closeButtons = document.getElementsByClassName("close-button");
let paddingTop = ((window.innerHeight - 50) / 15) + "px";

function PopUpImage() {
    document.querySelector("#sketches-popup").style.display = "flex";
    let imgToDisplay = document.querySelector("#sketches-img div.popup-img img");
    imgToDisplay.src = this.src;
    imgToDisplay.alt = this.alt;
    let popupCaption = document.querySelector("#popup-caption");
    popupCaption.innerHTML = this.nextElementSibling.innerHTML;
}

function CloseImage(event) {
    if (event.target.className === "close-button" || event.target.className === "popup")
    document.querySelector("#sketches-popup").style.display = "none";
}

for (const img of images) {
    img.addEventListener("click", PopUpImage);
}

document.querySelector("#sketches-popup").style.paddingTop = paddingTop;
document.querySelector("#sketches-popup").addEventListener("click", CloseImage)



