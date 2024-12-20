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

export async function getUserHistory(req, res) {
    try {
        const user = await User.findOne({ oauthId: req.params.id }).populate('rentalHistory');
        return res.status(201).json({ message: 'User History: ', user });
    } catch (e) {
        res.status(500).json({ message: `getUserHistory ${e.message}` });
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

export async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete({ _id: id });

        if (!user) {
            return res.status(404).json({ message: `No user found with id: ${id}` });
        }

        return res.status(200).json({ message: 'User deleted', user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function deleteCustomers(req, res) {
    try {
        const customers = await User.deleteMany({ role: 'customer' });

        if (!customers.deletedCount) {
            return res.status(404).json({ message: 'No customers found with role: customer' });
        }

        return res.status(200).json({ message: 'Customers deleted', customers });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function createUser(req, res) {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            profileImage: req.body.profileImage,
            oauthId: req.body.oauthId,
            balance: req.body.balance,
            role: req.body.role,
        });

        await newUser.save();
        return res.status(201).json({ message: 'User created', user: newUser });
    } catch (e) {
        res.status(500).json({ message: `createUser ${e.message}` });
    }
}
