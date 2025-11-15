const env = {};
env.local = {
    port: 3000,
    envName: "local",
    secretKey: 'hbfrvdeaqwnrabgtefvw',
    maxChecks: 5,
    twilio: {
        messagingServiceSID: 'MG39fef7ce0c5021fca1e8ab3fb1f47c15',
        accountSID: "AC50ca4a83960a7c8be99bd6df7084cb72",
        accountToken: "a20eca46cb39e490427acaddb2f4b542"
    }
};


env.production = {
    port: 5001,
    envName: "production",
    secretKey: 'rgqh4brrvdbrwhwefvw',
    maxChecks: 5,
    twilio: {
        messagingServiceSID: "MG39fef7ce0c5021fca1e8ab3fb1f47c15",
        accountSID: "AC50ca4a83960a7c8be99bd6df7084cb72",
        accountToken: "a20eca46cb39e490427acaddb2f4b542"
    }
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : "local";
module.exports = env[currentEnv];
