import DhammaEventModel from '../models/DhammaEventModel.js'
import errors from 'restify-errors'
import { DhammaEventCollection, DhammaEventResource } from '../resource/DhammaEventResource.js'
import applyPaginate from '../utils/applyPaginate.js'
import applyThisMonthQuery from '../utils/applyThisMonthQuery.js'
import getDatesInRange from '../utils/getDatesInRange.js'

const route = (server) => {
    server.get('/api/get-calendar-data-detail/:date', async (req, res) => {
        try {
            const { date } = req.params || {};

            if (!date) return res.send(400, { message: 'date required' });

            // fetch events in the date
            const events = await DhammaEventModel.find({
                date
            }).sort({ date: 1 }).lean();

            if (!events || events.length === 0) return res.send(200, []);

            let breakfast = null;

            let lunch = null;

            events.forEach(e => {
                if (e.event_for === 'breakfast') {
                    breakfast = DhammaEventResource(e);
                } else if (e.event_for === 'lunch') {
                    lunch = DhammaEventResource(e);;
                }
            });

            const formatData = { [date]: { breakfast, lunch } };

            res.send(200, formatData);
        } catch (error) {
            console.log(error)
        }
    });

    // [
    //     {
    //         "2025-10-01": [
    //             {
    //                 "breakfast": {
    //                     "id": 1,
    //                     "name": "Breakfast Event"
    //                 }
    //             },
    //             {
    //                 "lunch": {
    //                     "id": 1,
    //                     "name": "Breakfast Event"
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         "2025-10-02": [
    //             {
    //                 "breakfast": {
    //                     "id": 1,
    //                     "name": "Breakfast Event"
    //                 }
    //             },
    //             {
    //                 "lunch": null
    //             }
    //         ]
    //     }
    // ]
    server.get('/api/calendar-data/:current_month', async (req, res) => {
        try {
            const { current_month } = req.params || {};
            if (!current_month) return res.send(400, { message: 'current_month required (format YYYY-MM)' });

            // accept "YYYY-MM" or "YYYY-M"
            const parts = current_month.split('-');
            const year = Number(parts[0]);
            const month = Number(parts[1]) - 1; // zero-based

            if (Number.isNaN(year) || Number.isNaN(month)) {
                return res.send(400, { message: 'current_month must be in format YYYY-MM' });
            }

            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0);

            const dateRange = getDatesInRange(start, end);

            const formatEvents = Object.fromEntries(
                dateRange.map(date => [date, { breakfast: null, lunch: null }])
            );

            console.log('result', formatEvents)

            // fetch events in the month
            const events = await DhammaEventModel.find({
                date: { $gte: start, $lt: end }
            }).sort({ date: 1 }).lean();

            if (!events || events.length === 0) return res.send(200, []);

            // determine all event types present in the month (keeps consistent order)
            // const eventTypes = Array.from(new Set(events.map(e => e.event_for))).sort();

            // console.log('eventTypes',eventTypes)

            events.forEach(e => {
                const dateKey = new Date(e.date).toISOString().slice(0, 10); // "YYYY-MM-DD"

                const payload = {
                    id: e.id || e._id,
                    name: e.title || null
                };

                formatEvents[dateKey][e.event_for] = payload;
            });

            // convert to array of objects sorted by date
            // const result = Object.keys(map).sort().map(dateKey => ({ [dateKey]: map[dateKey] }));

            res.send(200, formatEvents);

        } catch (error) {
            console.log(error)
        }
    });

    server.get('/api/get-donation-event', async (req, res) => {
        try {
            let filter = {};

            const { year, month } = req.query || {};
            console.log(year)
            const dateFilter = applyThisMonthQuery(year, month);

            if (dateFilter !== null) {
                filter.date = dateFilter;
            }
            console.log(filter)

            const query = DhammaEventModel.find(filter).sort({ date: -1 });

            const baseQuery = DhammaEventModel;

            const [data, meta] = await applyPaginate(baseQuery, query, req);

            res.send(200, DhammaEventCollection(data, meta));

        } catch (error) {
            console.log(error)
        }

    })

    server.post('/api/save-donation-event', async (req, res) => {
        try {
            const model = new DhammaEventModel(req.body)

            await model.validate();

            const saved = await model.save();

            res.send(201, DhammaEventResource(saved));

        } catch (err) {
            // custom-format mongoose validation errors to remove the
            // "DhammaEventModel validation failed: ..." prefix
            if (err && err.name === 'ValidationError') {

                const messages = Object.values(err.errors || {}).map(e => e.message);

                return res.send(400, {
                    code: 'InvalidContent',
                    message: messages.join(', ')
                });
            }

            throw new errors.InternalServerError(err);
        }
    })
}

export default route;