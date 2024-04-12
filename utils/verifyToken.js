const jwt = require('jsonwebtoken')

// checking for validity of token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if(authHeader){
    const token = authHeader.split(' ')[1]
    const exp = jwt.decode(token).exp 
    if(!exp) return res.status(401).json({status: 'error', message: 'Token is invalid'})
    if (Date.now() >= exp * 1000) return res.status(401).json({status:'error', expired: true, message: 'Your session has expired'})
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if(err) return res.status(401).json({status: 'error', message: 'Token is invalid'})
      req.userId = user.userId
      next() 
    })
  }else{
    return res.status(401).json({status: 'error', message:'You are not authenticated!'})
  }
}

// Authorizing actions for verified users and admins
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.id === req.params.id){
      next()
    }else{
      res.status(403).json({status: 'error', message: 'Operation not allowed!'}) 
    }
  })
}

module.exports = {verifyToken, verifyTokenAndAuthorization}