import mongoose from 'mongoose'
import timestamp from 'mongoose-timestamp'

const DhammaEventSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please fill Date!']
    },
    event_for: {
        type: String,
        required: [true, 'Please fill Event For!'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please fill Phone!'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Please fill Title!'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please fill Description!'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Please fill Address!'],
        trim: true
    },
    confirm: {
        type: Number,
        default: 0
    }
}, {
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

DhammaEventSchema.plugin(timestamp)

const DhammaEventModel = mongoose.model('DhammaEventModel', DhammaEventSchema)

export default DhammaEventModel;