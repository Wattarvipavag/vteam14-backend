import mongoose from 'mongoose';
const { Schema } = mongoose;

const allowedZoneSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: {
        type: Object,
        required: true,
        default: {
            topLeft: { long: '', lat: '' },
            topRight: { long: '', lat: '' },
            botLeft: { long: '', lat: '' },
            botRight: { long: '', lat: '' },
        },
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
});

const AllowedZone = mongoose.model('AllowedZone', allowedZoneSchema);

export default AllowedZone;
