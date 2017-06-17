export function watch(obj, prop, cb) {
	let val = obj[prop];
	Object.defineProperty(obj, prop, {
		enumerable: true,
		configurable: true,
		get: function () {
			return val;
		},
		set: function (_val) {
			if (_val === val) {
				return;
			}
			const old = val;
			val = _val;
			cb(val, old);
		}
	});
}

export function noop() {}
