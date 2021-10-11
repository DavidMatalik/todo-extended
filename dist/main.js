/******/ var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***!
  \*********************************************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function (record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
 true ? module.exports : 0);

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js");

/***/ }),

/***/ "./auth/config.js":
/*!************************!*\
  !*** ./auth/config.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFirebaseClient": () => (/* binding */ getFirebaseClient)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyCGGMhr7m0KCFIM0ZgJOASzE1d2CF3KXJ8',
  authDomain: 'todo-extended.firebaseapp.com',
  databaseURL: 'https://todo-extended-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'todo-extended',
  storageBucket: 'todo-extended.appspot.com',
  messagingSenderId: '462240940597',
  appId: '1:462240940597:web:abbd267b519e7284b7277c'
}; // this is a working example of lazy loading firebase
// use of firebase esm files for webpack config in esm style

function getFirebaseClient() {
  return _getFirebaseClient.apply(this, arguments);
}

function _getFirebaseClient() {
  _getFirebaseClient = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__.default)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.mark(function _callee() {
    var _yield$import, firebase;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_firebase_app_dist_index_esm_js"), __webpack_require__.e("node_modules_firebase_app_dist_index_esm_js")]).then(__webpack_require__.bind(__webpack_require__, /*! firebase/app/dist/index.esm.js */ "./node_modules/firebase/app/dist/index.esm.js"));

          case 2:
            _yield$import = _context.sent;
            firebase = _yield$import["default"];
            _context.next = 6;
            return Promise.all([Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_firebase_app_dist_index_esm_js"), __webpack_require__.e("vendors-node_modules_firebase_auth_dist_index_esm_js")]).then(__webpack_require__.bind(__webpack_require__, /*! firebase/auth/dist/index.esm.js */ "./node_modules/firebase/auth/dist/index.esm.js")), Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_firebase_app_dist_index_esm_js"), __webpack_require__.e("vendors-node_modules_firebase_database_dist_index_esm_js")]).then(__webpack_require__.bind(__webpack_require__, /*! firebase/database/dist/index.esm.js */ "./node_modules/firebase/database/dist/index.esm.js")), Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_firebase_app_dist_index_esm_js"), __webpack_require__.e("vendors-node_modules_firebase_auth_dist_index_esm_js"), __webpack_require__.e("vendors-node_modules_firebaseui_dist_esm_js")]).then(__webpack_require__.bind(__webpack_require__, /*! firebaseui/dist/esm.js */ "./node_modules/firebaseui/dist/esm.js")), __webpack_require__.e(/*! import() */ "vendors-node_modules_firebaseui_dist_firebaseui_css").then(__webpack_require__.bind(__webpack_require__, /*! firebaseui/dist/firebaseui.css */ "./node_modules/firebaseui/dist/firebaseui.css"))]);

          case 6:
            firebase.initializeApp(firebaseConfig);
            return _context.abrupt("return", firebase);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getFirebaseClient.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./src/controller/controller.js":
/*!**************************************!*\
  !*** ./src/controller/controller.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "itemsCreationController": () => (/* binding */ itemsCreationController),
/* harmony export */   "itemValidationController": () => (/* binding */ itemValidationController),
/* harmony export */   "listsControllerFactory": () => (/* binding */ listsControllerFactory),
/* harmony export */   "tasksControllerFactory": () => (/* binding */ tasksControllerFactory)
/* harmony export */ });
// Code specifically for tasks
var tasksControllerFactory = function tasksControllerFactory() {
  return {};
}; // Code specifically for lists


var listsControllerFactory = function listsControllerFactory() {
  return {};
}; // Controller-Mixin to create items for tasks, lists, undertasks


var itemsCreationController = function itemsCreationController(itemsView, itemsModel) {
  function onClickAddItem() {
    itemsView.setNewItemText();
    itemsModel.addItem(itemsView.newItemText);
    itemsView.renderExistingItems(itemsModel.data);
  }

  function onClickDeleteItem(event) {
    var itemToDeleteID = event.target.dataset.itemid;
    itemsModel.deleteItem(itemToDeleteID);
    itemsView.renderExistingItems(itemsModel.data);
  }

  function initialize() {
    itemsView.onClickAddItem = onClickAddItem;
    itemsView.onClickDeleteItem = onClickDeleteItem;
    itemsView.initialize();
  }

  return {
    initialize: initialize
  };
}; // Controller-Mixin to validate user input for tasks, lists, undertasks


