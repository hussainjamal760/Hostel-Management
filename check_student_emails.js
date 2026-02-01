
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, 'apps/backend/.env') });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    role: String
});

const studentSchema = new mongoose.Schema({
    fullName: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

async function checkStudentEmails() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const students = await Student.find().populate('userId');

        console.log('\n--- Student Emails ---');
        if (students.length === 0) {
            console.log('No students found.');
        } else {
            students.forEach(s => {
                const user = s.userId;
                console.log(`Student: ${s.fullName}`);
                console.log(`User Email: ${user ? user.email : 'No User Linked'}`);
                console.log(`Username: ${user ? user.username : 'N/A'}`);
                console.log('---');
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkStudentEmails();
