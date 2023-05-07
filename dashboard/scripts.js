var musicQueue

window.onload = async function () {

    const response = await fetch("/api/test")
    const json = await response.json();
    var queue = json["716871605749416020"]
    musicQueue = queue
    updateQueue(queue)

    var socket = io();

    socket.on("queueUpdate", (queue) => {
        musicQueue = queue["716871605749416020"]
        console.log("QUEUE UPDATE!")
        console.log(queue["716871605749416020"])
        updateQueue(queue["716871605749416020"])
    })

    var video = document.querySelector('video');
    video.src = 'https://v3.pixelboop.net/api/video.mp4?' + new Date().getTime();

    var waitSeconds = 0

    video.onerror=function(err){
        console.log("VIDEO ERR")
        console.log(err)

        setTimeout(() => {
            video.src = 'https://v3.pixelboop.net/api/video.mp4?' + new Date().getTime();
            video.pause()
            video.load();
            video.play();
            waitSeconds+= 500
            console.log("WAIT TIME: "+waitSeconds)
        }, waitSeconds);

        

    }


    video.onplaying=function(){
        console.log("RESET WAIT")
        waitSeconds = 0
        video.style.display="block"
        
    }

}

var hide = false

var hideObjects = ["#discordOauthWrapper", "#header"]

var hidePref = []

document.onkeydown = function (e) {
    // use e.keyCode
    if (e.keyCode == 112) {
        e.preventDefault();
        hide = !hide
        if (hide) {
            console.log("HIDE!")
            hideObjects.forEach((selector,index)=>{
                var element = document.querySelector(selector)
                hidePref[index] = element.style.display
                element.style.display = "none"
            })
        } else {
            console.log("UNHIDE!")
            hideObjects.forEach((selector,index)=>{
                var element = document.querySelector(selector)
                element.style.display = hidePref[index]
            })
        }
    }
};

var lastSyncTime = new Date()

setInterval(() => {
    if (musicQueue && lastSyncTime) {
        console.log("SYNC!")

        var video = document.getElementById("backgroundVideo")
        var startRequest = new Date()
        fetch("/api/progress").then(req => req.json(req)).then(data => {
            var serverTime = data / 1000
            var requestTime = (new Date().getTime() - startRequest.getTime()) / 1000
            console.log("Server Time: " + serverTime)
            console.log("Video Time: " + video.currentTime)
            console.log("Difference: " + (serverTime - video.currentTime))
            console.log("Request Took: " + requestTime)

            console.log("CORECT: " + (serverTime + requestTime))

            video.currentTime = (serverTime + requestTime)

        })

    }
}, 5000);

var oldSong

var slideAnimation

var animationStartTime

var sliderSongs = []

async function updateDisplays(details) {
    console.log(details)

    //coverImage.src = queue.current.images[0].url

    document.getElementById("songName").textContent = details.name || details.title
    document.getElementById("artistName").textContent = details.authors ? details.authors.map(a => a.name).join(", ") : "Unknown"

    if (!document.body.style.backgroundImage && details.images) document.body.style.backgroundImage = `url(""), url("${details.images.find(i => i.height == 640).url}")`
    if (details.images) document.getElementById("coverImage").src = details.images.find(i => i.height == 64).url
    document.getElementById("songInfo").style.display = "block"
}

var imagesElms = [];

var cachedImages = []

async function updateQueue(queue, slide = true) {

    var cached = 0


    /* queue.queue.forEach(song => {
        var url = song.images.at(-1).url
        if (cachedImages.includes(url)) return
        cached++
        cachedImages.push(url)
    }) */

    var needToCache = []

    for (const song of queue.queue) {
        if (!song.images) continue;
        for (const image of song.images) {
            var url = image.url
            if (cachedImages.includes(url)) continue;
            cached++
            cachedImages.push(url)
            needToCache.push(url)
        }
    }

    preloadImages(needToCache)

    console.log(cachedImages.length)

    console.log("cached: " + cached)


    if (queue.spotifyUser) {
        var { discordId, spotifyId } = queue.spotifyUser
        document.getElementById("userId").textContent = spotifyId
        document.getElementById("discordId").textContent = discordId

        const response = await fetch("/api/discordUser/" + discordId)
        const json = await response.json();

        var { username, discriminator, avatar } = json

        document.getElementById("discordUserName").textContent = username
        document.getElementById("spotifyuserInfo").style.display = "block"
    } else {
        document.getElementById("spotifyuserInfo").style.display = "none"
    }

    if (queue.current) {

        var video = document.getElementById("backgroundVideo")
        if (queue.playbackDuration) video.currentTime = queue.playbackDuration / 1000

        //lastSyncTime = new Date()

        if (!document.body.style.backgroundImage) updateDisplays(queue.current)

        console.log(oldSong?.title != queue.current.title)

        if (/* oldSong &&  */oldSong?.title != queue.current.title) {
            sliderSongs.push(queue.current)

            setTimeout(() => {
                console.log("PLAY VIDEO!")
                var video = document.getElementById("backgroundVideo")
            video.src = 'https://v3.pixelboop.net/api/video.mp4?' + new Date().getTime();
            video.pause()
            video.load();
            video.play();
            if (queue.playbackDuration) video.currentTime = queue.playbackDuration / 1000

            video.classList.remove("anim")
            void video.offsetWidth;
            video.classList.add("anim")

            }, 2000);

            
            

            /* document.body.style.backgroundImage = `url("${oldSong.images.at(-1).url}"), url("${queue.current.images.at(-1).url}")`
            document.body.style.animation = ""
            void document.body.offsetWidth;
            document.body.style.animationDelay = ""
            document.body.style.animation = "mymove 5s forwards"
            if (slideAnimation) document.body.style.animationDelay = "-1s"
            animationStartTime = new Date()
            slideAnimation = setTimeout(() => {
                slideAnimation = null
                animationStartTime = null
            }, 5000); */
            if (slideAnimation || !slide) return
            function slide() {
                console.log(sliderSongs)
                var song = sliderSongs[0]
                var song2 = sliderSongs[1]
                if (!song || !song2) return slideAnimation = false
                sliderSongs.shift()
                console.log(queue)
                console.log(queue.currentIndex)
                //console.log(queue.queue.map(s => `url("${s.images.at(-1).url}")`).slice(queue.currentIndex, queue.currentIndex + 5).join(", "))
                var images = queue.queue.slice(queue.currentIndex, queue.currentIndex + 100)
                var index = 0

                console.log(imagesElms)

                images.forEach((img, index) => {
                    /* if (imagesElms.find(e=>e?.src==img.images.at(-1).url)) return
                    imagesElms[index] = new Image();
                    imagesElms[index].src = img.images.at(-1).url */

                })



                if (song.images) document.body.style.backgroundImage = `url("${song.images.find(i => i.height == 640).url}"), url("${song2.images.find(i => i.height == 640).url}")`
                document.body.style.animation = ""
                void document.body.offsetWidth;
                var seconds = 1 / (sliderSongs.length)
                console.log(`SPEED ${seconds}s`)
                document.body.style.animation = `mymove ${seconds}s forwards`
                updateDisplays(song2)
                //updateQueue(queue, false)
                setTimeout(slide, seconds * 1000)
            }
            slideAnimation = true
            setTimeout(slide, 1000)
        }
        oldSong = queue.current

    } else {
        document.getElementById("songInfo").style.display = "none"
        document.body.style.backgroundImage = ``
    }
}

function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function () {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}