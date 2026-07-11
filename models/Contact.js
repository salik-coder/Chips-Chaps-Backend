const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,  // ✅ Admin ne dekha ya nahi
        },
        replied: {
            type: Boolean,
            default: false,  // ✅ Reply bheja ya nahi
        },
    },
    {
        timestamps: true,  // ✅ createdAt, updatedAt automatically add honge
    }
);

module.exports = mongoose.model("Contact", contactSchema);