// Copyright (C) 2022, Rutio AB, All rights reserved
// Also made available under MIT license. See LICENSE file.
// Intended use is for one scripting session with a single client.
// Initialize the session by a call to await qrlioLogin(username, password),
// once this is done you can rock on with all of the API.

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Change this by setting environment variable QRLIO_API
const server = process.env.QRLIO_API ? process.env.QRLIO_API : "https://qrlio.com/api/";

let key, user, client, credits, profiles;

// This is for checking. If this is not undefined we are logged in
exports.qrlioGetKey = () => {
    return key;
}

// This is for checking. If this is not undefined we are logged in. 
// Should return the company name matching the account of a logged in user.
exports.qrlioGetClient = () => {
    return client;
}

exports.qrlioGetCredits = () => {
    return credits;
}

exports.qrlioGetProfiles = () => {
    return profiles;
}

const ec = x=>encodeURIComponent(x);

// Login. Returns true if successful, throws an exception if it fails.
exports.qrlioLogin = async (username, password) => {
    const call = server+"login?user="+ec(username)+"&pass="+ec(password);
    const response = await fetch(call);
    const data = await response.json();
    key = data.key;
    user = username;
    client = data.client;
    credits = data.credits;
    profiles = data.profiles;
    return true;
}

// If failing this function will throw. If successful it updates the credits and returns the created hash.
// Profile is the profile name, serial is the wanted serial number (any string up to 44 characters long), value is any values
// other than default values matching the values of the profile.
exports.qrlioRegister = async (serial, profile, value) => {
    const v=JSON.stringify(value);
    const call = `${server}register?user=${ec(user)}&key=${ec(key)}&client=${ec(client)}&name=${ec(serial)}&profile=${ec(profile)}&value=${ec(v)}`;
    const response = await fetch(call);
    const data = await response.json();
    credits = data.credits;
    return data.hash;
}

// Retreive QR code image and url for a given serial number. Provided arguments is 
exports.qrlioGetQR = async (serial, app="https://qrlio.com") => {
    const call = `${server}qrl?user=${ec(user)}&key=${ec(key)}&client=${ec(client)}&name=${ec(serial)}&app=${app}`;
    const response = await fetch(call);
    const data = await response.json();
}
