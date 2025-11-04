import config from "../config.js";
import AnnouncementModel from "../models/AnnouncementModel.js";
import { AnnounementCollection, AnnounementResource } from "../resource/AnnounementResource.js";
import errors from 'restify-errors'
import rjwt from 'restify-jwt-community';
import { convertMonthIndexToMonthString } from "../utils/convertMonthIndexToMonthString.js";
import applyThisMonthQuery from "../utils/applyThisMonthQuery.js";
import applyPaginate from "../utils/applyPaginate.js";

const route = (server) => {

    server.get('/api/set-announcement-always-show-true/:id',
        rjwt({ secret: config.JWT_SECRET }),
        async (req, res) => {
            console.log(req.params.id)
            try {
                await AnnouncementModel.updateMany({}, { $set: { always_show: 0 } });

                const announcement = await AnnouncementModel.findByIdAndUpdate({ _id: req.params.id }, { always_show: 1 })

                return res.send(200, AnnounementResource(announcement));
            } catch (err) {

                return res.send(500, { message: 'Server error' });
            }

        });

    server.get('/api/get-today-announcement', async (req, res) => {

        const today = new Date();

        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // check always_show true
        const alwaysShowAnnouncement = await AnnouncementModel.findOne({
            always_show: 1
        }).lean();

        if (alwaysShowAnnouncement) {
            res.send(200, AnnounementResource(alwaysShowAnnouncement))
        }

        const announcement = await AnnouncementModel.findOne({
            date: todayDate
        }).lean();

        res.send(200, AnnounementResource(announcement))
    });

    server.get('/api/get-announcement',
        rjwt({ secret: config.JWT_SECRET }),
        async (req, res) => {
            try {
                let filter = {};
                console.log(req.query)
                var year = req.query.year;
                var month = req.query.month;
                console.log('year here', year)
                console.log('month here', month)

                if (!year || !month) {
                    const date = new Date();
                    year = date.getFullYear();
                    month = convertMonthIndexToMonthString(date.getMonth());
                }

                const dateFilter = applyThisMonthQuery(year, month);

                if (dateFilter !== null) {
                    filter.date = dateFilter;
                }
                console.log(filter)

                const query = AnnouncementModel.find(filter).sort({ date: -1 });

                const baseQuery = AnnouncementModel;

                const [data, meta] = await applyPaginate(baseQuery, query, req);

                res.send(200, AnnounementCollection(data, meta));

            } catch (error) {
                console.log(error)
            }

        });

    server.post('/api/save-announcement', async (req, res) => {
        const model = new AnnouncementModel(req.body)

        await model.validate();

        const saved = await model.save();

        res.send(201, AnnounementResource(saved));
    });

    server.get('/api/get-announcement-detail/:id', async (req, res) => {
        const announcement = await AnnouncementModel.findById({ _id: req.params.id });

        res.send(200, AnnounementResource(announcement));
    });

    server.put('/api/update-announcement/:id', async (req, res) => {
        await AnnouncementModel.findByIdAndUpdate({ _id: req.params.id }, {
            date: req.body.date,
            announcement: req.body.announcement,
        })

        const updated = await AnnouncementModel.findById({_id: req.params.id})

        res.send(200, AnnounementResource(updated));
    });

    server.del('/api/delete-announcement/:id', async (req, res) => {

        await AnnouncementModel.findByIdAndDelete({ _id: req.params.id })

        res.send(200, true);
    });
}

export default route;