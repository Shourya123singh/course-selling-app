import dotenv from "dotenv";
dotenv.config();
const JWT_USER_PASSWORD=process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY="sk_test_51R81GqPTmiqJof6b7NzCD68AVQLaWt5j1N2VcHB3V2oXpW8ha7NqVWE05ahmAKDo8vH7MoKHrDEkAZBWhI2xm0Vp00Vba5rZZ8";
export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY
};