const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// ✅ Contact form submit - Email bheje + Database mein save kare
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // 1️⃣ Database mein save karein
        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });
        await newContact.save();
        console.log(`📝 Contact saved: ${name} - ${subject}`);

        // 2️⃣ Email bhejein (aapko)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `New Contact Message: ${subject}`,
            html: `
                <h2>📩 New Contact Form Submission</h2>
                <p><strong>👤 Name:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>📌 Subject:</strong> ${subject}</p>
                <p><strong>💬 Message:</strong></p>
                <p style="background:#f5f5f5; padding:15px; border-radius:8px;">${message}</p>
                <hr>
                <p><small>✅ Saved in database with ID: ${newContact._id}</small></p>
                <p><small>📅 ${new Date().toLocaleString()}</small></p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${process.env.EMAIL_TO}`);

        res.json({
            success: true,
            message: "Message sent and saved successfully!",
            data: newContact,
        });
    } catch (error) {
        console.error("Contact error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
};

// ✅ Saare messages get karein (Admin ke liye)
const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Ek specific message get karein
const getMessageById = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Message ko "read" mark karein
const markAsRead = async (req, res) => {
    try {
        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Message delete karein
const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






module.exports = {
    submitContact,
    getMessages,
    getMessageById,
    markAsRead,
    deleteMessage,
};