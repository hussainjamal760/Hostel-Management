
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env
dotenv.config({ path: path.join(__dirname, 'apps/backend/.env') });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, select: true }
});

const User = mongoose.model('User', userSchema);

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'lahore-585@hostelite.local';
        const newPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            console.log(`Password for ${email} has been reset to: ${newPassword}`);
        } else {
            console.log('User not found');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

resetPassword();
