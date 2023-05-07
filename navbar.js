fetch("/navbar.html").then(data => data.text().then(html => {
    //console.log(html)
    document.body.innerHTML += html

    var wrapper = document.getElementById("discordOauthWrapper")
    var children = Array.from(wrapper.children)
    children.forEach(child=>{
        if (document.location == child.href) child.classList.add("disabled")
    })
    var extra = document.getElementById("discordOauthWrapperExtra")
    if (extra) {
        console.log(extra)
        Array.from(extra.children).forEach(child=>{
            console.log(child)
            wrapper.appendChild(child)
        })
    }
}))