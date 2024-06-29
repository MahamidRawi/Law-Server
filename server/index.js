const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const AuthRouter = require('./API/auth/auth.api');
const MainRouter = require('./API/main/dashboard.api');
const loadDb = require('./DB/load.db');
server.use(express.json());
server.use(express.urlencoded({extended: true}))
require('dotenv').config();

server.use('/auth/', AuthRouter);
server.use('/main/', MainRouter);

server.listen(3200, () => {loadDb().catch(console.dir); console.log(process.env.JWTPASS)});

//test