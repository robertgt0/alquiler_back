import connectDB from "@/config/database";
import mongoose from "mongoose";
import usuario from "../models/usuario";
import Appointment from "../models/Appointment";
import Providder from "../models/Providder";
export  const getProviders = async () => {
    try {
        await connectDB();
        const provider = await Providder.find()
        return provider


    } catch (error) {
        console.error(error)
    }finally{
        await mongoose.disconnect();
    }
}

