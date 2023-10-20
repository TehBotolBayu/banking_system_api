const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    let token = req.headers.authorization

    if(!token) {
        return res.status(403).json({
            error: 'please provide a token'
        })
    }
    
    if(token.toLowerCase().startsWith("bearer")) {
        token = token.slice(6).trim()
    }

    const jwtPayLoad = jwt.verify(token, 'secret_key');

    if(!jwtPayLoad){
        return res.status(403).json({
            error: 'unauthenticated'
        })
    }

    res.user = jwtPayLoad

    next()
}

module.exports = checkToken