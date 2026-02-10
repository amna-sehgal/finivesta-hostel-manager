import mongoose from "mongoose";
import fs from "fs";
import MessMenu from "../models/MessMenu.js";

const data = JSON.parse(
  fs.readFileSync("./mess.json", "utf-8")
);

async function seed() {
  try {
    await mongoose.connect("mongodb+srv://amnasehgal211_db_user:iMRoIbiVpxzjLV4e@cluster0.nhzydm2.mongodb.net/?appName=Cluster0");

    await MessMenu.deleteMany();

    await MessMenu.create({
      weekly: data.weekly,
      pollOptions: data.pollOptions,
    });

    console.log("✅ Mess menu seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
