const { Payment } = require('./src/modules/payments/payment.model');
const { Student } = require('./src/modules/students/student.model');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function debugPayments() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const payments = await Payment.find().sort({ createdAt: -1 }).limit(10);
        console.log('--- Last 10 Payments ---');
        payments.forEach(p => {
            console.log(`ID: ${p._id}, StudentID: ${p.studentId}, Amount: ${p.amount}, Status: ${p.status}, Receipt: ${p.receiptNumber}, Month: ${p.month}`);
        });

        // Check if multiple payments share the same studentId for the same month
        const duplicates = await Payment.aggregate([
            { $group: { _id: { student: "$studentId", month: "$month", year: "$year" }, count: { $sum: 1 }, docs: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (duplicates.length > 0) {
            console.log('!!! DUPLICATE INVOICES FOUND !!!');
            console.log(JSON.stringify(duplicates, null, 2));
        } else {
            console.log('No duplicate monthly invoices found.');
        }

        // Check student count vs invoice count for current month
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Or target month if +1
        const invoices = await Payment.countDocuments({ month: currentMonth, year: today.getFullYear(), paymentType: 'RENT' });
        const students = await Student.countDocuments({ isActive: true });
        console.log(`Active Students: ${students}, Invoices for Month ${currentMonth}: ${invoices}`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

debugPayments();
