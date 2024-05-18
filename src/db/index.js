import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/dheeraj`);
        // const connectionInstance = await mongoose.connect(`mongodb+srv://dheeraj:dheeraj123@cluster0.hrrq7ua.mongodb.net/dheeraj`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB