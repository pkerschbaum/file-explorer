(() => {
  var e = {
      2378: (e, t, n) => {
        e = n.nmd(e);
        var o = '__lodash_hash_undefined__',
          a = 9007199254740991,
          i = '[object Arguments]',
          s = '[object Function]',
          r = '[object Object]',
          l = /^\[object .+?Constructor\]$/,
          c = /^(?:0|[1-9]\d*)$/,
          d = {};
        (d['[object Float32Array]'] =
          d['[object Float64Array]'] =
          d['[object Int8Array]'] =
          d['[object Int16Array]'] =
          d['[object Int32Array]'] =
          d['[object Uint8Array]'] =
          d['[object Uint8ClampedArray]'] =
          d['[object Uint16Array]'] =
          d['[object Uint32Array]'] =
            !0),
          (d[i] =
            d['[object Array]'] =
            d['[object ArrayBuffer]'] =
            d['[object Boolean]'] =
            d['[object DataView]'] =
            d['[object Date]'] =
            d['[object Error]'] =
            d[s] =
            d['[object Map]'] =
            d['[object Number]'] =
            d[r] =
            d['[object RegExp]'] =
            d['[object Set]'] =
            d['[object String]'] =
            d['[object WeakMap]'] =
              !1);
        var f = 'object' == typeof global && global && global.Object === Object && global,
          m = 'object' == typeof self && self && self.Object === Object && self,
          u = f || m || Function('return this')(),
          p = t && !t.nodeType && t,
          g = p && e && !e.nodeType && e,
          h = g && g.exports === p,
          v = h && f.process,
          b = (function () {
            try {
              return (
                (g && g.require && g.require('util').types) || (v && v.binding && v.binding('util'))
              );
            } catch (e) {}
          })(),
          y = b && b.isTypedArray;
        function j(e, t, n) {
          switch (n.length) {
            case 0:
              return e.call(t);
            case 1:
              return e.call(t, n[0]);
            case 2:
              return e.call(t, n[0], n[1]);
            case 3:
              return e.call(t, n[0], n[1], n[2]);
          }
          return e.apply(t, n);
        }
        var x,
          w,
          _,
          k = Array.prototype,
          N = Function.prototype,
          E = Object.prototype,
          O = u['__core-js_shared__'],
          P = N.toString,
          C = E.hasOwnProperty,
          I = (x = /[^.]+$/.exec((O && O.keys && O.keys.IE_PROTO) || ''))
            ? 'Symbol(src)_1.' + x
            : '',
          S = E.toString,
          M = P.call(Object),
          V = RegExp(
            '^' +
              P.call(C)
                .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
              '$',
          ),
          F = h ? u.Buffer : void 0,
          z = u.Symbol,
          A = u.Uint8Array,
          T =
            (F && F.allocUnsafe,
            (w = Object.getPrototypeOf),
            (_ = Object),
            function (e) {
              return w(_(e));
            }),
          D = Object.create,
          $ = E.propertyIsEnumerable,
          H = k.splice,
          R = z ? z.toStringTag : void 0,
          q = (function () {
            try {
              var e = re(Object, 'defineProperty');
              return e({}, '', {}), e;
            } catch (e) {}
          })(),
          B = F ? F.isBuffer : void 0,
          L = Math.max,
          U = Date.now,
          W = re(u, 'Map'),
          J = re(Object, 'create'),
          X = (function () {
            function e() {}
            return function (t) {
              if (!ye(t)) return {};
              if (D) return D(t);
              e.prototype = t;
              var n = new e();
              return (e.prototype = void 0), n;
            };
          })();
        function K(e) {
          var t = -1,
            n = null == e ? 0 : e.length;
          for (this.clear(); ++t < n; ) {
            var o = e[t];
            this.set(o[0], o[1]);
          }
        }
        function G(e) {
          var t = -1,
            n = null == e ? 0 : e.length;
          for (this.clear(); ++t < n; ) {
            var o = e[t];
            this.set(o[0], o[1]);
          }
        }
        function Z(e) {
          var t = -1,
            n = null == e ? 0 : e.length;
          for (this.clear(); ++t < n; ) {
            var o = e[t];
            this.set(o[0], o[1]);
          }
        }
        function Q(e) {
          var t = (this.__data__ = new G(e));
          this.size = t.size;
        }
        function Y(e, t, n) {
          ((void 0 !== n && !me(e[t], n)) || (void 0 === n && !(t in e))) && ne(e, t, n);
        }
        function ee(e, t, n) {
          var o = e[t];
          (C.call(e, t) && me(o, n) && (void 0 !== n || t in e)) || ne(e, t, n);
        }
        function te(e, t) {
          for (var n = e.length; n--; ) if (me(e[n][0], t)) return n;
          return -1;
        }
        function ne(e, t, n) {
          '__proto__' == t && q
            ? q(e, t, { configurable: !0, enumerable: !0, value: n, writable: !0 })
            : (e[t] = n);
        }
        (K.prototype.clear = function () {
          (this.__data__ = J ? J(null) : {}), (this.size = 0);
        }),
          (K.prototype.delete = function (e) {
            var t = this.has(e) && delete this.__data__[e];
            return (this.size -= t ? 1 : 0), t;
          }),
          (K.prototype.get = function (e) {
            var t = this.__data__;
            if (J) {
              var n = t[e];
              return n === o ? void 0 : n;
            }
            return C.call(t, e) ? t[e] : void 0;
          }),
          (K.prototype.has = function (e) {
            var t = this.__data__;
            return J ? void 0 !== t[e] : C.call(t, e);
          }),
          (K.prototype.set = function (e, t) {
            var n = this.__data__;
            return (this.size += this.has(e) ? 0 : 1), (n[e] = J && void 0 === t ? o : t), this;
          }),
          (G.prototype.clear = function () {
            (this.__data__ = []), (this.size = 0);
          }),
          (G.prototype.delete = function (e) {
            var t = this.__data__,
              n = te(t, e);
            return !(n < 0 || (n == t.length - 1 ? t.pop() : H.call(t, n, 1), --this.size, 0));
          }),
          (G.prototype.get = function (e) {
            var t = this.__data__,
              n = te(t, e);
            return n < 0 ? void 0 : t[n][1];
          }),
          (G.prototype.has = function (e) {
            return te(this.__data__, e) > -1;
          }),
          (G.prototype.set = function (e, t) {
            var n = this.__data__,
              o = te(n, e);
            return o < 0 ? (++this.size, n.push([e, t])) : (n[o][1] = t), this;
          }),
          (Z.prototype.clear = function () {
            (this.size = 0),
              (this.__data__ = { hash: new K(), map: new (W || G)(), string: new K() });
          }),
          (Z.prototype.delete = function (e) {
            var t = se(this, e).delete(e);
            return (this.size -= t ? 1 : 0), t;
          }),
          (Z.prototype.get = function (e) {
            return se(this, e).get(e);
          }),
          (Z.prototype.has = function (e) {
            return se(this, e).has(e);
          }),
          (Z.prototype.set = function (e, t) {
            var n = se(this, e),
              o = n.size;
            return n.set(e, t), (this.size += n.size == o ? 0 : 1), this;
          }),
          (Q.prototype.clear = function () {
            (this.__data__ = new G()), (this.size = 0);
          }),
          (Q.prototype.delete = function (e) {
            var t = this.__data__,
              n = t.delete(e);
            return (this.size = t.size), n;
          }),
          (Q.prototype.get = function (e) {
            return this.__data__.get(e);
          }),
          (Q.prototype.has = function (e) {
            return this.__data__.has(e);
          }),
          (Q.prototype.set = function (e, t) {
            var n = this.__data__;
            if (n instanceof G) {
              var o = n.__data__;
              if (!W || o.length < 199) return o.push([e, t]), (this.size = ++n.size), this;
              n = this.__data__ = new Z(o);
            }
            return n.set(e, t), (this.size = n.size), this;
          });
        function oe(e) {
          return null == e
            ? void 0 === e
              ? '[object Undefined]'
              : '[object Null]'
            : R && R in Object(e)
            ? (function (e) {
                var t = C.call(e, R),
                  n = e[R];
                try {
                  e[R] = void 0;
                  var o = !0;
                } catch (e) {}
                var a = S.call(e);
                return o && (t ? (e[R] = n) : delete e[R]), a;
              })(e)
            : (function (e) {
                return S.call(e);
              })(e);
        }
        function ae(e) {
          return je(e) && oe(e) == i;
        }
        function ie(e, t, n, o, a) {
          e !== t &&
            (function (e, t, n) {
              for (var o = -1, a = Object(e), i = n(e), s = i.length; s--; ) {
                var r = i[++o];
                if (!1 === t(a[r], r, a)) break;
              }
            })(
              t,
              function (i, s) {
                if ((a || (a = new Q()), ye(i)))
                  !(function (e, t, n, o, a, i, s) {
                    var l = de(e, n),
                      c = de(t, n),
                      d = s.get(c);
                    if (d) Y(e, n, d);
                    else {
                      var f,
                        m,
                        u,
                        p,
                        g,
                        h = i ? i(l, c, n + '', e, t, s) : void 0,
                        v = void 0 === h;
                      if (v) {
                        var b = pe(c),
                          y = !b && he(c),
                          j = !b && !y && xe(c);
                        (h = c),
                          b || y || j
                            ? pe(l)
                              ? (h = l)
                              : je((g = l)) && ge(g)
                              ? (h = (function (e, t) {
                                  var n = -1,
                                    o = e.length;
                                  for (t || (t = Array(o)); ++n < o; ) t[n] = e[n];
                                  return t;
                                })(l))
                              : y
                              ? ((v = !1),
                                (h = (function (e, t) {
                                  return e.slice();
                                })(c)))
                              : j
                              ? ((v = !1),
                                (p = new (u = (f = c).buffer).constructor(u.byteLength)),
                                new A(p).set(new A(u)),
                                (m = p),
                                (h = new f.constructor(m, f.byteOffset, f.length)))
                              : (h = [])
                            : (function (e) {
                                if (!je(e) || oe(e) != r) return !1;
                                var t = T(e);
                                if (null === t) return !0;
                                var n = C.call(t, 'constructor') && t.constructor;
                                return 'function' == typeof n && n instanceof n && P.call(n) == M;
                              })(c) || ue(c)
                            ? ((h = l),
                              ue(l)
                                ? (h = (function (e) {
                                    return (function (e, t, n, o) {
                                      var a = !n;
                                      n || (n = {});
                                      for (var i = -1, s = t.length; ++i < s; ) {
                                        var r = t[i],
                                          l = void 0;
                                        void 0 === l && (l = e[r]), a ? ne(n, r, l) : ee(n, r, l);
                                      }
                                      return n;
                                    })(e, we(e));
                                  })(l))
                                : (ye(l) && !ve(l)) ||
                                  (h = (function (e) {
                                    return 'function' != typeof e.constructor || ce(e)
                                      ? {}
                                      : X(T(e));
                                  })(c)))
                            : (v = !1);
                      }
                      v && (s.set(c, h), a(h, c, o, i, s), s.delete(c)), Y(e, n, h);
                    }
                  })(e, t, s, n, ie, o, a);
                else {
                  var l = o ? o(de(e, s), i, s + '', e, t, a) : void 0;
                  void 0 === l && (l = i), Y(e, s, l);
                }
              },
              we,
            );
        }
        function se(e, t) {
          var n,
            o,
            a = e.__data__;
          return (
            'string' == (o = typeof (n = t)) || 'number' == o || 'symbol' == o || 'boolean' == o
              ? '__proto__' !== n
              : null === n
          )
            ? a['string' == typeof t ? 'string' : 'hash']
            : a.map;
        }
        function re(e, t) {
          var n = (function (e, t) {
            return null == e ? void 0 : e[t];
          })(e, t);
          return (function (e) {
            return (
              !(
                !ye(e) ||
                (function (e) {
                  return !!I && I in e;
                })(e)
              ) &&
              (ve(e) ? V : l).test(
                (function (e) {
                  if (null != e) {
                    try {
                      return P.call(e);
                    } catch (e) {}
                    try {
                      return e + '';
                    } catch (e) {}
                  }
                  return '';
                })(e),
              )
            );
          })(n)
            ? n
            : void 0;
        }
        function le(e, t) {
          var n = typeof e;
          return (
            !!(t = null == t ? a : t) &&
            ('number' == n || ('symbol' != n && c.test(e))) &&
            e > -1 &&
            e % 1 == 0 &&
            e < t
          );
        }
        function ce(e) {
          var t = e && e.constructor;
          return e === (('function' == typeof t && t.prototype) || E);
        }
        function de(e, t) {
          if (('constructor' !== t || 'function' != typeof e[t]) && '__proto__' != t) return e[t];
        }
        var fe = (function (e) {
          var t = 0,
            n = 0;
          return function () {
            var o = U(),
              a = 16 - (o - n);
            if (((n = o), a > 0)) {
              if (++t >= 800) return arguments[0];
            } else t = 0;
            return e.apply(void 0, arguments);
          };
        })(
          q
            ? function (e, t) {
                return q(e, 'toString', {
                  configurable: !0,
                  enumerable: !1,
                  value:
                    ((n = t),
                    function () {
                      return n;
                    }),
                  writable: !0,
                });
                var n;
              }
            : Ne,
        );
        function me(e, t) {
          return e === t || (e != e && t != t);
        }
        var ue = ae(
            (function () {
              return arguments;
            })(),
          )
            ? ae
            : function (e) {
                return je(e) && C.call(e, 'callee') && !$.call(e, 'callee');
              },
          pe = Array.isArray;
        function ge(e) {
          return null != e && be(e.length) && !ve(e);
        }
        var he =
          B ||
          function () {
            return !1;
          };
        function ve(e) {
          if (!ye(e)) return !1;
          var t = oe(e);
          return (
            t == s ||
            '[object GeneratorFunction]' == t ||
            '[object AsyncFunction]' == t ||
            '[object Proxy]' == t
          );
        }
        function be(e) {
          return 'number' == typeof e && e > -1 && e % 1 == 0 && e <= a;
        }
        function ye(e) {
          var t = typeof e;
          return null != e && ('object' == t || 'function' == t);
        }
        function je(e) {
          return null != e && 'object' == typeof e;
        }
        var xe = y
          ? (function (e) {
              return function (t) {
                return e(t);
              };
            })(y)
          : function (e) {
              return je(e) && be(e.length) && !!d[oe(e)];
            };
        function we(e) {
          return ge(e)
            ? (function (e, t) {
                var n = pe(e),
                  o = !n && ue(e),
                  a = !n && !o && he(e),
                  i = !n && !o && !a && xe(e),
                  s = n || o || a || i,
                  r = s
                    ? (function (e, t) {
                        for (var n = -1, o = Array(e); ++n < e; ) o[n] = t(n);
                        return o;
                      })(e.length, String)
                    : [],
                  l = r.length;
                for (var c in e)
                  (!t && !C.call(e, c)) ||
                    (s &&
                      ('length' == c ||
                        (a && ('offset' == c || 'parent' == c)) ||
                        (i && ('buffer' == c || 'byteLength' == c || 'byteOffset' == c)) ||
                        le(c, l))) ||
                    r.push(c);
                return r;
              })(e, !0)
            : (function (e) {
                if (!ye(e))
                  return (function (e) {
                    var t = [];
                    if (null != e) for (var n in Object(e)) t.push(n);
                    return t;
                  })(e);
                var t = ce(e),
                  n = [];
                for (var o in e) ('constructor' != o || (!t && C.call(e, o))) && n.push(o);
                return n;
              })(e);
        }
        var _e,
          ke =
            ((_e = function (e, t, n) {
              ie(e, t, n);
            }),
            (function (e, t) {
              return fe(
                (function (e, t, n) {
                  return (
                    (t = L(void 0 === t ? e.length - 1 : t, 0)),
                    function () {
                      for (
                        var o = arguments, a = -1, i = L(o.length - t, 0), s = Array(i);
                        ++a < i;

                      )
                        s[a] = o[t + a];
                      a = -1;
                      for (var r = Array(t + 1); ++a < t; ) r[a] = o[a];
                      return (r[t] = n(s)), j(e, this, r);
                    }
                  );
                })(e, t, Ne),
                e + '',
              );
            })(function (e, t) {
              var n = -1,
                o = t.length,
                a = o > 1 ? t[o - 1] : void 0,
                i = o > 2 ? t[2] : void 0;
              for (
                a = _e.length > 3 && 'function' == typeof a ? (o--, a) : void 0,
                  i &&
                    (function (e, t, n) {
                      if (!ye(n)) return !1;
                      var o = typeof t;
                      return (
                        !!('number' == o ? ge(n) && le(t, n.length) : 'string' == o && (t in n)) &&
                        me(n[t], e)
                      );
                    })(t[0], t[1], i) &&
                    ((a = o < 3 ? void 0 : a), (o = 1)),
                  e = Object(e);
                ++n < o;

              ) {
                var s = t[n];
                s && _e(e, s, n);
              }
              return e;
            }));
        function Ne(e) {
          return e;
        }
        e.exports = ke;
      },
      6677: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.activateIcons = void 0);
        const r = i(n(7549)),
          l = i(n(9489)),
          c = i(n(2247));
        t.activateIcons = () => d();
        const d = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              yield l.getConfig().update('workbench.iconTheme', 'material-icon-theme', !0),
                void 0 !== l.getConfig().inspect('workbench.iconTheme').workspaceValue &&
                  l.getConfig().update('workbench.iconTheme', 'material-icon-theme'),
                r.window.showInformationMessage(c.translate('activated'));
            } catch (e) {
              console.error(e);
            }
          });
      },
      5438: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.checkArrowStatus = t.toggleExplorerArrows = void 0);
        const r = i(n(7549)),
          l = i(n(9489)),
          c = i(n(2247));
        t.toggleExplorerArrows = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = t.checkArrowStatus(),
                n = yield d(e);
              return f(n);
            } catch (e) {
              console.error(e);
            }
          });
        const d = (e) => {
            const t = {
                description: c.translate('toggleSwitch.on'),
                detail: c.translate('explorerArrows.enable'),
                label: e ? '◻' : '✔',
              },
              n = {
                description: c.translate('toggleSwitch.off'),
                detail: c.translate('explorerArrows.disable'),
                label: e ? '✔' : '◻',
              };
            return r.window.showQuickPick([t, n], {
              placeHolder: c.translate('explorerArrows.toggle'),
              ignoreFocusOut: !1,
              matchOnDescription: !0,
            });
          },
          f = (e) => {
            if (e && e.description)
              switch (e.description) {
                case c.translate('toggleSwitch.on'):
                  return l.setThemeConfig('hidesExplorerArrows', !1, !0);
                case c.translate('toggleSwitch.off'):
                  return l.setThemeConfig('hidesExplorerArrows', !0, !0);
                default:
                  return;
              }
          };
        t.checkArrowStatus = () => l.getMaterialIconsJSON().hidesExplorerArrows;
      },
      3572: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.checkFolderColorStatus = t.changeFolderColor = void 0);
        const r = i(n(7549)),
          l = n(1254),
          c = i(n(9489)),
          d = i(n(2247)),
          f = [
            { label: 'Grey (Default)', hex: '#90a4ae' },
            { label: 'Blue', hex: '#42a5f5' },
            { label: 'Green', hex: '#7CB342' },
            { label: 'Teal', hex: '#26A69A' },
            { label: 'Red', hex: '#EF5350' },
            { label: 'Orange', hex: '#FF7043' },
            { label: 'Yellow', hex: '#FDD835' },
            { label: 'Custom Color', hex: 'Custom HEX Code' },
          ];
        t.changeFolderColor = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = t.checkFolderColorStatus(),
                n = yield m(e);
              u(n);
            } catch (e) {
              console.error(e);
            }
          });
        const m = (e) => {
            const t = f.map((t) => ({ description: t.label, label: h(t, e) ? '✔' : '◻' }));
            return r.window.showQuickPick(t, {
              placeHolder: d.translate('folders.color'),
              ignoreFocusOut: !1,
              matchOnDescription: !0,
            });
          },
          u = (e) => {
            if (e && e.description)
              if ('Custom Color' === e.description)
                r.window
                  .showInputBox({
                    placeHolder: d.translate('folders.hexCode'),
                    ignoreFocusOut: !0,
                    validateInput: p,
                  })
                  .then((e) => g(e));
              else {
                const t = f.find((t) => t.label === e.description).hex;
                g(t);
              }
          },
          p = (e) => {
            if (!l.validateHEXColorCode(e)) return d.translate('folders.wrongHexCode');
          };
        t.checkFolderColorStatus = () => {
          var e;
          const t = l.getDefaultIconOptions();
          return null !== (e = c.getMaterialIconsJSON().options.folders.color) && void 0 !== e
            ? e
            : t.folders.color;
        };
        const g = (e) => {
            e && c.setThemeConfig('folders.color', e.toLowerCase(), !0);
          },
          h = (e, t) =>
            'Custom Color' === e.label
              ? !f.some((e) => e.hex.toLowerCase() === t.toLowerCase())
              : e.hex.toLowerCase() === t.toLowerCase();
      },
      9560: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.checkFolderIconsStatus = t.changeFolderTheme = void 0);
        const r = i(n(7549)),
          l = n(1254),
          c = i(n(9489)),
          d = i(n(2247));
        t.changeFolderTheme = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = t.checkFolderIconsStatus(),
                n = yield f(e);
              m(n);
            } catch (e) {
              console.error(e);
            }
          });
        const f = (e) => {
            const t = l.folderIcons.map((t) => ({
              description: c.capitalizeFirstLetter(t.name),
              detail:
                'none' === t.name
                  ? d.translate('folders.disabled')
                  : d.translate('folders.theme.description', c.capitalizeFirstLetter(t.name)),
              label: t.name === e ? '✔' : '◻',
            }));
            return r.window.showQuickPick(t, {
              placeHolder: d.translate('folders.toggleIcons'),
              ignoreFocusOut: !1,
              matchOnDescription: !0,
            });
          },
          m = (e) => {
            if (e && e.description)
              return c.setThemeConfig('folders.theme', e.description.toLowerCase(), !0);
          };
        t.checkFolderIconsStatus = () => c.getMaterialIconsJSON().options.folders.theme;
      },
      9482: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.checkGrayscaleStatus = t.toggleGrayscale = void 0);
        const r = i(n(7549)),
          l = i(n(9489)),
          c = i(n(2247));
        t.toggleGrayscale = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = t.checkGrayscaleStatus(),
                n = yield d(e);
              f(n);
            } catch (e) {
              console.error(e);
            }
          });
        const d = (e) => {
            const t = {
                description: c.translate('toggleSwitch.on'),
                detail: c.translate('grayscale.enable'),
                label: e ? '✔' : '◻',
              },
              n = {
                description: c.translate('toggleSwitch.off'),
                detail: c.translate('grayscale.disable'),
                label: e ? '◻' : '✔',
              };
            return r.window.showQuickPick([t, n], {
              placeHolder: c.translate('grayscale.toggle'),
              ignoreFocusOut: !1,
              matchOnDescription: !0,
            });
          },
          f = (e) => {
            if (e && e.description)
              switch (e.description) {
                case c.translate('toggleSwitch.on'):
                  return l.setThemeConfig('saturation', 0, !0);
                case c.translate('toggleSwitch.off'):
                  return l.setThemeConfig('saturation', 1, !0);
                default:
                  return;
              }
          };
        t.checkGrayscaleStatus = () => 0 === l.getMaterialIconsJSON().options.saturation;
      },
      4578: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getAllIconPacks = t.toggleIconPacks = void 0);
        const r = i(n(7549)),
          l = n(7554),
          c = i(n(9489)),
          d = i(n(2247));
        t.toggleIconPacks = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = u(),
                t = yield f(e);
              m(t);
            } catch (e) {
              console.error(e);
            }
          });
        const f = (e) => {
            const n = [...t.getAllIconPacks().sort(), 'none'].map((t) => {
              const n = c.toTitleCase(t.replace('_', ' + ')),
                o = p(e, t),
                a = 'none' === t && '' === e;
              return {
                description: n,
                detail: d.translate('iconPacks.' + ('none' === t ? 'disabled' : 'description'), n),
                label: a || o ? '✔' : '◻',
              };
            });
            return r.window.showQuickPick(n, {
              placeHolder: d.translate('iconPacks.selectPack'),
              ignoreFocusOut: !1,
              matchOnDescription: !0,
              matchOnDetail: !0,
            });
          },
          m = (e) => {
            if (!e || !e.description) return;
            const t = e.description.replace(' + ', '_').toLowerCase();
            c.setThemeConfig('activeIconPack', 'none' === t ? '' : t, !0);
          },
          u = () => c.getMaterialIconsJSON().options.activeIconPack;
        t.getAllIconPacks = () => {
          const e = [];
          for (const t in l.IconPack) isNaN(Number(t)) && e.push(l.IconPack[t].toLowerCase());
          return e;
        };
        const p = (e, t) => e.toLowerCase() === t.toLowerCase();
      },
      5885: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.registered = void 0);
        const s = i(n(7549)),
          r = n(6677),
          l = n(5438),
          c = n(3572),
          d = n(9560),
          f = n(9482),
          m = n(4578),
          u = n(9411),
          p = n(2225),
          g = n(3403),
          h = {
            activateIcons: r.activateIcons,
            toggleIconPacks: m.toggleIconPacks,
            changeFolderTheme: d.changeFolderTheme,
            changeFolderColor: c.changeFolderColor,
            restoreDefaultConfig: p.restoreDefaultConfig,
            toggleExplorerArrows: l.toggleExplorerArrows,
            changeOpacity: u.changeOpacity,
            toggleGrayscale: f.toggleGrayscale,
            changeSaturation: g.changeSaturation,
          };
        t.registered = Object.keys(h).map((e) =>
          s.commands.registerCommand(`material-icon-theme.${e}`, () => h[e]()),
        );
      },
      9411: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getCurrentOpacityValue = t.changeOpacity = void 0);
        const r = i(n(7549)),
          l = n(1254),
          c = i(n(9489)),
          d = i(n(2247));
        t.changeOpacity = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = t.getCurrentOpacityValue(),
                n = Number(yield f(e));
              return u(n);
            } catch (e) {
              console.error(e);
            }
          });
        const f = (e) =>
            r.window.showInputBox({
              placeHolder: d.translate('opacity.inputPlaceholder'),
              ignoreFocusOut: !0,
              value: String(e),
              validateInput: m,
            }),
          m = (e) => {
            if (!l.validateOpacityValue(+e)) return d.translate('opacity.wrongValue');
          };
        t.getCurrentOpacityValue = () => {
          var e;
          const t = l.getDefaultIconOptions();
          return null !== (e = c.getMaterialIconsJSON().options.opacity) && void 0 !== e
            ? e
            : t.opacity;
        };
        const u = (e) => {
          if (void 0 !== e) return c.setThemeConfig('opacity', e, !0);
        };
      },
      2225: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.restoreDefaultConfig = void 0);
        const o = n(9489);
        t.restoreDefaultConfig = () => {
          o.setThemeConfig('activeIconPack', void 0, !0),
            o.setThemeConfig('folders.theme', void 0, !0),
            o.setThemeConfig('folders.color', void 0, !0),
            o.setThemeConfig('hidesExplorerArrows', void 0, !0),
            o.setThemeConfig('opacity', void 0, !0),
            o.setThemeConfig('saturation', void 0, !0),
            o.setThemeConfig('files.associations', void 0, !0),
            o.setThemeConfig('folders.associations', void 0, !0),
            o.setThemeConfig('languages.associations', void 0, !0);
        };
      },
      3403: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getCurrentSaturationValue = t.changeSaturation = void 0);
        const r = i(n(7549)),
          l = n(1254),
          c = i(n(9489)),
          d = i(n(2247));
        t.changeSaturation = () =>
          s(void 0, void 0, void 0, function* () {
            try {
              const e = t.getCurrentSaturationValue(),
                n = Number(yield f(e));
              u(n);
            } catch (e) {
              console.error(e);
            }
          });
        const f = (e) =>
            r.window.showInputBox({
              placeHolder: d.translate('saturation.inputPlaceholder'),
              ignoreFocusOut: !0,
              value: String(e),
              validateInput: m,
            }),
          m = (e) => {
            if (!l.validateSaturationValue(+e)) return d.translate('saturation.wrongValue');
          };
        t.getCurrentSaturationValue = () => {
          var e;
          const t = l.getDefaultIconOptions();
          return null !== (e = c.getMaterialIconsJSON().options.saturation) && void 0 !== e
            ? e
            : t.saturation;
        };
        const u = (e) => {
          if (void 0 !== e) return c.setThemeConfig('saturation', e, !0);
        };
      },
      112: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.deactivate = t.activate = void 0);
        const r = i(n(7549)),
          l = i(n(5885)),
          c = n(1808),
          d = n(5566),
          f = i(n(2247)),
          m = n(7346);
        (t.activate = (e) =>
          s(void 0, void 0, void 0, function* () {
            try {
              yield f.initTranslations(), e.globalState.setKeysForSync([d.versionKey]);
              const t = yield d.checkThemeStatus(e.globalState);
              m.showStartMessages(t),
                e.subscriptions.push(...l.registered),
                c.detectConfigChanges(),
                r.workspace.onDidChangeConfiguration(c.detectConfigChanges);
            } catch (e) {
              console.error(e);
            }
          })),
          (t.deactivate = () => {});
      },
      1808: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.detectConfigChanges = void 0);
        const o = n(9489),
          a = n(1254),
          i = n(3302);
        t.detectConfigChanges = () => {
          const e = s();
          if (0 !== Object.keys(e.updatedConfigs).length)
            try {
              a.createIconFile(e.updatedConfigs, e.updatedJSONConfig);
            } catch (e) {
              console.error(e);
            }
        };
        const s = () => {
          const e = Object.keys(o.getConfigProperties())
              .map((e) => e.split('.').slice(1).join('.'))
              .filter((e) => !/show(Welcome|Update|Reload)Message/g.test(e)),
            t = o.getMaterialIconsJSON();
          return e.reduce(
            (e, n) => {
              var a;
              try {
                const s = o.getThemeConfig(n),
                  r = null !== (a = s.globalValue) && void 0 !== a ? a : s.defaultValue,
                  l = i.getObjectPropertyValue(t.options, n);
                JSON.stringify(r) !== JSON.stringify(l) &&
                  (i.setObjectPropertyValue(t.options, n, r),
                  i.setObjectPropertyValue(e.updatedConfigs, n, r));
              } catch (e) {
                console.error(e);
              }
              return e;
            },
            { updatedConfigs: {}, updatedJSONConfig: t.options },
          );
        };
      },
      2425: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getCustomIconPaths = void 0);
        const s = i(n(5622));
        t.getCustomIconPaths = (e) =>
          Object.values(e.files.associations)
            .filter((e) => e.match(/^[.\/]+/))
            .map((e) => s.dirname(s.join(__dirname, e)));
      },
      2331: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getFileConfigHash = void 0);
        const o = n(1254);
        t.getFileConfigHash = (e) => {
          try {
            const t = o.getDefaultIconOptions();
            let n = '';
            return (
              (e.saturation === t.saturation &&
                e.opacity === t.opacity &&
                e.folders.color === t.folders.color) ||
                (n += `~${a(JSON.stringify(e))}`),
              n
            );
          } catch (e) {
            console.error(e);
          }
        };
        const a = (e) => {
          let t = 0,
            n = 0;
          if (0 === e.length) return t;
          for (let o = 0; o < e.length; o++)
            (n = e.charCodeAt(o)), (t = (t << 5) - t + n), (t |= 0);
          return t;
        };
      },
      9489: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.toTitleCase =
            t.capitalizeFirstLetter =
            t.promptToReload =
            t.getMaterialIconsJSON =
            t.getExtensionPath =
            t.isThemeNotVisible =
            t.isThemeActivated =
            t.setThemeConfig =
            t.getThemeConfig =
            t.setConfig =
            t.getConfigProperties =
            t.getConfig =
              void 0);
        const s = i(n(5747)),
          r = i(n(5622)),
          l = i(n(7549)),
          c = n(1254),
          d = i(n(1459));
        (t.getConfig = (e) => l.workspace.getConfiguration(e)),
          (t.getConfigProperties = () =>
            l.extensions.getExtension('PKief.material-icon-theme').packageJSON.contributes
              .configuration.properties),
          (t.setConfig = (e, n, o = !1) => t.getConfig().update(e, n, o)),
          (t.getThemeConfig = (e) => t.getConfig('material-icon-theme').inspect(e)),
          (t.setThemeConfig = (e, n, o = !1) => t.getConfig('material-icon-theme').update(e, n, o)),
          (t.isThemeActivated = (e = !1) =>
            e
              ? 'material-icon-theme' === t.getConfig().inspect('workbench.iconTheme').globalValue
              : 'material-icon-theme' ===
                t.getConfig().inspect('workbench.iconTheme').workspaceValue),
          (t.isThemeNotVisible = () => {
            const e = t.getConfig().inspect('workbench.iconTheme');
            return (
              (!t.isThemeActivated(!0) && void 0 === e.workspaceValue) ||
              (!t.isThemeActivated() && void 0 !== e.workspaceValue)
            );
          }),
          (t.getExtensionPath = () =>
            l.extensions.getExtension('PKief.material-icon-theme').extensionPath),
          (t.getMaterialIconsJSON = () => {
            const e = r.join(t.getExtensionPath(), 'dist', c.iconJsonName);
            try {
              const t = s.readFileSync(e, 'utf8');
              return JSON.parse(t);
            } catch (e) {
              return void console.error(e);
            }
          }),
          (t.promptToReload = () =>
            d.showConfirmToReloadMessage().then((e) => {
              e && f();
            }));
        const f = () => l.commands.executeCommand('workbench.action.reloadWindow');
        (t.capitalizeFirstLetter = (e) => e.charAt(0).toUpperCase() + e.slice(1)),
          (t.toTitleCase = (e) =>
            e.replace(/\w\S*/g, (e) => e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()));
      },
      3302: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.setObjectPropertyValue = t.getObjectPropertyValue = void 0),
          (t.getObjectPropertyValue = (e, t) => {
            const n = t
              .replace(/\[(\w+)\]/g, '.$1')
              .replace(/^\./, '')
              .split('.');
            let o = JSON.parse(JSON.stringify(e));
            for (let e = 0; e < n.length; ++e) {
              const t = n[e];
              if ((a = o) !== Object(a) || !(t in o)) return;
              o = o[t];
            }
            var a;
            return o;
          }),
          (t.setObjectPropertyValue = (e, n, o) => {
            if (('string' == typeof n && (n = n.split('.')), n.length > 1)) {
              const a = n.shift();
              t.setObjectPropertyValue(
                (e[a] = '[object Object]' === Object.prototype.toString.call(e[a]) ? e[a] : {}),
                n,
                o,
              );
            } else e[n[0]] = o;
          });
      },
      5566: function (e, t, n) {
        'use strict';
        var o =
          (this && this.__awaiter) ||
          function (e, t, n, o) {
            return new (n || (n = Promise))(function (a, i) {
              function s(e) {
                try {
                  l(o.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function r(e) {
                try {
                  l(o.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? a(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(s, r);
              }
              l((o = o.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.checkThemeStatus = t.versionKey = t.getConfig = void 0);
        const a = n(7549),
          i = n(9489),
          s = n(9205);
        (t.getConfig = (e) => a.workspace.getConfiguration(e)),
          (t.versionKey = 'material-icon-theme.version'),
          (t.checkThemeStatus = (e) =>
            o(void 0, void 0, void 0, function* () {
              try {
                const n = e.get(t.versionKey),
                  o = d();
                return void 0 === n || 'string' != typeof n
                  ? (yield c(e), l() ? s.ThemeStatus.updated : s.ThemeStatus.neverUsedBefore)
                  : o && r(o, n)
                  ? (yield c(e), s.ThemeStatus.updated)
                  : s.ThemeStatus.current;
              } catch (e) {
                return console.error(e), s.ThemeStatus.current;
              }
            }));
        const r = (e, t) => 1 === e.localeCompare(t, void 0, { numeric: !0, sensitivity: 'base' }),
          l = () => i.isThemeActivated() || i.isThemeActivated(!0),
          c = (e) => {
            const n = d();
            if (n) return e.update(t.versionKey, n);
          },
          d = () => {
            var e;
            return null === (e = a.extensions.getExtension('PKief.material-icon-theme')) ||
              void 0 === e
              ? void 0
              : e.packageJSON.version;
          };
      },
      2247: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.replace =
            t.translate =
            t.getTranslationValue =
            t.initTranslations =
            t.getCurrentLanguage =
              void 0);
        const r = i(n(7549)),
          l = n(3302);
        let c, d;
        (t.getCurrentLanguage = () => r.env.language),
          (t.initTranslations = () =>
            s(void 0, void 0, void 0, function* () {
              try {
                (c = yield f(t.getCurrentLanguage())), (d = yield f('en'));
              } catch (e) {
                console.error(e);
              }
            }));
        const f = (e) =>
            s(void 0, void 0, void 0, function* () {
              try {
                return yield m(e);
              } catch (e) {
                return yield m('en');
              }
            }),
          m = (e) =>
            s(void 0, void 0, void 0, function* () {
              return (yield Promise.resolve().then(() => i(n(6684)(`./lang-${e}`)))).translation;
            });
        (t.getTranslationValue = (e, t = c, n = d) =>
          l.getObjectPropertyValue(t, e) || l.getObjectPropertyValue(n, e) || void 0),
          (t.translate = (e, n) => {
            const o = t.getTranslationValue(e);
            return n ? t.replace(o, n) : o;
          }),
          (t.replace = (e = '', t) => {
            let n = e;
            return (
              [].concat(t).forEach((e, t) => {
                n = n.replace('%'.concat(t), e);
              }),
              n
            );
          });
      },
      3722: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Theme wurde installiert.',
            howToActivate: 'Wie Icons aktivieren?',
            activate: 'Aktivieren',
            activated: 'Material Icon Theme ist jetzt aktiviert.',
            neverShowAgain: 'Nicht mehr zeigen',
            themeUpdated: 'Das Material Icon Theme wurde aktualisiert.',
            readChangelog: 'Änderungsprotokoll lesen',
            iconPacks: {
              selectPack: 'Icon Pack auswählen',
              description: "Das '%0' Icon Pack auswählen",
              disabled: 'Icon Packs deaktivieren',
            },
            folders: {
              toggleIcons: 'Wähle ein Ordner Design',
              color: 'Wähle eine Ordner Farbe',
              hexCode: 'Gebe einen HEX Farbcode ein',
              wrongHexCode: 'Ungültiger HEX Farbcode',
              disabled: 'Keine Ordner Icons',
              theme: { description: "Wähle das '%0' Design" },
            },
            opacity: {
              inputPlaceholder: 'Wert der Deckkraft (zwischen 0 und 1)',
              wrongValue: 'Der Wert muss zwischen 0 und 1 liegen!',
            },
            toggleSwitch: { on: 'EIN', off: 'AUS' },
            explorerArrows: {
              toggle: 'Pfeile im Explorer anpassen',
              enable: 'Explorer Pfeile anzeigen',
              disable: 'Explorer Pfeile ausblenden',
            },
            grayscale: {
              toggle: 'Schaltet graustufige Icons um',
              enable: 'Aktiviert graustufige Icons',
              disable: 'Deaktiviert graustufige Icons',
            },
            saturation: {
              inputPlaceholder: 'Wert der Sättigung (zwischen 0 und 1)',
              wrongValue: 'Der Wert muss zwischen 0 und 1 liegen!',
            },
            confirmReload:
              'VS Code muss neu gestartet werden, um die Änderungen an den Icons zu aktivieren.',
            reload: 'Neu starten',
            outdatedVersion: 'VS Code muss aktualisiert werden, um diesen Befehl auszuführen.',
            updateVSCode: 'VS Code aktualisieren',
          });
      },
      2925: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Theme has been installed.',
            howToActivate: 'How to activate icons',
            activate: 'Activate',
            activated: 'Material Icon Theme is active.',
            neverShowAgain: 'Never show again',
            themeUpdated: 'Material Icon Theme has been updated.',
            readChangelog: 'Read changelog',
            iconPacks: {
              selectPack: 'Select an icon pack',
              description: "Select the '%0' icon pack",
              disabled: 'Disable icon packs',
            },
            folders: {
              toggleIcons: 'Pick a folder theme',
              color: 'Choose a folder color',
              hexCode: 'Insert a HEX color code',
              wrongHexCode: 'Invalid HEX color code!',
              disabled: 'No folder icons',
              theme: { description: "Select the '%0' folder theme" },
            },
            opacity: {
              inputPlaceholder: 'Opacity value (between 0 and 1)',
              wrongValue: 'The value must be between 0 and 1!',
            },
            toggleSwitch: { on: 'ON', off: 'OFF' },
            explorerArrows: {
              toggle: 'Toggle folder arrows',
              enable: 'Show folder arrows',
              disable: 'Hide folder arrows',
            },
            confirmReload: 'You have to restart VS Code to activate the changes to the icons.',
            reload: 'Restart',
            outdatedVersion: 'You have to update VS Code to use this command.',
            updateVSCode: 'Update VS Code',
            grayscale: {
              toggle: 'Toggle grayscale icons',
              enable: 'Enable grayscale icons',
              disable: 'Disable grayscale icons',
            },
            saturation: {
              inputPlaceholder: 'Saturation value (between 0 and 1)',
              wrongValue: 'The value must be between 0 and 1!',
            },
          });
      },
      422: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Theme se ha instalado.',
            howToActivate: 'Cómo activar los iconos',
            activate: 'Activar',
            activated: 'Material Icon Theme está activado.',
            neverShowAgain: 'No mostrar más',
            themeUpdated: 'Material Icon Theme se ha actualizado.',
            readChangelog: 'Leer changelog',
            iconPacks: {
              selectPack: 'Seleccione un paquete de iconos',
              description: "Seleccione el paquete de iconos '%0'",
              disabled: 'Desactivar paquetes de iconos',
            },
            folders: {
              toggleIcons: 'Cambiar activación de iconos de carpetas',
              color: 'Elija un color de carpeta',
              hexCode: 'Insertar un código de color HEX',
              wrongHexCode: 'Código de color HEX inválido!',
              disabled: 'Sin iconos de carpeta',
              theme: { description: "Iconos de carpeta '%0'" },
            },
            opacity: {
              inputPlaceholder: 'Valor de opacidad (entre 0 y 1)',
              wrongValue: 'El valor debe estar entre 0 y 1!',
            },
            toggleSwitch: { on: 'ON', off: 'OFF' },
            explorerArrows: {
              toggle: 'Conmutar las flechas de carpetas',
              enable: 'Mostrar flechas de carpeta',
              disable: 'Ocultar las flechas de carpetas',
            },
            confirmReload: 'Debe reiniciar VS Code para activar los cambios en los iconos.',
            reload: 'Reiniciar',
            outdatedVersion: 'Debe actualizar VS Code para utilizar este comando.',
            updateVSCode: 'Actualizar VS Code',
          });
      },
      7941: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Theme a été installé.',
            howToActivate: 'Comment activer les icônes',
            activate: 'Activer',
            activated: 'Material Icon Theme est actif.',
            neverShowAgain: 'Ne plus afficher',
            themeUpdated: 'Material Icon Theme a été mis à jour.',
            readChangelog: 'Lire la liste des changements',
            iconPacks: {
              selectPack: "Sélectionnez un pack d'icônes",
              description: "Sélectionner le pack d'icônes '%0'",
              disabled: "Désactiver les paquets d'icônes",
            },
            folders: {
              toggleIcons: 'Basculer les icônes de dossiers',
              color: 'Choisissez une couleur de dossier',
              hexCode: 'Insérer un code couleur HEX',
              wrongHexCode: 'Code couleur HEX non valide!',
              disabled: 'Aucune icônes de dossiers',
              theme: { description: "Icônes de dossiers '%0'" },
            },
            opacity: {
              inputPlaceholder: "Valeur d'opacité (entre 0 et 1)",
              wrongValue: 'La valeur doit être comprise entre 0 et 1!',
            },
            toggleSwitch: { on: 'ON', off: 'OFF' },
            explorerArrows: {
              toggle: 'Basculer les flèches du dossier',
              enable: 'Afficher les flèches du dossier',
              disable: 'Cacher les flèches de dossier',
            },
            confirmReload: 'Veuillez redémarrer VS Code pour activer les icônes',
            reload: 'Redémarrer',
            outdatedVersion: 'Vous devez mettre VS Code à jour pour utiliser cette commande.',
            updateVSCode: 'Mettre VS Code à jour.',
          });
      },
      4398: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Thema is geïnstalleerd.',
            howToActivate: 'Hoe je icons activeert',
            activate: 'Activeer',
            activated: 'Material Icon Thema is actief.',
            neverShowAgain: 'Nooit meer laten zien',
            themeUpdated: 'Material Icon Thema is geüpdated.',
            readChangelog: 'Lees de changelog',
            iconPacks: {
              selectPack: 'Selecteer een iconpakket',
              description: "Selecteer het '%0' iconpakket",
              disabled: 'Zet iconpaketten uit',
            },
            folders: {
              toggleIcons: 'Kies een folderthema',
              color: 'Kies een folderkleur',
              hexCode: 'Voeg een HEX kleurcode in',
              wrongHexCode: 'Ongeldige HEX kleurcode!',
              disabled: 'Geen foldericons',
              theme: { description: "Selecteer het '%0' folderthema" },
            },
            opacity: {
              inputPlaceholder: 'Doorzichtbaarheidswaarde (tussen 0 en 1)',
              wrongValue: 'De waarde moet tussen de 0 en 1 zijn!',
            },
            toggleSwitch: { on: 'AAN', off: 'UIT' },
            explorerArrows: {
              toggle: 'Zet folderpijlen aan of uit',
              enable: 'Laat folderpijlen zien',
              disable: 'Verberg folderpijlen',
            },
            confirmReload: 'Je moet VS Code herstarten om de veranderingen in icons te activeren.',
            reload: 'Herstart',
            outdatedVersion: 'Je moet VS Code updaten om dit commando te kunnen gebruiken.',
            updateVSCode: 'Update VS Code',
            grayscale: {
              toggle: 'Zet grijsgetinte icons aan of uit',
              enable: 'Zet grijsgetinte icons aan',
              disable: 'Zet grijsgetinte icons uit',
            },
            saturation: {
              inputPlaceholder: 'Saturatiewaarde (tussen 0 en 1)',
              wrongValue: 'De waarde moet tussen de 0 en 1 zijn!',
            },
          });
      },
      9597: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Motyw Material Icon został zainstalowany.',
            howToActivate: 'Jak aktywować ikony',
            activate: 'Aktywuj',
            activated: 'Motyw Material Icon jest aktywny.',
            neverShowAgain: 'Nigdy więcej nie pokazuj',
            themeUpdated: 'Motyw Material Icon został zaktualizowany.',
            readChangelog: 'Przeczytaj listę zmian',
            iconPacks: {
              selectPack: 'Wybierz paczkę ikon',
              description: "Wybierz paczkę ikon '%0'",
              disabled: 'Wyłącz paczki ikon',
            },
            folders: {
              toggleIcons: 'Wybierz motyw folderów',
              color: 'Wybierz kolor folderów',
              hexCode: 'Podaj kolor w formacie HEX',
              wrongHexCode: 'Nieprawidłowy kolor HEX!',
              disabled: 'Brak ikon folderów',
              theme: { description: "Wybierz motyw folderów '%0'" },
            },
            opacity: {
              inputPlaceholder: 'Wartość przezroczystości (pomiędzy 0 a 1)',
              wrongValue: 'Wartość musi być pomiędzy 0 i 1!',
            },
            toggleSwitch: { on: 'WŁĄCZONE', off: 'WYŁĄCZONE' },
            explorerArrows: {
              toggle: 'Przełącz strzałki przy folderach',
              enable: 'Pokaż strzałki przy folderach',
              disable: 'Schowaj strzałki przy folderach',
            },
            confirmReload: 'Musisz zrestartować VS Code, aby uaktywnić zmiany ikon.',
            reload: 'Restartuj',
            outdatedVersion: 'Musisz zaktualizować VS Code, aby użyć tej komendy.',
            updateVSCode: 'Zaktualizuj VS Code',
            grayscale: {
              toggle: 'Przełącz czarno-białe ikony',
              enable: 'Włącz czarno-białe ikony',
              disable: 'Wyłącz czarno-białe ikony',
            },
            saturation: {
              inputPlaceholder: 'Wartość nasycenia (pomiędzy 0 a 1)',
              wrongValue: 'Wartość musi być pomiędzy 0 i 1!',
            },
          });
      },
      7100: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'O Material Icon Theme foi instalado.',
            howToActivate: 'Como ativar os ícones',
            activate: 'Ativar',
            activated: 'O Material Icon Theme está ativo.',
            neverShowAgain: 'Não mostrar novamente',
            themeUpdated: 'O Material Icon Theme foi atualizado.',
            readChangelog: 'Ler changelog',
            iconPacks: {
              selectPack: 'Selecione um pacote de ícones',
              description: "Selecionar o pacote de ícones '%0'",
              disabled: 'Desabilitar pacotes de ícones',
            },
            folders: {
              toggleIcons: 'Escolha um tema para as pastas',
              color: 'Escolha uma cor para as pastas',
              hexCode: 'Insira um código de cor hexadecimal',
              wrongHexCode: 'Código de cor hexadecimal inválido!',
              disabled: 'Nenhum ícone de pasta',
              theme: { description: "Selecionar o tema para pastas '%0'" },
            },
            opacity: {
              inputPlaceholder: 'Valor de opacidade (entre 0 e 1)',
              wrongValue: 'O valor deve estar entre 0 e 1!',
            },
            toggleSwitch: { on: 'ON', off: 'OFF' },
            explorerArrows: {
              toggle: 'Alternar setas do explorador de arquivos',
              enable: 'Exibir setas do explorador de arquivos',
              disable: 'Ocultar setas do explorador de arquivos',
            },
            confirmReload: 'Você precisa reiniciar o VS Code para ativar a mudança de ícones.',
            reload: 'Reiniciar',
            outdatedVersion: 'Você precisa atualizar o VS Code para usar esse comando.',
            updateVSCode: 'Atualizar VS Code',
          });
      },
      3536: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'O Material Icon Theme foi instalado.',
            howToActivate: 'Como habilitar os ícones',
            activate: 'Habilitar',
            activated: 'O Material Icon Theme está habilitado.',
            neverShowAgain: 'Não mostrar novamente',
            themeUpdated: 'O Material Icon Theme foi atualizado.',
            readChangelog: 'Ler registos',
            iconPacks: {
              selectPack: 'Seleccione um pacote de ícones',
              description: "Seleccionar o pacote de ícones '%0'",
              disabled: 'Desabilitar pacotes de ícones',
            },
            folders: {
              toggleIcons: 'Escolhe um tema para os directórios',
              color: 'Escolhe uma cor para os directórios',
              hexCode: 'Insira um código de cor hexadecimal',
              wrongHexCode: 'Código de cor hexadecimal inválido!',
              disabled: 'Nenhum ícone do directório',
              theme: { description: "Seleccionar o tema para directórios '%0'" },
            },
            opacity: {
              inputPlaceholder: 'Valor de opacidade (entre 0 e 1)',
              wrongValue: 'O valor deve estar entre 0 e 1!',
            },
            toggleSwitch: { on: 'ON', off: 'OFF' },
            explorerArrows: {
              toggle: 'Alternar setas do explorador de ficheiros',
              enable: 'Exibir setas do explorador de ficheiros',
              disable: 'Ocultar setas do explorador de ficheiros',
            },
            confirmReload: 'Precisas reinicializar o VS Code para habilitar a alteração de ícones.',
            reload: 'Reiniciar',
            outdatedVersion: 'Precisas actualizar o VS Code para utilizar este comando.',
            updateVSCode: 'Actualizar o VS Code',
          });
      },
      3189: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Theme был установлен.',
            howToActivate: 'Как активировать иконки',
            activate: 'Активировать',
            activated: 'Material Icon Theme активен.',
            neverShowAgain: 'Никогда не показывать снова',
            themeUpdated: 'Material Icon Theme был обновлен.',
            readChangelog: 'Читать изменения версии',
            iconPacks: {
              selectPack: 'Выбрать набор иконок',
              description: "Выбрать '%0' набор иконок",
              disabled: 'Выключить набор иконок',
            },
            folders: {
              toggleIcons: 'Выбрать тему папки',
              color: 'Выбрать цвет папки',
              hexCode: 'Вставить HEX-код цвета',
              wrongHexCode: 'Неверный HEX-код цвета!',
              disabled: 'Нет иконки для папки',
              theme: { description: "Выбрать '%0' тему папки" },
            },
            opacity: {
              inputPlaceholder: 'Значение непрозрачности (от 0 до 1)',
              wrongValue: 'Значение должно быть от 0 до 1!',
            },
            toggleSwitch: { on: 'Включить', off: 'Выключить' },
            explorerArrows: {
              toggle: 'Показать/Скрыть стрелки у папок',
              enable: 'Показать стрелки у папок',
              disable: 'Скрыть стрелки у папок',
            },
            confirmReload: 'Нужно перезапустить VS Code для активации иконок.',
            reload: 'Перезагрузить',
            outdatedVersion: 'Нужно обновить VS Code чтобы использовать эту команду.',
            updateVSCode: 'Обновить VS Code',
          });
      },
      7833: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material Icon Theme був встановлений.',
            howToActivate: 'Як активувати значки',
            activate: 'Активувати',
            activated: 'Material Icon Theme активований.',
            neverShowAgain: 'Ніколи не показувати знову',
            themeUpdated: 'Material Icon Theme був оновлений.',
            readChangelog: 'Прочитати зміни',
            folders: { toggleIcons: 'Переключити теку icons' },
            toggleSwitch: { on: 'Включити', off: 'Відключити' },
            confirmReload: 'Необхідно перезавантажити VS Code, щоб активувати зміни значків.',
            reload: 'Перезавантажити',
            outdatedVersion: 'Ви повинні оновити VS Code, щоб використовувати цю команду.',
            updateVSCode: 'Оновити VS Code',
          });
      },
      2539: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.translation = void 0),
          (t.translation = {
            themeInstalled: 'Material主题图标已安装',
            howToActivate: '如何激活图标',
            activate: '激活',
            activated: 'Material主题图标已激活',
            neverShowAgain: '不再显示',
            themeUpdated: 'Material主题图标已更新',
            readChangelog: '阅读更新日志',
            iconPacks: {
              selectPack: '选择图标包',
              description: '选择％0符号',
              disabled: '禁用图标包',
            },
            folders: {
              toggleIcons: '切换文件夹图标的显示',
              color: '选择一个文件夹颜色',
              hexCode: '插入HEX颜色代码',
              wrongHexCode: '无效的HEX颜色代码！',
              disabled: '不显示文件夹图标',
              theme: { description: "'%0'主题的文件夹图标" },
            },
            opacity: {
              inputPlaceholder: '不透明度值（0和1之间）',
              wrongValue: '该值必须介于0和1之间！',
            },
            toggleSwitch: { on: 'ON', off: 'OFF' },
            explorerArrows: {
              toggle: '切换文件夹箭头',
              enable: '显示文件夹箭头',
              disable: '隐藏文件夹箭头',
            },
            confirmReload: '你必须重启VS Code来应用对图标的更改',
            reload: '重启',
            outdatedVersion: '你必须更新VS Code才能使用该命令',
            updateVSCode: '更新VS Code',
          });
      },
      6034: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.fileIcons = void 0);
        const o = n(7554);
        t.fileIcons = {
          defaultIcon: { name: 'file' },
          icons: [
            { name: 'html', fileExtensions: ['htm', 'xhtml', 'html_vm', 'asp'] },
            {
              name: 'pug',
              fileExtensions: ['jade', 'pug'],
              fileNames: ['.pug-lintrc', '.pug-lintrc.js', '.pug-lintrc.json'],
            },
            { name: 'markdown', fileExtensions: ['md', 'markdown', 'rst'] },
            { name: 'blink', fileExtensions: ['blink'], light: !0 },
            { name: 'css', fileExtensions: ['css'] },
            { name: 'sass', fileExtensions: ['scss', 'sass'] },
            { name: 'less', fileExtensions: ['less'] },
            {
              name: 'json',
              fileExtensions: ['json', 'tsbuildinfo', 'json5', 'jsonl', 'ndjson'],
              fileNames: [
                '.jscsrc',
                '.jshintrc',
                'composer.lock',
                '.jsbeautifyrc',
                '.esformatter',
                'cdp.pid',
                '.lintstagedrc',
              ],
            },
            { name: 'jinja', fileExtensions: ['jinja', 'jinja2', 'j2', 'jinja-html'], light: !0 },
            { name: 'proto', fileExtensions: ['proto'] },
            { name: 'sublime', fileExtensions: ['sublime-project', 'sublime-workspace'] },
            { name: 'twine', fileExtensions: ['tw', 'twee'] },
            {
              name: 'yaml',
              fileExtensions: ['yml', 'yaml', 'yml.dist', 'yaml.dist', 'YAML-tmLanguage'],
            },
            {
              name: 'xml',
              fileExtensions: [
                'xml',
                'plist',
                'xsd',
                'dtd',
                'xsl',
                'xslt',
                'resx',
                'iml',
                'xquery',
                'tmLanguage',
                'manifest',
                'project',
                'xml.dist',
                'xml.dist.sample',
                'dmn',
              ],
              fileNames: ['.htaccess'],
            },
            {
              name: 'image',
              fileExtensions: [
                'png',
                'jpeg',
                'jpg',
                'gif',
                'ico',
                'tif',
                'tiff',
                'psd',
                'psb',
                'ami',
                'apx',
                'bmp',
                'bpg',
                'brk',
                'cur',
                'dds',
                'dng',
                'exr',
                'fpx',
                'gbr',
                'img',
                'jbig2',
                'jb2',
                'jng',
                'jxr',
                'pgf',
                'pic',
                'raw',
                'webp',
                'eps',
                'afphoto',
                'ase',
                'aseprite',
                'clip',
                'cpt',
                'heif',
                'heic',
                'kra',
                'mdp',
                'ora',
                'pdn',
                'reb',
                'sai',
                'tga',
                'xcf',
                'jfif',
                'ppm',
                'pbm',
                'pgm',
                'pnm',
              ],
            },
            { name: 'javascript', fileExtensions: ['esx', 'mjs'] },
            { name: 'react', fileExtensions: ['jsx'] },
            { name: 'react_ts', fileExtensions: ['tsx'] },
            {
              name: 'routing',
              fileExtensions: [
                'routing.ts',
                'routing.tsx',
                'routing.js',
                'routing.jsx',
                'routes.ts',
                'routes.tsx',
                'routes.js',
                'routes.jsx',
              ],
              fileNames: [
                'router.js',
                'router.jsx',
                'router.ts',
                'router.tsx',
                'routes.js',
                'routes.jsx',
                'routes.ts',
                'routes.tsx',
              ],
              enabledFor: [
                o.IconPack.Angular,
                o.IconPack.Ngrx,
                o.IconPack.React,
                o.IconPack.Redux,
                o.IconPack.Vue,
                o.IconPack.Vuex,
              ],
            },
            {
              name: 'redux-action',
              fileExtensions: ['action.js', 'actions.js', 'action.ts', 'actions.ts'],
              fileNames: ['action.js', 'actions.js', 'action.ts', 'actions.ts'],
              enabledFor: [o.IconPack.Redux],
            },
            {
              name: 'redux-reducer',
              fileExtensions: ['reducer.js', 'reducers.js', 'reducer.ts', 'reducers.ts'],
              fileNames: ['reducer.js', 'reducers.js', 'reducer.ts', 'reducers.ts'],
              enabledFor: [o.IconPack.Redux],
            },
            {
              name: 'redux-store',
              fileExtensions: ['store.js', 'store.ts'],
              fileNames: ['store.js', 'store.ts'],
              enabledFor: [o.IconPack.Redux],
            },
            {
              name: 'settings',
              fileExtensions: [
                'ini',
                'dlc',
                'dll',
                'config',
                'conf',
                'properties',
                'prop',
                'settings',
                'option',
                'props',
                'toml',
                'prefs',
                'sln.dotsettings',
                'sln.dotsettings.user',
                'cfg',
              ],
              fileNames: [
                '.jshintignore',
                '.buildignore',
                '.mrconfig',
                '.yardopts',
                'manifest.mf',
                '.clang-format',
                '.clang-tidy',
              ],
            },
            { name: 'typescript-def', fileExtensions: ['d.ts'] },
            { name: 'markojs', fileExtensions: ['marko'] },
            { name: 'astro', fileExtensions: ['astro'] },
            { name: 'pdf', fileExtensions: ['pdf'] },
            { name: 'table', fileExtensions: ['xlsx', 'xls', 'csv', 'tsv'] },
            {
              name: 'vscode',
              fileExtensions: ['vscodeignore', 'vsixmanifest', 'vsix', 'code-workplace'],
            },
            {
              name: 'visualstudio',
              fileExtensions: [
                'csproj',
                'ruleset',
                'sln',
                'suo',
                'vb',
                'vbs',
                'vcxitems',
                'vcxitems.filters',
                'vcxproj',
                'vcxproj.filters',
              ],
            },
            {
              name: 'database',
              fileExtensions: [
                'pdb',
                'sql',
                'pks',
                'pkb',
                'accdb',
                'mdb',
                'sqlite',
                'sqlite3',
                'pgsql',
                'postgres',
                'psql',
                'db',
                'db3',
              ],
            },
            { name: 'kusto', fileExtensions: ['kql'] },
            { name: 'csharp', fileExtensions: ['cs', 'csx'] },
            { name: 'qsharp', fileExtensions: ['qs'] },
            {
              name: 'zip',
              fileExtensions: [
                'zip',
                'tar',
                'gz',
                'xz',
                'br',
                'bzip2',
                'gzip',
                'brotli',
                '7z',
                'rar',
                'tgz',
              ],
            },
            { name: 'vala', fileExtensions: ['vala'] },
            { name: 'zig', fileExtensions: ['zig'] },
            { name: 'exe', fileExtensions: ['exe', 'msi'] },
            { name: 'hex', fileExtensions: ['dat', 'bin', 'hex'] },
            { name: 'java', fileExtensions: ['java', 'jsp'] },
            { name: 'jar', fileExtensions: ['jar'] },
            { name: 'javaclass', fileExtensions: ['class'] },
            { name: 'c', fileExtensions: ['c', 'm', 'i', 'mi'] },
            { name: 'h', fileExtensions: ['h'] },
            { name: 'cpp', fileExtensions: ['cc', 'cpp', 'cxx', 'c++', 'cp', 'mm', 'mii', 'ii'] },
            { name: 'hpp', fileExtensions: ['hh', 'hpp', 'hxx', 'h++', 'hp', 'tcc', 'inl'] },
            { name: 'go', fileExtensions: ['go'] },
            { name: 'go-mod', fileNames: ['go.mod', 'go.sum'] },
            { name: 'python', fileExtensions: ['py'] },
            {
              name: 'python-misc',
              fileExtensions: ['pyc', 'whl'],
              fileNames: [
                'requirements.txt',
                'pipfile',
                '.python-version',
                'manifest.in',
                'pylintrc',
                '.pylintrc',
              ],
            },
            { name: 'url', fileExtensions: ['url'] },
            {
              name: 'console',
              fileExtensions: [
                'sh',
                'ksh',
                'csh',
                'tcsh',
                'zsh',
                'bash',
                'bat',
                'cmd',
                'awk',
                'fish',
                'exp',
              ],
              fileNames: ['pre-commit', 'pre-push', 'post-merge'],
            },
            {
              name: 'powershell',
              fileExtensions: ['ps1', 'psm1', 'psd1', 'ps1xml', 'psc1', 'pssc'],
            },
            {
              name: 'gradle',
              fileExtensions: ['gradle'],
              fileNames: ['gradle.properties', 'gradlew', 'gradle-wrapper.properties'],
            },
            { name: 'word', fileExtensions: ['doc', 'docx', 'rtf'] },
            {
              name: 'certificate',
              fileExtensions: ['cer', 'cert', 'crt'],
              fileNames: [
                'copying',
                'copying.md',
                'copying.txt',
                'copyright',
                'copyright.txt',
                'copyright.md',
                'license',
                'license.md',
                'license.txt',
                'licence',
                'licence.md',
                'licence.txt',
              ],
            },
            {
              name: 'key',
              fileExtensions: ['pub', 'key', 'pem', 'asc', 'gpg', 'passwd'],
              fileNames: ['.htpasswd'],
            },
            {
              name: 'font',
              fileExtensions: [
                'woff',
                'woff2',
                'ttf',
                'eot',
                'suit',
                'otf',
                'bmap',
                'fnt',
                'odttf',
                'ttc',
                'font',
                'fonts',
                'sui',
                'ntf',
                'mrf',
              ],
            },
            { name: 'lib', fileExtensions: ['lib', 'bib'] },
            { name: 'ruby', fileExtensions: ['rb', 'erb'] },
            { name: 'gemfile', fileNames: ['gemfile'] },
            {
              name: 'rubocop',
              fileNames: ['.rubocop.yml', '.rubocop-todo.yml', '.rubocop_todo.yml'],
              light: !0,
            },
            { name: 'fsharp', fileExtensions: ['fs', 'fsx', 'fsi', 'fsproj'] },
            { name: 'swift', fileExtensions: ['swift'] },
            { name: 'arduino', fileExtensions: ['ino'] },
            {
              name: 'docker',
              fileExtensions: ['dockerignore', 'dockerfile'],
              fileNames: [
                'dockerfile',
                'dockerfile.prod',
                'dockerfile.production',
                'dockerfile.alpha',
                'dockerfile.beta',
                'dockerfile.stage',
                'dockerfile.staging',
                'dockerfile.dev',
                'dockerfile.development',
                'dockerfile.local',
                'dockerfile.test',
                'dockerfile.testing',
                'dockerfile.ci',
                'dockerfile.web',
                'dockerfile.worker',
                'docker-compose.yml',
                'docker-compose.override.yml',
                'docker-compose.prod.yml',
                'docker-compose.production.yml',
                'docker-compose.alpha.yml',
                'docker-compose.beta.yml',
                'docker-compose.stage.yml',
                'docker-compose.staging.yml',
                'docker-compose.dev.yml',
                'docker-compose.development.yml',
                'docker-compose.local.yml',
                'docker-compose.test.yml',
                'docker-compose.testing.yml',
                'docker-compose.ci.yml',
                'docker-compose.web.yml',
                'docker-compose.worker.yml',
                'docker-compose.yaml',
                'docker-compose.override.yaml',
                'docker-compose.prod.yaml',
                'docker-compose.production.yaml',
                'docker-compose.alpha.yaml',
                'docker-compose.beta.yaml',
                'docker-compose.stage.yaml',
                'docker-compose.staging.yaml',
                'docker-compose.dev.yaml',
                'docker-compose.development.yaml',
                'docker-compose.local.yaml',
                'docker-compose.test.yaml',
                'docker-compose.testing.yaml',
                'docker-compose.ci.yaml',
                'docker-compose.web.yaml',
                'docker-compose.worker.yaml',
              ],
            },
            { name: 'tex', fileExtensions: ['tex', 'sty', 'dtx', 'ltx'] },
            {
              name: 'powerpoint',
              fileExtensions: [
                'pptx',
                'ppt',
                'pptm',
                'potx',
                'potm',
                'ppsx',
                'ppsm',
                'pps',
                'ppam',
                'ppa',
              ],
            },
            {
              name: 'video',
              fileExtensions: [
                'webm',
                'mkv',
                'flv',
                'vob',
                'ogv',
                'ogg',
                'gifv',
                'avi',
                'mov',
                'qt',
                'wmv',
                'yuv',
                'rm',
                'rmvb',
                'mp4',
                'm4v',
                'mpg',
                'mp2',
                'mpeg',
                'mpe',
                'mpv',
                'm2v',
              ],
            },
            { name: 'virtual', fileExtensions: ['vdi', 'vbox', 'vbox-prev'] },
            { name: 'email', fileExtensions: ['ics'], fileNames: ['.mailmap'] },
            { name: 'audio', fileExtensions: ['mp3', 'flac', 'm4a', 'wma', 'aiff', 'wav'] },
            { name: 'coffee', fileExtensions: ['coffee', 'cson', 'iced'] },
            { name: 'document', fileExtensions: ['txt'] },
            { name: 'graphql', fileExtensions: ['graphql', 'gql'], fileNames: ['.graphqlconfig'] },
            { name: 'rust', fileExtensions: ['rs'] },
            { name: 'raml', fileExtensions: ['raml'] },
            { name: 'xaml', fileExtensions: ['xaml'] },
            { name: 'haskell', fileExtensions: ['hs'] },
            { name: 'kotlin', fileExtensions: ['kt', 'kts'] },
            {
              name: 'git',
              fileExtensions: ['patch'],
              fileNames: [
                '.gitignore',
                '.gitignore_global',
                '.gitconfig',
                '.gitattributes',
                '.gitmodules',
                '.gitkeep',
                'git-history',
              ],
            },
            { name: 'lua', fileExtensions: ['lua'], fileNames: ['.luacheckrc'] },
            { name: 'clojure', fileExtensions: ['clj', 'cljs', 'cljc'] },
            { name: 'groovy', fileExtensions: ['groovy'] },
            { name: 'r', fileExtensions: ['r', 'rmd'], fileNames: ['.Rhistory'] },
            { name: 'dart', fileExtensions: ['dart'] },
            { name: 'actionscript', fileExtensions: ['as'] },
            { name: 'mxml', fileExtensions: ['mxml'] },
            { name: 'autohotkey', fileExtensions: ['ahk'] },
            { name: 'flash', fileExtensions: ['swf'] },
            { name: 'swc', fileExtensions: ['swc'] },
            {
              name: 'cmake',
              fileExtensions: ['cmake'],
              fileNames: ['cmakelists.txt', 'cmakecache.txt'],
            },
            {
              name: 'assembly',
              fileExtensions: [
                'asm',
                'a51',
                'inc',
                'nasm',
                's',
                'ms',
                'agc',
                'ags',
                'aea',
                'argus',
                'mitigus',
                'binsource',
              ],
            },
            { name: 'vue', fileExtensions: ['vue'] },
            {
              name: 'vue-config',
              fileNames: ['vue.config.js', 'vue.config.ts', 'vetur.config.js', 'vetur.config.ts'],
            },
            {
              name: 'vuex-store',
              fileExtensions: ['store.js', 'store.ts'],
              fileNames: ['store.js', 'store.ts'],
              enabledFor: [o.IconPack.Vuex],
            },
            { name: 'nuxt', fileNames: ['nuxt.config.js', 'nuxt.config.ts'], light: !0 },
            { name: 'ocaml', fileExtensions: ['ml', 'mli', 'cmx'] },
            { name: 'odin', fileExtensions: ['odin'] },
            { name: 'javascript-map', fileExtensions: ['js.map', 'mjs.map', 'cjs.map'] },
            { name: 'css-map', fileExtensions: ['css.map'] },
            {
              name: 'lock',
              fileExtensions: ['lock'],
              fileNames: ['security.md', 'security.txt', 'security'],
            },
            { name: 'handlebars', fileExtensions: ['hbs', 'mustache'] },
            { name: 'perl', fileExtensions: ['pm', 'raku'] },
            { name: 'haxe', fileExtensions: ['hx'] },
            { name: 'test-ts', fileExtensions: ['spec.ts', 'e2e-spec.ts', 'test.ts', 'ts.snap'] },
            {
              name: 'test-jsx',
              fileExtensions: [
                'spec.tsx',
                'test.tsx',
                'tsx.snap',
                'spec.jsx',
                'test.jsx',
                'jsx.snap',
              ],
            },
            {
              name: 'test-js',
              fileExtensions: [
                'spec.js',
                'spec.cjs',
                'spec.mjs',
                'e2e-spec.js',
                'e2e-spec.cjs',
                'e2e-spec.mjs',
                'test.js',
                'test.cjs',
                'test.mjs',
                'js.snap',
              ],
            },
            {
              name: 'angular',
              fileExtensions: ['module.ts', 'module.js', 'ng-template'],
              fileNames: ['angular-cli.json', '.angular-cli.json', 'angular.json'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            {
              name: 'angular-component',
              fileExtensions: ['component.ts', 'component.js'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            {
              name: 'angular-guard',
              fileExtensions: ['guard.ts', 'guard.js'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            {
              name: 'angular-service',
              fileExtensions: ['service.ts', 'service.js'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            {
              name: 'angular-pipe',
              fileExtensions: ['pipe.ts', 'pipe.js', 'filter.js'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            {
              name: 'angular-directive',
              fileExtensions: ['directive.ts', 'directive.js'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            {
              name: 'angular-resolver',
              fileExtensions: ['resolver.ts', 'resolver.js'],
              enabledFor: [o.IconPack.Angular, o.IconPack.Ngrx],
            },
            { name: 'puppet', fileExtensions: ['pp'] },
            { name: 'elixir', fileExtensions: ['ex', 'exs', 'eex', 'leex'] },
            { name: 'livescript', fileExtensions: ['ls'] },
            { name: 'erlang', fileExtensions: ['erl'] },
            { name: 'twig', fileExtensions: ['twig'] },
            { name: 'julia', fileExtensions: ['jl'] },
            { name: 'elm', fileExtensions: ['elm'] },
            { name: 'purescript', fileExtensions: ['pure', 'purs'] },
            { name: 'smarty', fileExtensions: ['tpl'] },
            { name: 'stylus', fileExtensions: ['styl'] },
            { name: 'reason', fileExtensions: ['re', 'rei'] },
            { name: 'bucklescript', fileExtensions: ['cmj'] },
            { name: 'merlin', fileExtensions: ['merlin'] },
            { name: 'verilog', fileExtensions: ['vhd', 'sv', 'svh'] },
            { name: 'mathematica', fileExtensions: ['nb'] },
            { name: 'wolframlanguage', fileExtensions: ['wl', 'wls'] },
            { name: 'nunjucks', fileExtensions: ['njk', 'nunjucks'] },
            { name: 'robot', fileExtensions: ['robot'] },
            { name: 'solidity', fileExtensions: ['sol'] },
            { name: 'autoit', fileExtensions: ['au3'] },
            { name: 'haml', fileExtensions: ['haml'] },
            { name: 'yang', fileExtensions: ['yang'] },
            { name: 'mjml', fileExtensions: ['mjml'], fileNames: ['.mjmlconfig'] },
            {
              name: 'vercel',
              fileNames: ['vercel.json', '.vercelignore', 'now.json', '.nowignore'],
              light: !0,
            },
            { name: 'next', fileNames: ['next.config.js', 'next.config.ts'], light: !0 },
            { name: 'terraform', fileExtensions: ['tf', 'tf.json', 'tfvars', 'tfstate'] },
            { name: 'laravel', fileExtensions: ['blade.php', 'inky.php'], fileNames: ['artisan'] },
            { name: 'applescript', fileExtensions: ['applescript', 'ipa'] },
            { name: 'cake', fileExtensions: ['cake'] },
            { name: 'cucumber', fileExtensions: ['feature'] },
            { name: 'nim', fileExtensions: ['nim', 'nimble'] },
            { name: 'apiblueprint', fileExtensions: ['apib', 'apiblueprint'] },
            { name: 'riot', fileExtensions: ['riot', 'tag'] },
            { name: 'vfl', fileExtensions: ['vfl'], fileNames: ['.vfl'] },
            { name: 'kl', fileExtensions: ['kl'], fileNames: ['.kl'] },
            {
              name: 'postcss',
              fileExtensions: ['pcss', 'sss'],
              fileNames: [
                'postcss.config.js',
                'postcss.config.cjs',
                '.postcssrc.js',
                '.postcssrc',
                '.postcssrc.json',
                '.postcssrc.yml',
              ],
            },
            {
              name: 'posthtml',
              fileNames: [
                'posthtml.config.js',
                '.posthtmlrc.js',
                '.posthtmlrc',
                '.posthtmlrc.json',
                '.posthtmlrc.yml',
              ],
            },
            { name: 'todo', fileExtensions: ['todo'] },
            { name: 'coldfusion', fileExtensions: ['cfml', 'cfc', 'lucee', 'cfm'] },
            {
              name: 'cabal',
              fileExtensions: ['cabal'],
              fileNames: ['cabal.project', 'cabal.project.freeze', 'cabal.project.local'],
            },
            { name: 'nix', fileExtensions: ['nix'] },
            { name: 'slim', fileExtensions: ['slim'] },
            { name: 'http', fileExtensions: ['http', 'rest'], fileNames: ['CNAME'] },
            { name: 'restql', fileExtensions: ['rql', 'restql'] },
            { name: 'kivy', fileExtensions: ['kv'] },
            { name: 'graphcool', fileExtensions: ['graphcool'], fileNames: ['project.graphcool'] },
            { name: 'sbt', fileExtensions: ['sbt'] },
            {
              name: 'webpack',
              fileNames: [
                'webpack.js',
                'webpack.cjs',
                'webpack.ts',
                'webpack.base.js',
                'webpack.base.cjs',
                'webpack.base.ts',
                'webpack.config.js',
                'webpack.config.cjs',
                'webpack.config.ts',
                'webpack.common.js',
                'webpack.common.cjs',
                'webpack.common.ts',
                'webpack.config.common.js',
                'webpack.config.common.cjs',
                'webpack.config.common.ts',
                'webpack.config.common.babel.js',
                'webpack.config.common.babel.ts',
                'webpack.dev.js',
                'webpack.dev.cjs',
                'webpack.dev.ts',
                'webpack.development.js',
                'webpack.development.cjs',
                'webpack.development.ts',
                'webpack.config.dev.js',
                'webpack.config.dev.cjs',
                'webpack.config.dev.ts',
                'webpack.config.dev.babel.js',
                'webpack.config.dev.babel.ts',
                'webpack.mix.js',
                'webpack.mix.cjs',
                'webpack.prod.js',
                'webpack.prod.cjs',
                'webpack.prod.config.js',
                'webpack.prod.config.cjs',
                'webpack.prod.ts',
                'webpack.production.js',
                'webpack.production.cjs',
                'webpack.production.ts',
                'webpack.server.js',
                'webpack.server.cjs',
                'webpack.server.ts',
                'webpack.client.js',
                'webpack.client.cjs',
                'webpack.client.ts',
                'webpack.config.server.js',
                'webpack.config.server.cjs',
                'webpack.config.server.ts',
                'webpack.config.client.js',
                'webpack.config.client.cjs',
                'webpack.config.client.ts',
                'webpack.config.production.babel.js',
                'webpack.config.production.babel.ts',
                'webpack.config.prod.babel.js',
                'webpack.config.prod.babel.cjs',
                'webpack.config.prod.babel.ts',
                'webpack.config.prod.js',
                'webpack.config.prod.cjs',
                'webpack.config.prod.ts',
                'webpack.config.production.js',
                'webpack.config.production.cjs',
                'webpack.config.production.ts',
                'webpack.config.staging.js',
                'webpack.config.staging.cjs',
                'webpack.config.staging.ts',
                'webpack.config.babel.js',
                'webpack.config.babel.ts',
                'webpack.config.base.babel.js',
                'webpack.config.base.babel.ts',
                'webpack.config.base.js',
                'webpack.config.base.cjs',
                'webpack.config.base.ts',
                'webpack.config.staging.babel.js',
                'webpack.config.staging.babel.ts',
                'webpack.config.coffee',
                'webpack.config.test.js',
                'webpack.config.test.cjs',
                'webpack.config.test.ts',
                'webpack.config.vendor.js',
                'webpack.config.vendor.cjs',
                'webpack.config.vendor.ts',
                'webpack.config.vendor.production.js',
                'webpack.config.vendor.production.cjs',
                'webpack.config.vendor.production.ts',
                'webpack.test.js',
                'webpack.test.cjs',
                'webpack.test.ts',
                'webpack.dist.js',
                'webpack.dist.cjs',
                'webpack.dist.ts',
                'webpackfile.js',
                'webpackfile.cjs',
                'webpackfile.ts',
              ],
            },
            { name: 'ionic', fileNames: ['ionic.config.json', '.io-config.json'] },
            {
              name: 'gulp',
              fileNames: ['gulpfile.js', 'gulpfile.mjs', 'gulpfile.ts', 'gulpfile.babel.js'],
            },
            {
              name: 'nodejs',
              fileNames: ['package.json', 'package-lock.json', '.nvmrc', '.esmrc', '.node-version'],
            },
            { name: 'npm', fileNames: ['.npmignore', '.npmrc'] },
            {
              name: 'yarn',
              fileNames: [
                '.yarnrc',
                'yarn.lock',
                '.yarnclean',
                '.yarn-integrity',
                'yarn-error.log',
                '.yarnrc.yml',
                '.yarnrc.yaml',
              ],
            },
            {
              name: 'android',
              fileNames: ['androidmanifest.xml'],
              fileExtensions: ['apk', 'smali', 'dex'],
            },
            {
              name: 'tune',
              fileExtensions: ['env'],
              fileNames: [
                '.env.defaults',
                '.env.example',
                '.env.sample',
                '.env.template',
                '.env.schema',
                '.env.local',
                '.env.dev',
                '.env.development',
                '.env.qa',
                '.env.dist',
                '.env.prod',
                '.env.production',
                '.env.staging',
                '.env.preview',
                '.env.test',
                '.env.testing',
                '.env.development.local',
                '.env.qa.local',
                '.env.production.local',
                '.env.staging.local',
                '.env.test.local',
              ],
            },
            {
              name: 'babel',
              fileNames: [
                '.babelrc',
                '.babelrc.cjs',
                '.babelrc.js',
                '.babelrc.mjs',
                '.babelrc.json',
                'babel.config.cjs',
                'babel.config.js',
                'babel.config.mjs',
                'babel.config.json',
                'babel-transform.js',
                '.babel-plugin-macrosrc',
                '.babel-plugin-macrosrc.json',
                '.babel-plugin-macrosrc.yaml',
                '.babel-plugin-macrosrc.yml',
                '.babel-plugin-macrosrc.js',
                'babel-plugin-macros.config.js',
              ],
            },
            { name: 'contributing', fileNames: ['contributing.md'] },
            { name: 'readme', fileNames: ['readme.md', 'readme.txt', 'readme'] },
            {
              name: 'changelog',
              fileNames: [
                'changelog',
                'changelog.md',
                'changelog.txt',
                'changes',
                'changes.md',
                'changes.txt',
              ],
            },
            { name: 'credits', fileNames: ['credits', 'credits.txt', 'credits.md'] },
            { name: 'authors', fileNames: ['authors', 'authors.md', 'authors.txt'] },
            { name: 'flow', fileNames: ['.flowconfig'] },
            { name: 'favicon', fileNames: ['favicon.ico'] },
            {
              name: 'karma',
              fileNames: [
                'karma.conf.js',
                'karma.conf.ts',
                'karma.conf.coffee',
                'karma.config.js',
                'karma.config.ts',
                'karma-main.js',
                'karma-main.ts',
              ],
            },
            { name: 'bithound', fileNames: ['.bithoundrc'] },
            { name: 'svgo', fileNames: ['svgo.config.js'] },
            { name: 'appveyor', fileNames: ['.appveyor.yml', 'appveyor.yml'] },
            { name: 'travis', fileNames: ['.travis.yml'] },
            { name: 'codecov', fileNames: ['.codecov.yml', 'codecov.yml'] },
            {
              name: 'protractor',
              fileNames: [
                'protractor.conf.js',
                'protractor.conf.ts',
                'protractor.conf.coffee',
                'protractor.config.js',
                'protractor.config.ts',
              ],
            },
            { name: 'fusebox', fileNames: ['fuse.js'] },
            { name: 'heroku', fileNames: ['procfile', 'procfile.windows'] },
            { name: 'editorconfig', fileNames: ['.editorconfig'] },
            { name: 'gitlab', fileExtensions: ['gitlab-ci.yml'] },
            { name: 'bower', fileNames: ['.bowerrc', 'bower.json'] },
            {
              name: 'eslint',
              fileNames: [
                '.eslintrc.js',
                '.eslintrc.cjs',
                '.eslintrc.yaml',
                '.eslintrc.yml',
                '.eslintrc.json',
                '.eslintrc-md.js',
                '.eslintrc-jsdoc.js',
                '.eslintrc',
                '.eslintignore',
                '.eslintcache',
              ],
            },
            { name: 'conduct', fileNames: ['code_of_conduct.md', 'code_of_conduct.txt'] },
            { name: 'watchman', fileNames: ['.watchmanconfig'] },
            { name: 'aurelia', fileNames: ['aurelia.json'] },
            {
              name: 'mocha',
              fileNames: [
                'mocha.opts',
                '.mocharc.yml',
                '.mocharc.yaml',
                '.mocharc.js',
                '.mocharc.json',
                '.mocharc.jsonc',
              ],
            },
            {
              name: 'jenkins',
              fileNames: ['jenkinsfile'],
              fileExtensions: ['jenkinsfile', 'jenkins'],
            },
            {
              name: 'firebase',
              fileNames: [
                'firebase.json',
                '.firebaserc',
                'firestore.rules',
                'firestore.indexes.json',
              ],
            },
            {
              name: 'rollup',
              fileNames: [
                'rollup.config.js',
                'rollup.config.ts',
                'rollup-config.js',
                'rollup-config.ts',
                'rollup.config.common.js',
                'rollup.config.common.ts',
                'rollup.config.base.js',
                'rollup.config.base.ts',
                'rollup.config.prod.js',
                'rollup.config.prod.ts',
                'rollup.config.dev.js',
                'rollup.config.dev.ts',
                'rollup.config.prod.vendor.js',
                'rollup.config.prod.vendor.ts',
              ],
            },
            { name: 'hack', fileNames: ['.hhconfig'] },
            {
              name: 'stylelint',
              fileNames: [
                '.stylelintrc',
                'stylelint.config.js',
                '.stylelintrc.json',
                '.stylelintrc.yaml',
                '.stylelintrc.yml',
                '.stylelintrc.js',
                '.stylelintignore',
              ],
              light: !0,
            },
            { name: 'code-climate', fileNames: ['.codeclimate.yml'], light: !0 },
            {
              name: 'prettier',
              fileNames: [
                '.prettierrc',
                'prettier.config.js',
                'prettier.config.cjs',
                '.prettierrc.js',
                '.prettierrc.cjs',
                '.prettierrc.json',
                '.prettierrc.json5',
                '.prettierrc.yaml',
                '.prettierrc.yml',
                '.prettierignore',
                '.prettierrc.toml',
              ],
            },
            {
              name: 'renovate',
              fileNames: ['.renovaterc', '.renovaterc.json', 'renovate.json', 'renovate.json5'],
            },
            { name: 'apollo', fileNames: ['apollo.config.js'] },
            { name: 'nodemon', fileNames: ['nodemon.json', 'nodemon-debug.json'] },
            {
              name: 'ngrx-reducer',
              fileExtensions: ['reducer.ts', 'rootReducer.ts'],
              enabledFor: [o.IconPack.Ngrx],
            },
            { name: 'ngrx-state', fileExtensions: ['state.ts'], enabledFor: [o.IconPack.Ngrx] },
            { name: 'ngrx-actions', fileExtensions: ['actions.ts'], enabledFor: [o.IconPack.Ngrx] },
            { name: 'ngrx-effects', fileExtensions: ['effects.ts'], enabledFor: [o.IconPack.Ngrx] },
            { name: 'ngrx-entity', fileNames: ['.entity'], enabledFor: [o.IconPack.Ngrx] },
            {
              name: 'ngrx-selectors',
              fileExtensions: ['selectors.ts'],
              enabledFor: [o.IconPack.Ngrx],
            },
            { name: 'webhint', fileNames: ['.hintrc'] },
            { name: 'browserlist', fileNames: ['browserslist', '.browserslistrc'], light: !0 },
            { name: 'crystal', fileExtensions: ['cr', 'ecr'], light: !0 },
            { name: 'snyk', fileNames: ['.snyk'] },
            { name: 'drone', fileExtensions: ['drone.yml'], fileNames: ['.drone.yml'], light: !0 },
            { name: 'cuda', fileExtensions: ['cu', 'cuh'] },
            { name: 'log', fileExtensions: ['log'] },
            { name: 'dotjs', fileExtensions: ['def', 'dot', 'jst'] },
            { name: 'ejs', fileExtensions: ['ejs'] },
            { name: 'sequelize', fileNames: ['.sequelizerc'] },
            {
              name: 'gatsby',
              fileNames: [
                'gatsby.config.js',
                'gatsby-config.js',
                'gatsby-node.js',
                'gatsby-browser.js',
                'gatsby-ssr.js',
              ],
            },
            {
              name: 'wakatime',
              fileNames: ['.wakatime-project'],
              fileExtensions: ['.wakatime-project'],
              light: !0,
            },
            { name: 'circleci', fileNames: ['circle.yml'], light: !0 },
            { name: 'cloudfoundry', fileNames: ['.cfignore'] },
            {
              name: 'grunt',
              fileNames: [
                'gruntfile.js',
                'gruntfile.ts',
                'gruntfile.coffee',
                'gruntfile.babel.js',
                'gruntfile.babel.ts',
                'gruntfile.babel.coffee',
              ],
            },
            {
              name: 'jest',
              fileNames: [
                'jest.config.js',
                'jest.config.ts',
                'jest.config.cjs',
                'jest.config.mjs',
                'jest.config.json',
                'jest.e2e.config.js',
                'jest.e2e.config.ts',
                'jest.e2e.config.cjs',
                'jest.e2e.config.mjs',
                'jest.e2e.config.json',
                'jest-unit.config.js',
                'jest-e2e.config.js',
                'jest-e2e.json',
                'jest-github-actions-reporter.js',
                'jest.setup.js',
                'jest.setup.ts',
                'jest.json',
                '.jestrc',
                '.jestrc.js',
                '.jestrc.json',
                'jest.teardown.js',
              ],
            },
            { name: 'processing', fileExtensions: ['pde'], light: !0 },
            {
              name: 'storybook',
              fileExtensions: [
                'stories.js',
                'stories.jsx',
                'stories.mdx',
                'story.js',
                'story.jsx',
                'stories.ts',
                'stories.tsx',
                'story.ts',
                'story.tsx',
                'stories.svelte',
                'story.mdx',
              ],
            },
            { name: 'wepy', fileExtensions: ['wpy'] },
            { name: 'fastlane', fileNames: ['fastfile', 'appfile'] },
            { name: 'hcl', fileExtensions: ['hcl'], light: !0 },
            { name: 'helm', fileNames: ['.helmignore'] },
            { name: 'san', fileExtensions: ['san'] },
            { name: 'wallaby', fileNames: ['wallaby.js', 'wallaby.conf.js'] },
            { name: 'django', fileExtensions: ['djt'] },
            { name: 'stencil', fileNames: ['stencil.config.js', 'stencil.config.ts'] },
            { name: 'red', fileExtensions: ['red'] },
            { name: 'makefile', fileNames: ['makefile'] },
            { name: 'foxpro', fileExtensions: ['fxp', 'prg'] },
            { name: 'i18n', fileExtensions: ['pot', 'po', 'mo'] },
            { name: 'webassembly', fileExtensions: ['wat', 'wasm'] },
            {
              name: 'semantic-release',
              light: !0,
              fileNames: [
                '.releaserc',
                '.releaserc.yaml',
                '.releaserc.yml',
                '.releaserc.json',
                '.releaserc.js',
                'release.config.js',
              ],
            },
            {
              name: 'bitbucket',
              fileNames: ['bitbucket-pipelines.yaml', 'bitbucket-pipelines.yml'],
            },
            { name: 'jupyter', fileExtensions: ['ipynb'] },
            { name: 'd', fileExtensions: ['d'] },
            { name: 'mdx', fileExtensions: ['mdx'] },
            { name: 'ballerina', fileExtensions: ['bal', 'balx'] },
            { name: 'racket', fileExtensions: ['rkt'] },
            {
              name: 'bazel',
              fileExtensions: ['bzl', 'bazel'],
              fileNames: ['.bazelignore', '.bazelrc', '.bazelversion'],
            },
            { name: 'mint', fileExtensions: ['mint'] },
            { name: 'velocity', fileExtensions: ['vm', 'fhtml', 'vtl'] },
            { name: 'godot', fileExtensions: ['gd'] },
            { name: 'godot-assets', fileExtensions: ['godot', 'tres', 'tscn'] },
            {
              name: 'azure-pipelines',
              fileNames: ['azure-pipelines.yml', 'azure-pipelines.yaml'],
              fileExtensions: ['azure-pipelines.yml', 'azure-pipelines.yaml'],
            },
            { name: 'azure', fileExtensions: ['azcli'] },
            { name: 'vagrant', fileNames: ['vagrantfile'], fileExtensions: ['vagrantfile'] },
            { name: 'prisma', fileNames: ['prisma.yml'], fileExtensions: ['prisma'] },
            { name: 'razor', fileExtensions: ['cshtml', 'vbhtml'] },
            { name: 'abc', fileExtensions: ['abc'] },
            { name: 'asciidoc', fileExtensions: ['ad', 'adoc', 'asciidoc'] },
            { name: 'istanbul', fileNames: ['.nycrc', '.nycrc.json'] },
            { name: 'edge', fileExtensions: ['edge'] },
            { name: 'scheme', fileExtensions: ['ss', 'scm'] },
            { name: 'lisp', fileExtensions: ['lisp', 'lsp', 'cl', 'fast'] },
            {
              name: 'tailwindcss',
              fileNames: [
                'tailwind.js',
                'tailwind.ts',
                'tailwind.config.js',
                'tailwind.config.ts',
                'tailwind.config.cjs',
              ],
            },
            {
              name: '3d',
              fileExtensions: [
                'stl',
                'obj',
                'ac',
                'blend',
                'mesh',
                'mqo',
                'pmd',
                'pmx',
                'skp',
                'vac',
                'vdp',
                'vox',
              ],
            },
            { name: 'buildkite', fileNames: ['buildkite.yml', 'buildkite.yaml'] },
            {
              name: 'netlify',
              fileNames: ['netlify.json', 'netlify.yml', 'netlify.yaml', 'netlify.toml'],
            },
            { name: 'svg', fileExtensions: ['svg'] },
            {
              name: 'svelte',
              fileExtensions: ['svelte'],
              fileNames: ['svelte.config.js', 'svelte.config.cjs'],
            },
            { name: 'vim', fileExtensions: ['vimrc', 'gvimrc', 'exrc', 'vim', 'viminfo'] },
            {
              name: 'nest',
              fileNames: ['nest-cli.json', '.nest-cli.json', 'nestconfig.json', '.nestconfig.json'],
            },
            {
              name: 'nest-controller',
              fileExtensions: ['controller.ts', 'controller.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-middleware',
              fileExtensions: ['middleware.ts', 'middleware.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-module',
              fileExtensions: ['module.ts', 'module.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-service',
              fileExtensions: ['service.ts', 'service.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-decorator',
              fileExtensions: ['decorator.ts', 'decorator.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-pipe',
              fileExtensions: ['pipe.ts', 'pipe.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-filter',
              fileExtensions: ['filter.ts', 'filter.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-gateway',
              fileExtensions: ['gateway.ts', 'gateway.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-guard',
              fileExtensions: ['guard.ts', 'guard.js'],
              enabledFor: [o.IconPack.Nest],
            },
            {
              name: 'nest-resolver',
              fileExtensions: ['resolver.ts', 'resolver.js'],
              enabledFor: [o.IconPack.Nest],
            },
            { name: 'moonscript', fileExtensions: ['moon'] },
            { name: 'percy', fileNames: ['.percy.yml'] },
            { name: 'gitpod', fileNames: ['.gitpod.yml'] },
            { name: 'advpl_prw', fileExtensions: ['prw', 'prx'] },
            { name: 'advpl_ptm', fileExtensions: ['ptm'] },
            { name: 'advpl_tlpp', fileExtensions: ['tlpp'] },
            { name: 'advpl_include', fileExtensions: ['ch'] },
            { name: 'codeowners', fileNames: ['codeowners'] },
            { name: 'gcp', fileNames: ['.gcloudignore'] },
            { name: 'disc', fileExtensions: ['iso'] },
            { name: 'fortran', fileExtensions: ['f', 'f77', 'f90', 'f95', 'f03', 'f08'] },
            { name: 'tcl', fileExtensions: ['tcl'] },
            { name: 'liquid', fileExtensions: ['liquid'] },
            { name: 'prolog', fileExtensions: ['p', 'pro', 'pl'] },
            {
              name: 'husky',
              fileNames: [
                '.huskyrc',
                'husky.config.js',
                '.huskyrc.json',
                '.huskyrc.js',
                '.huskyrc.yaml',
                '.huskyrc.yml',
              ],
            },
            { name: 'coconut', fileExtensions: ['coco'] },
            { name: 'tilt', fileNames: ['tiltfile'] },
            { name: 'capacitor', fileNames: ['capacitor.config.json'] },
            { name: 'sketch', fileExtensions: ['sketch'] },
            { name: 'pawn', fileExtensions: ['pwn', 'amx'] },
            { name: 'adonis', fileNames: ['.adonisrc.json', 'ace'] },
            { name: 'forth', fileExtensions: ['4th', 'fth', 'frt'] },
            { name: 'uml', fileExtensions: ['iuml', 'pu', 'puml', 'plantuml', 'wsd'], light: !0 },
            {
              name: 'meson',
              fileNames: ['meson.build', 'meson_options.txt'],
              fileExtensions: ['wrap'],
            },
            {
              name: 'commitlint',
              fileNames: [
                '.commitlintrc',
                '.commitlintrc.js',
                'commitlint.config.js',
                '.commitlintrc.json',
                '.commitlint.yaml',
                '.commitlint.yml',
                '.commitlintrc.yaml',
                '.commitlintrc.yml',
              ],
            },
            { name: 'buck', fileNames: ['.buckconfig'] },
            { name: 'dhall', fileExtensions: ['dhall', 'dhallb'] },
            {
              name: 'sml',
              fileExtensions: ['sml', 'mlton', 'mlb', 'sig', 'fun', 'cm', 'lex', 'use', 'grm'],
            },
            { name: 'nrwl', fileNames: ['nx.json'] },
            { name: 'opam', fileExtensions: ['opam'] },
            {
              name: 'dune',
              fileNames: ['dune', 'dune-project', 'dune-workspace', 'dune-workspace.dev'],
            },
            { name: 'imba', fileExtensions: ['imba'] },
            { name: 'drawio', fileExtensions: ['drawio', 'dio'] },
            { name: 'pascal', fileExtensions: ['pas'] },
            { name: 'shaderlab', fileExtensions: ['unity'] },
            {
              name: 'roadmap',
              fileNames: [
                'roadmap.md',
                'roadmap.txt',
                'timeline.md',
                'timeline.txt',
                'milestones.md',
                'milestones.txt',
              ],
            },
            {
              name: 'sas',
              fileExtensions: ['sas', 'sas7bdat', 'sashdat', 'astore', 'ast', 'sast'],
            },
            {
              name: 'nuget',
              fileNames: ['nuget.config', '.nuspec', 'nuget.exe'],
              fileExtensions: ['nupkg'],
            },
            { name: 'command', fileExtensions: ['command'] },
            { name: 'stryker', fileNames: ['stryker.conf.js', 'stryker.conf.json'] },
            { name: 'denizenscript', fileExtensions: ['dsc'] },
            {
              name: 'modernizr',
              fileNames: ['.modernizrrc', '.modernizrrc.js', '.modernizrrc.json'],
            },
            { name: 'slug', fileNames: ['.slugignore'] },
            { name: 'search', fileExtensions: ['code-search'] },
            {
              name: 'stitches',
              fileNames: ['stitches.config.js', 'stitches.config.ts'],
              light: !0,
            },
            { name: 'nginx', fileNames: ['nginx.conf'] },
            { name: 'minecraft', fileExtensions: ['mcfunction'] },
            { name: 'replit', fileNames: ['.replit'] },
            { name: 'rescript', fileExtensions: ['res', 'resi'] },
            {
              name: 'snowpack',
              fileNames: [
                'snowpack.config.cjs',
                'snowpack.config.js',
                'snowpack.config.mjs',
                'snowpack.deps.json',
                'snowpack.config.ts',
                'snowpack.config.json',
              ],
              light: !0,
            },
            { name: 'brainfuck', fileExtensions: ['b', 'bf'] },
            { name: 'bicep', fileExtensions: ['bicep'] },
            { name: 'cobol', fileExtensions: ['cob', 'cbl'] },
            { name: 'grain', fileExtensions: ['gr'] },
            { name: 'lolcode', fileExtensions: ['lol'] },
            { name: 'idris', fileExtensions: ['idr', 'ibc'] },
            { name: 'quasar', fileNames: ['quasar.conf.js'] },
            { name: 'pipeline', fileExtensions: ['pipeline'] },
            {
              name: 'vite',
              fileNames: ['vite.config.js', 'vite.config.mjs', 'vite.config.cjs', 'vite.config.ts'],
            },
            { name: 'opa', fileExtensions: ['rego'] },
            { name: 'lerna', fileNames: ['lerna.json'] },
            {
              name: 'windicss',
              fileNames: [
                'windi.config.js',
                'windi.config.ts',
                'windi.config.cjs',
                'windi.config.json',
              ],
              fileExtensions: ['windi'],
            },
            { name: 'textlint', fileNames: ['.textlintrc'] },
            { name: 'scala', fileExtensions: ['scala', 'sc'] },
            { name: 'lilypond', fileExtensions: ['ly'] },
            { name: 'vlang', fileExtensions: ['v'], fileNames: ['vpkg.json', 'v.mod'] },
            { name: 'chess', fileExtensions: ['pgn', 'fen'], light: !0 },
            { name: 'gemini', fileExtensions: ['gmi', 'gemini'] },
            { name: 'sentry', fileNames: ['.sentryclirc'] },
            {
              name: 'phpunit',
              fileNames: [
                '.phpunit.result.cache',
                '.phpunit-watcher.yml',
                'phpunit.xml',
                'phpunit.xml.dist',
                'phpunit-watcher.yml',
                'phpunit-watcher.yml.dist',
              ],
            },
            {
              name: 'php-cs-fixer',
              fileNames: [
                '.php_cs',
                '.php_cs.dist',
                '.php_cs.php',
                '.php_cs.dist.php',
                '.php-cs-fixer.php',
                '.php-cs-fixer.dist.php',
              ],
            },
            { name: 'robots', fileNames: ['robots.txt'] },
            {
              name: 'tsconfig',
              fileNames: [
                'tsconfig.json',
                'tsconfig.app.json',
                'tsconfig.editor.json',
                'tsconfig.spec.json',
                'tsconfig.base.json',
                'tsconfig.build.json',
                'tsconfig.eslint.json',
                'tsconfig.lib.json',
              ],
              fileExtensions: ['tsconfig.json'],
            },
            { name: 'jsconfig', fileNames: ['jsconfig.json'], fileExtensions: ['jsconfig.json'] },
            { name: 'maven', fileNames: ['maven.config', 'jvm.config'] },
            { name: 'ada', fileExtensions: ['ada', 'adb', 'ads', 'ali'] },
            { name: 'ember', fileNames: ['.ember-cli', '.ember-cli.js', 'ember-cli-builds.js'] },
            {
              name: 'horusec',
              fileNames: ['horusec-config.json'],
              fileExtensions: ['horusec-config.json'],
            },
            { name: 'coala', fileExtensions: ['coarc', 'coafile'] },
            { name: 'dinophp', fileExtensions: ['bubble', 'html.bubble', 'php.bubble'] },
            { name: 'teal', fileExtensions: ['tl'] },
            { name: 'astyle', fileNames: ['.astylerc'] },
            { name: 'rome', fileNames: ['rome.json'] },
          ],
        };
      },
      1077: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.folderIcons = void 0);
        const o = n(7554);
        t.folderIcons = [
          {
            name: 'specific',
            defaultIcon: { name: 'folder' },
            rootFolder: { name: 'folder-root' },
            icons: [
              { name: 'folder-src', folderNames: ['src', 'source', 'sources', 'code'] },
              { name: 'folder-dist', folderNames: ['dist', 'out', 'build', 'release', 'bin'] },
              {
                name: 'folder-css',
                folderNames: ['css', 'stylesheet', 'stylesheets', 'style', 'styles'],
              },
              { name: 'folder-sass', folderNames: ['sass', '_sass', 'scss', '_scss'] },
              {
                name: 'folder-images',
                folderNames: [
                  'images',
                  'image',
                  'img',
                  'icons',
                  'icon',
                  'ico',
                  'screenshot',
                  'screenshots',
                  'picture',
                  'pictures',
                ],
              },
              { name: 'folder-scripts', folderNames: ['script', 'scripts'] },
              { name: 'folder-node', folderNames: ['node_modules'] },
              { name: 'folder-javascript', folderNames: ['js', 'javascript', 'javascripts'] },
              { name: 'folder-json', folderNames: ['json'] },
              { name: 'folder-font', folderNames: ['font', 'fonts'] },
              { name: 'folder-bower', folderNames: ['bower_components'] },
              {
                name: 'folder-test',
                folderNames: [
                  'test',
                  'tests',
                  'testing',
                  '__tests__',
                  '__snapshots__',
                  '__mocks__',
                  '__test__',
                  'spec',
                  'specs',
                ],
              },
              { name: 'folder-jinja', folderNames: ['jinja', 'jinja2', 'j2'], light: !0 },
              { name: 'folder-markdown', folderNames: ['markdown', 'md'] },
              { name: 'folder-php', folderNames: ['php'] },
              { name: 'folder-phpmailer', folderNames: ['phpmailer'] },
              { name: 'folder-sublime', folderNames: ['sublime'] },
              {
                name: 'folder-docs',
                folderNames: [
                  'doc',
                  'docs',
                  'document',
                  'documents',
                  'documentation',
                  'post',
                  'posts',
                  'article',
                  'articles',
                ],
              },
              {
                name: 'folder-git',
                folderNames: [
                  '.git',
                  'patches',
                  'githooks',
                  '.githooks',
                  'submodules',
                  '.submodules',
                ],
              },
              { name: 'folder-github', folderNames: ['.github'] },
              { name: 'folder-gitlab', folderNames: ['.gitlab'] },
              { name: 'folder-vscode', folderNames: ['.vscode', '.vscode-test'] },
              {
                name: 'folder-views',
                folderNames: ['view', 'views', 'screen', 'screens', 'page', 'pages', 'html'],
              },
              { name: 'folder-vue', folderNames: ['vue'] },
              { name: 'folder-vuepress', folderNames: ['.vuepress'] },
              { name: 'folder-expo', folderNames: ['.expo', '.expo-shared'] },
              {
                name: 'folder-config',
                folderNames: [
                  'config',
                  'configs',
                  'configuration',
                  'configurations',
                  'setting',
                  '.setting',
                  'settings',
                  '.settings',
                  'META-INF',
                ],
              },
              {
                name: 'folder-i18n',
                folderNames: [
                  'i18n',
                  'internationalization',
                  'lang',
                  'language',
                  'languages',
                  'locale',
                  'locales',
                  'l10n',
                  'localization',
                  'translation',
                  'translate',
                  'translations',
                  '.tx',
                ],
              },
              { name: 'folder-components', folderNames: ['components', 'widget', 'widgets'] },
              { name: 'folder-aurelia', folderNames: ['aurelia_project'] },
              {
                name: 'folder-resource',
                folderNames: [
                  'resource',
                  'resources',
                  'res',
                  'asset',
                  'assets',
                  'static',
                  'report',
                  'reports',
                ],
              },
              {
                name: 'folder-lib',
                folderNames: [
                  'lib',
                  'libs',
                  'library',
                  'libraries',
                  'vendor',
                  'vendors',
                  'third-party',
                ],
              },
              {
                name: 'folder-theme',
                folderNames: ['themes', 'theme', 'color', 'colors', 'design', 'designs'],
              },
              { name: 'folder-webpack', folderNames: ['webpack', '.webpack'] },
              { name: 'folder-global', folderNames: ['global'] },
              {
                name: 'folder-public',
                folderNames: ['public', 'www', 'wwwroot', 'web', 'website'],
              },
              { name: 'folder-include', folderNames: ['include', 'includes', '_includes', 'inc'] },
              { name: 'folder-docker', folderNames: ['docker', 'dockerfiles', '.docker'] },
              {
                name: 'folder-ngrx-effects',
                folderNames: ['effects'],
                enabledFor: [o.IconPack.Ngrx],
              },
              { name: 'folder-ngrx-store', folderNames: ['store'], enabledFor: [o.IconPack.Ngrx] },
              {
                name: 'folder-ngrx-state',
                folderNames: ['states', 'state'],
                enabledFor: [o.IconPack.Ngrx],
              },
              {
                name: 'folder-ngrx-reducer',
                folderNames: ['reducers', 'reducer'],
                enabledFor: [o.IconPack.Ngrx],
              },
              {
                name: 'folder-ngrx-actions',
                folderNames: ['actions'],
                enabledFor: [o.IconPack.Ngrx],
              },
              {
                name: 'folder-ngrx-entities',
                folderNames: ['entities'],
                enabledFor: [o.IconPack.Ngrx],
              },
              {
                name: 'folder-ngrx-selectors',
                folderNames: ['selectors'],
                enabledFor: [o.IconPack.Ngrx],
              },
              {
                name: 'folder-redux-reducer',
                folderNames: ['reducers', 'reducer'],
                enabledFor: [o.IconPack.Redux],
              },
              {
                name: 'folder-redux-actions',
                folderNames: ['actions'],
                enabledFor: [o.IconPack.Redux],
              },
              {
                name: 'folder-redux-store',
                folderNames: ['store'],
                enabledFor: [o.IconPack.Redux],
              },
              {
                name: 'folder-react-components',
                folderNames: ['components'],
                enabledFor: [o.IconPack.React, o.IconPack.Redux],
              },
              {
                name: 'folder-database',
                folderNames: ['db', 'database', 'databases', 'sql', 'data', '_data'],
              },
              { name: 'folder-log', folderNames: ['log', 'logs'] },
              {
                name: 'folder-temp',
                folderNames: ['temp', '.temp', 'tmp', '.tmp', 'cached', 'cache', '.cache'],
              },
              { name: 'folder-aws', folderNames: ['aws', '.aws'] },
              {
                name: 'folder-audio',
                folderNames: ['audio', 'audios', 'music', 'musics', 'sound', 'sounds'],
              },
              { name: 'folder-video', folderNames: ['video', 'videos', 'movie', 'movies'] },
              { name: 'folder-kubernetes', folderNames: ['kubernetes', 'k8s'] },
              { name: 'folder-import', folderNames: ['import', 'imports', 'imported'] },
              { name: 'folder-export', folderNames: ['export', 'exports', 'exported'] },
              { name: 'folder-wakatime', folderNames: ['wakatime'] },
              { name: 'folder-circleci', folderNames: ['.circleci'] },
              { name: 'folder-wordpress', folderNames: ['.wordpress-org', 'wp-content'] },
              { name: 'folder-gradle', folderNames: ['gradle', '.gradle'] },
              {
                name: 'folder-coverage',
                folderNames: [
                  'coverage',
                  '.nyc-output',
                  '.nyc_output',
                  'e2e',
                  'it',
                  'integration-test',
                  'integration-tests',
                ],
              },
              {
                name: 'folder-class',
                folderNames: ['class', 'classes', 'model', 'models', 'schemas', 'schema'],
              },
              {
                name: 'folder-other',
                folderNames: ['other', 'others', 'misc', 'miscellaneous', 'extra', 'extras'],
              },
              {
                name: 'folder-typescript',
                folderNames: ['typescript', 'ts', 'typings', '@types', 'types'],
              },
              { name: 'folder-graphql', folderNames: ['graphql', 'gql'] },
              { name: 'folder-routes', folderNames: ['routes', 'router', 'routers'] },
              { name: 'folder-ci', folderNames: ['.ci', 'ci'] },
              {
                name: 'folder-benchmark',
                folderNames: [
                  'benchmark',
                  'benchmarks',
                  'performance',
                  'measure',
                  'measures',
                  'measurement',
                ],
              },
              {
                name: 'folder-messages',
                folderNames: [
                  'messages',
                  'messaging',
                  'forum',
                  'chat',
                  'chats',
                  'conversation',
                  'conversations',
                ],
              },
              { name: 'folder-less', folderNames: ['less'] },
              { name: 'folder-gulp', folderNames: ['gulp'] },
              { name: 'folder-python', folderNames: ['python', '__pycache__', '.pytest_cache'] },
              { name: 'folder-debug', folderNames: ['debug', 'debugging'] },
              { name: 'folder-fastlane', folderNames: ['fastlane'] },
              {
                name: 'folder-plugin',
                folderNames: [
                  'plugin',
                  'plugins',
                  '_plugins',
                  'extension',
                  'extensions',
                  'addon',
                  'addons',
                  'module',
                  'modules',
                ],
              },
              { name: 'folder-middleware', folderNames: ['middleware', 'middlewares'] },
              {
                name: 'folder-controller',
                folderNames: [
                  'controller',
                  'controllers',
                  'service',
                  'services',
                  'provider',
                  'providers',
                ],
              },
              { name: 'folder-ansible', folderNames: ['ansible'] },
              { name: 'folder-server', folderNames: ['server', 'servers', 'backend'] },
              { name: 'folder-client', folderNames: ['client', 'clients', 'frontend', 'pwa'] },
              { name: 'folder-tasks', folderNames: ['tasks', 'tickets'] },
              { name: 'folder-android', folderNames: ['android'] },
              { name: 'folder-ios', folderNames: ['ios'] },
              { name: 'folder-upload', folderNames: ['uploads', 'upload'] },
              { name: 'folder-download', folderNames: ['downloads', 'download'] },
              { name: 'folder-tools', folderNames: ['tools'] },
              { name: 'folder-helper', folderNames: ['helpers', 'helper'] },
              { name: 'folder-serverless', folderNames: ['.serverless', 'serverless'] },
              { name: 'folder-api', folderNames: ['api', 'apis', 'restapi'] },
              { name: 'folder-app', folderNames: ['app', 'apps'] },
              {
                name: 'folder-apollo',
                folderNames: ['apollo', 'apollo-client', 'apollo-cache', 'apollo-config'],
              },
              {
                name: 'folder-archive',
                folderNames: [
                  'archive',
                  'archives',
                  'archival',
                  'backup',
                  'backups',
                  'back-up',
                  'back-ups',
                ],
              },
              { name: 'folder-batch', folderNames: ['batch', 'batchs', 'batches'] },
              { name: 'folder-cluster', folderNames: ['cluster', 'clusters'] },
              { name: 'folder-command', folderNames: ['command', 'commands', 'cli', 'clis'] },
              { name: 'folder-constant', folderNames: ['constant', 'constants'] },
              {
                name: 'folder-container',
                folderNames: ['container', 'containers', '.devcontainer'],
              },
              { name: 'folder-content', folderNames: ['content', 'contents'] },
              { name: 'folder-context', folderNames: ['context', 'contexts'] },
              { name: 'folder-core', folderNames: ['core'] },
              { name: 'folder-delta', folderNames: ['delta', 'deltas', 'changes'] },
              { name: 'folder-dump', folderNames: ['dump', 'dumps'] },
              {
                name: 'folder-examples',
                folderNames: [
                  'demo',
                  'demos',
                  'example',
                  'examples',
                  'sample',
                  'samples',
                  'sample-data',
                ],
              },
              {
                name: 'folder-environment',
                folderNames: [
                  '.env',
                  '.environment',
                  'env',
                  'envs',
                  'environment',
                  'environments',
                  '.venv',
                ],
              },
              {
                name: 'folder-functions',
                folderNames: [
                  'function',
                  'functions',
                  'lambda',
                  'lambdas',
                  'logic',
                  'math',
                  'calc',
                  'calculation',
                  'calculations',
                ],
              },
              {
                name: 'folder-generator',
                folderNames: [
                  'generator',
                  'generators',
                  'generated',
                  'cfn-gen',
                  'gen',
                  'gens',
                  'auto',
                ],
              },
              { name: 'folder-hook', folderNames: ['hook', 'hooks', 'trigger', 'triggers'] },
              { name: 'folder-job', folderNames: ['job', 'jobs'] },
              { name: 'folder-keys', folderNames: ['keys', 'key', 'token', 'tokens'] },
              { name: 'folder-layout', folderNames: ['layout', 'layouts'] },
              { name: 'folder-mail', folderNames: ['mail', 'mails', 'email', 'emails', 'smtp'] },
              { name: 'folder-mappings', folderNames: ['mappings', 'mapping'] },
              { name: 'folder-meta', folderNames: ['meta'] },
              { name: 'folder-packages', folderNames: ['package', 'packages'] },
              { name: 'folder-shared', folderNames: ['shared', 'common'] },
              { name: 'folder-stack', folderNames: ['stack', 'stacks'] },
              { name: 'folder-template', folderNames: ['template', 'templates'] },
              { name: 'folder-utils', folderNames: ['util', 'utils', 'utility', 'utilities'] },
              { name: 'folder-private', folderNames: ['private', '.private'] },
              { name: 'folder-error', folderNames: ['error', 'errors', 'err'] },
              { name: 'folder-event', folderNames: ['event', 'events'] },
              {
                name: 'folder-secure',
                folderNames: [
                  'auth',
                  'authentication',
                  'secure',
                  'security',
                  'cert',
                  'certs',
                  'certificate',
                  'certificates',
                  'ssl',
                ],
              },
              { name: 'folder-custom', folderNames: ['custom', 'customs'] },
              {
                name: 'folder-mock',
                folderNames: [
                  'mock',
                  'mocks',
                  'draft',
                  'drafts',
                  'concept',
                  'concepts',
                  'sketch',
                  'sketches',
                ],
              },
              { name: 'folder-syntax', folderNames: ['syntax', 'syntaxes', 'spellcheck'] },
              { name: 'folder-vm', folderNames: ['vm', 'vms'] },
              { name: 'folder-stylus', folderNames: ['stylus'] },
              { name: 'folder-flow', folderNames: ['flow-typed'] },
              {
                name: 'folder-rules',
                folderNames: [
                  'rule',
                  'rules',
                  'validation',
                  'validations',
                  'validator',
                  'validators',
                ],
              },
              {
                name: 'folder-review',
                folderNames: ['review', 'reviews', 'revisal', 'revisals', 'reviewed'],
              },
              { name: 'folder-animation', folderNames: ['animation', 'animations', 'animated'] },
              { name: 'folder-guard', folderNames: ['guard', 'guards'] },
              { name: 'folder-prisma', folderNames: ['prisma'] },
              { name: 'folder-pipe', folderNames: ['pipe', 'pipes'] },
              { name: 'folder-svg', folderNames: ['svg', 'svgs'] },
              { name: 'folder-vuex-store', folderNames: ['store'], enabledFor: [o.IconPack.Vuex] },
              {
                name: 'folder-nuxt',
                folderNames: ['nuxt', '.nuxt'],
                enabledFor: [o.IconPack.Vuex, o.IconPack.Vue],
              },
              {
                name: 'folder-vue-directives',
                folderNames: ['directives'],
                enabledFor: [o.IconPack.Vuex, o.IconPack.Vue],
              },
              {
                name: 'folder-vue',
                folderNames: ['components'],
                enabledFor: [o.IconPack.Vuex, o.IconPack.Vue],
              },
              { name: 'folder-terraform', folderNames: ['terraform', '.terraform'] },
              {
                name: 'folder-mobile',
                folderNames: ['mobile', 'mobiles', 'portable', 'portability'],
              },
              { name: 'folder-stencil', folderNames: ['.stencil'] },
              { name: 'folder-firebase', folderNames: ['.firebase'] },
              { name: 'folder-svelte', folderNames: ['svelte'] },
              { name: 'folder-update', folderNames: ['update', 'updates', 'upgrade', 'upgrades'] },
              { name: 'folder-intellij', folderNames: ['.idea'], light: !0 },
              {
                name: 'folder-azure-pipelines',
                folderNames: ['.azure-pipelines', '.azure-pipelines-ci'],
              },
              { name: 'folder-mjml', folderNames: ['mjml'] },
              { name: 'folder-admin', folderNames: ['admin'] },
              { name: 'folder-scala', folderNames: ['scala'] },
              { name: 'folder-connection', folderNames: ['connection', 'connections'] },
              { name: 'folder-quasar', folderNames: ['.quasar'] },
              { name: 'folder-cobol', folderNames: ['cobol'] },
              { name: 'folder-yarn', folderNames: ['yarn', '.yarn'] },
              { name: 'folder-husky', folderNames: ['husky', '.husky'] },
              {
                name: 'folder-storybook',
                folderNames: ['.storybook', 'storybook', 'stories', '__stories__'],
              },
              { name: 'folder-base', folderNames: ['base', '.base'] },
              { name: 'folder-cart', folderNames: ['cart', 'shopping-cart', 'shopping', 'shop'] },
              { name: 'folder-home', folderNames: ['home', '.home', 'start', '.start'] },
              {
                name: 'folder-project',
                folderNames: ['project', 'projects', '.project', '.projects'],
              },
              { name: 'folder-interface', folderNames: ['interface', 'interfaces'] },
              {
                name: 'folder-contract',
                folderNames: [
                  'pact',
                  'pacts',
                  'contract',
                  '.contract',
                  'contracts',
                  'contract-testing',
                  'contract-test',
                  'contract-tests',
                ],
              },
              { name: 'folder-vercel', folderNames: ['vercel', '.vercel', 'now', '.now'] },
            ],
          },
          { name: 'classic', defaultIcon: { name: 'folder' }, rootFolder: { name: 'folder-root' } },
          { name: 'none', defaultIcon: { name: '' } },
        ];
      },
      4996: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.wildcardPattern =
            t.highContrastVersion =
            t.lightVersion =
            t.openedFolder =
            t.iconJsonName =
            t.iconFolderPath =
              void 0),
          (t.iconFolderPath = './../icons/'),
          (t.iconJsonName = 'material-icons.json'),
          (t.openedFolder = '-open'),
          (t.lightVersion = '_light'),
          (t.highContrastVersion = '_highContrast'),
          (t.wildcardPattern = new RegExp(/^\*{1,2}\./));
      },
      6410: function (e, t, n) {
        'use strict';
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.loadFileIconDefinitions = void 0);
        const a = o(n(2378)),
          i = n(2331),
          s = n(7554),
          r = n(4996);
        t.loadFileIconDefinitions = (e, t, n) => (
          (t = a.default({}, t)),
          [...c(e, n.activeIconPack), ...f(n.files.associations)].forEach((e) => {
            e.disabled ||
              ((t = a.default({}, t, d(t, e.name))),
              e.light && (t = a.default({}, t, d(t, e.name, r.lightVersion))),
              e.highContrast && (t = a.default({}, t, d(t, e.name, r.highContrastVersion))),
              e.fileExtensions && (t = a.default({}, t, l(e, 'fileExtensions'))),
              e.fileNames && (t = a.default({}, t, l(e, 'fileNames', n.files.associations))));
          }),
          ((t = a.default({}, t, d(t, e.defaultIcon.name))).file = e.defaultIcon.name),
          e.defaultIcon.light &&
            ((t = a.default({}, t, d(t, e.defaultIcon.name, r.lightVersion))).light.file =
              e.defaultIcon.name + r.lightVersion),
          e.defaultIcon.highContrast &&
            ((t = a.default(
              {},
              t,
              d(t, e.defaultIcon.name, r.highContrastVersion),
            )).highContrast.file = e.defaultIcon.name + r.highContrastVersion),
          t
        );
        const l = (e, t, n = {}) => {
            const o = new s.IconConfiguration();
            return (
              e[t].forEach((a) => {
                Object.keys(n).some((e) => {
                  if (!/^\*{2}\./.test(e)) return !1;
                  const t = e.replace(r.wildcardPattern, '.');
                  return -1 !== a.toLowerCase().indexOf(t.toLowerCase());
                }) ||
                  ((o[t][a] = e.name),
                  e.light && (o.light[t][a] = `${e.name}${r.lightVersion}`),
                  e.highContrast && (o.highContrast[t][a] = `${e.name}${r.highContrastVersion}`));
              }),
              o
            );
          },
          c = (e, t) => e.icons.filter((e) => !e.enabledFor || e.enabledFor.some((e) => e === t)),
          d = (e, t, n = '') => {
            const o = { iconDefinitions: {} },
              a = i.getFileConfigHash(e.options);
            return (
              (o.iconDefinitions[`${t}${n}`] = { iconPath: `${r.iconFolderPath}${t}${n}${a}.svg` }),
              o
            );
          },
          f = (e) =>
            e
              ? Object.keys(e).map((t) => {
                  const n = { name: e[t].toLowerCase() };
                  return (
                    r.wildcardPattern.test(t)
                      ? (n.fileExtensions = [t.toLowerCase().replace(r.wildcardPattern, '')])
                      : (n.fileNames = [t.toLowerCase()]),
                    n
                  );
                })
              : [];
      },
      4611: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.validateHEXColorCode = t.generateFolderIcons = t.loadFolderIconDefinitions = void 0);
        const r = i(n(5747)),
          l = s(n(2378)),
          c = i(n(5622)),
          d = n(2331),
          f = n(4996);
        t.loadFolderIconDefinitions = (e, t, n) => {
          (t = l.default({}, t)).hidesExplorerArrows = n.hidesExplorerArrows;
          const o = u(e, n.folders.theme),
            a = [...p(o, n.activeIconPack), ...j(n.folders.associations)];
          return 'none' === n.folders.theme
            ? t
            : (a.forEach((e) => {
                e.disabled ||
                  ((t = g(t, e)),
                  ((t = l.default({}, t, v(e.name, e.folderNames))).light = e.light
                    ? l.default({}, t.light, v(e.name, e.folderNames, f.lightVersion))
                    : t.light),
                  (t.highContrast = e.highContrast
                    ? l.default({}, t.highContrast, v(e.name, e.folderNames, f.highContrastVersion))
                    : t.highContrast));
              }),
              (t = m(o, t)));
        };
        const m = (e, t) => {
            t = l.default({}, t);
            const n = e.defaultIcon.name && e.defaultIcon.name.length > 0;
            return (
              n && (t = g(t, e.defaultIcon)),
              ((t = l.default({}, t, b(n, e, ''))).light = e.defaultIcon.light
                ? l.default({}, t.light, b(n, e, f.lightVersion))
                : t.light),
              (t.highContrast = e.defaultIcon.highContrast
                ? l.default({}, t.highContrast, b(n, e, f.highContrastVersion))
                : t.highContrast),
              (t = l.default({}, t, y(n, e, ''))),
              e.rootFolder &&
                (((t = g(t, e.rootFolder)).light = e.rootFolder.light
                  ? l.default({}, t.light, y(n, e, f.lightVersion))
                  : t.light),
                (t.highContrast = e.rootFolder.highContrast
                  ? l.default({}, t.highContrast, y(n, e, f.highContrastVersion))
                  : t.highContrast)),
              t
            );
          },
          u = (e, t) => e.find((e) => e.name === t),
          p = (e, t) =>
            e.icons && 0 !== e.icons.length
              ? e.icons.filter((e) => !e.enabledFor || e.enabledFor.some((e) => e === t))
              : [],
          g = (e, t) => (
            (e = l.default({}, e)),
            (e = h(e, t.name)),
            t.light && (e = l.default({}, e, h(e, t.name, f.lightVersion))),
            t.highContrast && (e = l.default({}, e, h(e, t.name, f.highContrastVersion))),
            e
          ),
          h = (e, t, n = '') => {
            e = l.default({}, e);
            const o = d.getFileConfigHash(e.options);
            return (
              (e.iconDefinitions[t + n] = { iconPath: `${f.iconFolderPath}${t}${n}${o}.svg` }),
              (e.iconDefinitions[`${t}${f.openedFolder}${n}`] = {
                iconPath: `${f.iconFolderPath}${t}${f.openedFolder}${n}${o}.svg`,
              }),
              e
            );
          },
          v = (e, t, n = '') => {
            const o = { folderNames: {}, folderNamesExpanded: {} };
            return (
              t.forEach((t) => {
                (o.folderNames[t] = e + n),
                  (o.folderNamesExpanded[t] = `${e}${f.openedFolder}${n}`);
              }),
              o
            );
          },
          b = (e, t, n = '') => {
            const o = { folder: '', folderExpanded: '' };
            return (
              (o.folder = e ? t.defaultIcon.name + n : ''),
              (o.folderExpanded = e ? `${t.defaultIcon.name}${f.openedFolder}${n}` : ''),
              o
            );
          },
          y = (e, t, n = '') => {
            const o = { rootFolder: '', rootFolderExpanded: '' };
            return (
              (o.rootFolder = e
                ? t.rootFolder
                  ? t.rootFolder.name + n
                  : t.defaultIcon.name + n
                : ''),
              (o.rootFolderExpanded = e
                ? t.rootFolder
                  ? `${t.rootFolder.name}${f.openedFolder}${n}`
                  : `${t.defaultIcon.name}${f.openedFolder}${n}`
                : ''),
              o
            );
          },
          j = (e) =>
            e
              ? Object.keys(e).map((t) => ({
                  name: e[t].length > 0 ? 'folder-' + e[t].toLowerCase() : 'folder',
                  folderNames: [t.toLowerCase()],
                }))
              : [];
        t.generateFolderIcons = (e) => {
          if (!t.validateHEXColorCode(e))
            return console.error('Invalid color code for folder icons');
          _(
            'folder',
            w(
              x(
                'M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1.11-.9-2-2-2h-8l-2-2z',
                e,
              ),
            ),
          ),
            _(
              'folder-open',
              w(
                x(
                  'M19 20H4c-1.11 0-2-.9-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z',
                  e,
                ),
              ),
            ),
            _(
              'folder-root',
              w(
                x(
                  'M12 20a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 5a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5z',
                  e,
                ),
              ),
            ),
            _(
              'folder-root-open',
              w(
                x(
                  'M12 20a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z',
                  e,
                ),
              ),
            );
        };
        const x = (e, t) => `<path d="${e}" fill="${t}" />`,
          w = (e) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${e}</svg>`,
          _ = (e, t) => {
            let n;
            n =
              'dist' === c.basename(__dirname)
                ? c.join(__dirname, '..', 'icons')
                : c.join(__dirname, '..', '..', '..', 'icons');
            const o = c.join(n, `${e}.svg`);
            try {
              r.writeFileSync(o, t);
            } catch (e) {
              console.error(e);
            }
          };
        t.validateHEXColorCode = (e) => {
          const t = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
          return e.length > 0 && t.test(e);
        };
      },
      7449: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.validateOpacityValue = t.setIconOpacity = void 0);
        const s = i(n(5747)),
          r = i(n(5622)),
          l = n(2425);
        (t.setIconOpacity = (e, n) => {
          if (!t.validateOpacityValue(e.opacity))
            return console.error(
              'Invalid opacity value! Opacity must be a decimal number between 0 and 1!',
            );
          let o = '';
          o =
            'dist' === r.basename(__dirname)
              ? r.join(__dirname, '..', 'icons')
              : r.join(__dirname, '..', '..', '..', 'icons');
          const a = l.getCustomIconPaths(e),
            i = s.readdirSync(o);
          try {
            (n || i).forEach(c(o, e)),
              a.forEach((t) => {
                s.readdirSync(t).forEach(c(t, e));
              });
          } catch (e) {
            console.error(e);
          }
        }),
          (t.validateOpacityValue = (e) => void 0 !== e && e <= 1 && e >= 0);
        const c = (e, t) => (n) => {
          const o = r.join(e, n),
            a = s.readFileSync(o, 'utf-8'),
            i = ((e) => {
              const t = new RegExp(/<svg[^>]*>/).exec(e);
              return null == t ? void 0 : t[0];
            })(a);
          if (!i) return;
          let l;
          l =
            t.opacity < 1
              ? ((e, t) => {
                  const n = new RegExp(/\sopacity="[\d.]+"/);
                  return n.test(e)
                    ? e.replace(n, ` opacity="${t}"`)
                    : e.replace(/^<svg/, `<svg opacity="${t}"`);
                })(i, t.opacity)
              : ((e) => {
                  const t = new RegExp(/\sopacity="[\d.]+"/);
                  return e.replace(t, '');
                })(i);
          const c = a.replace(/<svg[^>]*>/, l);
          s.writeFileSync(o, c);
        };
      },
      9865: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.validateSaturationValue = t.setIconSaturation = void 0);
        const s = i(n(5747)),
          r = i(n(5622)),
          l = n(2425);
        (t.setIconSaturation = (e, n) => {
          if (!t.validateSaturationValue(e.saturation))
            return console.error(
              'Invalid saturation value! Saturation must be a decimal number between 0 and 1!',
            );
          let o = '';
          o =
            'dist' === r.basename(__dirname)
              ? r.join(__dirname, '..', 'icons')
              : r.join(__dirname, '..', '..', '..', 'icons');
          const a = l.getCustomIconPaths(e),
            i = s.readdirSync(o);
          try {
            (n || i).forEach(c(o, e)),
              a.forEach((t) => {
                s.readdirSync(t).forEach(c(t, e));
              });
          } catch (e) {
            console.error(e);
          }
        }),
          (t.validateSaturationValue = (e) => void 0 !== e && e <= 1 && e >= 0);
        const c = (e, t) => (n) => {
          const o = r.join(e, n),
            a = s.readFileSync(o, 'utf-8'),
            i = ((e) => {
              const t = new RegExp(/<svg[^>]*>/).exec(e);
              return null == t ? void 0 : t[0];
            })(a);
          if (!i) return;
          let l;
          l =
            t.saturation < 1
              ? ((e) => {
                  const t = new RegExp(/\sfilter="[^"]+?"/);
                  return t.test(e)
                    ? e.replace(t, ' filter="url(#saturation)"')
                    : e.replace(/^<svg/, '<svg filter="url(#saturation)"');
                })(i)
              : ((e) => {
                  const t = new RegExp(/\sfilter="[^"]+?"/);
                  return e.replace(t, '');
                })(i);
          let c = a.replace(/<svg[^>]*>/, l);
          (c =
            t.saturation < 1
              ? ((e, t) => {
                  const n = new RegExp(/<filter id="saturation".+<\/filter>(.*<\/svg>)/),
                    o = `<filter id="saturation"><feColorMatrix type="saturate" values="${t}"/></filter>`;
                  return n.test(e) ? e.replace(n, `${o}$1`) : e.replace(/<\/svg>/, `${o}</svg>`);
                })(c, t.saturation)
              : ((e) => {
                  const t = new RegExp(/<filter id="saturation".+<\/filter>(.*<\/svg>)/);
                  return e.replace(t, '$1');
                })(c)),
            s.writeFileSync(o, c);
        };
      },
      1121: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          a(n(6410), t),
          a(n(4611), t),
          a(n(9409), t),
          a(n(4996), t),
          a(n(1111), t),
          a(n(7449), t),
          a(n(9865), t);
      },
      1111: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getDefaultIconOptions = t.createIconFile = t.generateIconConfigurationObject = void 0);
        const r = i(n(5747)),
          l = s(n(2378)),
          c = i(n(5622)),
          d = n(2425),
          f = n(2331),
          m = n(7554),
          u = n(6034),
          p = n(1077),
          g = n(4121),
          h = n(4996),
          v = n(1121);
        (t.generateIconConfigurationObject = (e) => {
          const t = l.default({}, new m.IconConfiguration(), { options: e }),
            n = v.loadLanguageIconDefinitions(g.languageIcons, t, e),
            o = v.loadFileIconDefinitions(u.fileIcons, t, e),
            a = v.loadFolderIconDefinitions(p.folderIcons, t, e);
          return l.default({}, n, o, a);
        }),
          (t.createIconFile = (e, n = {}) => {
            var o, a;
            const i = l.default({}, t.getDefaultIconOptions(), n),
              s = t.generateIconConfigurationObject(i);
            if (
              (null == e ? void 0 : e.opacity) &&
              !v.validateOpacityValue(null == e ? void 0 : e.opacity)
            )
              throw Error('Material Icons: Invalid opacity value!');
            if (
              (null == e ? void 0 : e.saturation) &&
              !v.validateSaturationValue(null == e ? void 0 : e.saturation)
            )
              throw Error('Material Icons: Invalid saturation value!');
            if (
              (null === (o = null == e ? void 0 : e.folders) || void 0 === o ? void 0 : o.color) &&
              !v.validateHEXColorCode(
                null === (a = null == e ? void 0 : e.folders) || void 0 === a ? void 0 : a.color,
              )
            )
              throw Error('Material Icons: Invalid folder color value!');
            try {
              let t = __dirname;
              'dist' !== c.basename(__dirname) && (t = c.join(__dirname, '..', '..', '..', 'dist')),
                (e && !(e.folders || {}).color) ||
                  (v.generateFolderIcons(i.folders.color),
                  v.setIconOpacity(i, [
                    'folder.svg',
                    'folder-open.svg',
                    'folder-root.svg',
                    'folder-root-open.svg',
                  ])),
                (e && void 0 === e.opacity) || v.setIconOpacity(i),
                (e && void 0 === e.saturation) || v.setIconSaturation(i),
                b(t, i);
            } catch (e) {
              throw Error(e);
            }
            try {
              let e = __dirname;
              'dist' !== c.basename(__dirname) && (e = c.join(__dirname, '..', '..', '..', 'dist')),
                r.writeFileSync(c.join(e, h.iconJsonName), JSON.stringify(s, void 0, 2), 'utf-8');
            } catch (e) {
              throw Error(e);
            }
            return h.iconJsonName;
          }),
          (t.getDefaultIconOptions = () => ({
            folders: { theme: 'specific', color: '#90a4ae', associations: {} },
            activeIconPack: 'angular',
            hidesExplorerArrows: !1,
            opacity: 1,
            saturation: 1,
            files: { associations: {} },
            languages: { associations: {} },
          }));
        const b = (e, t) => {
          const n = d.getCustomIconPaths(t);
          [c.join(e, '..', 'icons'), ...n].forEach((e) => {
            r.readdirSync(e)
              .filter((e) => e.match(/\.svg/gi))
              .forEach((n) => {
                const o = c.join(e, n),
                  a = f.getFileConfigHash(t),
                  i = c.join(e, n.replace(/(^[^\.~]+)(.*)\.svg/, `$1${a}.svg`));
                o !== i && r.existsSync(i) ? r.unlinkSync(o) : r.renameSync(o, i);
              });
          });
        };
      },
      9409: function (e, t, n) {
        'use strict';
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.loadLanguageIconDefinitions = void 0);
        const a = o(n(2378)),
          i = n(2331),
          s = n(4996);
        t.loadLanguageIconDefinitions = (e, t, n) => (
          (t = a.default({}, t)),
          [...f(e, n.activeIconPack), ...d(n.languages.associations)].forEach((e) => {
            e.disabled ||
              ((t = r(t, e.icon)),
              ((t = a.default({}, t, c(e.icon.name, e.ids))).light = e.icon.light
                ? a.default({}, t.light, c(e.icon.name + s.lightVersion, e.ids))
                : t.light),
              (t.highContrast = e.icon.highContrast
                ? a.default({}, t.highContrast, c(e.icon.name + s.highContrastVersion, e.ids))
                : t.highContrast));
          }),
          t
        );
        const r = (e, t) => (
            (e = a.default({}, e)),
            (e = l(e, t.name)),
            (e = a.default({}, e, t.light ? l(e, t.name + s.lightVersion) : e.light)),
            a.default({}, e, t.highContrast ? l(e, t.name + s.highContrastVersion) : e.highContrast)
          ),
          l = (e, t) => {
            e = a.default({}, e);
            const n = i.getFileConfigHash(e.options);
            return (e.iconDefinitions[t] = { iconPath: `${s.iconFolderPath}${t}${n}.svg` }), e;
          },
          c = (e, t) => {
            const n = { languageIds: {} };
            return (
              t.forEach((t) => {
                n.languageIds[t] = e;
              }),
              n
            );
          },
          d = (e) =>
            e
              ? Object.keys(e).map((t) => ({
                  icon: { name: e[t].toLowerCase() },
                  ids: [t.toLowerCase()],
                }))
              : [],
          f = (e, t) => e.filter((e) => !e.enabledFor || e.enabledFor.some((e) => e === t));
      },
      1254: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          a(n(1121), t),
          a(n(6034), t),
          a(n(1077), t),
          a(n(4121), t);
      },
      4121: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.languageIcons = void 0),
          (t.languageIcons = [
            { icon: { name: 'git' }, ids: ['git', 'git-commit', 'git-rebase', 'ignore'] },
            { icon: { name: 'c' }, ids: ['c', 'objective-c', 'objective-cpp'] },
            { icon: { name: 'yaml' }, ids: ['yaml'] },
            { icon: { name: 'xml' }, ids: ['xml', 'xquery', 'xsl'] },
            { icon: { name: 'matlab' }, ids: ['matlab'] },
            { icon: { name: 'settings' }, ids: ['makefile', 'toml', 'ini', 'properties'] },
            { icon: { name: 'shaderlab' }, ids: ['shaderlab'] },
            { icon: { name: 'diff' }, ids: ['diff'] },
            { icon: { name: 'json' }, ids: ['json', 'jsonc', 'json5'] },
            { icon: { name: 'blink' }, ids: ['blink'] },
            { icon: { name: 'java' }, ids: ['java'] },
            { icon: { name: 'razor' }, ids: ['razor', 'aspnetcorerazor'] },
            { icon: { name: 'python' }, ids: ['python'] },
            { icon: { name: 'javascript' }, ids: ['javascript'] },
            { icon: { name: 'typescript' }, ids: ['typescript'] },
            { icon: { name: 'scala' }, ids: ['scala'] },
            { icon: { name: 'handlebars' }, ids: ['handlebars'] },
            { icon: { name: 'perl' }, ids: ['perl', 'perl6'] },
            { icon: { name: 'haxe' }, ids: ['haxe', 'hxml'] },
            { icon: { name: 'puppet' }, ids: ['puppet'] },
            { icon: { name: 'elixir' }, ids: ['elixir'] },
            { icon: { name: 'livescript' }, ids: ['livescript'] },
            { icon: { name: 'erlang' }, ids: ['erlang'] },
            { icon: { name: 'twig' }, ids: ['twig'] },
            { icon: { name: 'julia' }, ids: ['julia'] },
            { icon: { name: 'elm' }, ids: ['elm'] },
            { icon: { name: 'purescript' }, ids: ['purescript'] },
            { icon: { name: 'stylus' }, ids: ['stylus'] },
            { icon: { name: 'nunjucks' }, ids: ['nunjucks'] },
            { icon: { name: 'pug' }, ids: ['pug'] },
            { icon: { name: 'robot' }, ids: ['robotframework'] },
            { icon: { name: 'sass' }, ids: ['sass', 'scss'] },
            { icon: { name: 'less' }, ids: ['less'] },
            { icon: { name: 'css' }, ids: ['css'] },
            { icon: { name: 'visualstudio' }, ids: ['testOutput', 'vb'] },
            { icon: { name: 'angular' }, ids: ['ng-template'] },
            { icon: { name: 'graphql' }, ids: ['graphql'] },
            { icon: { name: 'solidity' }, ids: ['solidity'] },
            { icon: { name: 'autoit' }, ids: ['autoit'] },
            { icon: { name: 'haml' }, ids: ['haml'] },
            { icon: { name: 'yang' }, ids: ['yang'] },
            { icon: { name: 'terraform' }, ids: ['terraform'] },
            { icon: { name: 'applescript' }, ids: ['applescript'] },
            { icon: { name: 'cake' }, ids: ['cake'] },
            { icon: { name: 'cucumber' }, ids: ['cucumber'] },
            { icon: { name: 'nim' }, ids: ['nim', 'nimble'] },
            { icon: { name: 'apiblueprint' }, ids: ['apiblueprint'] },
            { icon: { name: 'riot' }, ids: ['riot'] },
            { icon: { name: 'postcss' }, ids: ['postcss'] },
            { icon: { name: 'coldfusion' }, ids: ['lang-cfml'] },
            { icon: { name: 'haskell' }, ids: ['haskell'] },
            { icon: { name: 'dhall' }, ids: ['dhall'] },
            { icon: { name: 'cabal' }, ids: ['cabal'] },
            { icon: { name: 'nix' }, ids: ['nix'] },
            { icon: { name: 'ruby' }, ids: ['ruby'] },
            { icon: { name: 'slim' }, ids: ['slim'] },
            { icon: { name: 'php' }, ids: ['php'] },
            { icon: { name: 'php_elephant' }, ids: [] },
            { icon: { name: 'php_elephant_pink' }, ids: [] },
            { icon: { name: 'hack' }, ids: ['hack'] },
            { icon: { name: 'react' }, ids: ['javascriptreact'] },
            { icon: { name: 'mjml' }, ids: ['mjml'] },
            { icon: { name: 'processing' }, ids: ['processing'] },
            { icon: { name: 'hcl' }, ids: ['hcl'] },
            { icon: { name: 'go' }, ids: ['go'] },
            { icon: { name: 'go_gopher' }, ids: [] },
            { icon: { name: 'nodejs_alt' }, ids: [] },
            { icon: { name: 'django' }, ids: ['django-html', 'django-txt'] },
            { icon: { name: 'html' }, ids: ['html'] },
            { icon: { name: 'godot' }, ids: ['gdscript'] },
            { icon: { name: 'vim' }, ids: ['viml'] },
            { icon: { name: 'silverstripe' }, ids: [] },
            { icon: { name: 'prolog' }, ids: ['prolog'] },
            { icon: { name: 'pawn' }, ids: ['pawn'] },
            { icon: { name: 'reason' }, ids: ['reason', 'reason_lisp'] },
            { icon: { name: 'sml' }, ids: ['sml'] },
            { icon: { name: 'tex' }, ids: ['tex', 'doctex', 'latex', 'latex-expl3'] },
            { icon: { name: 'salesforce' }, ids: ['apex'] },
            { icon: { name: 'sas' }, ids: ['sas'] },
            { icon: { name: 'docker' }, ids: ['dockerfile'] },
            { icon: { name: 'table' }, ids: ['csv', 'tsv'] },
            { icon: { name: 'csharp' }, ids: ['csharp'] },
            { icon: { name: 'console' }, ids: ['bat', 'awk', 'shellscript'] },
            { icon: { name: 'cpp' }, ids: ['cpp'] },
            { icon: { name: 'coffee' }, ids: ['coffeescript'] },
            { icon: { name: 'fsharp' }, ids: ['fsharp'] },
            { icon: { name: 'editorconfig' }, ids: ['editorconfig'] },
            { icon: { name: 'clojure' }, ids: ['clojure'] },
            { icon: { name: 'groovy' }, ids: ['groovy'] },
            { icon: { name: 'markdown' }, ids: ['markdown'] },
            { icon: { name: 'jinja' }, ids: ['jinja'] },
            { icon: { name: 'proto' }, ids: ['proto'] },
            { icon: { name: 'python-misc' }, ids: ['pip-requirements'] },
            { icon: { name: 'vue' }, ids: ['vue', 'vue-postcss', 'vue-html'] },
            { icon: { name: 'lua' }, ids: ['lua'] },
            { icon: { name: 'lib' }, ids: ['bibtex', 'bibtex-style'] },
            { icon: { name: 'log' }, ids: ['log'] },
            { icon: { name: 'jupyter' }, ids: ['jupyter'] },
            { icon: { name: 'document' }, ids: ['plaintext'] },
            { icon: { name: 'pdf' }, ids: ['pdf'] },
            { icon: { name: 'powershell' }, ids: ['powershell'] },
            { icon: { name: 'pug' }, ids: ['jade'] },
            { icon: { name: 'r' }, ids: ['r', 'rsweave'] },
            { icon: { name: 'rust' }, ids: ['rust'] },
            { icon: { name: 'database' }, ids: ['sql'] },
            { icon: { name: 'kusto' }, ids: ['kql'] },
            { icon: { name: 'lock' }, ids: ['ssh_config'] },
            { icon: { name: 'svg' }, ids: ['svg'] },
            { icon: { name: 'swift' }, ids: ['swift'] },
            { icon: { name: 'react_ts' }, ids: ['typescriptreact'] },
            { icon: { name: 'search' }, ids: ['search-result'] },
            { icon: { name: 'minecraft' }, ids: ['mcfunction'] },
            { icon: { name: 'rescript' }, ids: ['rescript'] },
            {
              icon: { name: 'twine' },
              ids: ['twee3', 'twee3-harlowe-3', 'twee3-chapbook-1', 'twee3-sugarcube-2'],
            },
            { icon: { name: 'grain' }, ids: ['grain'] },
            { icon: { name: 'lolcode' }, ids: ['lolcode'] },
            { icon: { name: 'idris' }, ids: ['idris'] },
            { icon: { name: 'chess' }, ids: ['pgn'] },
            { icon: { name: 'gemini' }, ids: ['gemini', 'text-gemini'] },
            { icon: { name: 'vlang' }, ids: ['v'] },
            { icon: { name: 'wolframlanguage' }, ids: ['wolfram'] },
          ]);
      },
      1459: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            },
          s =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (a, i) {
                function s(e) {
                  try {
                    l(o.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function r(e) {
                  try {
                    l(o.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function l(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t);
                          })).then(s, r);
                }
                l((o = o.apply(e, t || [])).next());
              });
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.showConfirmToReloadMessage = void 0);
        const r = i(n(7549)),
          l = n(9489),
          c = n(2247);
        t.showConfirmToReloadMessage = () =>
          s(void 0, void 0, void 0, function* () {
            if (!1 !== l.getThemeConfig('showReloadMessage').globalValue)
              switch (
                yield r.window.showInformationMessage(
                  c.translate('confirmReload'),
                  c.translate('reload'),
                  c.translate('neverShowAgain'),
                )
              ) {
                case c.translate('reload'):
                  return !0;
                case c.translate('neverShowAgain'):
                  return d(), !1;
                default:
                  return !1;
              }
          });
        const d = () => {
          l.setThemeConfig('showReloadMessage', !1, !0);
        };
      },
      7346: (e, t, n) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.showStartMessages = void 0);
        const o = n(9205),
          a = n(1314),
          i = n(2055);
        t.showStartMessages = (e) => {
          e === o.ThemeStatus.updated
            ? a.showUpdateMessage()
            : e === o.ThemeStatus.neverUsedBefore && i.showWelcomeMessage();
        };
      },
      1314: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.showUpdateMessage = void 0);
        const s = i(n(7549)),
          r = n(6677),
          l = n(9489),
          c = n(2247);
        t.showUpdateMessage = () => {
          !0 === l.getThemeConfig('showUpdateMessage').globalValue &&
            s.window
              .showInformationMessage(
                c.translate('themeUpdated'),
                l.isThemeNotVisible() ? c.translate('activate') : void 0,
                c.translate('readChangelog'),
                c.translate('neverShowAgain'),
              )
              .then(d);
        };
        const d = (e) => {
            switch (e) {
              case c.translate('activate'):
                r.activateIcons();
                break;
              case c.translate('readChangelog'):
                s.env.openExternal(
                  s.Uri.parse(
                    'https://marketplace.visualstudio.com/items/PKief.material-icon-theme/changelog',
                  ),
                );
                break;
              case c.translate('neverShowAgain'):
                f();
            }
          },
          f = () => {
            l.setThemeConfig('showUpdateMessage', !1, !0);
          };
      },
      2055: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, 'default', { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          i =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var n in e)
                  'default' !== n && Object.prototype.hasOwnProperty.call(e, n) && o(t, e, n);
              return a(t, e), t;
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.showWelcomeMessage = void 0);
        const s = i(n(7549)),
          r = n(6677),
          l = n(9489),
          c = n(2247);
        t.showWelcomeMessage = () => {
          !1 !== l.getThemeConfig('showWelcomeMessage').globalValue &&
            s.window
              .showInformationMessage(
                c.translate('themeInstalled'),
                l.isThemeNotVisible() ? c.translate('activate') : void 0,
                c.translate('neverShowAgain'),
              )
              .then(d);
        };
        const d = (e) => {
            switch (e) {
              case c.translate('activate'):
                r.activateIcons();
                break;
              case c.translate('howToActivate'):
                s.env.openExternal(
                  s.Uri.parse(
                    'https://code.visualstudio.com/blogs/2016/09/08/icon-themes#_file-icon-themes',
                  ),
                );
                break;
              case c.translate('neverShowAgain'):
                f();
            }
          },
          f = () => {
            l.setThemeConfig('showWelcomeMessage', !1, !0);
          };
      },
      4677: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), a(n(9205), t);
      },
      9205: (e, t) => {
        'use strict';
        var n;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.ThemeStatus = void 0),
          ((n = t.ThemeStatus || (t.ThemeStatus = {}))[(n.neverUsedBefore = 0)] =
            'neverUsedBefore'),
          (n[(n.updated = 1)] = 'updated'),
          (n[(n.current = 2)] = 'current');
      },
      6072: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), a(n(7196), t);
      },
      7196: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      796: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.IconConfiguration = void 0),
          (t.IconConfiguration = class {
            constructor() {
              (this.iconDefinitions = {}),
                (this.folderNames = {}),
                (this.folderNamesExpanded = {}),
                (this.fileExtensions = {}),
                (this.fileNames = {}),
                (this.languageIds = {}),
                (this.light = { fileExtensions: {}, fileNames: {} }),
                (this.highContrast = { fileExtensions: {}, fileNames: {} }),
                (this.options = {});
            }
          });
      },
      2523: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      6399: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      1269: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.FileIcons = void 0),
          (t.FileIcons = class {});
      },
      2769: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), a(n(6399), t), a(n(1269), t);
      },
      137: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      6511: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      8968: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), a(n(137), t), a(n(6511), t);
      },
      8731: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      2193: (e, t) => {
        'use strict';
        var n;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.IconPack = void 0),
          ((n = t.IconPack || (t.IconPack = {})).Angular = 'angular'),
          (n.Nest = 'nest'),
          (n.Ngrx = 'angular_ngrx'),
          (n.React = 'react'),
          (n.Redux = 'react_redux'),
          (n.Vue = 'vue'),
          (n.Vuex = 'vue_vuex');
      },
      1946: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          a(n(2769), t),
          a(n(8968), t),
          a(n(8692), t),
          a(n(2193), t),
          a(n(8731), t),
          a(n(2523), t);
      },
      8692: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }), a(n(8696), t);
      },
      8696: (e, t) => {
        'use strict';
        Object.defineProperty(t, '__esModule', { value: !0 });
      },
      7554: function (e, t, n) {
        'use strict';
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    });
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n]);
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                'default' === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n);
            };
        Object.defineProperty(t, '__esModule', { value: !0 }),
          a(n(1946), t),
          a(n(6072), t),
          a(n(796), t),
          a(n(4677), t);
      },
      6684: (e, t, n) => {
        var o = {
          './lang-de': 3722,
          './lang-de.ts': 3722,
          './lang-en': 2925,
          './lang-en.ts': 2925,
          './lang-es': 422,
          './lang-es.ts': 422,
          './lang-fr': 7941,
          './lang-fr.ts': 7941,
          './lang-nl': 4398,
          './lang-nl.ts': 4398,
          './lang-pl': 9597,
          './lang-pl.ts': 9597,
          './lang-pt-br': 7100,
          './lang-pt-br.ts': 7100,
          './lang-pt-pt': 3536,
          './lang-pt-pt.ts': 3536,
          './lang-ru': 3189,
          './lang-ru.ts': 3189,
          './lang-uk': 7833,
          './lang-uk.ts': 7833,
          './lang-zh-cn': 2539,
          './lang-zh-cn.ts': 2539,
        };
        function a(e) {
          var t = i(e);
          return n(t);
        }
        function i(e) {
          if (!n.o(o, e)) {
            var t = new Error("Cannot find module '" + e + "'");
            throw ((t.code = 'MODULE_NOT_FOUND'), t);
          }
          return o[e];
        }
        (a.keys = function () {
          return Object.keys(o);
        }),
          (a.resolve = i),
          (e.exports = a),
          (a.id = 6684);
      },
      5747: (e) => {
        'use strict';
        e.exports = require('fs');
      },
      5622: (e) => {
        'use strict';
        e.exports = require('path');
      },
      7549: (e) => {
        'use strict';
        e.exports = require('vscode');
      },
    },
    t = {};
  function n(o) {
    var a = t[o];
    if (void 0 !== a) return a.exports;
    var i = (t[o] = { id: o, loaded: !1, exports: {} });
    return e[o].call(i.exports, i, i.exports, n), (i.loaded = !0), i.exports;
  }
  (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (n.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e));
  var o = n(112);
  module.exports = o;
})();
//# sourceMappingURL=extension.js.map
