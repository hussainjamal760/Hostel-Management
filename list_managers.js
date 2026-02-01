
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, 'apps/backend/.env') });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    role: String,
    isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function listManagers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const managers = await User.find({ role: 'MANAGER' }).select('name email username isActive');

        console.log('\n--- Managers ---');
        if (managers.length === 0) {
            console.log('No managers found.');
        } else {
            managers.forEach(m => {
                console.log(`Name: ${m.name}`);
                console.log(`Email: ${m.email}`);
                console.log(`Username: ${m.username}`);
                console.log(`Active: ${m.isActive}`);
                console.log('---');
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listManagers();
