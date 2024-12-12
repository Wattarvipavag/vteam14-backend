import mongoose from 'mongoose';
const { Schema } = mongoose;

const chargingStationSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: {
        type: Object,
        required: true,
        default: { long: '', lat: '', radius: 0 },
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    bikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bike' }],
});

const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

export default ChargingStation;
