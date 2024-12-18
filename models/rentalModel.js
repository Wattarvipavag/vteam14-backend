import mongoose from 'mongoose';
const { Schema } = mongoose;

const rentalSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
        totalCost: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
        startLocation: { type: Object, required: true, default: { long: '', lat: '' } },
    },
    { timestamps: true }
);

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
