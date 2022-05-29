const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        phone: { type: String, required: true },
        name: { type: String, required: false, unique: true },
        activated: { type: Boolean, required: false, default: false },
        userId: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);