var itemValidationController = function itemValidationController() {
  return {};
};



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../auth/config.js */ "./auth/config.js");
/* harmony import */ var _view_view_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view/view.js */ "./src/view/view.js");
/* harmony import */ var _model_model_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/model.js */ "./src/model/model.js");
/* harmony import */ var _controller_controller_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controller/controller.js */ "./src/controller/controller.js");
// using ES6 imports:
// full qualified path for webpack esm style



 // Shortcuts to DOM Elements.

var containerElement = document.getElementById('container'); // Small Firebase Test
// Lazy load firebase
// this is not working => ToDo: we need to know why
// const firebase = async () => { await getFirebaseClient() }
// console.log(firebase)
// ToDo: We need a better approach

var firebase = await (0,_auth_config_js__WEBPACK_IMPORTED_MODULE_0__.getFirebaseClient)(); // Initialize the FirebaseUI Widget using Firebase.
// eslint-disable-next-line no-undef

var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function signInSuccessWithAuthResult(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      if (authResult.user) {
        handleSignedInUser(authResult.user);
      }

      writeUserData(authResult.user.uid, authResult.user.displayName, authResult.user.email, null);
      containerElement.removeAttribute('hidden'); // Do not redirect.

      return false;
    },
    uiShown: function uiShown() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
      console.log('uiShown');
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  // signInSuccessUrl: 'https://todo-extended.web.app/',
  signInOptions: [// Leave the lines as is for the providers you want to offer your users.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
}; // The start method will wait until the DOM is loaded.

ui.start('#firebaseui-auth-container', uiConfig);

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}
/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */


var handleSignedInUser = function handleSignedInUser(user) {
  containerElement.style.display = 'block';
  document.getElementById('firebaseui-auth-container').style.display = 'none';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phoneNumber;

  if (user.photoURL) {
    var photoURL = user.photoURL; // Append size to the photo URL for Google hosted images to avoid requesting
    // the image with its original resolution (using more bandwidth than needed)
    // when it is going to be presented in smaller size.

    if (photoURL.indexOf('googleusercontent.com') != -1 || photoURL.indexOf('ggpht.com') != -1) {
      photoURL = photoURL + '?sz=' + document.getElementById('photo').clientHeight;
    }

    document.getElementById('photo').src = photoURL;
    document.getElementById('photo').style.display = 'block';
  } else {
    document.getElementById('photo').style.display = 'none';
  }
};
/**
 * Displays the UI for a signed out user.
 */


var handleSignedOutUser = function handleSignedOutUser() {
  containerElement.style.display = 'none';
  document.getElementById('firebaseui-auth-container').style.display = 'block';
  ui.start('#firebaseui-auth-container', uiConfig);
}; // Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.


firebase.auth().onAuthStateChanged(function (user) {
  document.getElementById('loader').style.display = 'none'; // document.getElementById('loaded').style.display = 'block';

  user ? handleSignedInUser(user) : handleSignedOutUser();
});
/**
 * Deletes the user's account.
 */

var deleteAccount = function deleteAccount() {
  var user = firebase.auth().currentUser; // delete user in database

  firebase.database().ref('users/' + user.uid).remove().then(function (error) {
    if (error) {
      console.log(error.message);
    } else {
      // delete firebase user authentication
      firebase.auth().currentUser["delete"]()["catch"](function (error) {
        if (error.code == 'auth/requires-recent-login') {
          // The user's credential is too old. She needs to sign in again.
          firebase.auth().signOut().then(function () {
            // The timeout allows the message to be displayed after the UI has
            // changed to the signed out state.
            setTimeout(function () {
              alert('Please sign in again to delete your account.');
            }, 1);
          });
        }
      });
      alert('Your account was successfully deleted.');
    }
  });
}; // Everything for tasks


