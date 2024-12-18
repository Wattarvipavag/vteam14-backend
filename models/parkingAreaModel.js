import mongoose from 'mongoose';
const { Schema } = mongoose;

const parkingAreaSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: {
        type: Object,
        required: true,
        default: { long: '', lat: '', radius: 0 },
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    bikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bike' }],
    type: { type: String, default: 'Parkingarea' },
});

const ParkingArea = mongoose.model('ParkingArea', parkingAreaSchema);

export default ParkingArea;
