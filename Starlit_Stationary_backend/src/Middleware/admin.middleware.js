export const isAdmin = async(req,res,next) =>{
    try {
        const user = req.user.role
        const isadmin = (user === "admin")
        if(!isadmin){
            return res.status(401).json({message:"Only admin allowed"})
        }
        req.role = user
        next()
    } catch (error) {
        console.log("error in admin Middleware",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}