var tasksTargetElement = document.getElementById('tasks');
var tasksTargetButton = document.getElementById('task-add');
var tasksTargetField = document.getElementById('task-input');
var initialTasksData = [];
var tasksViewSpecifics = (0,_view_view_js__WEBPACK_IMPORTED_MODULE_1__.tasksViewFactory)(tasksTargetElement, tasksTargetButton, tasksTargetField);
var tasksCreationView = (0,_view_view_js__WEBPACK_IMPORTED_MODULE_1__.itemsCreationView)('task');
var tasksView = Object.assign({}, tasksViewSpecifics, tasksCreationView);
var tasksModelSpecifics = (0,_model_model_js__WEBPACK_IMPORTED_MODULE_2__.tasksModelFactory)();
var tasksCreationModel = (0,_model_model_js__WEBPACK_IMPORTED_MODULE_2__.itemsCreationModel)(initialTasksData);
var tasksModel = Object.assign({}, tasksModelSpecifics, tasksCreationModel);
var tasksControllerSpecifics = (0,_controller_controller_js__WEBPACK_IMPORTED_MODULE_3__.tasksControllerFactory)();
var tasksCreationController = (0,_controller_controller_js__WEBPACK_IMPORTED_MODULE_3__.itemsCreationController)(tasksView, tasksModel);
var tasksController = Object.assign({}, tasksControllerSpecifics, tasksCreationController);
tasksController.initialize(); // Everything for lists

var listsTargetElement = document.getElementById('lists');
var listsTargetButton = document.getElementById('list-add');
var listsTargetField = document.getElementById('list-input');
var initialListsData = [];
var listsViewSpecifics = (0,_view_view_js__WEBPACK_IMPORTED_MODULE_1__.listsViewFactory)(listsTargetElement, listsTargetButton, listsTargetField);
var listsCreationView = (0,_view_view_js__WEBPACK_IMPORTED_MODULE_1__.itemsCreationView)('list');
var listsView = Object.assign({}, listsViewSpecifics, listsCreationView);
var listsModelSpecifics = (0,_model_model_js__WEBPACK_IMPORTED_MODULE_2__.listsModelFactory)();
var listsCreationModel = (0,_model_model_js__WEBPACK_IMPORTED_MODULE_2__.itemsCreationModel)(initialListsData);
var listsModel = Object.assign({}, listsModelSpecifics, listsCreationModel);
var listsControllerSpecifics = (0,_controller_controller_js__WEBPACK_IMPORTED_MODULE_3__.listsControllerFactory)();
var listsCreationController = (0,_controller_controller_js__WEBPACK_IMPORTED_MODULE_3__.itemsCreationController)(listsView, listsModel);
var listsController = Object.assign({}, listsControllerSpecifics, listsCreationController);
listsController.initialize();
/**
 * Initializes the app.
 */

var initApp = function initApp() {
  document.getElementById('sign-out').addEventListener('click', function () {
    firebase.auth().signOut();
  });
  document.getElementById('delete-account').addEventListener('click', function () {
    deleteAccount();
  });
};

