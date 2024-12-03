import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    oauthId: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    rentalHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rental' }],
    role: { type: String, required: true, default: 'customer' },
});

const User = mongoose.model('User', userSchema);

export default User;
