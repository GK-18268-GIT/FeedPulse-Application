import mongoose from "mongoose";
import { ENV } from "../config/env.js";

beforeAll(async () => {
    await mongoose.connect(ENV.MONGODB_URL || "mongodb://localhost:27017/feedpulse_test");
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for(const key in collections) {
        await collections[key]?.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    await new Promise<void>(resolve => setTimeout(resolve, 500));

});

