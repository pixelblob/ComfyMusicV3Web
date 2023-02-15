fetch("/api/discord/me").then(req=>req.json()).then(data=>{
    var discordProfileCard = document.getElementById("discordProfileCard")
    var discordProfilePicture = document.getElementById("discordProfilePicture")
    var discordProfilePictureDecoration = document.getElementById("discordProfilePictureDecoration")
    var discordUserName = document.getElementById("discordUserName")

    discordProfilePicture.src=`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    discordProfilePictureDecoration.src=`https://cdn.discordapp.com/avatar-decorations//${data.id}/${data.avatar_decoration}.png`
    discordUserName.textContent=`${data.username}#${data.discriminator}`

    discordProfileCard.style.display="inline-block"
})