window.addEventListener('load', initApp);
/* logic of todo app

1. Describe in your own words what this app should look like and do

    - Look and Feel:
        Top      - task input field with add button
            Later: search field
        Mid      -tasks with delete button
            Headline with current Listname and editButton/deleteButton
        Right    - clicked task
            TaskName editable
            TaskNotes editable
            Later: change to Project button
        Left     - lists container
            List input field with add button
            Current list highlighted

    - Start screen:
        Defaults to Inbox list

    - Do:

        Create task after user entered one and pressed on add
        Delete task after user clicked on delete of one task
        Show task in Detail on the right side after user clicked on it
            Make taskName editable after user clicked on it
            Make taskNote editable after user clicked on it
        Move task around when user clicks on it and holds click
            Show visual help where task would go
            Place task when user doesn't hold click anymore

        Create list after user entered one and pressed on add
        Make listName editable after user clicked on editButton
            Rename listName after user pressed enter
        Check after user clicked on deleteButton: tasks in this list?
            If yes ask user if really delete it with all containing tasks
                If yes delete list with all containing taks
                If no forget about delete wish of user
            If no delete list

        Later: keep the deleted tasks of the last 3 days in a deletedlist
        --> User can somehow undo deletion

2. Algorithm: Plan how to realize your app - describe code in plain english

- index.js for initializing and connecting everything
        import functions from domStuff
        import functions from todoController
        call renderStartpage
        create

- Module for taskModel
    attr: taskID
    attr: taskName
    attr: taskNote

    func: setTaskID --> automatically when task is created
    func: getTaskID
    func: setTaskName
    func: getTaskName
    func: setTaskNote
    func: getTaskNote
    func: deleteTask

    - Module for taskView, inject: htmlContainer
    attr: onClickRenderDetails = null;

    - Module for taskController

PenguinView.prototype.render = function render(viewModel) {
  this.element.innerHTML = '<h3>' + viewModel.name + '</h3>' +
    '<img class="penguin-image" src="' + viewModel.imageUrl +
      '" alt="' + viewModel.name + '" />' +
    '<p><b>Size:</b> ' + viewModel.size + '</p>' +
    '<p><b>Favorite food:</b> ' + viewModel.favoriteFood + '</p>' +
    '<a id="previousPenguin" class="previous button" href="javascript:void(0);"' +
      ' data-penguin-index="' + viewModel.previousIndex + '">Previous</a> ' +
    '<a id="nextPenguin" class="next button" href="javascript:void(0);"' +
      ' data-penguin-index="' + viewModel.nextIndex + '">Next</a>';

  ??this.previousIndex = viewModel.previousIndex;
  ??this.nextIndex = viewModel.nextIndex;

  var previousPenguin = this.element.querySelector('#previousPenguin');
  previousPenguin.addEventListener('click', this.onClickGetPenguin);
};

var TasksView = function TasksView(htmlElement) {
    this.htmlElement = htmlElement;
    this.onClickAddTask = null;
}

TasksView.prototype.render = function render(viewModel) {
    this.htmlElement = viewModel.forEach(renderOneTask);

    function renderOneTask(task) {
        `<p> ${task}</p>`
    }

    var addTask = this.htmlElement.querySelector('#addTask');
    addTask.addEventListener('click', this.onClickAddTask);
}

var tasksTargetElement = document.getElementById('taskContainer');

var taskView = new TasksView(tasksTargetElement);

taskView.onClickAddTask

var testModel = ['dfdsfsdfsdf', '23432423432df'];

taskView.render(testModel);

2. Algorithm: Plan how to realize your app - describe code in plain english

    - index.js for initializing and connecting everything
        import functions from domStuff
        import functions from todoController
        call renderStartpage
        create

    - Module for taskFactory
        attr: taskID
        attr: taskName
        attr: taskNote

        func: setTaskID --> automatically when task is created
        func: getTaskID
        func: setTaskName
        func: getTaskName
        func: setTaskNote
        func: getTaskNote
        func: deleteTask

    - Module for listFactory
        attr: lListID
        attr: listName
        attr: assignedTasks(array or object?)

        func: addTask
        func: removeTask
        func: changeOrderAssigendTasks(task, new place)
        func: setListID
        func: getListID
        func: setListName
        func: getListName
        func: deletelist

    - Module for renderStartUI
        attr: assignedTasksToList (to all created lists? Or only active one?)
        func: renderStartPage
                call renderListTabs
                call renderActiveListTasks(inbox)
                call highlightActiveListTab
                call initListeners
        func: renderListTabs
        func: renderActiveListTasks(activeList)
        func: highlightActiveListTab

        func: initListeners
            call addListenerToLists
            call
            call
        func: listenToLists        --> call renderAsignedTasks
                                   --> call highlightActiveListTab
        func: listenToOneTask(cl)  --> call renderTaskDetails
        func: listenToOneTaks(clh) --> call moveTask
            to active task
                taskName input field + enter --> changeTaskName
                taskNote input field + enter --> changeTaskNote
        func: listenToListDelete   --> call validateListDelete from TodoController
        func: listenToListEdit     --> call validateListEdit from TodoController
        func: listenToAllTasks     --> call listenToOneTask(cl)
                                   --> call listenToOneTaks(clh)
        func: listenToTaskDelete   --> call deleteTask(task) from todoController
        func: renderTaskDetails(task)
        func: addTasktoView --> display this task next to the already displayed tasks
        func: deleteTaskfromView --> possible without rendering all other tasks?
                                 --> delete task from assignedTaskstoList
        func: moveTaskInList --> change assigned tasks order in temporarily generated array
                                 render the tasks appropriately (rendering all new needed?)

    - Module for todoController

        func: addTask         --> create new task object with taskFactory
                              --> call addTasktoView from domStuff
                              --> put reference to created task into the right list
                              (--> call storeTask from taskStorage)

        func: deleteTask(task)--> delete task object
                              --> call deleteTaskfromView from domStuff
                              --> call deleteTask from right list
                              (--> call deleteTask from taskStorage)

        func: moveTask        --> if inside: call moveTaskinList from domStuff
                                             call list.changeOrderAssignedTasks

                              --> if outside: call newList.addTask
                                              call oldList.deleteTask

        func: addList         --> create new list object with listFactory
        func: list.delete
        func: validateListDelete
        func: validateListEdit

    - At the end: Module for taskStorage

        attr: allTasks (also with reference to the list? Maybe for performance?)
        func: deleteTask (later: put into attr deletedTask for 3 days)
        func: storeTask
        func: getAllTasks

3. Divide your plan further and code

    Kommt das ganze validation Zeugs als best practice in die setter der objects rein?
    Von meinem Verständnis her ja --> Also validation methods oben entsprechend abändern/verschieben.

    - Validate: is there a taskName or listName entered?

    Falls ich assigendTasks mit object löse --> Reihenfolge fürs Rendern?
    Wie die Reihe ist? Oder noch extra attribute wie z.B. Nummer/platz hinzufügen?

*/
__webpack_handle_async_dependencies__();
}, 1);

