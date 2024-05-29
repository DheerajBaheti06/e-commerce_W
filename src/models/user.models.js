import mongoose, {Schema} from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "please enter your Name"],
            maxLength:[30, "Name cannot exceed 30 characters"],
            minLength:[4, "Name should have more than 4 characters"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "please enter your Email"],
            validate: [validator.isEmail, "please enter a valid Email !!"]
        },
        password: {
            type: String,
            required: [true, "please enter your Password"],
            minLength:[8, "Name should have more than 8 characters"],
            select: false
        },
        avatar: {
            type: String, //cloudinary
            // required: true,
        },
        role: {
            type: String,
            default: "user"
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
        
    },
    { timestamps: true })

    
    userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) next();
        
        this.password = await bcrypt.hash(this.password, 10);
        next();
    })


    
    
    
    export const User = new mongoose.model("User", userSchema);
