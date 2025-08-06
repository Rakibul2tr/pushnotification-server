const json = require("./firebase-service-account.json");

// 🔥 এই লাইনে JSON টাকে এক লাইনে করে দিচ্ছে
const singleLineJSON = JSON.stringify(json).replace(/\n/g, "\\n");

// 🖨️ এখন তুমি console এ পাবে এক লাইন JSON
console.log(singleLineJSON);
