/* ------------------ Logout -------------------- */

bannerUsuario() 

async function bannerUsuario() {
    const user = await buscarUsuario()
    const plantillaUser = await buscarPlantillaUsuario()
    const htmluser = armarHTMLuser(plantillaUser,user)
    document.getElementById('user').innerHTML = htmluser
}
function buscarPlantillaUsuario() {
    return fetch('/plantillas/logout-user.hbs')
    .then(respuesta3 => respuesta3.text())
}
function buscarUsuario() {
    return fetch('/login/user')
    .then(msjs => msjs.json())
}
function armarHTMLuser(plantillaUser,user) {
    const render = Handlebars.compile(plantillaUser,user);
    const html = render({ user })
    return html
}