// Copyright (C) 2022, Rutio AB, All rights reserved
// Also made available under MIT license. See LICENSE file.

// Intended use is for scripting sessions with multiple users and passwords.
// Initialize the session by a call to await qrlioLogin(username, password),
// once this is done use the returned object as first parameter in all calls.
//
// The convention is that all of the API functions will throw an error should they not
// be successful. If they are successful they return the expected data.


// Check structure of qobj - mainly a service for migration from v1 API to v2 API
const checkQObject = (qobj) => {
    if (typeof(qobj) !== 'object')
        throw new Error("The qobj parameter must be an object");
    if (!(qobj.hasOwnProperty('key') && qobj.hasOwnProperty('user') 
          && qobj.hasOwnProperty('client') && qobj.hasOwnProperty('profiles')))
        throw new Error("The qobj lacks one or more mandatory fields");
    return;
}

// This is for checking. If this is not undefined we are logged in. 
// Should return the company name matching the account of a logged in user.
exports.qrlioGetClient = (qobj) => {
    return qobj.client;
}

// Return how many credits are available.
exports.qrlioGetCredits = (qobj) => {
    return qobj.credits;
}

// List of profiles for the given user
exports.qrlioGetProfiles = (qobj) => {
    return qobj.profiles;
}

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Change this by setting environment variable QRLIO_API
const server = process.env.QRLIO_API ? process.env.QRLIO_API : "https://qrlio.com/qrl-api/";

// Shorthand for below functions
const ec = x=>encodeURIComponent(x);

// Login. Returns a qobj with {key, credits, client, profiles} if successful, throws an exception if it fails.
exports.qrlioLogin = async (username, password) => {
    const call = server+"login?user="+ec(username)+"&pass="+ec(password);
    const response = await fetch(call);
    let qobj = await response.json();
    qobj.user = username;
    return qobj;
}

// If failing this function will throw. If successful it updates the credits and returns the created hash.
// Profile is the profile name, serial is the wanted serial number (any string up to 44 characters long), value is any values
// other than default values matching the values of the profile. First parameter is the object returned by Login. 
// The object is updated.
exports.qrlioRegister = async (qobj, serial, profile, value) => {
    checkQObject(qobj);
    const v=JSON.stringify(value);
    const call = `${server}register?user=${ec(qobj.user)}&key=${ec(qobj.key)}&client=${ec(qobj.client)}&name=${ec(serial)}&profile=${ec(profile)}&value=${ec(v)}`;
    const response = await fetch(call);
    const data = await response.json();
    qobj.credits = data.credits;
    return data.hash;
}

// Retreive QR code image and url for a given serial number. Provided arguments is the serial number and an optional app parameter 
// (the app parameter is generally not used, but if you want to have a different landing page than the default you can use it and then 
// forward the call to qrlio.com (be sure to include the hash parameter in the forward))
exports.qrlioGetQR = async (qobj, serial, app="https://qrlio.com") => {
    checkQObject(qobj);
    const call = `${server}qrl?user=${ec(qobj.user)}&key=${ec(qobj.key)}&client=${ec(qobj.client)}&name=${ec(serial)}&app=${ec(app)}`;
    const response = await fetch(call);
    const data = await response.json();
    return data;
}

// Retreive the data associated with serial, will also record that it was checked in with the associated action
exports.qrlioCheckIn = async (qobj, serial, action="ApiCheckin") => {
    checkQObject(qobj);
    const call = `${server}checkin?user=${ec(qobj.user)}&key=${ec(qobj.key)}&client=${ec(qobj.client)}&name=${ec(serial)}&action=${ec(action)}`;
    const response = await fetch(call);
    const data = await response.json(); // Data contains full event list for node, and data, etc.
    return data;
}

// Update the position for a given serial number. Useful if you want an initial position when registerring serials or otherwise want to upadte
// the position for a given serial number.
exports.qrlioUpdatePosition = async (qobj, serial, lat, lng) => {
    checkQObject(qobj);
    const call = `${server}updateposition?user=${ec(qobj.user)}&key=${ec(qobj.key)}&client=${ec(qobj.client)}&name=${ec(serial)}&lat=${ec(lat)}&lng=${ec(lng)}`;
    const response = await fetch(call);
    const data = await response.json(); // Data contains full event list for the node.
    return true;
}

// Update data 
// Include a "edits" object which have the fields set which you want to edit. No other fields are updated.
// Returns the resulting updated object
exports.qrlioEdits = async (qobj, serial, edits) => {
    checkQObject(qobj);
    const call = `${server}edits?user=${ec(qobj.user)}&key=${ec(qobj.key)}&client=${ec(qobj.client)}&name=${ec(serial)}&edits=${ec(JSON.stringify(edits))}`;
    const response = await fetch(call);
    const data = await response.json(); // Data contains full event list for the node.
    return data; // Return the resulting object
}

// List all serials (with hash and creation date) for a given client.
exports.qrlioListAll = async (qobj) => {
    checkQObject(qobj);
    const call = `${server}list?user=${ec(qobj.user)}&key=${ec(qobj.key)}&client=${ec(qobj.client)}`;
    const response = await fetch(call);
    const data = await response.json(); // Data contains full event list for the node.
    return data;
}
