(() => {
  'use strict';
  var e = {};
  ({
    236: function (e, t) {
      var n =
        (this && this.__awaiter) ||
        function (e, t, n, i) {
          return new (n || (n = Promise))(function (a, o) {
            function c(e) {
              try {
                u(i.next(e));
              } catch (e) {
                o(e);
              }
            }
            function r(e) {
              try {
                u(i.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function u(e) {
              var t;
              e.done
                ? a(e.value)
                : ((t = e.value),
                  t instanceof n
                    ? t
                    : new n(function (e) {
                        e(t);
                      })).then(c, r);
            }
            u((i = i.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.deactivate = t.activate = void 0),
        (t.activate = () => n(void 0, void 0, void 0, function* () {})),
        (t.deactivate = () => {});
    },
  }[236](0, e));
  var t = exports;
  for (var n in e) t[n] = e[n];
  e.__esModule && Object.defineProperty(t, '__esModule', { value: !0 });
})();
