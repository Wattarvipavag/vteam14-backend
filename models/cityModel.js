import mongoose from 'mongoose';
const { Schema } = mongoose;

const citySchema = new Schema({
    name: { type: String, required: true, unique: true },
    bikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bike' }],
    location: { type: Object, required: true, default: { long: '', lat: '' } },
    chargingStations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChargingStation' }],
    parkingAreas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingArea' }],
    allowedZones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AllowedZone' }],
    minuteRate: { type: Number, required: true, default: 2 },
    surcharge: { type: Number, required: true, default: 10 },
    discount: { type: Number, required: true, default: 10 },
});

const City = mongoose.model('City', citySchema);

export default City;
