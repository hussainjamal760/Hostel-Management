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

async function activateHostels() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Hostel.updateMany({}, { $set: { isActive: true } });
        console.log(`Updated active status for ${result.modifiedCount} hostels.`);

        // Verify
        const hostels = await Hostel.find({});
        console.log('\n--- Hostels Status ---');
        hostels.forEach(h => {
            console.log(`Name: ${h.name}, Active: ${h.isActive}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

activateHostels();
