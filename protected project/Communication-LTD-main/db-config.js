const mysql = require("mysql");
const dotenv = require("dotenv").config();
const fs = require('fs');

const userDbConfig = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_forUsers
})

const clientDbConfig = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_forClients
})

module.exports = {
    userDbConfig,
    clientDbConfig
};