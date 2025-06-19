import mongoose, {Schema} from "mongoose";

export const deviceSchema = new Schema({

    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: String, required: true }

})


export const DeviceModel = mongoose.model('rateLimit', deviceSchema)