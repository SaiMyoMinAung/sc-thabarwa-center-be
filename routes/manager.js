import errors from 'restify-errors'
import bcrypt from 'bcryptjs'
import authenticate from '../auth.js'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import ManagerModel from '../models/MangerModel.js'
import { ManagerResource } from '../resource/ManagerResource.js'

export default (server) => {

    server.post('/api/register-manager', async (req, res) => {
        try {
            const manager = new ManagerModel(req.body);

            // validate and return friendly message on failure
            try {
                await manager.validate();
            } catch (err) {
                if (err && err.name === 'ValidationError') {
                    const messages = Object.values(err.errors || {}).map(e => e.message);
                    res.send(400, {
                        code: 'InvalidContent',
                        message: messages.join(', ')
                    });
                }
                throw err;
            }

            // hash password (async)
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(manager.password, salt);
            manager.password = hash;

            const newManager = await manager.save();

            res.send(201, ManagerResource(newManager));

        } catch (err) {
            console.log('error', err);
            res.send(500, { message: 'Server error' });

        }
    });

    server.post('/api/manager-login', async (req, res) => {

        if (!(req.body?.email) || !(req.body?.password)) {
            throw new errors.InvalidContentError(`Please fill email and password`)
        }

        const { email, password } = req.body;

        const user = await authenticate(email, password)

        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
            expiresIn: '2400m'
        })

        const { iat, exp } = jwt.decode(token)

        res.send({ iat, exp, token })
    })
}