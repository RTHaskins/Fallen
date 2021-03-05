/*!
 * pixi-sound - v2.1.3
 * https://github.com/pixijs/pixi-sound
 * Compiled Tue, 23 Apr 2019 03:40:39 UTC
 *
 * pixi-sound is licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license
 */
! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).__pixiSound = t()
}(this, function() {
    "use strict";
    if ("undefined" == typeof PIXI) throw "PixiJS required";
    var e = setTimeout;

    function t() {}

    function n(e) {
        if (!(this instanceof n)) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof e) throw new TypeError("not a function");
        this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], a(e, this)
    }

    function o(e, t) {
        for (; 3 === e._state;) e = e._value;
        0 !== e._state ? (e._handled = !0, n._immediateFn(function() {
            var n = 1 === e._state ? t.onFulfilled : t.onRejected;
            if (null !== n) {
                var o;
                try {
                    o = n(e._value)
                } catch (e) {
                    return void r(t.promise, e)
                }
                i(t.promise, o)
            } else(1 === e._state ? i : r)(t.promise, e._value)
        })) : e._deferreds.push(t)
    }

    function i(e, t) {
        try {
            if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
            if (t && ("object" == typeof t || "function" == typeof t)) {
                var o = t.then;
                if (t instanceof n) return e._state = 3, e._value = t, void s(e);
                if ("function" == typeof o) return void a((i = o, u = t, function() {
                    i.apply(u, arguments)
                }), e)
            }
            e._state = 1, e._value = t, s(e)
        } catch (t) {
            r(e, t)
        }
        var i, u
    }

    function r(e, t) {
        e._state = 2, e._value = t, s(e)
    }

    function s(e) {
        2 === e._state && 0 === e._deferreds.length && n._immediateFn(function() {
            e._handled || n._unhandledRejectionFn(e._value)
        });
        for (var t = 0, i = e._deferreds.length; t < i; t++) o(e, e._deferreds[t]);
        e._deferreds = null
    }

    function u(e, t, n) {
        this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n
    }

    function a(e, t) {
        var n = !1;
        try {
            e(function(e) {
                n || (n = !0, i(t, e))
            }, function(e) {
                n || (n = !0, r(t, e))
            })
        } catch (e) {
            if (n) return;
            n = !0, r(t, e)
        }
    }
    n.prototype.catch = function(e) {
        return this.then(null, e)
    }, n.prototype.then = function(e, n) {
        var i = new this.constructor(t);
        return o(this, new u(e, n, i)), i
    }, n.prototype.finally = function(e) {
        var t = this.constructor;
        return this.then(function(n) {
            return t.resolve(e()).then(function() {
                return n
            })
        }, function(n) {
            return t.resolve(e()).then(function() {
                return t.reject(n)
            })
        })
    }, n.all = function(e) {
        return new n(function(t, n) {
            if (!e || void 0 === e.length) throw new TypeError("Promise.all accepts an array");
            var o = Array.prototype.slice.call(e);
            if (0 === o.length) return t([]);
            var i = o.length;

            function r(e, s) {
                try {
                    if (s && ("object" == typeof s || "function" == typeof s)) {
                        var u = s.then;
                        if ("function" == typeof u) return void u.call(s, function(t) {
                            r(e, t)
                        }, n)
                    }
                    o[e] = s, 0 == --i && t(o)
                } catch (e) {
                    n(e)
                }
            }
            for (var s = 0; s < o.length; s++) r(s, o[s])
        })
    }, n.resolve = function(e) {
        return e && "object" == typeof e && e.constructor === n ? e : new n(function(t) {
            t(e)
        })
    }, n.reject = function(e) {
        return new n(function(t, n) {
            n(e)
        })
    }, n.race = function(e) {
        return new n(function(t, n) {
            for (var o = 0, i = e.length; o < i; o++) e[o].then(t, n)
        })
    }, n._immediateFn = "function" == typeof setImmediate && function(e) {
        setImmediate(e)
    } || function(t) {
        e(t, 0)
    }, n._unhandledRejectionFn = function(e) {
        "undefined" != typeof console && console
    };
    var c = function() {
            function e(e, t) {
                this._output = t, this._input = e
            }
            return Object.defineProperty(e.prototype, "destination", {
                get: function() {
                    return this._input
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "filters", {
                get: function() {
                    return this._filters
                },
                set: function(e) {
                    var t = this;
                    if (this._filters && (this._filters.forEach(function(e) {
                            e && e.disconnect()
                        }), this._filters = null, this._input.connect(this._output)), e && e.length) {
                        this._filters = e.slice(0), this._input.disconnect();
                        var n = null;
                        e.forEach(function(e) {
                            null === n ? t._input.connect(e.destination) : n.connect(e.destination), n = e
                        }), n.connect(this._output)
                    }
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.destroy = function() {
                this.filters = null, this._input = null, this._output = null
            }, e
        }(),
        l = function() {
            function e(e, t) {
                this.init(e, t)
            }
            return e.prototype.init = function(e, t) {
                this.destination = e, this.source = t || e
            }, e.prototype.connect = function(e) {
                this.source.connect(e)
            }, e.prototype.disconnect = function() {
                this.source.disconnect()
            }, e.prototype.destroy = function() {
                this.disconnect(), this.destination = null, this.source = null
            }, e
        }(),
        p = function(e, t) {
            return (p = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(e, t) {
                    e.__proto__ = t
                } || function(e, t) {
                    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                })(e, t)
        };

    function h(e, t) {
        function n() {
            this.constructor = e
        }
        p(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
    }
    var f, d = function() {
        return (d = Object.assign || function(e) {
            for (var t, n = 1, o = arguments.length; n < o; n++)
                for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            return e
        }).apply(this, arguments)
    };

    function _() {
        return f
    }
    var y = function() {
            function e() {}
            return e.setParamValue = function(e, t) {
                if (e.setValueAtTime) {
                    var n = _().context;
                    e.setValueAtTime(t, n.audioContext.currentTime)
                } else e.value = t;
                return t
            }, e
        }(),
        m = 0,
        g = function(e) {
            function t(t) {
                var n = e.call(this) || this;
                return n.id = m++, n._media = null, n._paused = !1, n._muted = !1, n._elapsed = 0, n._updateListener = n._update.bind(n), n.init(t), n
            }
            return h(t, e), t.prototype.stop = function() {
                this._source && (this._internalStop(), this.emit("stop"))
            }, Object.defineProperty(t.prototype, "speed", {
                get: function() {
                    return this._speed
                },
                set: function(e) {
                    this._speed = e, this.refresh(), this._update(!0)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "volume", {
                get: function() {
                    return this._volume
                },
                set: function(e) {
                    this._volume = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "muted", {
                get: function() {
                    return this._muted
                },
                set: function(e) {
                    this._muted = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "loop", {
                get: function() {
                    return this._loop
                },
                set: function(e) {
                    this._loop = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.refresh = function() {
                if (this._source) {
                    var e = this._media.context,
                        t = this._media.parent;
                    this._source.loop = this._loop || t.loop;
                    var n = e.volume * (e.muted ? 0 : 1),
                        o = t.volume * (t.muted ? 0 : 1),
                        i = this._volume * (this._muted ? 0 : 1);
                    y.setParamValue(this._gain.gain, i * o * n), y.setParamValue(this._source.playbackRate, this._speed * t.speed * e.speed)
                }
            }, t.prototype.refreshPaused = function() {
                var e = this._media.context,
                    t = this._media.parent,
                    n = this._paused || t.paused || e.paused;
                n !== this._pausedReal && (this._pausedReal = n, n ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
                    start: this._elapsed % this._duration,
                    end: this._end,
                    speed: this._speed,
                    loop: this._loop,
                    volume: this._volume
                })), this.emit("pause", n))
            }, t.prototype.play = function(e) {
                var t = e.start,
                    n = e.end,
                    o = e.speed,
                    i = e.loop,
                    r = e.volume,
                    s = e.muted;
                this._paused = !1;
                var u = this._media.nodes.cloneBufferSource(),
                    a = u.source,
                    c = u.gain;
                this._source = a, this._gain = c, this._speed = o, this._volume = r, this._loop = !!i, this._muted = s, this.refresh();
                var l = this._source.buffer.duration;
                this._duration = l, this._end = n, this._lastUpdate = this._now(), this._elapsed = t, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = n, this._source.loopStart = t, this._source.start(0, t)) : n ? this._source.start(0, t, n - t) : this._source.start(0, t), this.emit("start"), this._update(!0), this._enabled = !0
            }, t.prototype._toSec = function(e) {
                return e > 10 && (e /= 1e3), e || 0
            }, Object.defineProperty(t.prototype, "_enabled", {
                set: function(e) {
                    var t = this._media.nodes.script;
                    t.removeEventListener("audioprocess", this._updateListener), e && t.addEventListener("audioprocess", this._updateListener)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "progress", {
                get: function() {
                    return this._progress
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "paused", {
                get: function() {
                    return this._paused
                },
                set: function(e) {
                    this._paused = e, this.refreshPaused()
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.destroy = function() {
                this.removeAllListeners(), this._internalStop(), this._source && (this._source.disconnect(), this._source = null), this._gain && (this._gain.disconnect(), this._gain = null), this._media && (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), this._media = null), this._end = null, this._speed = 1, this._volume = 1, this._loop = !1, this._elapsed = 0, this._duration = 0, this._paused = !1, this._muted = !1, this._pausedReal = !1
            }, t.prototype.toString = function() {
                return "[WebAudioInstance id=" + this.id + "]"
            }, t.prototype._now = function() {
                return this._media.context.audioContext.currentTime
            }, t.prototype._update = function(e) {
                if (void 0 === e && (e = !1), this._source) {
                    var t = this._now(),
                        n = t - this._lastUpdate;
                    if (n > 0 || e) {
                        var o = this._source.playbackRate.value;
                        this._elapsed += n * o, this._lastUpdate = t;
                        var i = this._duration,
                            r = void 0;
                        if (this._source.loopStart) {
                            var s = this._source.loopEnd - this._source.loopStart;
                            r = (this._source.loopStart + this._elapsed % s) / i
                        } else r = this._elapsed % i / i;
                        this._progress = r, this.emit("progress", this._progress, i)
                    }
                }
            }, t.prototype.init = function(e) {
                this._media = e, e.context.events.on("refresh", this.refresh, this), e.context.events.on("refreshPaused", this.refreshPaused, this)
            }, t.prototype._internalStop = function() {
                this._source && (this._enabled = !1, this._source.onended = null, this._source.stop(0), this._source = null)
            }, t.prototype._onComplete = function() {
                this._source && (this._enabled = !1, this._source.onended = null), this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this)
            }, t
        }(PIXI.utils.EventEmitter),
        b = function(e) {
            function t(t) {
                var n = this,
                    o = t.audioContext,
                    i = o.createBufferSource(),
                    r = o.createScriptProcessor(0),
                    s = o.createGain(),
                    u = o.createAnalyser();
                return i.connect(u), u.connect(s), s.connect(t.destination), r.connect(t.destination), (n = e.call(this, u, s) || this).context = t, n.bufferSource = i, n.script = r, n.gain = s, n.analyser = u, n
            }
            return h(t, e), t.prototype.destroy = function() {
                e.prototype.destroy.call(this), this.bufferSource.disconnect(), this.script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this.script = null, this.gain = null, this.analyser = null, this.context = null
            }, t.prototype.cloneBufferSource = function() {
                var e = this.bufferSource,
                    t = this.context.audioContext.createBufferSource();
                t.buffer = e.buffer, y.setParamValue(t.playbackRate, e.playbackRate.value), t.loop = e.loop;
                var n = this.context.audioContext.createGain();
                return t.connect(n), n.connect(this.destination), {
                    source: t,
                    gain: n
                }
            }, Object.defineProperty(t.prototype, "bufferSize", {
                get: function() {
                    return this.script.bufferSize
                },
                enumerable: !0,
                configurable: !0
            }), t
        }(c),
        v = function() {
            function e() {}
            return e.prototype.init = function(e) {
                this.parent = e, this._nodes = new b(this.context), this._source = this._nodes.bufferSource, this.source = e.options.source
            }, e.prototype.destroy = function() {
                this.parent = null, this._nodes.destroy(), this._nodes = null, this._source = null, this.source = null
            }, e.prototype.create = function() {
                return new g(this)
            }, Object.defineProperty(e.prototype, "context", {
                get: function() {
                    return this.parent.context
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "isPlayable", {
                get: function() {
                    return !!this._source && !!this._source.buffer
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "filters", {
                get: function() {
                    return this._nodes.filters
                },
                set: function(e) {
                    this._nodes.filters = e
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "duration", {
                get: function() {
                    return this._source.buffer.duration
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "buffer", {
                get: function() {
                    return this._source.buffer
                },
                set: function(e) {
                    this._source.buffer = e
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "nodes", {
                get: function() {
                    return this._nodes
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.load = function(e) {
                this.source ? this._decode(this.source, e) : this.parent.url ? this._loadUrl(e) : e && e(new Error("sound.url or sound.source must be set"))
            }, e.prototype._loadUrl = function(e) {
                var t = this,
                    n = new XMLHttpRequest,
                    o = this.parent.url;
                n.open("GET", o, !0), n.responseType = "arraybuffer", n.onload = function() {
                    t.source = n.response, t._decode(n.response, e)
                }, n.send()
            }, e.prototype._decode = function(e, t) {
                var n = this;
                this.parent.context.decode(e, function(e, o) {
                    if (e) t && t(e);
                    else {
                        n.parent.isLoaded = !0, n.buffer = o;
                        var i = n.parent.autoPlayStart();
                        t && t(null, n.parent, i)
                    }
                })
            }, e
        }(),
        P = function(e) {
            function t() {
                var n = this,
                    o = window,
                    i = new t.AudioContext,
                    r = i.createDynamicsCompressor(),
                    s = i.createAnalyser();
                return s.connect(r), r.connect(i.destination), (n = e.call(this, s, r) || this)._ctx = i, n._offlineCtx = new t.OfflineAudioContext(1, 2, o.OfflineAudioContext ? i.sampleRate : 44100), n._unlocked = !1, n.compressor = r, n.analyser = s, n.events = new PIXI.utils.EventEmitter, n.volume = 1, n.speed = 1, n.muted = !1, n.paused = !1, "running" !== i.state && (n._unlock(), n._unlock = n._unlock.bind(n), document.addEventListener("mousedown", n._unlock, !0), document.addEventListener("touchstart", n._unlock, !0), document.addEventListener("touchend", n._unlock, !0)), n
            }
            return h(t, e), t.prototype._unlock = function() {
                this._unlocked || (this.playEmptySound(), "running" === this._ctx.state && (document.removeEventListener("mousedown", this._unlock, !0), document.removeEventListener("touchend", this._unlock, !0), document.removeEventListener("touchstart", this._unlock, !0), this._unlocked = !0))
            }, t.prototype.playEmptySound = function() {
                var e = this._ctx.createBufferSource();
                e.buffer = this._ctx.createBuffer(1, 1, 22050), e.connect(this._ctx.destination), e.start(0, 0, 0), "suspended" === e.context.state && e.context.resume()
            }, Object.defineProperty(t, "AudioContext", {
                get: function() {
                    var e = window;
                    return e.AudioContext || e.webkitAudioContext || null
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t, "OfflineAudioContext", {
                get: function() {
                    var e = window;
                    return e.OfflineAudioContext || e.webkitOfflineAudioContext || null
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.destroy = function() {
                e.prototype.destroy.call(this);
                var t = this._ctx;
                void 0 !== t.close && t.close(), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null
            }, Object.defineProperty(t.prototype, "audioContext", {
                get: function() {
                    return this._ctx
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "offlineContext", {
                get: function() {
                    return this._offlineCtx
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "paused", {
                get: function() {
                    return this._paused
                },
                set: function(e) {
                    e && "running" === this._ctx.state ? this._ctx.suspend() : e || "suspended" !== this._ctx.state || this._ctx.resume(), this._paused = e
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.refresh = function() {
                this.events.emit("refresh")
            }, t.prototype.refreshPaused = function() {
                this.events.emit("refreshPaused")
            }, t.prototype.toggleMute = function() {
                return this.muted = !this.muted, this.refresh(), this.muted
            }, t.prototype.togglePause = function() {
                return this.paused = !this.paused, this.refreshPaused(), this._paused
            }, t.prototype.decode = function(e, t) {
                this._offlineCtx.decodeAudioData(e, function(e) {
                    t(null, e)
                }, function(e) {
                    t(new Error(e.message || "Unable to decode file"))
                })
            }, t
        }(c),
        x = Object.freeze({
            WebAudioMedia: v,
            WebAudioInstance: g,
            WebAudioNodes: b,
            WebAudioContext: P,
            WebAudioUtils: y
        }),
        O = function(e) {
            function t(n, o, i, r, s, u, a, c, l, p) {
                void 0 === n && (n = 0), void 0 === o && (o = 0), void 0 === i && (i = 0), void 0 === r && (r = 0), void 0 === s && (s = 0), void 0 === u && (u = 0), void 0 === a && (a = 0), void 0 === c && (c = 0), void 0 === l && (l = 0), void 0 === p && (p = 0);
                var h = this;
                if (!_().useLegacy) {
                    var f = [{
                        f: t.F32,
                        type: "lowshelf",
                        gain: n
                    }, {
                        f: t.F64,
                        type: "peaking",
                        gain: o
                    }, {
                        f: t.F125,
                        type: "peaking",
                        gain: i
                    }, {
                        f: t.F250,
                        type: "peaking",
                        gain: r
                    }, {
                        f: t.F500,
                        type: "peaking",
                        gain: s
                    }, {
                        f: t.F1K,
                        type: "peaking",
                        gain: u
                    }, {
                        f: t.F2K,
                        type: "peaking",
                        gain: a
                    }, {
                        f: t.F4K,
                        type: "peaking",
                        gain: c
                    }, {
                        f: t.F8K,
                        type: "peaking",
                        gain: l
                    }, {
                        f: t.F16K,
                        type: "highshelf",
                        gain: p
                    }].map(function(e) {
                        var t = _().context.audioContext.createBiquadFilter();
                        return t.type = e.type, y.setParamValue(t.Q, 1), t.frequency.value = e.f, y.setParamValue(t.gain, e.gain), t
                    });
                    (h = e.call(this, f[0], f[f.length - 1]) || this).bands = f, h.bandsMap = {};
                    for (var d = 0; d < h.bands.length; d++) {
                        var m = h.bands[d];
                        d > 0 && h.bands[d - 1].connect(m), h.bandsMap[m.frequency.value] = m
                    }
                    return h
                }
                h = e.call(this, null) || this
            }
            return h(t, e), t.prototype.setGain = function(e, t) {
                if (void 0 === t && (t = 0), !this.bandsMap[e]) throw new Error("No band found for frequency " + e);
                y.setParamValue(this.bandsMap[e].gain, t)
            }, t.prototype.getGain = function(e) {
                if (!this.bandsMap[e]) throw new Error("No band found for frequency " + e);
                return this.bandsMap[e].gain.value
            }, Object.defineProperty(t.prototype, "f32", {
                get: function() {
                    return this.getGain(t.F32)
                },
                set: function(e) {
                    this.setGain(t.F32, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f64", {
                get: function() {
                    return this.getGain(t.F64)
                },
                set: function(e) {
                    this.setGain(t.F64, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f125", {
                get: function() {
                    return this.getGain(t.F125)
                },
                set: function(e) {
                    this.setGain(t.F125, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f250", {
                get: function() {
                    return this.getGain(t.F250)
                },
                set: function(e) {
                    this.setGain(t.F250, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f500", {
                get: function() {
                    return this.getGain(t.F500)
                },
                set: function(e) {
                    this.setGain(t.F500, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f1k", {
                get: function() {
                    return this.getGain(t.F1K)
                },
                set: function(e) {
                    this.setGain(t.F1K, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f2k", {
                get: function() {
                    return this.getGain(t.F2K)
                },
                set: function(e) {
                    this.setGain(t.F2K, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f4k", {
                get: function() {
                    return this.getGain(t.F4K)
                },
                set: function(e) {
                    this.setGain(t.F4K, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f8k", {
                get: function() {
                    return this.getGain(t.F8K)
                },
                set: function(e) {
                    this.setGain(t.F8K, e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "f16k", {
                get: function() {
                    return this.getGain(t.F16K)
                },
                set: function(e) {
                    this.setGain(t.F16K, e)
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.reset = function() {
                this.bands.forEach(function(e) {
                    y.setParamValue(e.gain, 0)
                })
            }, t.prototype.destroy = function() {
                this.bands.forEach(function(e) {
                    e.disconnect()
                }), this.bands = null, this.bandsMap = null
            }, t.F32 = 32, t.F64 = 64, t.F125 = 125, t.F250 = 250, t.F500 = 500, t.F1K = 1e3, t.F2K = 2e3, t.F4K = 4e3, t.F8K = 8e3, t.F16K = 16e3, t
        }(l),
        j = function(e) {
            function t(t) {
                void 0 === t && (t = 0);
                var n = this;
                if (!_().useLegacy) {
                    var o = _().context.audioContext.createWaveShaper();
                    return (n = e.call(this, o) || this)._distortion = o, n.amount = t, n
                }
                n = e.call(this, null) || this
            }
            return h(t, e), Object.defineProperty(t.prototype, "amount", {
                get: function() {
                    return this._amount
                },
                set: function(e) {
                    e *= 1e3, this._amount = e;
                    for (var t, n = new Float32Array(44100), o = Math.PI / 180, i = 0; i < 44100; ++i) t = 2 * i / 44100 - 1, n[i] = (3 + e) * t * 20 * o / (Math.PI + e * Math.abs(t));
                    this._distortion.curve = n, this._distortion.oversample = "4x"
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.destroy = function() {
                this._distortion = null, e.prototype.destroy.call(this)
            }, t
        }(l),
        w = function(e) {
            function t(t) {
                void 0 === t && (t = 0);
                var n = this;
                if (!_().useLegacy) {
                    var o, i, r, s = _().context.audioContext;
                    return s.createStereoPanner ? r = o = s.createStereoPanner() : ((i = s.createPanner()).panningModel = "equalpower", r = i), (n = e.call(this, r) || this)._stereo = o, n._panner = i, n.pan = t, n
                }
                n = e.call(this, null) || this
            }
            return h(t, e), Object.defineProperty(t.prototype, "pan", {
                get: function() {
                    return this._pan
                },
                set: function(e) {
                    this._pan = e, this._stereo ? y.setParamValue(this._stereo.pan, e) : this._panner.setPosition(e, 0, 1 - Math.abs(e))
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.destroy = function() {
                e.prototype.destroy.call(this), this._stereo = null, this._panner = null
            }, t
        }(l),
        A = function(e) {
            function t(t, n, o) {
                void 0 === t && (t = 3), void 0 === n && (n = 2), void 0 === o && (o = !1);
                var i = this;
                if (!_().useLegacy) return (i = e.call(this, null) || this)._seconds = i._clamp(t, 1, 50), i._decay = i._clamp(n, 0, 100), i._reverse = o, i._rebuild(), i;
                i = e.call(this, null) || this
            }
            return h(t, e), t.prototype._clamp = function(e, t, n) {
                return Math.min(n, Math.max(t, e))
            }, Object.defineProperty(t.prototype, "seconds", {
                get: function() {
                    return this._seconds
                },
                set: function(e) {
                    this._seconds = this._clamp(e, 1, 50), this._rebuild()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "decay", {
                get: function() {
                    return this._decay
                },
                set: function(e) {
                    this._decay = this._clamp(e, 0, 100), this._rebuild()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "reverse", {
                get: function() {
                    return this._reverse
                },
                set: function(e) {
                    this._reverse = e, this._rebuild()
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype._rebuild = function() {
                for (var e, t = _().context.audioContext, n = t.sampleRate, o = n * this._seconds, i = t.createBuffer(2, o, n), r = i.getChannelData(0), s = i.getChannelData(1), u = 0; u < o; u++) e = this._reverse ? o - u : u, r[u] = (2 * Math.random() - 1) * Math.pow(1 - e / o, this._decay), s[u] = (2 * Math.random() - 1) * Math.pow(1 - e / o, this._decay);
                var a = _().context.audioContext.createConvolver();
                a.buffer = i, this.init(a)
            }, t
        }(l),
        E = function(e) {
            function t() {
                var t = this;
                if (!_().useLegacy) {
                    var n = _().context.audioContext,
                        o = n.createChannelSplitter(),
                        i = n.createChannelMerger();
                    return i.connect(o), (t = e.call(this, i, o) || this)._merger = i, t
                }
                t = e.call(this, null) || this
            }
            return h(t, e), t.prototype.destroy = function() {
                this._merger.disconnect(), this._merger = null, e.prototype.destroy.call(this)
            }, t
        }(l),
        F = function(e) {
            function t() {
                if (!_().useLegacy) {
                    var t = _().context.audioContext,
                        n = t.createBiquadFilter(),
                        o = t.createBiquadFilter(),
                        i = t.createBiquadFilter(),
                        r = t.createBiquadFilter();
                    return n.type = "lowpass", y.setParamValue(n.frequency, 2e3), o.type = "lowpass", y.setParamValue(o.frequency, 2e3), i.type = "highpass", y.setParamValue(i.frequency, 500), r.type = "highpass", y.setParamValue(r.frequency, 500), n.connect(o), o.connect(i), i.connect(r), e.call(this, n, r) || this
                }
                e.call(this, null)
            }
            return h(t, e), t
        }(l),
        I = Object.freeze({
            Filter: l,
            EqualizerFilter: O,
            DistortionFilter: j,
            StereoFilter: w,
            ReverbFilter: A,
            MonoFilter: E,
            TelephoneFilter: F
        }),
        S = 0,
        L = function(e) {
            function t(t) {
                var n = e.call(this) || this;
                return n.id = S++, n.init(t), n
            }
            return h(t, e), Object.defineProperty(t.prototype, "progress", {
                get: function() {
                    return this._source.currentTime / this._duration
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "paused", {
                get: function() {
                    return this._paused
                },
                set: function(e) {
                    this._paused = e, this.refreshPaused()
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype._onPlay = function() {
                this._playing = !0
            }, t.prototype._onPause = function() {
                this._playing = !1
            }, t.prototype.init = function(e) {
                this._playing = !1, this._duration = e.source.duration;
                var t = this._source = e.source.cloneNode(!1);
                t.src = e.parent.url, t.onplay = this._onPlay.bind(this), t.onpause = this._onPause.bind(this), e.context.on("refresh", this.refresh, this), e.context.on("refreshPaused", this.refreshPaused, this), this._media = e
            }, t.prototype._internalStop = function() {
                this._source && this._playing && (this._source.onended = null, this._source.pause())
            }, t.prototype.stop = function() {
                this._internalStop(), this._source && this.emit("stop")
            }, Object.defineProperty(t.prototype, "speed", {
                get: function() {
                    return this._speed
                },
                set: function(e) {
                    this._speed = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "volume", {
                get: function() {
                    return this._volume
                },
                set: function(e) {
                    this._volume = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "loop", {
                get: function() {
                    return this._loop
                },
                set: function(e) {
                    this._loop = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "muted", {
                get: function() {
                    return this._muted
                },
                set: function(e) {
                    this._muted = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.refresh = function() {
                var e = this._media.context,
                    t = this._media.parent;
                this._source.loop = this._loop || t.loop;
                var n = e.volume * (e.muted ? 0 : 1),
                    o = t.volume * (t.muted ? 0 : 1),
                    i = this._volume * (this._muted ? 0 : 1);
                this._source.volume = i * n * o, this._source.playbackRate = this._speed * e.speed * t.speed
            }, t.prototype.refreshPaused = function() {
                var e = this._media.context,
                    t = this._media.parent,
                    n = this._paused || t.paused || e.paused;
                n !== this._pausedReal && (this._pausedReal = n, n ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
                    start: this._source.currentTime,
                    end: this._end,
                    volume: this._volume,
                    speed: this._speed,
                    loop: this._loop
                })), this.emit("pause", n))
            }, t.prototype.play = function(e) {
                var n = this,
                    o = e.start,
                    i = e.end,
                    r = e.speed,
                    s = e.loop,
                    u = e.volume,
                    a = e.muted;
                this._speed = r, this._volume = u, this._loop = !!s, this._muted = a, this.refresh(), this.loop && null !== i && (this.loop = !1), this._start = o, this._end = i || this._duration, this._start = Math.max(0, this._start - t.PADDING), this._end = Math.min(this._end + t.PADDING, this._duration), this._source.onloadedmetadata = function() {
                    n._source && (n._source.currentTime = o, n._source.onloadedmetadata = null, n.emit("progress", o, n._duration), PIXI.ticker.shared.add(n._onUpdate, n))
                }, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start")
            }, t.prototype._onUpdate = function() {
                this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete()
            }, t.prototype._onComplete = function() {
                PIXI.ticker.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this)
            }, t.prototype.destroy = function() {
                PIXI.ticker.shared.remove(this._onUpdate, this), this.removeAllListeners();
                var e = this._source;
                e && (e.onended = null, e.onplay = null, e.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = !1, this._end = null, this._start = 0, this._duration = 0, this._playing = !1, this._pausedReal = !1, this._paused = !1, this._muted = !1, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null)
            }, t.prototype.toString = function() {
                return "[HTMLAudioInstance id=" + this.id + "]"
            }, t.PADDING = .1, t
        }(PIXI.utils.EventEmitter),
        C = function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return h(t, e), t.prototype.init = function(e) {
                this.parent = e, this._source = e.options.source || new Audio, e.url && (this._source.src = e.url)
            }, t.prototype.create = function() {
                return new L(this)
            }, Object.defineProperty(t.prototype, "isPlayable", {
                get: function() {
                    return !!this._source && 4 === this._source.readyState
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "duration", {
                get: function() {
                    return this._source.duration
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "context", {
                get: function() {
                    return this.parent.context
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "filters", {
                get: function() {
                    return null
                },
                set: function(e) {},
                enumerable: !0,
                configurable: !0
            }), t.prototype.destroy = function() {
                this.removeAllListeners(), this.parent = null, this._source && (this._source.src = "", this._source.load(), this._source = null)
            }, Object.defineProperty(t.prototype, "source", {
                get: function() {
                    return this._source
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.load = function(e) {
                var t = this._source,
                    n = this.parent;
                if (4 !== t.readyState) {
                    if (!n.url) return e(new Error("sound.url or sound.source must be set"));
                    t.src = n.url;
                    var o = function() {
                            t.removeEventListener("canplaythrough", i), t.removeEventListener("load", i), t.removeEventListener("abort", r), t.removeEventListener("error", s)
                        },
                        i = function() {
                            o(), n.isLoaded = !0;
                            var t = n.autoPlayStart();
                            e && e(null, n, t)
                        },
                        r = function() {
                            o(), e && e(new Error("Sound loading has been aborted"))
                        },
                        s = function() {
                            o();
                            var n = "Failed to load audio element (code: " + t.error.code + ")";
                            e && e(new Error(n))
                        };
                    t.addEventListener("canplaythrough", i, !1), t.addEventListener("load", i, !1), t.addEventListener("abort", r, !1), t.addEventListener("error", s, !1), t.load()
                } else {
                    n.isLoaded = !0;
                    var u = n.autoPlayStart();
                    e && setTimeout(function() {
                        e(null, n, u)
                    }, 0)
                }
            }, t
        }(PIXI.utils.EventEmitter),
        M = function(e) {
            function t() {
                var t = e.call(this) || this;
                return t.speed = 1, t.volume = 1, t.muted = !1, t.paused = !1, t
            }
            return h(t, e), t.prototype.refresh = function() {
                this.emit("refresh")
            }, t.prototype.refreshPaused = function() {
                this.emit("refreshPaused")
            }, Object.defineProperty(t.prototype, "filters", {
                get: function() {
                    return null
                },
                set: function(e) {},
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(t.prototype, "audioContext", {
                get: function() {
                    return null
                },
                enumerable: !0,
                configurable: !0
            }), t.prototype.toggleMute = function() {
                return this.muted = !this.muted, this.refresh(), this.muted
            }, t.prototype.togglePause = function() {
                return this.paused = !this.paused, this.refreshPaused(), this.paused
            }, t.prototype.destroy = function() {
                this.removeAllListeners()
            }, t
        }(PIXI.utils.EventEmitter),
        k = Object.freeze({
            HTMLAudioMedia: C,
            HTMLAudioInstance: L,
            HTMLAudioContext: M
        }),
        T = ["mp3", "ogg", "oga", "opus", "mpeg", "wav", "m4a", "aiff", "wma", "mid"];
    var R, G, X, K, D = (R = {
            m4a: "mp4",
            oga: "ogg"
        }, G = document.createElement("audio"), X = {}, K = /^no$/, T.forEach(function(e) {
            var t = R[e] || e,
                n = G.canPlayType("audio/" + e).replace(K, ""),
                o = G.canPlayType("audio/" + t).replace(K, "");
            X[e] = !!n || !!o
        }), Object.freeze(X)),
        q = /\.(\{([^\}]+)\})(\?.*)?$/;

    function B(e) {
        var t = q,
            n = "string" == typeof e ? e : e.url;
        if (t.test(n)) {
            for (var o = t.exec(n), i = o[2].split(","), r = i[i.length - 1], s = 0, u = i.length; s < u; s++) {
                var a = i[s];
                if (D[a]) {
                    r = a;
                    break
                }
            }
            var c = n.replace(o[1], r);
            return "string" != typeof e && (e.extension = r, e.url = c), c
        }
        return n
    }
    var V = function() {
            function e() {}
            return e.add = function() {
                e.legacy = _().useLegacy
            }, Object.defineProperty(e, "legacy", {
                set: function(e) {
                    var t = PIXI.loaders.Resource,
                        n = T;
                    e ? n.forEach(function(e) {
                        t.setExtensionXhrType(e, t.XHR_RESPONSE_TYPE.DEFAULT), t.setExtensionLoadType(e, t.LOAD_TYPE.AUDIO)
                    }) : n.forEach(function(e) {
                        t.setExtensionXhrType(e, t.XHR_RESPONSE_TYPE.BUFFER), t.setExtensionLoadType(e, t.LOAD_TYPE.XHR)
                    })
                },
                enumerable: !0,
                configurable: !0
            }), e.pre = function(e, t) {
                B(e), t()
            }, e.use = function(e, t) {
                e.data && T.indexOf(e.extension) > -1 ? e.sound = _().add(e.name, {
                    loaded: t,
                    preload: !0,
                    url: e.url,
                    source: e.data
                }) : t()
            }, e
        }(),
        U = function(e) {
            function t(t, n) {
                var o = e.call(this, t, n) || this;
                return o.use(V.use), o.pre(V.pre), o
            }
            return h(t, e), t.addPixiMiddleware = function(t) {
                e.addPixiMiddleware.call(this, t)
            }, t
        }(PIXI.loaders.Loader),
        H = function() {
            function e(e, t) {
                this.parent = e, Object.assign(this, t), this.duration = this.end - this.start
            }
            return e.prototype.play = function(e) {
                return this.parent.play({
                    complete: e,
                    speed: this.speed || this.parent.speed,
                    end: this.end,
                    start: this.start,
                    loop: this.loop
                })
            }, e.prototype.destroy = function() {
                this.parent = null
            }, e
        }(),
        N = function() {
            function e(e, t) {
                this.media = e, this.options = t, this._instances = [], this._sprites = {}, this.media.init(this);
                var n = t.complete;
                this._autoPlayOptions = n ? {
                    complete: n
                } : null, this.isLoaded = !1, this.isPlaying = !1, this.autoPlay = t.autoPlay, this.singleInstance = t.singleInstance, this.preload = t.preload || this.autoPlay, this.url = t.url, this.speed = t.speed, this.volume = t.volume, this.loop = t.loop, t.sprites && this.addSprites(t.sprites), this.preload && this._preload(t.loaded)
            }
            return e.from = function(t) {
                var n = {};
                return "string" == typeof t ? n.url = t : t instanceof ArrayBuffer || t instanceof HTMLAudioElement ? n.source = t : n = t, (n = d({
                    autoPlay: !1,
                    singleInstance: !1,
                    url: null,
                    source: null,
                    preload: !1,
                    volume: 1,
                    speed: 1,
                    complete: null,
                    loaded: null,
                    loop: !1
                }, n)).url && (n.url = B(n.url)), Object.freeze(n), new e(_().useLegacy ? new C : new v, n)
            }, Object.defineProperty(e.prototype, "context", {
                get: function() {
                    return _().context
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.pause = function() {
                return this.isPlaying = !1, this.paused = !0, this
            }, e.prototype.resume = function() {
                return this.isPlaying = this._instances.length > 0, this.paused = !1, this
            }, Object.defineProperty(e.prototype, "paused", {
                get: function() {
                    return this._paused
                },
                set: function(e) {
                    this._paused = e, this.refreshPaused()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "speed", {
                get: function() {
                    return this._speed
                },
                set: function(e) {
                    this._speed = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "filters", {
                get: function() {
                    return this.media.filters
                },
                set: function(e) {
                    this.media.filters = e
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.addSprites = function(e, t) {
                if ("object" == typeof e) {
                    var n = {};
                    for (var o in e) n[o] = this.addSprites(o, e[o]);
                    return n
                }
                if ("string" == typeof e) {
                    var i = new H(this, t);
                    return this._sprites[e] = i, i
                }
            }, e.prototype.destroy = function() {
                this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null
            }, e.prototype.removeSprites = function(e) {
                if (e) {
                    var t = this._sprites[e];
                    void 0 !== t && (t.destroy(), delete this._sprites[e])
                } else
                    for (var n in this._sprites) this.removeSprites(n);
                return this
            }, Object.defineProperty(e.prototype, "isPlayable", {
                get: function() {
                    return this.isLoaded && this.media && this.media.isPlayable
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.stop = function() {
                if (!this.isPlayable) return this.autoPlay = !1, this._autoPlayOptions = null, this;
                this.isPlaying = !1;
                for (var e = this._instances.length - 1; e >= 0; e--) this._instances[e].stop();
                return this
            }, e.prototype.play = function(e, t) {
                var n, o = this;
                "string" == typeof e ? n = {
                    sprite: r = e,
                    loop: this.loop,
                    complete: t
                } : "function" == typeof e ? (n = {}).complete = e : n = e;
                if ((n = d({
                        complete: null,
                        loaded: null,
                        sprite: null,
                        end: null,
                        start: 0,
                        volume: 1,
                        speed: 1,
                        muted: !1,
                        loop: !1
                    }, n || {})).sprite) {
                    var i = n.sprite,
                        r = this._sprites[i];
                    n.start = r.start, n.end = r.end, n.speed = r.speed || 1, n.loop = r.loop || n.loop, delete n.sprite
                }
                if (n.offset && (n.start = n.offset), !this.isLoaded) return new Promise(function(e, t) {
                    o.autoPlay = !0, o._autoPlayOptions = n, o._preload(function(o, i, r) {
                        o ? t(o) : (n.loaded && n.loaded(o, i, r), e(r))
                    })
                });
                this.singleInstance && this._removeInstances();
                var s = this._createInstance();
                return this._instances.push(s), this.isPlaying = !0, s.once("end", function() {
                    n.complete && n.complete(o), o._onComplete(s)
                }), s.once("stop", function() {
                    o._onComplete(s)
                }), s.play(n), s
            }, e.prototype.refresh = function() {
                for (var e = this._instances.length, t = 0; t < e; t++) this._instances[t].refresh()
            }, e.prototype.refreshPaused = function() {
                for (var e = this._instances.length, t = 0; t < e; t++) this._instances[t].refreshPaused()
            }, Object.defineProperty(e.prototype, "volume", {
                get: function() {
                    return this._volume
                },
                set: function(e) {
                    this._volume = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "muted", {
                get: function() {
                    return this._muted
                },
                set: function(e) {
                    this._muted = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "loop", {
                get: function() {
                    return this._loop
                },
                set: function(e) {
                    this._loop = e, this.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype._preload = function(e) {
                this.media.load(e)
            }, Object.defineProperty(e.prototype, "instances", {
                get: function() {
                    return this._instances
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "sprites", {
                get: function() {
                    return this._sprites
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "duration", {
                get: function() {
                    return this.media.duration
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.autoPlayStart = function() {
                var e;
                return this.autoPlay && (e = this.play(this._autoPlayOptions)), e
            }, e.prototype._removeInstances = function() {
                for (var e = this._instances.length - 1; e >= 0; e--) this._poolInstance(this._instances[e]);
                this._instances.length = 0
            }, e.prototype._onComplete = function(e) {
                if (this._instances) {
                    var t = this._instances.indexOf(e);
                    t > -1 && this._instances.splice(t, 1), this.isPlaying = this._instances.length > 0
                }
                this._poolInstance(e)
            }, e.prototype._createInstance = function() {
                if (e._pool.length > 0) {
                    var t = e._pool.pop();
                    return t.init(this.media), t
                }
                return this.media.create()
            }, e.prototype._poolInstance = function(t) {
                t.destroy(), e._pool.indexOf(t) < 0 && e._pool.push(t)
            }, e._pool = [], e
        }(),
        z = function() {
            function e() {
                this.init()
            }
            return e.prototype.init = function() {
                return this.supported && (this._webAudioContext = new P), this._htmlAudioContext = new M, this._sounds = {}, this.useLegacy = !this.supported, this
            }, Object.defineProperty(e.prototype, "context", {
                get: function() {
                    return this._context
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "filtersAll", {
                get: function() {
                    return this.useLegacy ? [] : this._context.filters
                },
                set: function(e) {
                    this.useLegacy || (this._context.filters = e)
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "supported", {
                get: function() {
                    return null !== P.AudioContext
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.add = function(e, t) {
                if ("object" == typeof e) {
                    var n = {};
                    for (var o in e) {
                        var i = this._getOptions(e[o], t);
                        n[o] = this.add(o, i)
                    }
                    return n
                }
                if ("string" == typeof e) {
                    if (t instanceof N) return this._sounds[e] = t, t;
                    i = this._getOptions(t);
                    var r = N.from(i);
                    return this._sounds[e] = r, r
                }
            }, e.prototype._getOptions = function(e, t) {
                var n;
                return n = "string" == typeof e ? {
                    url: e
                } : e instanceof ArrayBuffer || e instanceof HTMLAudioElement ? {
                    source: e
                } : e, n = d({}, n, t || {})
            }, Object.defineProperty(e.prototype, "useLegacy", {
                get: function() {
                    return this._useLegacy
                },
                set: function(e) {
                    V.legacy = e, this._useLegacy = e, this._context = !e && this.supported ? this._webAudioContext : this._htmlAudioContext
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.remove = function(e) {
                return this.exists(e, !0), this._sounds[e].destroy(), delete this._sounds[e], this
            }, Object.defineProperty(e.prototype, "volumeAll", {
                get: function() {
                    return this._context.volume
                },
                set: function(e) {
                    this._context.volume = e, this._context.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "speedAll", {
                get: function() {
                    return this._context.speed
                },
                set: function(e) {
                    this._context.speed = e, this._context.refresh()
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.togglePauseAll = function() {
                return this._context.togglePause()
            }, e.prototype.pauseAll = function() {
                return this._context.paused = !0, this._context.refreshPaused(), this
            }, e.prototype.resumeAll = function() {
                return this._context.paused = !1, this._context.refreshPaused(), this
            }, e.prototype.toggleMuteAll = function() {
                return this._context.toggleMute()
            }, e.prototype.muteAll = function() {
                return this._context.muted = !0, this._context.refresh(), this
            }, e.prototype.unmuteAll = function() {
                return this._context.muted = !1, this._context.refresh(), this
            }, e.prototype.removeAll = function() {
                for (var e in this._sounds) this._sounds[e].destroy(), delete this._sounds[e];
                return this
            }, e.prototype.stopAll = function() {
                for (var e in this._sounds) this._sounds[e].stop();
                return this
            }, e.prototype.exists = function(e, t) {
                return void 0 === t && (t = !1), !!this._sounds[e]
            }, e.prototype.find = function(e) {
                return this.exists(e, !0), this._sounds[e]
            }, e.prototype.play = function(e, t) {
                return this.find(e).play(t)
            }, e.prototype.stop = function(e) {
                return this.find(e).stop()
            }, e.prototype.pause = function(e) {
                return this.find(e).pause()
            }, e.prototype.resume = function(e) {
                return this.find(e).resume()
            }, e.prototype.volume = function(e, t) {
                var n = this.find(e);
                return void 0 !== t && (n.volume = t), n.volume
            }, e.prototype.speed = function(e, t) {
                var n = this.find(e);
                return void 0 !== t && (n.speed = t), n.speed
            }, e.prototype.duration = function(e) {
                return this.find(e).duration
            }, e.prototype.close = function() {
                return this.removeAll(), this._sounds = null, this._webAudioContext && (this._webAudioContext.destroy(), this._webAudioContext = null), this._htmlAudioContext && (this._htmlAudioContext.destroy(), this._htmlAudioContext = null), this._context = null, this
            }, e
        }(),
        W = 0;
    var Y = Object.freeze({
            get PLAY_ID() {
                return W
            },
            playOnce: function(e, t) {
                var n = "alias" + W++;
                return _().add(n, {
                    url: e,
                    preload: !0,
                    autoPlay: !0,
                    loaded: function(e) {
                        e && (_().remove(n), t && t(e))
                    },
                    complete: function() {
                        _().remove(n), t && t(null)
                    }
                }), n
            },
            render: function(e, t) {
                var n = document.createElement("canvas");
                t = d({
                    width: 512,
                    height: 128,
                    fill: "black"
                }, t || {}), n.width = t.width, n.height = t.height;
                var o = PIXI.BaseTexture.fromCanvas(n);
                if (!(e.media instanceof v)) return o;
                var i = e.media,
                    r = n.getContext("2d");
                r.fillStyle = t.fill;
                for (var s = i.buffer.getChannelData(0), u = Math.ceil(s.length / t.width), a = t.height / 2, c = 0; c < t.width; c++) {
                    for (var l = 1, p = -1, h = 0; h < u; h++) {
                        var f = s[c * u + h];
                        f < l && (l = f), f > p && (p = f)
                    }
                    r.fillRect(c, (1 + l) * a, 1, Math.max(1, (p - l) * a))
                }
                return o
            },
            resolveUrl: B,
            sineTone: function(e, t) {
                void 0 === e && (e = 200), void 0 === t && (t = 1);
                var n = N.from({
                    singleInstance: !0
                });
                if (!(n.media instanceof v)) return n;
                for (var o = n.media, i = n.context.audioContext.createBuffer(1, 48e3 * t, 48e3), r = i.getChannelData(0), s = 0; s < r.length; s++) {
                    var u = e * (s / i.sampleRate) * Math.PI;
                    r[s] = 2 * Math.sin(u)
                }
                return o.buffer = i, n.isLoaded = !0, n
            },
            extensions: T,
            supported: D
        }),
        $ = function(e) {
            return f = e, e
        }(new z),
        J = window,
        Q = PIXI;
    if ("undefined" == typeof Promise && (J.Promise = n), void 0 !== PIXI.loaders) {
        var Z = parseInt(PIXI.VERSION.split(".")[0], 10);
        4 === Z ? (PIXI.loaders.Loader = U, V.add(), PIXI.loader.use(V.use), PIXI.loader.pre(V.pre)) : Z >= 5 && Q.Loader.registerPlugin(V)
    }
    return void 0 === J.__pixiSound && delete J.__pixiSound, Q.sound || (Object.defineProperty(Q, "sound", {
        get: function() {
            return $
        }
    }), Object.defineProperties($, {
        Filterable: {
            get: function() {
                return c
            }
        },
        filters: {
            get: function() {
                return I
            }
        },
        htmlaudio: {
            get: function() {
                return k
            }
        },
        Sound: {
            get: function() {
                return N
            }
        },
        SoundLibrary: {
            get: function() {
                return z
            }
        },
        SoundSprite: {
            get: function() {
                return H
            }
        },
        utils: {
            get: function() {
                return Y
            }
        },
        webaudio: {
            get: function() {
                return x
            }
        },
        sound: {
            get: function() {
                return $
            }
        }
    })), $
});
//# sourceMappingURL=pixi-sound.js.map