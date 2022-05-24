let {qrlioLogin, qrlioGetClient, qrlioGetCredits, qrlioRegister, qrlioGetProfiles, qrlioGetQR, qrlioListAll, qrlioUpdatePosition, qrlioCheckIn} = require('./qrlio-api-v2');
let {argv, exit} = require('process');

let username = argv[2]
let password = argv[3]
let serialNo = argv[4];
if (!username || !password || !serialNo) {
    console.log("Usage: example-v2.js <username> <password> <serial>");
    exit(1);
}
console.log("Serial: " + serialNo);

let runExample = async (serial) => {
    console.log("Logging in with username and password from command line");
    const session = await qrlioLogin(username, password);
    console.log(session);

    console.log("**** Login successful ****");
    console.log("Company: " + qrlioGetClient(session));
    console.log("Credits: " + qrlioGetCredits(session));
    console.log("Profiles: ", qrlioGetProfiles(session));

    // Listing nodes
    const all = await qrlioListAll(session);
    console.log("All registerred serials:", all);

    // Register a new serial, it will generate a persistent hash. This hash is what is used
    // in the QR code or in a NFC tag. See also the qrlioGetQr function below.
    // If any data should be associated with the serial number, provide that as parameters. Comparse with
    // the values field of the profiles returned when logging in to know which value structure is expected.
    // 
    const hash = await qrlioRegister(session, serial, /* profile*/ session.profiles[0].name, /* value */ {size:"80"});

    // Set a position of a given serial, of course you should replace the supplied 
    // lat, lng with something useful although the place is nice
    await qrlioUpdatePosition(session, serial, /*lat*/ 55.602, /*lng*/ 12.990);

    // Check in the node and retreive all data associated with it
    await qrlioCheckIn(session, serial, "ApiTest");

    const info = await qrlioGetQR(session, serial);
    // Returns image (png) in data.qr, and URL for use in e.g. NFC tags in data.qrl
    console.log(info);
}

runExample(serialNo);

