const sendToken = (user,statusCode,res) => {
    //createing JWT token 
    const token = user.getjwtToken();

    //setting cookies
    const option = {
        expires:new Date(
            Date.now() + 7 * 24 * 60 * 1000
            ),
            httpOnly: true,
    }

    res.status(statusCode)
    .cookie('token',token,option)
    .json({
        message:true,
        token,
        user
    })
}

module.exports = sendToken;