/***/ }),

/***/ "./src/model/model.js":
/*!****************************!*\
  !*** ./src/model/model.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "itemsCreationModel": () => (/* binding */ itemsCreationModel),
/* harmony export */   "itemValidationModel": () => (/* binding */ itemValidationModel),
/* harmony export */   "tasksModelFactory": () => (/* binding */ tasksModelFactory),
/* harmony export */   "listsModelFactory": () => (/* binding */ listsModelFactory)
/* harmony export */ });
// Code specifically for tasks
var tasksModelFactory = function tasksModelFactory() {
  return {};
}; // Code specifically for lists


var listsModelFactory = function listsModelFactory() {
  return {};
}; // Model-Mixin to create items for tasks, lists, undertasks


var itemsCreationModel = function itemsCreationModel(data) {
  var creationCounter = 0;

  var addItem = function addItem(itemText) {
    var newItemObject = {
      id: this.creationCounter,
      text: itemText
    };
    data.push(newItemObject);
    this.creationCounter++;
  };

  var deleteItem = function deleteItem(itemObjectID) {
    itemObjectID = parseInt(itemObjectID); // eslint-disable-next-line array-callback-return

    var indexItemToDelete = data.findIndex(function (currentItem) {
      if (currentItem.id === itemObjectID) {
        return true;
      }
    });
    data.splice(indexItemToDelete, 1);
  };

  return {
    data: data,
    addItem: addItem,
    deleteItem: deleteItem,
    creationCounter: creationCounter
  };
}; // Model-Mixin to validate user input for tasks, lists, undertasks


var itemValidationModel = function itemValidationModel() {
  return {};
};



/***/ }),

/***/ "./src/view/view.js":
/*!**************************!*\
  !*** ./src/view/view.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "itemsCreationView": () => (/* binding */ itemsCreationView),
/* harmony export */   "itemValidationView": () => (/* binding */ itemValidationView),
/* harmony export */   "listsViewFactory": () => (/* binding */ listsViewFactory),
/* harmony export */   "tasksViewFactory": () => (/* binding */ tasksViewFactory)
/* harmony export */ });
// Code specifically for tasks
var tasksViewFactory = function tasksViewFactory(htmlElement, addButton, inputField) {
  return {
    htmlElement: htmlElement,
    addButton: addButton,
    inputField: inputField
  };
}; // Code specifically for lists


var listsViewFactory = function listsViewFactory(htmlElement, addButton, inputField) {
  return {
    htmlElement: htmlElement,
    addButton: addButton,
    inputField: inputField
  };
}; // View-Mixin to create items for tasks, lists, undertasks


