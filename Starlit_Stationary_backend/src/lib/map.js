import axios from "axios"

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2){
    const R = 6371
    const dLat = (lat2-lat1)*(Math.PI/180);
    const dLon = (lon2-lon1)*(Math.PI/180);
    const a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180))*Math.sin(dLon/2)*Math.sin(dLon/2)
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c
}

export const validateDistance = async(req,res,next)=>{
    try {
        const {address} = req.body.shippingAddress
        console.log(address+",Indore,Madhya Pradesh,India")
        const {data} = await axios(`https://nominatim.openstreetmap.org/search`,{
            params:{
                q:address+",Indore,Madhya Pradesh,India",
                format:'json',
                limit:1,
            },
            headers:{
                'User-Agent':'Starlit_Stationary/1.0/(rithik06062003@gmail.com)',
            },
        });
        if(!data.length){
            return res.status(400).json({message:"Invalid Address"})
        }
        const {lat,lon} = data[0];
        const distance = getDistanceFromLatLonInKm(process.env.FIXED_LAT,process.env.FIXED_LON,parseFloat(lat),parseFloat(lon))
        if(distance>15){
            return res.status(400).json({message:'Delivery area is out of 15km range'})
        }
        next();
    } catch (error) {
        console.log("error in map")
        res.status(500).json({message:"Internal Server error"})        
    }
};