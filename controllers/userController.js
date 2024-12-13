import User from '../models/userModel.js';

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().exec();
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getUser(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: `No user found with ${userId}` });
        }

        return res.status(200).json({ message: 'User exists', user: user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getUserOauth(req, res) {
    try {
        const oauthId = req.params.id;
        const user = await User.findOne({ oauthId });

        if (!user) {
            return res.status(404).json({ message: `No user found with oauth id: ${oauthId}` });
        }

        return res.status(200).json({ message: 'User exists', user: user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function updateUser(req, res) {
    try {
        const id = req.params.id;
        const email = req.body.email;
        const balance = req.body.balance;
        const user = await User.findByIdAndUpdate({ _id: id }, { email, balance }, { new: true });

        if (!user) {
            return res.status(404).json({ message: `No user found with id: ${id}` });
        }

        return res.status(200).json({ message: 'User updated', user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}