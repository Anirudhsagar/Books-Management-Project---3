const jwt = require("jsonwebtoken");




//*********************************************AUTHENTICATION************************************************************************

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionUp-plutonium-project-key")
        //req.decodedToken = decodedToken
        if (!decodedToken) {
            return res.status(403).send({ status: false, msg: "token is invalid" });
        }
        let bodyUserId = req.body.userId;
        if (bodyUserId) {
            if (bodyUserId != decodedToken.userId)
                return res.status(400).send({
                    status: false,
                    message: "Provided userId is not same as logined userId",
                });
            }

            next()
        } catch (err) {
            res.status(500).send({ status: false, msg: err.message })
        }
    }


//*********************************************AUTHORIZATION************************************************************************

const authorization = function (req, res, next) {
        try {
            let token = req.headers["x-api-key"];
            let decodedToken = jwt.verify(token, "functionUp-plutonium-project-key")
            let loggedInUserId = decodedToken.userId                                           //req.decodedToken.authorId
            let requestUserId = req.query.userId
            if (requestUserId != loggedInUserId) {
                return res.status(403).send({ status: false, message: "no permission" })
            }
            next()
        } catch (err) {
            res.status(500).send({ status: false, msg: err.message })
        }
    }




    module.exports.authorization = authorization
    module.exports.authentication = authentication