console.log("RUNNING GLOBAL SCRIPT")

var storedProfilePicture = localStorage.getItem("profile");

if (storedProfilePicture) setFavicon(storedProfilePicture)

console.log(storedProfilePicture)

fetch("/api/discord/me").then(req => req.json()).then(data => {
    var profilePicture = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    //localStorage.setItem("profile", profilePicture);
    //setFavicon(profilePicture)
})

function setFavicon(url) {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = "image/png"
        document.head.appendChild(link);
    }
    link.href = url;
}



document.addEventListener("DOMContentLoaded", () => {


    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.crossOrigin = 'Anonymous'
    img.src = storedProfilePicture;

    img.onload = function () {

        roundedImage(0, 0, img.width, img.height, 70);
        ctx.clip();

        ctx.drawImage(img, 0, 0);

        var image = canvas.toDataURL()

        document.querySelector("link[rel~='icon']").setAttribute('href', image);

    }

    function roundedImage(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

});

