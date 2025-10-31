import mongoose from 'mongoose';
import ManagerModel from './models/MangerModel.js';
import bcrypt from 'bcryptjs';

const authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {

        if (!email || !password) {
            throw new Error('Email and password required');
        }

        try {
            const user = await ManagerModel.findOne({ email });

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err

                if (isMatch) {
                    resolve(user)
                } else {
                    reject('Authentication failed');
                }
            })
        } catch (err) {
            console.log('error in authenticate');
            reject(err)
        }
    })
}

export default authenticate;