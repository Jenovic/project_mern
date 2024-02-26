import mongoose, { ConnectOptions } from "mongoose";
const config = require('config');


const db = config.get('mongoURI');

const connectDB = async () => {
    try {

        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);

        console.log('MongoDB connected...');
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
}

export default connectDB;