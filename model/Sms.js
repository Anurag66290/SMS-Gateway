import mongoose from 'mongoose';

const {Schema} = mongoose;

const smsSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        enum: [
            'Airtel', 'JIO', 'VI'
        ],
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Sms = mongoose.model('Sms', smsSchema);

export default Sms;
