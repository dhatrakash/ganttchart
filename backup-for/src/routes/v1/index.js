const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const hardwareRoute = require('./hardware.routes');
const machineRoute = require('./machine.route');
const gatewayRoute = require('./gateway.routes');
const sensorRoute = require('./sensor.routes');
const fanucRoute = require('./fanuc.control.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/data',
    route: hardwareRoute,
  },
  {
    path: '/machines',
    route: machineRoute,
  },
  {
    path: '/gateway',
    route: gatewayRoute,
  },
  {
    path: '/sensors',
    route: sensorRoute,
  },
  {
    path: '/fanuc',
    route: fanucRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
