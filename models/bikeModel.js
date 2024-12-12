import mongoose from 'mongoose';
const { Schema } = mongoose;

const bikeSchema = new Schema({
    available: { type: Boolean, required: true, default: true },
    location: { type: Object, required: true, default: { long: '', lat: '' } },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    chargingStationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChargingStation' },
    parkingAreaId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingArea' },
    charge: { type: Number, required: true, default: 100 },
    speed: { type: Number, required: true, default: 0 },
});

const Bike = mongoose.model('Bike', bikeSchema);

export default Bike;
