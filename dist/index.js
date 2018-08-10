'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sc2Sdk = require('sc2-sdk');

var _sc2Sdk2 = _interopRequireDefault(_sc2Sdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VueSteemConnect = {
  install: function install(Vue, _options) {
    var options = Object.assign({}, _options, {
      scope: _options.scope || ['vote', 'comment']
    });

    var api = _sc2Sdk2.default.Initialize({
      app: options.app,
      callbackURL: options.callbackURL,
      scope: options.scope || ['vote', 'comment']
    });

    Vue.prototype.$steemconnect = api;
    // setting the api directly as the value does not work, methods are removed (why? serialization?)
    Vue.SteemConnect = function () {
      return api;
    };
  }
};

exports.default = VueSteemConnect;