/**
 * 拓展对象
 */
export default function extend(target) {
	var sources = Array.prototype.slice.call(arguments, 1);
	if (Object.prototype.toString.call(target) != '[object Object]') {
		target = {}
	}
	for (var i = 0; i < sources.length; i += 1) {
		var source = sources[i];
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				if (Object.prototype.toString.call(target[key]) == '[object Object]') {
					target[key] = extend(target[key], source[key]);
				} else {
					target[key] = source[key];
				}
			}
		}
	}

	return target;
};