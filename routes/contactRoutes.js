const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");  // ✅ NAYA - Model import

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // 1️⃣ ✅ DATABASE MEIN SAVE KAREIN
        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });
        await newContact.save();
        console.log(`📝 Contact saved: ${name} - ${subject}`);

        // 2️⃣ ✅ EMAIL BHEJEIN
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
});

// ✅ GET - Saare messages dekhne ke liye (Admin)
router.get("/", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ DELETE - Message delete karne ke liye (Admin)
router.delete("/:id", async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ PUT - Message ko "Read" mark karein (Admin)
router.put("/:id/read", async (req, res) => {
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
});

module.exports = router;