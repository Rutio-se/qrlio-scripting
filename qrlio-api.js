// Copyright (C) 2022, Rutio AB, All rights reserved
// Also made available under MIT license. See LICENSE file.

// Intended use is for one scripting session with a single client/user/password.
// Initialize the session by a call to await qrlioLogin(username, password),
// once this is done you can rock on with all of the API.
// Logging in after a first login will start a new session.
//
// The convention is that all of the API functions will throw an error should they not
// be successful. If they are successful they return the retreived data.

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Change this by setting environment variable QRLIO_API
const server = process.env.QRLIO_API ? process.env.QRLIO_API : "https://qrlio.com/qrl-api/";

// These variables are kept mostly internal to this namespace (some have getters). This is 
// in order to simplify use after a login call.
let key, user, client, credits, profiles;

// This is for checking. If this is not undefined we are logged in. 
// Should return the company name matching the account of a logged in user.
exports.qrlioGetClient = () => {
    return client;
}

// Return how many credits are available.
exports.qrlioGetCredits = () => {
    return credits;
}

// List of profiles for the given user
exports.qrlioGetProfiles = () => {
    return profiles;
}

// Shorthand for below functions
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

// Retreive QR code image and url for a given serial number. Provided arguments is the serial number and an optional app parameter 
// (the app parameter is generally not used, but if you want to have a different landing page than the default you can use it and then 
// forward the call to qrlio.com (be sure to include the hash parameter in the forward))
exports.qrlioGetQR = async (serial, app="https://qrlio.com") => {
    const call = `${server}qrl?user=${ec(user)}&key=${ec(key)}&client=${ec(client)}&name=${ec(serial)}&app=${ec(app)}`;
    const response = await fetch(call);
    const data = await response.json();
    return data;
}

// Update the position for a given serial number. Useful if you want an initial position when registerring serials or otherwise want to upadte
// the position for a given serial number.
exports.qrlioUpdatePosition = async (serial, lat, lng) => {
    const call = `${server}updateposition?user=${ec(user)}&key=${ec(key)}&client=${ec(client)}&name=${ec(serial)}&lat=${ec(lat)}&lng=${ec(lng)}`;
    const response = await fetch(call);
    const data = await response.json(); // Data contains full event list for the node.
    return true;
}

// List all serials (with hash and creation date) for a given client.
exports.qrlioListAll = async () => {
    const call = `${server}list?user=${ec(user)}&key=${ec(key)}&client=${ec(client)}`;
    const response = await fetch(call);
    const data = await response.json(); // Data contains full event list for the node.
    return data;
}
