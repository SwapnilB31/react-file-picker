"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilePicker = FilePicker;

require("./index.css");

var _fa = require("react-icons/fa");

var _react = require("react");

var _Dirent = _interopRequireDefault(require("./Dirent"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * 
 * @param {Object} props - props to react functional component
 * @param {boolean} props.show - a state representing whether the file-picker is shown or not
 * @param {Function} props.setShow - a function that sets the value of show
 * @param {Function} props.scanDir - async ScanDir(path : string) - takes a path anc returns an array of objects of the shape {name : string, isDirectory : boolean, path : string}
 * @param {Function} props.setSelectedPath - a method that can set the value of an element to the path of the file selected by the user in the file-picker
 * @param {string[]} props.filters - (optional) string array with file extensions (e.g. doc, pdf) that is used to filter the results shown by the file picker.
 * @param {Object} props.iconsObj - (optional) file icons for specific file types can be defined as a JS object that will be shown in the file-picker ui. They key should be a string with the extension type and the value should be a react icon
 * @param {JSX.Element} props.iconsObj.extension 
 * 
     
 }} 
 */
function FilePicker(_ref) {
  var show = _ref.show,
      setShow = _ref.setShow,
      scanDir = _ref.scanDir,
      setSelectedPath = _ref.setSelectedPath,
      filters = _ref.filters,
      iconsObj = _ref.iconsObj;
  var direntArray = [];
  var filterSet = filters ? new Set(filters.map(function (val) {
    return val.toLowerCase();
  })) : new Set([]);

  var _useState = (0, _react.useState)('/'),
      _useState2 = _slicedToArray(_useState, 2),
      path = _useState2[0],
      setPath = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      dirents = _useState4[0],
      setDirents = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      backNavActive = _useState6[0],
      setBackNavActive = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      forwNavActive = _useState8[0],
      setForwNavActive = _useState8[1];

  var _useState9 = (0, _react.useState)([]),
      _useState10 = _slicedToArray(_useState9, 2),
      history = _useState10[0],
      setHistory = _useState10[1];

  (0, _react.useEffect)(function () {
    var fetchDirentData = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var queryPath;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                queryPath = path === "/" ? "/" : "".concat(path);
                queryPath = queryPath.replace('//', '/');
                _context.next = 5;
                return scanDir(queryPath);

              case 5:
                direntArray = _context.sent;
                if (history.length === 0) setHistory(["/"]);
                setStateNavButtons();
                direntArray = direntArray.map(function (val) {
                  return {
                    name: val.name,
                    isDirectory: val.isDirectory,
                    path: val.path,
                    active: false
                  };
                });

                if (filters) {
                  direntArray = direntArray.filter(function (val) {
                    if (!val.isDirectory) {
                      var nameParts = val.name.split(".");
                      var ext = nameParts[nameParts.length - 1];
                      return filterSet.has(ext.toLowerCase());
                    }

                    return true;
                  });
                }

                direntArray = direntArray.sort(function (a, b) {
                  if (a.isDirectory && b.isDirectory) return 0;else if (a.isDirectory && !b.isDirectory) return -1;else if (!a.isDirectory && b.isDirectory) return 1;else return a.name.localeCompare(b.name);
                });
                setDirents(direntArray);
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](0);
                console.warn(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 14]]);
      }));

      return function fetchDirentData() {
        return _ref2.apply(this, arguments);
      };
    }();

    fetchDirentData();
  }, [path]);

  var setAllDirentsInActive = function setAllDirentsInActive() {
    setDirents(dirents.map(function (val) {
      return {
        name: val.name,
        isDirectory: val.isDirectory,
        path: val.path,
        active: false
      };
    }));
  };

  var setStateNavButtons = function setStateNavButtons() {
    var hist = history;
    var pathAlias = path;
    var pathInd = hist.indexOf(pathAlias);

    if (pathInd > 0 && pathInd < hist.length - 1) {
      setBackNavActive(true);
      setForwNavActive(true);
    }

    if (hist.length > 1 && pathInd === 0) {
      setBackNavActive(false);
      setForwNavActive(true);
    }

    if (hist.length > 1 && pathInd === hist.length - 1) {
      setBackNavActive(true);
      setForwNavActive(false);
    }

    if (pathInd === 0 && hist.length === 1) {
      setBackNavActive(false);
      setForwNavActive(false);
    }
  };

  function goBack() {
    if (backNavActive) {
      var lastPath = history.indexOf(path) - 1;
      setPath(history[lastPath]);
    }
  }

  function goForward() {
    if (forwNavActive) {
      var nextPath = history.indexOf(path) + 1;
      setPath(history[nextPath]);
    }
  }

  function cleanAllNavs() {
    setPath("/");
    setHistory([]);
    setBackNavActive(false);
    setForwNavActive(false);
  }

  function returnSelectedPath() {
    var selectedDirent = dirents.find(function (dirent) {
      return dirent.active;
    });

    if (selectedDirent && selectedDirent.path) {
      setSelectedPath(selectedDirent.path.startsWith('/') ? selectedDirent.path : "/".concat(selectedDirent.path));
      setShow(!show);
      cleanAllNavs();
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    className: show ? 'file-picker-bg' : 'close-file-picker'
  }, /*#__PURE__*/React.createElement("div", {
    className: "file-picker"
  }, /*#__PURE__*/React.createElement("div", {
    className: "address-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-buttons"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: goBack,
    className: "nav-button left ".concat(!backNavActive ? 'nav-button-inactive' : '')
  }, " ", /*#__PURE__*/React.createElement(_fa.FaArrowLeft, null)), /*#__PURE__*/React.createElement("button", {
    onClick: goForward,
    className: "nav-button ".concat(!forwNavActive ? 'nav-button-inactive' : '')
  }, /*#__PURE__*/React.createElement(_fa.FaArrowRight, null))), /*#__PURE__*/React.createElement("div", {
    className: "address-field"
  }, path)), /*#__PURE__*/React.createElement("div", {
    className: "file-list", 
    onClick: function onClick(e) {
      if (e.target.classList.contains('file-list')) setAllDirentsInActive();
    }
  }, dirents.map(function (val) {
    return /*#__PURE__*/React.createElement(_Dirent["default"], {
      key: (0, _uuid.v4)(),
      direntObj: val,
      stateSetters: {
        setDirents: setDirents,
        setPath: setPath,
        setHistory: setHistory
      },
      stateVariables: {
        dirents: dirents,
        prevPath: path,
        history: history
      },
      iconsObj: iconsObj
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "action-bar"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: returnSelectedPath,
    className: "action-button select-button mr-3"
  }, "Select"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setShow(!show);
      cleanAllNavs();
    },
    className: "action-button close-button"
  }, "Close"))));
}
