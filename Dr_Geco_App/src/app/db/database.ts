import mongoose from 'mongoose';

const connectMongo = async () => {
    mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string);
    //verify connection
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Connected to MongoDB');
    });
    
}

export default connectMongo;