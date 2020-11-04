"use strict";

require("core-js/modules/es.object.assign");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Button;

var _Loader = _interopRequireDefault(require("./Loader"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var commonStyles = {
  height: '44px',
  padding: '4px 16px',
  border: 0,
  borderRadius: '22px',
  fontSize: '16px'
};
var styles = {
  neutral: Object.assign({
    backgroundColor: 'gray',
    color: '#fff'
  }, commonStyles),
  red: Object.assign({
    backgroundColor: 'red',
    color: '#fff'
  }, commonStyles),
  green: Object.assign({
    backgroundColor: 'green',
    color: '#fff'
  }, commonStyles),
  blue: Object.assign({
    backgroundColor: '#276bfb',
    color: '#fff'
  }, commonStyles),
  disabled: {
    backgroundColor: '#aaa',
    cursor: 'not-allowed'
  },
  fullWidth: {
    display: 'block',
    width: '100%'
  },
  isLoading: {
    opacity: 0.7
  }
};

var loader = /*#__PURE__*/_react["default"].createElement(_Loader["default"], null);
/**
 * Common button loaded with extras
 *
 * `import {Button} from 'ui-framework'`
 */


function Button(props) {
  var children = props.children,
      onClick = props.onClick,
      variant = props.variant,
      isLoading = props.isLoading,
      disabled = props.disabled,
      fullWidth = props.fullWidth;
  var style = styles[variant] || styles.neutral;

  if (disabled) {
    style = Object.assign({}, style, styles.disabled);
  }

  if (fullWidth) {
    style = Object.assign({}, style, styles.fullWidth);
  }

  if (isLoading) {
    style = Object.assign({}, style, styles.isLoading);
  }

  var cssClass = "btn--".concat(variant);
  return /*#__PURE__*/_react["default"].createElement("button", {
    onClick: onClick,
    disabled: disabled,
    className: cssClass
  }, isLoading ? loader : children);
}

Button.propTypes = {
  /**
   * Change appearance of the button.
   */
  variant: _propTypes["default"].oneOf(['neutral', 'red', 'green', 'blue']),

  /**
   * Replace the button text by a loader.
   */
  isLoading: _propTypes["default"].bool,

  /**
   * Disables the button.
   */
  disabled: _propTypes["default"].bool,

  /**
   * Child nodes of the button (text / image)
   */
  children: _propTypes["default"].node,

  /**
   * Make button take full width
   */
  fullWidth: _propTypes["default"].bool
};
Button.defaultProps = {
  variant: 'neutral'
};
module.exports = exports.default;
module.exports.default = exports.default;