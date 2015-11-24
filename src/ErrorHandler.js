/**
 * Copyright 2015 Fabian Grutschus. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the copyright holders.
 *
 * @author    Fabian Grutschus <f.grutschus@lubyte.de>
 * @copyright 2015 Fabian Grutschus. All rights reserved.
 * @license   BSD-2-Clause
 */

;(function (global, storage) {

    var originalOnError = function () {};
    if (typeof global.onerror === "function") {
        originalOnError = global.onerror;
    }

    var E = {
        storageKey: "fabiang_error_handler",
        register: function () {
            global.onerror = function () {
                var args = Array.prototype.slice.call(arguments);
                E.handle.apply(null, args);
                originalOnError.apply(null, args);
            };
            E.registerForjQuery();
        },
        registerForjQuery: function () {
            if (typeof global.jQuery === "function") {
                jQuery(global.document).ajaxError(function (e, xhr, settings, message) {
                    var error = {
                        message: message.length > 0 ? message : "Unknown error",
                        method: settings.type,
                        url: settings.url,
                        type: "ajaxError"
                    };
                    E.store(error);
                });
            }
        },
        handle: function (message, filename, lineno, column) {
            var error = {
                message: message,
                filename: filename,
                lineno: lineno,
                column: column,
                type: "error"
            };
            E.store(error);
        },
        store: function (error) {
            var errors = E.get();
            errors.push(error);
            storage.setItem(E.storageKey, JSON.stringify(errors));
        },
        get: function () {
            if (null !== storage.getItem(E.storageKey)) {
                return JSON.parse(storage.getItem(E.storageKey));
            }
            return [];
        },
        clear: function () {
            storage.setItem(E.storageKey, "[]");
        }
    };

    global.ErrorHandler = E;
    E.register();

}(this, localStorage));
