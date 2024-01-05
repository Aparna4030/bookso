
const isLoggedin = (req,res,next)=>{
    console.log('in middleware')
    if(req.session.userId){
        console.log('redirecting home')

        res.redirect("/")
    }else{
        console.log('not logged in, calling next')
        next();
    }
}
module.exports = {isLoggedin}