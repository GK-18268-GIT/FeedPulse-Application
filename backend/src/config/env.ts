import dotenv from 'dotenv';

dotenv.config();

const {PORT, CLIENT_URL, MONGODB_URL, GEMINI_API_KEY, JWT_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env;

if(!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY environment variable is not defined");
}

if(!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
}

export const ENV = {
    PORT: PORT,
    CLIENT_URL: CLIENT_URL,
    MONGODB_URL: MONGODB_URL,
    GEMINI_API_KEY: GEMINI_API_KEY,
    JWT_SECRET_KEY: JWT_SECRET_KEY,
    ADMIN_EMAIL: ADMIN_EMAIL,
    ADMIN_PASSWORD: ADMIN_PASSWORD
};