let {qrlioLogin, qrlioGetClient, qrlioGetCredits, qrlioRegister, qrlioGetProfiles, qrlioGetQR} = require('./qrlio-api');

let runExample = async (serial) => {
    console.log("Logging in with username and password from environment variables QRLIO_USER and QRLIO_PASS");
    await qrlioLogin(process.env.QRLIO_USER, process.env.QRLIO_PASS);

    console.log("**** Login successful ****");
    console.log("Company: " + qrlioGetClient());
    console.log("Credits: " + qrlioGetCredits());
    console.log("Profiles: ", qrlioGetProfiles());

    // Register a new serial, it will generate a persistent hash
    // If any data should be associated with the serial number, provide that as parameters
    const hash = await qrlioRegister(serial, "Tennisboll", {size:"80"});

    const info = await qrlioGetQR(serial);
    // Returns image (png) in data.qr, and URL for use in e.g. NFC tags in data.qrl
    console.log(info);
}

runExample("25");


