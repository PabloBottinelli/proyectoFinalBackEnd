module.exports = function adm (req, res, next){
    const admin = true
    try{
        if(admin){
            next()
        }else{
            res.status(401).json({error: 'Acceso no permitido'})
        }
    }catch(err){
        res.status(500).json({error: 'Error en el servidor'})
    }
}

module.exports = function checkAuth (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}