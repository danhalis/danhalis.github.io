// General rules for all pages //
document.body.style.maxWidth = window.innerWidth + "px";
let firstHeight = null;

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

    $("#see-more-button").click(function()
    {
        $("#see-more-button").css("display", "none");
        $("#profile-info").css("height", "unset");
        $("#see-less-button").css("display", "flex");
    });

    $("#see-less-button").click(function()
    {
        $("#see-less-button").css("display", "none");
        $("#profile-info").css("height", firstHeight);
        $("#see-more-button").css("display", "flex");
    });
});

let belowLaptopScreen = window.matchMedia("(max-width: 1024px").matches;

if (belowLaptopScreen) {
    let profileInfo = document.getElementById("profile-info");
    let profileHeading = document.getElementById("profile-heading");
    let firstParagraph = document.getElementById("first-p");

    firstHeight = parseFloat(window.getComputedStyle(profileInfo, null).getPropertyValue('padding-top'))
                               + parseFloat(window.getComputedStyle(profileInfo, null).getPropertyValue('padding-bottom')) 
                               + profileHeading.offsetHeight 
                               + parseFloat(window.getComputedStyle(profileHeading, null).getPropertyValue('margin-bottom')) 
                               + firstParagraph.offsetHeight + "px";
    profileInfo.style.height = firstHeight;
}