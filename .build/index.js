"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var app = require('express')();

var bodyParser = require('body-parser');

var request = require('request-promise');

var debuger = require('@touno-io/debuger');

var _require = require('@touno-io/db/schema'),
    touno = _require.touno;

var _require2 = require('nuxt'),
    Nuxt = _require2.Nuxt,
    Builder = _require2.Builder;

var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || 3000;
var reSecret = process.env.RECAPTCHA_SECRET;
var reEndpoint = process.env.RECAPTCHA_ENDPOINT || 'https://www.google.com/recaptcha/api/siteverify'; // Import and Set Nuxt.js options

var config = require('../nuxt.config.js');

config.dev = !(process.env.NODE_ENV === 'production');

if (config.dev) {
  app.use(function (req, res, next) {
    var methodAllow = ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','));
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
} // parse application/x-www-form-urlencoded


app.use(bodyParser.urlencoded({
  extended: false
})); // parse application/json

app.use(bodyParser.json());
app.use('/my-resume', require('./resume.js'));
app.post('/api/email',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var _touno$get, ResumeContact, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(!reSecret || !req.body.token)) {
              _context.next = 3;
              break;
            }

            throw new Error('Token Recaptcha expired.');

          case 3:
            _context.next = 5;
            return touno.open();

          case 5:
            _touno$get = touno.get(), ResumeContact = _touno$get.ResumeContact;
            _context.next = 8;
            return request({
              method: 'post',
              url: reEndpoint,
              json: true,
              formData: {
                secret: reSecret,
                response: req.body.token
              }
            });

          case 8:
            data = _context.sent;

            if (data.success) {
              _context.next = 11;
              break;
            }

            throw new Error(data['error-codes']);

          case 11:
            _context.next = 13;
            return new ResumeContact(Object.assign({
              sended: false,
              score: data.score,
              challenge: new Date(data.challenge_ts),
              created: new Date()
            }, req.body)).save();

          case 13:
            // const { name, email, subject, text } = req.body
            // await debuger.Slack({ 
            //   text: `*${subject}*\n${text}\n\nby _${email}_`,
            //   name: name,
            //   channel: '#contact-us'
            // })
            res.status(200).json({
              error: null
            });
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              error: _context.t0.message || _context.t0
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var expressInitialize =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var logger, nuxt, builder;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return debuger('SERVER');

          case 2:
            logger = _context2.sent;
            _context2.next = 5;
            return touno.open();

          case 5:
            logger.info('Mongo connected.'); // Init Nuxt.js

            nuxt = new Nuxt(config);

            if (!config.dev) {
              _context2.next = 13;
              break;
            }

            builder = new Builder(nuxt);
            _context2.next = 11;
            return builder.build();

          case 11:
            _context2.next = 15;
            break;

          case 13:
            _context2.next = 15;
            return nuxt.ready();

          case 15:
            app.use(nuxt.render); // Listen the server

            _context2.next = 18;
            return app.listen(port, host);

          case 18:
            logger.start('Server listening on http://' + host + ':' + port); // eslint-disable-line no-console

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function expressInitialize() {
    return _ref2.apply(this, arguments);
  };
}();

expressInitialize();
//# sourceMappingURL=index.js.map