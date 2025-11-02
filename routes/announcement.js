import AnnouncementModel from "../models/AnnouncementModel.js";
import { AnnounementResource } from "../resource/AnnounementResource.js";
import errors from 'restify-errors'

const route = (server) => {
    server.get('/api/get-announcement/:date', async (req, res) => {

        const { date } = req.params || {};

        if (!date) return res.send(400, { message: 'date required' });

        const announcement = await AnnouncementModel.findOne({
            date
        }).lean();

        if (announcement === null){
            throw new errors.NotFoundError('Not found data')
        }

        res.send(200, AnnounementResource(announcement))
    });

    server.post('/api/save-announcement', async (req, res) => {
        const model = new AnnouncementModel(req.body)

        await model.validate();

        const saved = await model.save();

        res.send(201, AnnounementResource(saved));
    });
}

export default route;