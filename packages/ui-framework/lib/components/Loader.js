"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Loader;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Loader(props) {
  var style = {
    width: props.width || '60%'
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "wrapper-loader",
    style: style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "container-loader"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "item-loader"
  })));
}

module.exports = exports.default;
module.exports.default = exports.default;