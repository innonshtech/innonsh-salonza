import dbConnect from "./lib/dbConnect";
import Service from "./models/Service";

async function checkServices() {
    await dbConnect();
    const services = await Service.find({}).lean();
    console.log("All Services in DB:");
    services.forEach(s => {
        console.log(`- ${s.name}: duration=${s.duration} type=${typeof s.duration}`);
    });
    process.exit(0);
}

checkServices();