var itemsCreationView = function itemsCreationView(itemName) {
  var onClickAddItem = null;
  var onClickDeleteItem = null;

  function initialize() {
    this.addButton.addEventListener('click', this.onClickAddItem);
  }

  ;

  function setNewItemText() {
    this.newItemText = this.inputField.value;
  }

  function renderExistingItems(viewModel) {
    this.inputField.value = '';
    this.htmlElement.innerHTML = '';
    viewModel.forEach(renderOneItem, this);
  }

  ;

  function renderOneItem(itemObject) {
    var itemID = itemObject.id;
    var p = document.createElement('p');
    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'del';
    deleteButton.dataset.itemid = itemID;
    deleteButton.classList.add("delete-".concat(itemName, "-button"));
    deleteButton.addEventListener('click', this.onClickDeleteItem);
    p.innerHTML = itemObject.text;
    p.appendChild(deleteButton);
    p.classList.add("".concat(itemName));
    this.htmlElement.appendChild(p);
  }

  ;
  return {
    initialize: initialize,
    setNewItemText: setNewItemText,
    renderExistingItems: renderExistingItems,
    onClickAddItem: onClickAddItem,
    onClickDeleteItem: onClickDeleteItem
  };
}; // View-Mixin to validate user input for tasks, lists, undertasks


var itemValidationView = function itemValidationView() {
  return {};
};



