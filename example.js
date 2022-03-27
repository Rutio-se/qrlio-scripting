let {qrlioLogin, qrlioGetClient, qrlioGetCredits, qrlioRegister, qrlioGetProfiles, qrlioGetQR, qrlioListAll, qrlioUpdatePosition} = require('./qrlio-api');

let runExample = async (serial) => {
    console.log("Logging in with username and password from environment variables QRLIO_USER and QRLIO_PASS");
    await qrlioLogin(process.env.QRLIO_USER, process.env.QRLIO_PASS);

    console.log("**** Login successful ****");
    console.log("Company: " + qrlioGetClient());
    console.log("Credits: " + qrlioGetCredits());
    console.log("Profiles: ", qrlioGetProfiles());

    // Listing nodes
    const all = await qrlioListAll();
    console.log("All registerred serials:", all);

    // Register a new serial, it will generate a persistent hash. This hash is what is used
    // in the QR code or in a NFC tag. See also the qrlioGetQr function below.
    // If any data should be associated with the serial number, provide that as parameters. Comparse with
    // the values field of the profiles returned when logging in to know which value structure is expected.
    // 
    const hash = await qrlioRegister(serial, /* profile*/ "MyProfile", /* value */ {size:"80"});

    // Set a position of a given serial, of course you should replace the supplied 
    // lat, lng with something useful although the place is nice
    await qrlioUpdatePosition(serial, /*lat*/ 55.602, /*lng*/ 12.990);

    const info = await qrlioGetQR(serial);
    // Returns image (png) in data.qr, and URL for use in e.g. NFC tags in data.qrl
    console.log(info);
}

runExample(12);

