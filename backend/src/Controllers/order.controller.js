import Order from "../Models/order.model.js"

export const placeOrder = async (req,res) =>{
    try {
        const {items,shippingAddress,totalPrice} = req.body
        if(!items||(items.length === 0)||!shippingAddress||!totalPrice){
            return res.status(400).json({message:"All feilds are compulsory"})
        }
        const otp = Math.floor(100000+Math.random()*900000).toString();
        const order = new Order(
            {
                user:req.user._id,
                items,
                shippingAddress,
                paymentMethod:"Cash on delivery",
                deliveryOTP:{
                    code:otp,
                    expiredAt:new Date(Date.now() + 7*24*60*60*1000),
                    verified:false,        
                },
                totalPrice,
            }
        )
        const placedOrder = await order.save()
        res.status(200).json({message:"Your order placed successfully"})
    } catch (error) {
        console.log("error in placeOrder controller",error)
        res.status(500).json({message:"Internal server error"})        
    }
}

export const specificOrder = async(req,res)=>{
    try {
        if(!req.params.slug){
            return res.status(400).json({message:"order id is required"})
        }
        const order = await Order.find({ "shippingAddress.fullName":req.params.slug}).populate('user','name email').populate('items.product','name price')
        console.log(order)
        if(order.length === 0) return res.status(404).json({message:'Order not found'})
        res.json(order)
    } catch (error) {
        console.log("error in specificOrder controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const myOrder = async (req,res)=>{
    try {
        const order = await Order.find({user:req.user._id}).populate('items.product','name price').sort({createdAt:-1})
        if(order.length === 0) return res.status(404).json({message:"order not found"})
        res.status(200).json(order)
    } catch (error) {
        console.log("error in myOrder controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const allOrders = async (req,res)=>{
    try {
        const filter = {}
        const {query} = req.query
        if(query === 'pending'){
            filter.isDelivered = false;
        }
        else if(query === 'delivered'){
            filter.isDelivered = true;
        }
        else if(query ==='all'){
            
        }
        else{
            return res.status(400).json({message:"status is required"})
        }
        const order = await Order.find(filter).populate('user','name email').populate('items.product','name price').sort({createdAt:-1})
        if(order.length === 0){
            return res.status(404).json({message:"order not found"})
        }
        res.status(200).json(order)
    } catch (error) {
        console.log("error in allorders controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const verifyOTP = async (req,res)=>{
    try {
        const {deliveryOTP} = req.body
        if(!req.params.id){
            return res.status(400).json({message:"order id is required"})
        }
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        const now = new Date();
        if(!order.deliveryOTP||(order.deliveryOTP.code !== deliveryOTP)||(order.deliveryOTP.expiredAt < now)){
            return res.status(400).json({message:"Invalid or expired OTP"})
        }
        order.deliveryOTP.verified = true
        order.isDelivered = true
        order.deliveredAt = Date.now()
        order.isPaid = true
        order.paidAt = Date.now()
        await order.save();
        res.status(200).json({message:"order delivered and verified successfully"})
    } catch (error) {
        console.log("error in verify otp controller",error)
        res.status(500).json({message:"Internal server error"})        
    }
}

export const cancelOrder = async(req,res)=>{
    try {
        const {id} = req.params
        const {why} = req.body
        if(!id){
            return res.status(400).json({message:"Order id is required"})
        }
        if(!why){
            return res.status(400).json({message:"Order canceled reason is required"})
        }
        const order = await Order.findById(id)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        if(order.isDelivered || order.isPaid) return res.status(400).json({message:"you cannot cancel order after delivered/paid"})
        order.isOrderCanceled.isTrue = true;
        order.isOrderCanceled.why = why;
        await order.save()
        res.status(200).json({message:"Order canceled"})
    } catch (error) {
        console.log("error in cancelOrder controller",error)
        res.status(500).json({message:"Internal Server error"})
    }
}