/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the modules object (__webpack_modules__)
/******/ __webpack_require__.m = __webpack_modules__;
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/amd define */
/******/ (() => {
/******/ 	__webpack_require__.amdD = function () {
/******/ 		throw new Error('define cannot be used indirect');
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var completeQueue = (queue) => {
/******/ 		if(queue) {
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var completeFunction = (fn) => (!--fn.r && fn());
/******/ 	var queueFunction = (queue, fn) => (queue ? queue.push(fn) : completeFunction(fn));
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackThen]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					completeQueue(queue);
/******/ 					queue = 0;
/******/ 				});
/******/ 				var obj = {};
/******/ 											obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep.catch(reject));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 							ret[webpackThen] = (fn) => (completeFunction(fn));
/******/ 							ret[webpackExports] = dep;
/******/ 							return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue = hasAwait && [];
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var isEvaluating = true;
/******/ 		var nested = false;
/******/ 		var whenAll = (deps, onResolve, onReject) => {
/******/ 			if (nested) return;
/******/ 			nested = true;
/******/ 			onResolve.r += deps.length;
/******/ 			deps.map((dep, i) => (dep[webpackThen](onResolve, onReject)));
/******/ 			nested = false;
/******/ 		};
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackThen] = (fn, rejectFn) => {
/******/ 			if (isEvaluating) { return completeFunction(fn); }
/******/ 			if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 			queueFunction(queue, fn);
/******/ 			promise.catch(rejectFn);
/******/ 		};
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			if(!deps) return outerResolve();
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn, result;
/******/ 			var promise = new Promise((resolve, reject) => {
/******/ 				fn = () => (resolve(result = currentDeps.map((d) => (d[webpackExports]))));
/******/ 				fn.r = 0;
/******/ 				whenAll(currentDeps, fn, reject);
/******/ 			});
/******/ 			return fn.r ? promise : result;
/******/ 		}).then(outerResolve, reject);
/******/ 		isEvaluating = false;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/ensure chunk */
/******/ (() => {
/******/ 	__webpack_require__.f = {};
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = (chunkId) => {
/******/ 		return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 			__webpack_require__.f[key](chunkId, promises);
/******/ 			return promises;
/******/ 		}, []));
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/get javascript chunk filename */
/******/ (() => {
/******/ 	// This function allow to reference async chunks
/******/ 	__webpack_require__.u = (chunkId) => {
/******/ 		// return url for filenames based on template
/******/ 		return "" + chunkId + ".main.js";
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/global */
/******/ (() => {
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ })();
/******/ 
/******/ /* webpack/runtime/harmony module decorator */
/******/ (() => {
/******/ 	__webpack_require__.hmd = (module) => {
/******/ 		module = Object.create(module);
/******/ 		if (!module.children) module.children = [];
/******/ 		Object.defineProperty(module, 'exports', {
/******/ 			enumerable: true,
/******/ 			set: () => {
/******/ 				throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 			}
/******/ 		});
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/load script */
/******/ (() => {
/******/ 	var inProgress = {};
/******/ 	var dataWebpackPrefix = "todo:";
/******/ 	// loadScript function to load a script via script tag
/******/ 	__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 		if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 		var script, needAttach;
/******/ 		if(key !== undefined) {
/******/ 			var scripts = document.getElementsByTagName("script");
/******/ 			for(var i = 0; i < scripts.length; i++) {
/******/ 				var s = scripts[i];
/******/ 				if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 			}
/******/ 		}
/******/ 		if(!script) {
/******/ 			needAttach = true;
/******/ 			script = document.createElement('script');
/******/ 			script.type = "module";
/******/ 			script.charset = 'utf-8';
/******/ 			script.timeout = 120;
/******/ 			if (__webpack_require__.nc) {
/******/ 				script.setAttribute("nonce", __webpack_require__.nc);
/******/ 			}
/******/ 			script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 			script.src = url;
/******/ 		}
/******/ 		inProgress[url] = [done];
/******/ 		var onScriptComplete = (prev, event) => {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var doneFns = inProgress[url];
/******/ 			delete inProgress[url];
/******/ 			script.parentNode && script.parentNode.removeChild(script);
/******/ 			doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 			if(prev) return prev(event);
/******/ 		}
/******/ 		;
/******/ 		var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 		script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 		script.onload = onScriptComplete.bind(null, script.onload);
/******/ 		needAttach && document.head.appendChild(script);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	var scriptUrl;
/******/ 	if (typeof import.meta.url === "string") scriptUrl = import.meta.url
/******/ 	// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 	// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 	if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 	scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 	__webpack_require__.p = scriptUrl;
/******/ })();
/******/ 
/******/ /* webpack/runtime/jsonp chunk loading */
/******/ (() => {
/******/ 	// no baseURI
/******/ 	
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/ 	
/******/ 	__webpack_require__.f.j = (chunkId, promises) => {
/******/ 			// JSONP chunk loading for javascript
/******/ 			var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 			if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 	
/******/ 				// a Promise means "currently loading".
/******/ 				if(installedChunkData) {
/******/ 					promises.push(installedChunkData[2]);
/******/ 				} else {
/******/ 					if(true) { // all chunks have JS
/******/ 						// setup Promise in chunk cache
/******/ 						var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 						promises.push(installedChunkData[2] = promise);
/******/ 	
/******/ 						// start chunk loading
/******/ 						var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 						// create error before stack unwound to get useful stacktrace later
/******/ 						var error = new Error();
/******/ 						var loadingEnded = (event) => {
/******/ 							if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 								installedChunkData = installedChunks[chunkId];
/******/ 								if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 								if(installedChunkData) {
/******/ 									var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 									var realSrc = event && event.target && event.target.src;
/******/ 									error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 									error.name = 'ChunkLoadError';
/******/ 									error.type = errorType;
/******/ 									error.request = realSrc;
/******/ 									installedChunkData[1](error);
/******/ 								}
/******/ 							}
/******/ 						};
/******/ 						__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 					} else installedChunks[chunkId] = 0;
/******/ 				}
/******/ 			}
/******/ 	};
/******/ 	
/******/ 	// no prefetching
/******/ 	
/******/ 	// no preloaded
/******/ 	
/******/ 	// no HMR
/******/ 	
/******/ 	// no HMR manifest
/******/ 	
/******/ 	// no on chunks loaded
/******/ 	
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 		var [chunkIds, moreModules, runtime] = data;
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0;
/******/ 		if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 		}
/******/ 		if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				installedChunks[chunkId][0]();
/******/ 			}
/******/ 			installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 	
/******/ 	}
/******/ 	
/******/ 	var chunkLoadingGlobal = self["webpackChunktodo"] = self["webpackChunktodo"] || [];
/******/ 	chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 	chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 

//# sourceMappingURL=main.js.map