"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

require("./index.css");

var _reactIcons = require("react-icons");

var _fa = require("react-icons/fa");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** 
 * 
 * @param {Object} props
 * @param {Object} props.direntObj
 * @param {string} props.direntObj.name
 * @param {boolean} props.direntObj.isDirectory
 * @param {string} props.direntObj.path
 * @param {Object} props.stateSetters
 * @param {Function} props.stateSetters.setDirents
 * @param {Function} props.stateSetters.setPath
 * @param {Function} props.stateSetters.setHistory
 * @param {Object} props.stateVariables
 * @param {[]} props.stateVariables.dirents
 * @param {string} props.stateVariables.prevPath
 * @param {string[]} props.stateVariables.history
 * @param {Object} props.iconsObj
 * @param {JSX.Element} props.iconsObj.extension
 */
function Dirent(_ref) {
  var direntObj = _ref.direntObj,
      stateSetters = _ref.stateSetters,
      stateVariables = _ref.stateVariables,
      iconsObj = _ref.iconsObj;
  //console.log(direntObj)
  var name = direntObj.name,
      isDirectory = direntObj.isDirectory,
      path = direntObj.path,
      active = direntObj.active;
  var dirents = stateVariables.dirents,
      prevPath = stateVariables.prevPath,
      history = stateVariables.history;
  var setDirents = stateSetters.setDirents,
      setPath = stateSetters.setPath,
      setHistory = stateSetters.setHistory;
  var fileIcon;
  var nameParts = name.split('.');
  var extension = nameParts[nameParts.length - 1];

  if (iconsObj && iconsObj[extension.toLowerCase()]) {
    fileIcon = /*#__PURE__*/_react["default"].createElement(_reactIcons.IconContext.Provider, {
      value: {
        className: 'mr-3 dirent-file-icon'
      }
    }, iconsObj[extension.toLowerCase()]);
  } else {
    fileIcon = /*#__PURE__*/_react["default"].createElement(_fa.FaFile, {
      className: "mr-3 dirent-file-icon"
    });
  }

  var setActive = function setActive() {
    setDirents(dirents.map(function (val) {
      return val.path === path ? {
        name: val.name,
        isDirectory: val.isDirectory,
        path: val.path,
        active: true
      } : {
        name: val.name,
        isDirectory: val.isDirectory,
        path: val.path,
        active: false
      };
    }));
  };

  var handleDblClick = function handleDblClick() {
    if (isDirectory) {
      var hist = history;

      if (hist.indexOf(prevPath) > -1) {
        hist = hist.slice(0, hist.indexOf(prevPath) + 1);
        hist.push(path);
        setHistory(hist);
      }

      if (hist.indexOf(path) === -1) {
        hist.push(path);
        setHistory(hist);
      }

      setPath(path);
    }
  };

  return isDirectory ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "dirent dir",
    onDoubleClick: handleDblClick
  }, /*#__PURE__*/_react["default"].createElement(_fa.FaFolder, {
    className: "mr-3 dirent-dir-icon"
  }), " ", /*#__PURE__*/_react["default"].createElement("div", null, name)) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "dirent file ".concat(active ? 'dirent-active' : ''),
    onClick: setActive
  }, " ", fileIcon, " ", /*#__PURE__*/_react["default"].createElement("div", null, name));
}

var _default = Dirent;
exports["default"] = _default;
