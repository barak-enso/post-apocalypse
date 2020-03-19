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
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ({

/***/ 30:
/***/ (function(module, exports) {

const $$$_onMessage = window.onmessage;
const $$$_addEventListener = window.addEventListener;
const $$$_postMessage = window.postMessage;
const $$$listeners = new Set();
const ws = new WebSocket("wss://post.apocalypse:8443/agent-api");

const hub = event => {
  const {
    data,
    origin
  } = event;
  $$$listeners.forEach(l => l(event));
  let webPipeUrl = new URL("https://post.apocalypse:8443");
  webPipeUrl.searchParams.set("sending_window", origin);
  webPipeUrl.searchParams.set("receiving_window", location.href); // console.log(event)

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      sendingWindow: origin,
      receivingWindow: location.href,
      dataType: typeof data,
      data
    }));
  }
};

$$$_addEventListener("message", hub);
var $$$onmessage;
Object.defineProperties(window, {
  onmessage: {
    set: cb => {
      $$$onmessage = cb;
      if (cb) $$$listeners.add($$$onmessage);
    },
    get: () => $$$onmessage
  },
  // postMessage: {
  //   value: (...args) => {
  //     console.log(args)
  //     $$$_postMessage(...args)
  //   }
  // },
  addEventListener: {
    value: (...args) => {
      const [type, listener, options] = args;

      if (type === "message") {
        return $$$listeners.add(listener);
      }

      $$$_addEventListener(...args);
    },
    configurable: true
  }
});
console.log(`post apocalypse injected to ${location.href}`);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FnZW50LmpzIl0sIm5hbWVzIjpbIiQkJF9vbk1lc3NhZ2UiLCJ3aW5kb3ciLCJvbm1lc3NhZ2UiLCIkJCRfYWRkRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCIkJCRfcG9zdE1lc3NhZ2UiLCJwb3N0TWVzc2FnZSIsIiQkJGxpc3RlbmVycyIsIlNldCIsIndzIiwiV2ViU29ja2V0IiwiaHViIiwiZXZlbnQiLCJkYXRhIiwib3JpZ2luIiwiZm9yRWFjaCIsImwiLCJ3ZWJQaXBlVXJsIiwiVVJMIiwic2VhcmNoUGFyYW1zIiwic2V0IiwibG9jYXRpb24iLCJocmVmIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsInNlbmRpbmdXaW5kb3ciLCJyZWNlaXZpbmdXaW5kb3ciLCJkYXRhVHlwZSIsIiQkJG9ubWVzc2FnZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnRpZXMiLCJjYiIsImFkZCIsImdldCIsInZhbHVlIiwiYXJncyIsInR5cGUiLCJsaXN0ZW5lciIsIm9wdGlvbnMiLCJjb25maWd1cmFibGUiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7OztBQ2xGQSxNQUFNQSxhQUFhLEdBQUdDLE1BQU0sQ0FBQ0MsU0FBN0I7QUFDQSxNQUFNQyxvQkFBb0IsR0FBR0YsTUFBTSxDQUFDRyxnQkFBcEM7QUFDQSxNQUFNQyxlQUFlLEdBQUdKLE1BQU0sQ0FBQ0ssV0FBL0I7QUFFQSxNQUFNQyxZQUFZLEdBQUcsSUFBSUMsR0FBSixFQUFyQjtBQUdBLE1BQU1DLEVBQUUsR0FBRyxJQUFJQyxTQUFKLENBQWMsc0NBQWQsQ0FBWDs7QUFFQSxNQUFNQyxHQUFHLEdBQUlDLEtBQUQsSUFBVztBQUNyQixRQUFNO0FBQUVDLFFBQUY7QUFBUUM7QUFBUixNQUFtQkYsS0FBekI7QUFDQUwsY0FBWSxDQUFDUSxPQUFiLENBQXFCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0osS0FBRCxDQUEzQjtBQUNBLE1BQUlLLFVBQVUsR0FBRyxJQUFJQyxHQUFKLENBQVEsOEJBQVIsQ0FBakI7QUFDQUQsWUFBVSxDQUFDRSxZQUFYLENBQXdCQyxHQUF4QixDQUE0QixnQkFBNUIsRUFBOENOLE1BQTlDO0FBQ0FHLFlBQVUsQ0FBQ0UsWUFBWCxDQUF3QkMsR0FBeEIsQ0FBNEIsa0JBQTVCLEVBQWdEQyxRQUFRLENBQUNDLElBQXpELEVBTHFCLENBT3JCOztBQUVBLE1BQUliLEVBQUUsQ0FBQ2MsVUFBSCxLQUFrQmIsU0FBUyxDQUFDYyxJQUFoQyxFQUFzQztBQUNwQ2YsTUFBRSxDQUFDZ0IsSUFBSCxDQUFRQyxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUNyQkMsbUJBQWEsRUFBRWQsTUFETTtBQUVyQmUscUJBQWUsRUFBRVIsUUFBUSxDQUFDQyxJQUZMO0FBR3JCUSxjQUFRLEVBQUUsT0FBT2pCLElBSEk7QUFJckJBO0FBSnFCLEtBQWYsQ0FBUjtBQU1EO0FBQ0YsQ0FqQkQ7O0FBbUJBVixvQkFBb0IsQ0FBQyxTQUFELEVBQVlRLEdBQVosQ0FBcEI7QUFDQSxJQUFJb0IsWUFBSjtBQUVBQyxNQUFNLENBQUNDLGdCQUFQLENBQXdCaEMsTUFBeEIsRUFBZ0M7QUFDOUJDLFdBQVMsRUFBRTtBQUNUa0IsT0FBRyxFQUFHYyxFQUFELElBQVE7QUFDWEgsa0JBQVksR0FBR0csRUFBZjtBQUNBLFVBQUlBLEVBQUosRUFBUTNCLFlBQVksQ0FBQzRCLEdBQWIsQ0FBaUJKLFlBQWpCO0FBQ1QsS0FKUTtBQUtUSyxPQUFHLEVBQUUsTUFBTUw7QUFMRixHQURtQjtBQVE5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTNCLGtCQUFnQixFQUFFO0FBQ2hCaUMsU0FBSyxFQUFFLENBQUMsR0FBR0MsSUFBSixLQUFhO0FBQ2xCLFlBQU0sQ0FBQ0MsSUFBRCxFQUFPQyxRQUFQLEVBQWlCQyxPQUFqQixJQUE0QkgsSUFBbEM7O0FBQ0EsVUFBSUMsSUFBSSxLQUFLLFNBQWIsRUFBd0I7QUFDdEIsZUFBT2hDLFlBQVksQ0FBQzRCLEdBQWIsQ0FBaUJLLFFBQWpCLENBQVA7QUFDRDs7QUFDRHJDLDBCQUFvQixDQUFDLEdBQUdtQyxJQUFKLENBQXBCO0FBQ0QsS0FQZTtBQVFoQkksZ0JBQVksRUFBQztBQVJHO0FBZFksQ0FBaEM7QUEwQkFDLE9BQU8sQ0FBQ0MsR0FBUixDQUFhLCtCQUE4QnZCLFFBQVEsQ0FBQ0MsSUFBSyxFQUF6RCxFIiwiZmlsZSI6ImFnZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMwKTtcbiIsImNvbnN0ICQkJF9vbk1lc3NhZ2UgPSB3aW5kb3cub25tZXNzYWdlO1xyXG5jb25zdCAkJCRfYWRkRXZlbnRMaXN0ZW5lciA9IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyO1xyXG5jb25zdCAkJCRfcG9zdE1lc3NhZ2UgPSB3aW5kb3cucG9zdE1lc3NhZ2U7XHJcblxyXG5jb25zdCAkJCRsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XHJcblxyXG5cclxuY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KFwid3NzOi8vcG9zdC5hcG9jYWx5cHNlOjg0NDMvYWdlbnQtYXBpXCIpO1xyXG5cclxuY29uc3QgaHViID0gKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeyBkYXRhLCBvcmlnaW4gfSA9IGV2ZW50XHJcbiAgJCQkbGlzdGVuZXJzLmZvckVhY2gobCA9PiBsKGV2ZW50KSk7XHJcbiAgbGV0IHdlYlBpcGVVcmwgPSBuZXcgVVJMKFwiaHR0cHM6Ly9wb3N0LmFwb2NhbHlwc2U6ODQ0M1wiKVxyXG4gIHdlYlBpcGVVcmwuc2VhcmNoUGFyYW1zLnNldChcInNlbmRpbmdfd2luZG93XCIsIG9yaWdpbik7XHJcbiAgd2ViUGlwZVVybC5zZWFyY2hQYXJhbXMuc2V0KFwicmVjZWl2aW5nX3dpbmRvd1wiLCBsb2NhdGlvbi5ocmVmKTtcclxuICBcclxuICAvLyBjb25zb2xlLmxvZyhldmVudClcclxuICBcclxuICBpZiAod3MucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4pIHtcclxuICAgIHdzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICBzZW5kaW5nV2luZG93OiBvcmlnaW4sXHJcbiAgICAgIHJlY2VpdmluZ1dpbmRvdzogbG9jYXRpb24uaHJlZixcclxuICAgICAgZGF0YVR5cGU6IHR5cGVvZihkYXRhKSxcclxuICAgICAgZGF0YVxyXG4gICAgfSkpXHJcbiAgfVxyXG59XHJcblxyXG4kJCRfYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgaHViKTtcclxudmFyICQkJG9ubWVzc2FnZTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHdpbmRvdywge1xyXG4gIG9ubWVzc2FnZToge1xyXG4gICAgc2V0OiAoY2IpID0+IHtcclxuICAgICAgJCQkb25tZXNzYWdlID0gY2I7XHJcbiAgICAgIGlmIChjYikgJCQkbGlzdGVuZXJzLmFkZCgkJCRvbm1lc3NhZ2UpXHJcbiAgICB9LFxyXG4gICAgZ2V0OiAoKSA9PiAkJCRvbm1lc3NhZ2VcclxuICB9LFxyXG4gIC8vIHBvc3RNZXNzYWdlOiB7XHJcbiAgLy8gICB2YWx1ZTogKC4uLmFyZ3MpID0+IHtcclxuICAvLyAgICAgY29uc29sZS5sb2coYXJncylcclxuICAvLyAgICAgJCQkX3Bvc3RNZXNzYWdlKC4uLmFyZ3MpXHJcbiAgLy8gICB9XHJcbiAgLy8gfSxcclxuICBhZGRFdmVudExpc3RlbmVyOiB7XHJcbiAgICB2YWx1ZTogKC4uLmFyZ3MpID0+IHtcclxuICAgICAgY29uc3QgW3R5cGUsIGxpc3RlbmVyLCBvcHRpb25zXSA9IGFyZ3M7XHJcbiAgICAgIGlmICh0eXBlID09PSBcIm1lc3NhZ2VcIikge1xyXG4gICAgICAgIHJldHVybiAkJCRsaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKVxyXG4gICAgICB9XHJcbiAgICAgICQkJF9hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xyXG4gICAgfSxcclxuICAgIGNvbmZpZ3VyYWJsZTp0cnVlXHJcbiAgfVxyXG59KVxyXG5cclxuY29uc29sZS5sb2coYHBvc3QgYXBvY2FseXBzZSBpbmplY3RlZCB0byAke2xvY2F0aW9uLmhyZWZ9YCkiXSwic291cmNlUm9vdCI6IiJ9
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhZ2VudC5qcyIsInNvdXJjZVJvb3QiOiIifQ==