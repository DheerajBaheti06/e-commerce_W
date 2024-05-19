import mongoose from "mongoose";
// const {MONGODB_URL} = process.env;

const connectDB = async () => {
    try {
        // const connectionInstance = await mongoose.connect(MONGODB_URL);
        // console.log(process.env.PORT);
        const connectionInstance = await mongoose.connect("mongodb+srv://dheeraj:dheeraj123@cluster0.hrrq7ua.mongodb.net"); // --since .env not working
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB