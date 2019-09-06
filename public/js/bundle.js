/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/js/emitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/emitter.js":
/*!******************************!*\
  !*** ./public/js/emitter.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\r\nfunction formatBytes(a, b) { if (0 == a) return \"0 Bytes\"; var c = 1024, d = b || 2, e = [\"Bytes\", \"KB\", \"MB\", \"GB\", \"TB\", \"PB\", \"EB\", \"ZB\", \"YB\"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + \" \" + e[f] }\r\n\r\nfunction createText(content) {\r\n    const filesContainer = document.getElementsByClassName('files-container')[0]\r\n    const clipboardID = Math.random().toString(36).substring(7);\r\n    const row = document.createElement('div');\r\n    row.classList.add('row', 'message');\r\n    const column = document.createElement('div');\r\n    column.classList.add('one-half', 'columns', 'messages');\r\n    const h3 = document.createElement('p');\r\n\r\n    h3.innerText = content.data.text\r\n    h3.setAttribute('id', clipboardID)\r\n\r\n    const span = document.createElement('span');\r\n    span.classList.add('clip')\r\n    span.setAttribute('data-clipboard-target', `#${clipboardID}`)\r\n\r\n    row.appendChild(column);\r\n    column.appendChild(h3)\r\n    column.appendChild(span)\r\n    const fa = document.createElement('i');\r\n    fa.classList.add('fa', 'fa-copy');\r\n    fa.setAttribute('aria-hidden', 'true')\r\n    span.appendChild(fa)\r\n    filesContainer.prepend(row)\r\n}\r\n\r\n(function bindSessionToIO() {\r\n    const socket = io('/');\r\n    // socket.emit('sessionSocket');\\\r\n    window.addEventListener('DOMContentLoaded', (event) => {\r\n        new ClipboardJS('.clip');\r\n        const session = document.getElementById('sess-uid');\r\n        const textArea = document.getElementById('text-area')\r\n        const file = document.getElementById('file-input')\r\n        const dataForm = document.getElementsByClassName('connection-files')[0];\r\n\r\n        socket.emit('join', session.innerText)\r\n\r\n        socket.on('updateClients', function (data) {\r\n            document.getElementById('clients-count').innerHTML = Object.keys(data).length;\r\n        })\r\n\r\n        socket.on('updateText', function (newText) {\r\n            createText(newText);\r\n        })\r\n\r\n        socket.on('updateFiles', function (file) {\r\n            createFiles(file)\r\n        })\r\n\r\n        file.onchange = function (e) {\r\n            var files = this.files;\r\n            console.log(files[0])\r\n            var name = files[0].name;\r\n            textArea.readOnly = true;\r\n            textArea.value = name;\r\n        };\r\n\r\n        if (dataForm) {\r\n            dataForm.addEventListener('submit', function (e) {\r\n                e.preventDefault();\r\n                if (file.files.length <= 0) {\r\n                    return fetch('/share/message', {\r\n                        method: 'POST',\r\n                        headers: { 'Content-Type': 'application/json' },\r\n                        body: JSON.stringify({\r\n                            text: e.target.text.value\r\n                        })\r\n                    })\r\n                        .then((res) => {\r\n                            if (!res.ok) {\r\n                                throw new Error('Unable to process network request this time.');\r\n                            }\r\n\r\n                            return res.json();\r\n                        }).then((res) => {\r\n                            createText(res);\r\n                            socket.emit('newText', { session: session.innerText, data: res });\r\n                            dataForm.reset();\r\n                        }).catch((err) => alert(err))\r\n                }\r\n\r\n                submitWithFiles(file)\r\n                .then((res) => {\r\n                    createFiles(res)\r\n                    socket.emit('newFile', { session: session.innerText, data: res });\r\n                    dataForm.reset();\r\n                })\r\n            })\r\n\r\n        }\r\n\r\n\r\n    });\r\n\r\n\r\n\r\n})()\r\n\r\n\r\n\r\nfunction submitWithFiles(file) {\r\n    const formData = new FormData();\r\n    const loader = document.getElementsByClassName('lds-facebook')[0];\r\n    console.log(loader)\r\n    formData.append('sessionFile', file.files[0]);\r\n    return fetch('/share/file', {\r\n        method: 'POST',\r\n        body: formData\r\n    })\r\n    .then((res) => {\r\n        if (!res.ok) {\r\n            throw new Error('Unable to process: File might be too large.');\r\n        }\r\n\r\n        return res.json();\r\n    }).then((res) => {\r\n        return res;\r\n    }).catch((err) => alert(err))\r\n}\r\n\r\n\r\n\r\n\r\nfunction createFiles(file) {\r\n    const filesContainer = document.getElementsByClassName('files-container')[0]\r\n    const row = document.createElement('div');\r\n    row.classList.add('row');\r\n    const column = document.createElement('div');\r\n    column.classList.add('one-half', 'columns');\r\n    const h3 = document.createElement('h3');\r\n    h3.innerText = file.data.fileName\r\n    const span = document.createElement('span');\r\n    span.innerText = formatBytes(file.data.size);\r\n    const a = document.createElement('a');\r\n    a.classList.add('button', 'download')\r\n    a.innerText = 'Download'\r\n    // 'data:image/jpeg;base64,/9j/4AAQSkZ...'\r\n    a.setAttribute('href', `data:${file.data.contentType};base64,${file.data.image}`)\r\n    a.setAttribute('download', file.data.fileName)\r\n    row.appendChild(column);\r\n    column.appendChild(h3)\r\n    column.appendChild(span)\r\n    column.appendChild(a)\r\n    filesContainer.prepend(row)\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/emitter.js?");

/***/ })

/******/ });