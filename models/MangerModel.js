
import mongoose from 'mongoose'

const ManagerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

const ManagerModel = mongoose.model('ManagerModel', ManagerSchema);

export default ManagerModel;