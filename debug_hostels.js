const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, 'apps/backend/.env') });

const hostelSchema = new mongoose.Schema({
    name: String,
    isActive: Boolean
});

const Hostel = mongoose.model('Hostel', hostelSchema);

async function listHostels() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const hostels = await Hostel.find({});

        console.log('\n--- Hostels ---');
        if (hostels.length === 0) {
            console.log('No hostels found.');
        } else {
            hostels.forEach(h => {
                console.log(`Name: ${h.name}`);
                console.log(`ID: ${h._id}`);
                console.log(`Active: ${h.isActive}`);
                console.log('---');
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listHostels();
