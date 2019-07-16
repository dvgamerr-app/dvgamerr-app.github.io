"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var app = require('express')();

var _require = require('@touno-io/db/schema'),
    touno = _require.touno;

app.get('/',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var _touno$get, Resume, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, raw;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return touno.open();

          case 3:
            _touno$get = touno.get(), Resume = _touno$get.Resume;
            data = {};
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 8;
            _context.next = 11;
            return Resume.find({});

          case 11:
            _context.t0 = Symbol.iterator;
            _iterator = _context.sent[_context.t0]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 19;
              break;
            }

            raw = _step.value;
            data[raw.section] = raw.content;

          case 16:
            _iteratorNormalCompletion = true;
            _context.next = 13;
            break;

          case 19:
            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t1 = _context["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 25:
            _context.prev = 25;
            _context.prev = 26;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 28:
            _context.prev = 28;

            if (!_didIteratorError) {
              _context.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context.finish(28);

          case 32:
            return _context.finish(25);

          case 33:
            res.json(data);
            _context.next = 39;
            break;

          case 36:
            _context.prev = 36;
            _context.t2 = _context["catch"](0);
            res.status(500).json({
              error: _context.t2.message || _context.t2
            });

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 36], [8, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // Export the server middleware

module.exports = app;
//# sourceMappingURL=resume.js.map