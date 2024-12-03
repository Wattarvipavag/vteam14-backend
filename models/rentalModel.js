import mongoose from 'mongoose';
const { Schema } = mongoose;

const rentalSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
    rentalStartTime: { type: Date, default: Date.now },
    rentalEndTime: { type: Date },
    totalCost: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
});

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
