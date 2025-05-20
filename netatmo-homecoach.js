const _ = require('underscore');
const fetch = require('node-fetch');
const httpTransport = require('https');

const callRefreshToken = ({ clientId, clientSecret, refreshToken }) => {
  return new Promise((resolve, reject) => {

    const responseEncoding = 'utf8';
    const httpOptions = {
      hostname: 'api.netatmo.com',
      port: '443',
      path: '/oauth2/token',
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;

    const request = httpTransport.request(httpOptions, (res) => {
      let responseBufs = [];
      let responseStr = '';

      res.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          responseBufs.push(chunk);
        }
        else {
          responseStr = responseStr + chunk;
        }
      }).on('end', () => {
        responseStr = responseBufs.length > 0 ? Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
        if (res.statusCode === 200) {
          let json;
          try {
            json = JSON.parse(responseStr);
            resolve(json.access_token);
          } catch (e) {
            reject(e);
          }
        } else {
          reject('Unable to refresh the access token');
        }
      });
    })
      .setTimeout(0)
      .on('error', (error) => {
        callback(error);
      });
    request.write(`grant_type=refresh_token&refresh_token=${encodeURI(refreshToken)}&client_id=${clientId}&client_secret=${clientSecret}`);
    request.end();
  });
};

module.exports = function (RED) {
  function NetatmoDashboard(config) {

    RED.nodes.createNode(this, config);
    this.creds = RED.nodes.getNode(config.creds);
    var node = this;
    this.on('input', async function (msg, send, done) {
      // send/done compatibility for node-red < 1.0
      send = send || function () { node.send.apply(node, arguments) };
      done = done || function (error) { node.error.call(node, error, msg) };

      const clientSecret = this.creds.client_secret;
      const clientId = this.creds.client_id;
      const refreshToken = this.creds.refresh_token;

      let data;
      try {
        // for some reason the same request with node-fetch is not working
        const refreshedToken = await callRefreshToken({ clientSecret, clientId, refreshToken });;

        // Get Station data (GET https://api.netatmo.com/api/getstationsdata?get_favorites=false)
        const response = await fetch("https://api.netatmo.com/api/gethomecoachsdata", {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${refreshedToken}`
          }
        });
        data = await response.json();
      } catch (e) {
        done(e);
        return;
      }

      msg.payload = {};
      msg.payload.compact = {};
      msg.payload.detailed = {};

      /** save all detailed information **/
      msg.payload.detailed = data;

      _(data.body.devices).each(function (station) {
        if (station.type === 'NHC') {
          msg.payload.compact.reachable = station.reachable || "false";
          msg.payload.compact.station_name = station.station_name;
          msg.payload.compact.last_status_store = station.last_status_store;

          if (typeof station.dashboard_data !== "undefined") {
            msg.payload.compact.temperature = station.dashboard_data.Temperature !== "undefined" ? station.dashboard_data.Temperature : "N.N.";
            msg.payload.compact.co2 = station.dashboard_data.CO2 !== "undefined" ? station.dashboard_data.CO2 : "N.N.";
            msg.payload.compact.humidity = station.dashboard_data.Humidity !== "undefined" ? station.dashboard_data.Humidity : "N.N.";
            msg.payload.compact.noise = station.dashboard_data.Noise !== "undefined" ? station.dashboard_data.Noise : "N.N.";
            msg.payload.compact.pressure = station.dashboard_data.Pressure !== "undefined" ? station.dashboard_data.Pressure : "N.N.";
            msg.payload.compact.health_idx = station.dashboard_data.health_idx !== "undefined" ? station.dashboard_data.health_idx : "N.N.";

          }
          else {
            msg.payload.compact.temperature = "N.N.";
            msg.payload.compact.co2 = "N.N.";
            msg.payload.compact.humidity = "N.N.";
            msg.payload.compact.noise = "N.N.";
            msg.payload.compact.pressure = "N.N.";
             msg.payload.compact.health_idx = "N.N.";
          }

          });
        }
      });
      send(msg);
      done();
    });
  }
  RED.nodes.registerType('netatmo-homecoach', NetatmoHomecoach);

  function NetatmoConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.client_id = n.client_id;
    this.client_secret = n.client_secret;
    this.refresh_token = n.refresh_token;
  }
  RED.nodes.registerType('netatmo-config-node', NetatmoConfigNode);

};
