const env = {};

env.local = {
    port: 3000,
    envName: "local",
    secretKey: 'hbfrvdeaqwnrabgtefvw'
}
env.production = {
    port: 5001,
    envName: "production",
     secretKey: 'rgqh4brrvdbrwhwefvw'
}

/// determine current environment
const currentEnv = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : env.local.envName;

/// export corresponding environment
const envToExport = typeof (env[currentEnv]) === "object" ? env[currentEnv] : env.local;
module.exports = envToExport;