import User from '../models/userModel.js';

export async function loginUser(req, res) {
    try {
        const oauthId = req.body.oauthId;
        const user = await User.findOne({ oauthId });

        if (!user) {
            return registerUser(req, res);
        }

        res.status(200).json({ message: 'User already exists', user: user });
    } catch (e) {
        res.status(500).json({ message: `loginUser ${e.message}` });
    }
}

export async function registerUser(req, res) {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            profileImage: req.body.profileImage,
            oauthId: req.body.oauthId,
        });

        return res.status(200).json({ message: 'New user created', user: newUser });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
