import axios from "axios"

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2){
    const R = 6371
    const dLat = (lat2-lat1)*(Math.PI/180);
    const dLon = (lon2-lon1)*(Math.PI/180);
    const a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180))*Math.sin(dLon/2)*Math.sin(dLon/2)
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c
}

export const validateDistance = async(req, res, next) => {
    try {
        const { address, postalCode } = req.body.shippingAddress;
        const fullAddress = `${address}, ${postalCode}, Indore, Madhya Pradesh, India`;

        const { data } = await axios(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: fullAddress,
                key: process.env.OPENCAGE_API_KEY,
                limit: 1,
                no_annotations: 1
            }
        });

        if (!data.results || data.results.length === 0) {
            return res.status(400).json({ message: "Invalid Address" });
        }

        const result = data.results[0];
        const { lat, lng } = result.geometry;
        const confidence = result.confidence;
        const components = result.components;

        if (confidence < 5 || components._type === 'city' || components._type === 'state') {
            return res.status(400).json({ message: "Invalid or incomplete address. Please provide a valid street or landmark name." });
        }

        const distance = getDistanceFromLatLonInKm(
            process.env.FIXED_LAT, 
            process.env.FIXED_LON, 
            parseFloat(lat), 
            parseFloat(lng)
        );

        if (distance > 15) {
            return res.status(400).json({ message: 'Delivery area is out of 15km range' });
        }
        
        next();
    } catch (error) {
        console.log("Error in map validation:", error.response?.data || error.message);
        res.status(500).json({ message: "Internal Server error" });        
    }
};