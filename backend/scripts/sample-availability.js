// Script to create sample availability for testing
// This can be run in MongoDB Compass or via a separate Node.js script

// Sample availability data for a guide
const sampleAvailability = {
  // Replace this with an actual guide's user ID from your database
  userId: "GUIDE_USER_ID_HERE", 
  weeklyAvailability: {
    monday: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "17:00" }
    ],
    tuesday: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "17:00" }
    ],
    wednesday: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "17:00" }
    ],
    thursday: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "17:00" }
    ],
    friday: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "17:00" }
    ],
    saturday: [
      { startTime: "10:00", endTime: "15:00" }
    ],
    sunday: [] // No availability on Sunday
  },
  unavailableDates: [] // No unavailable dates
};

// To use this:
// 1. Find a guide's user ID from the users collection where role = "guide"
// 2. Replace "GUIDE_USER_ID_HERE" with the actual ObjectId
// 3. Insert this document into the "availabilities" collection

console.log("Sample availability data:", JSON.stringify(sampleAvailability, null, 2));
console.log("\nTo set up test data:");
console.log("1. Find a guide user ID: db.users.findOne({role: 'guide'})._id");
console.log("2. Replace GUIDE_USER_ID_HERE with the actual ID");
console.log("3. Insert: db.availabilities.insertOne(sampleAvailability)");
