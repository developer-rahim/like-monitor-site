const env = {};

env.local = {
    port: 3000,
    envName: "local",
    secretKey: 'hbfrvdeaqwnrabgtefvw',
    maxChecks: 5
    ,
    twilio: {
        messagingServiceSid: 'MG39fef7ce0c5021fca1e8ab3fb1f47c15',
        accountSSd: "AC50ca4a83960a7c8be99bd6df7084cb72",
        accountToken: "2e1e12f65d82c007d6b8885f3dc17c3b"
    }
}
env.production = {
    port: 5001,
    envName: "production",
    secretKey: 'rgqh4brrvdbrwhwefvw',
    maxChecks: 5,
    twilio: {
        messagingServiceSid: "MG39fef7ce0c5021fca1e8ab3fb1f47c15",
        accountSSd: "AC50ca4a83960a7c8be99bd6df7084cb72",
        accountToken: "2e1e12f65d82c007d6b8885f3dc17c3b"
    }
}

/// determine current environment
const currentEnv = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : env.local.envName;

/// export corresponding environment
const envToExport = typeof (env[currentEnv]) === "object" ? env[currentEnv] : env.local;
module.exports = envToExport;