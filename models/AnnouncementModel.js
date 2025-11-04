import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please fill Date!']
    },
    announcement: {
        type: String,
        required: [true, 'Please fill Announcement!']
    },
    always_show: {
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

const AnnouncementModel = mongoose.model('AnnouncementModel', AnnouncementSchema)

export default AnnouncementModel;

