import mongoose from 'mongoose';
const { Schema } = mongoose;

const allowedZoneSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: {
        type: Object,
        required: true,
        default: { topLeft: 0, topRight: 0, botLeft: 0, botRight: 0 },
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
});

const AllowedZone = mongoose.model('AllowedZone', allowedZoneSchema);

export default AllowedZone;
