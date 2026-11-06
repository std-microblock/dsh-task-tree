window.__ModuleLoader__.load({
	id: "dsh-task-tree",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
				throw new Error("cached value already set");
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject$1(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject$1(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject$1(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject$1(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$2 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$1 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject$1(a) && isPlainObject$1(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!isPlainObject$1(input)) {
					payload.issues.push({
						expected: "record",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				const proms = [];
				const values = def.keyType._zod.values;
				if (values) {
					payload.value = {};
					const recordKeys = /* @__PURE__ */ new Set();
					for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
						recordKeys.add(typeof key === "number" ? key.toString() : key);
						const keyResult = def.keyType._zod.run({
							value: key,
							issues: []
						}, ctx);
						if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (keyResult.issues.length) {
							payload.issues.push({
								code: "invalid_key",
								origin: "record",
								issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
								input: key,
								path: [key],
								inst
							});
							continue;
						}
						const outKey = keyResult.value;
						const result = def.valueType._zod.run({
							value: input[key],
							issues: []
						}, ctx);
						if (result instanceof Promise) proms.push(result.then((result) => {
							if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
							payload.value[outKey] = result.value;
						}));
						else {
							if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
							payload.value[outKey] = result.value;
						}
					}
					let unrecognized;
					for (const key in input) if (!recordKeys.has(key)) {
						unrecognized = unrecognized ?? [];
						unrecognized.push(key);
					}
					if (unrecognized && unrecognized.length > 0) payload.issues.push({
						code: "unrecognized_keys",
						input,
						inst,
						keys: unrecognized
					});
				} else {
					payload.value = {};
					for (const key of Reflect.ownKeys(input)) {
						if (key === "__proto__") continue;
						if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
						let keyResult = def.keyType._zod.run({
							value: key,
							issues: []
						}, ctx);
						if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
							const retryResult = def.keyType._zod.run({
								value: Number(key),
								issues: []
							}, ctx);
							if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
							if (retryResult.issues.length === 0) keyResult = retryResult;
						}
						if (keyResult.issues.length) {
							if (def.mode === "loose") payload.value[key] = input[key];
							else payload.issues.push({
								code: "invalid_key",
								origin: "record",
								issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
								input: key,
								path: [key],
								inst
							});
							continue;
						}
						const result = def.valueType._zod.run({
							value: input[key],
							issues: []
						}, ctx);
						if (result instanceof Promise) proms.push(result.then((result) => {
							if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
							payload.value[keyResult.value] = result.value;
						}));
						else {
							if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
							payload.value[keyResult.value] = result.value;
						}
					}
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize$1(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize$1(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize$1(ctx, schema);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
			else vals.push(Number(val));
			else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const recordProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			const keyType = def.keyType;
			const patterns = keyType._zod.bag?.patterns;
			if (def.mode === "loose" && patterns && patterns.size > 0) {
				const valueSchema = process(def.valueType, ctx, {
					...params,
					path: [
						...params.path,
						"patternProperties",
						"*"
					]
				});
				json.patternProperties = {};
				for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
			} else {
				if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process(def.keyType, ctx, {
					...params,
					path: [...params.path, "propertyNames"]
				});
				json.additionalProperties = process(def.valueType, ctx, {
					...params,
					path: [...params.path, "additionalProperties"]
				});
			}
			const keyValues = keyType._zod.values;
			if (keyValues) {
				const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
				if (validKeyValues.length > 0) json.required = validKeyValues;
			}
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodRecord = /*@__PURE__*/ $constructor("ZodRecord", (inst, def) => {
			$ZodRecord.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
			inst.keyType = def.keyType;
			inst.valueType = def.valueType;
		});
		function record(keyType, valueType, params) {
			if (!valueType || !valueType._zod) return new ZodRecord({
				type: "record",
				keyType: string(),
				valueType: keyType,
				...normalizeParams(valueType)
			});
			return new ZodRecord({
				type: "record",
				keyType,
				valueType,
				...normalizeParams(params)
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region src/protocol.ts
		/** Validated messages on the plugin's authenticated Connection RPC routes. */
		/** Connection owns authentication, correlation, transport, and cancellation. */
		const TASK_TREE_CHANNEL = "/api";
		/** Cross-session task list. */
		const LIST_METHOD = "task-tree/list";
		object({}).strict();
		/** List response received by the browser. */
		const listResponseSchema = object({
			rows: array(object({
				sessionId: string().min(1),
				rootTitle: string(),
				path: array(string()),
				detail: string(),
				doneCount: number().int().nonnegative(),
				totalCount: number().int().nonnegative(),
				lastRecordSeq: number().int().nonnegative(),
				updatedAt: number().nonnegative()
			})),
			pollIntervalMs: number().int().positive()
		});
		//#endregion
		//#region src/records.ts
		/** Versioned, ignorable task-tree records; none are part of the model conversation. */
		/** How the auxiliary request is built. */
		const GENERATION_MODES = [
			"fork",
			"fork-cheap",
			"checkpoint"
		];
		object({
			provider: string().min(1),
			model: string().min(1),
			reasoningEffort: string().min(1).optional()
		}).strict();
		object({
			path: array(string().trim().min(1).max(120)).min(1),
			detail: string().trim().min(1).max(400),
			decisions: array(string().trim().min(1).max(400)).default([])
		});
		/** Persisted successful report fields consumed by the tree, the Client, and the index. */
		const resultSchema = object({
			version: literal(1),
			id: string().min(1),
			sessionId: string().min(1),
			mode: _enum(GENERATION_MODES),
			/** Session seq of the last event visible to the captured context. */
			contextSeq: number().int().nonnegative(),
			coveredStepCount: number().int().nonnegative(),
			/** Turn and step current when the context was captured; named to stay out of Conversation coordinates. */
			coveredTurn: number().int().nonnegative().optional(),
			coveredStep: number().int().nonnegative().optional(),
			path: array(string().min(1)).min(1),
			previousPath: array(string().min(1)),
			detail: string().min(1),
			decisions: array(string().min(1))
		});
		object({
			version: literal(1),
			id: string().min(1),
			sessionId: string().min(1),
			/** Number of leading captured messages the summary replaces. */
			boundary: number().int().positive(),
			/** SHA-256 of the canonical JSON of the summarized messages. */
			prefixHash: string().regex(/^[0-9a-f]{64}$/u),
			summary: string().min(1),
			basedOn: string().min(1).optional()
		});
		object({
			version: literal(1),
			title: string().min(1)
		});
		/** Record type names. */
		const RECORD = {
			request: "plugin:task-tree/request",
			result: "plugin:task-tree/result",
			failure: "plugin:task-tree/failure",
			checkpoint: "plugin:task-tree/checkpoint",
			title: "plugin:task-tree/title"
		};
		/**
		* Read an untrusted result record without importing the Host Session runtime.
		* @param event - event envelope.
		* @returns validated result data, or undefined for any other or malformed event.
		*/
		function readResult(event) {
			if (event.type !== RECORD.result || event.ignorable !== true) return void 0;
			const parsed = resultSchema.safeParse(event.data);
			return parsed.success ? parsed.data : void 0;
		}
		/**
		* Whether two task paths name the same items.
		* @param a - first path.
		* @param b - second path.
		* @returns true when every segment is equal.
		*/
		function samePath(a, b) {
			return a.length === b.length && a.every((segment, index) => segment === b[index]);
		}
		//#endregion
		//#region src/client/decisions.tsx
		/** Decision block shared by the tree views and the Chat change row; each decision quotes itself into the composer. */
		/**
		* Render decisions as a bordered block of clickable rows.
		* @param props.decisions - decision texts, oldest first.
		* @param props.onInsert - quotes one decision into the composer.
		* @param props.insertDisabled - whether insertion is unavailable.
		* @param props.t - copy.
		* @returns the block.
		*/
		function DecisionList({ decisions, onInsert, insertDisabled, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-task-tree-decision-block",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-task-tree-decision-label",
					"aria-hidden": "true",
					children: t("decision.label")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: "dsh-task-tree-decision-list",
					"aria-label": t("decision.label"),
					children: decisions.map((decision) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: t("decision.insert"),
						side: "top",
						align: "center",
						portal: true,
						delayMs: 400,
						disabled: insertDisabled,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-task-tree-decision",
							disabled: insertDisabled,
							onClick: () => {
								onInsert(decision.text);
							},
							children: decision.text
						})
					}) }, decision.key))
				})]
			});
		}
		/**
		* Text a decision inserts into the composer.
		* @param text - decision.
		* @returns a Markdown quote line followed by a newline.
		*/
		function decisionQuote(text) {
			return `> ${text}\n`;
		}
		/**
		* Bind decision insertion to one Session's composer: the quote lands at the
		* cursor without replacing a selection, and the draft is persisted and focused.
		* @param seats - composer seats and focus callback.
		* @returns the insertion action and whether the composer accepts edits now.
		*/
		function useDecisionInsert({ useInput, inputActions, focusComposer }) {
			const insertDisabled = useInput((state) => state.phase !== "plain");
			return {
				onInsert: (0, react.useCallback)((text) => {
					const span = inputActions.captureInsertion();
					if (!inputActions.insertText(decisionQuote(text), {
						...span,
						end: span.start
					})) return;
					inputActions.persistDraft();
					focusComposer();
				}, [inputActions, focusComposer]),
				insertDisabled
			};
		}
		//#endregion
		//#region src/client/ChangeRow.tsx
		/** Work-details row announcing a task-path change or new decisions. */
		const ICON = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineRegular, { size: 14 });
		/**
		* Index of the first path segment that differs from the previous path.
		* @param path - reported path.
		* @param previousPath - path of the preceding report.
		* @returns the index; equal to `path.length` when nothing changed.
		*/
		function firstChangedSegment(path, previousPath) {
			let index = 0;
			while (index < path.length && path[index] === previousPath[index]) index++;
			return index;
		}
		/**
		* Render one change as a reasoning-style disclosure row.
		* @param props - change data, disclosure state, decision insertion, and copy.
		* @returns the row; its root carries the record id and seq used by scroll sync and jumps.
		*/
		function ChangeRow({ data, expanded, onToggle, onInsert, insertDisabled, t }) {
			const pathChanged = !samePath(data.path, data.previousPath);
			const changedFrom = firstChangedSegment(data.path, data.previousPath);
			const deepest = data.path[data.path.length - 1] ?? "";
			const title = pathChanged ? t("change.title") : t("change.decisions", { count: data.decisions.length });
			const collapsed = (0, react.useMemo)(() => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-task-tree-change-separator",
				"data-shimmer-decoration": true,
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-task-tree-change-summary",
				"data-changed": pathChanged || void 0,
				children: deepest
			})] }), [deepest, pathChanged]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-task-tree-change",
				"data-task-tree-record": data.id,
				"data-task-tree-seq": data.seq,
				"data-expanded": expanded || void 0,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.DisclosureRow, {
					icon: ICON,
					title,
					open: expanded,
					expandable: true,
					expandOnRowClick: true,
					onToggle,
					collapsedContent: collapsed,
					titleClassName: "dsh-task-tree-change-title",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-task-tree-change-body",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ol", {
								className: "dsh-task-tree-crumbs",
								"aria-label": t("change.path"),
								children: data.path.map((segment, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
									"data-changed": pathChanged && index >= changedFrom || void 0,
									children: segment
								}, index))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dsh-task-tree-change-detail",
								children: data.detail
							}),
							data.decisions.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DecisionList, {
								t,
								onInsert,
								insertDisabled,
								decisions: data.decisions.map((text, index) => ({
									key: String(index),
									text
								}))
							})
						]
					})
				})
			});
		}
		/**
		* Keyed `conversation.chat.node` renderer; the disclosure resets with its enclosing Turn.
		* @param props - framework node and composer seats, focus callback, and copy.
		* @returns the change row.
		*/
		function ChangeNode({ node, sessionId, useDisclosure, useInput, inputActions, focusComposer, t }) {
			const { expanded, toggle } = useDisclosure();
			const insert = useDecisionInsert({
				useInput,
				inputActions,
				focusComposer: (0, react.useCallback)(() => {
					focusComposer(sessionId);
				}, [focusComposer, sessionId])
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChangeRow, {
				data: node.data,
				expanded,
				onToggle: toggle,
				...insert,
				t
			});
		}
		//#endregion
		//#region src/client/ConfigPage.tsx
		/** The bundle's own configuration page in the Plugins manager. */
		/**
		* Whether a cheap model is configured.
		* @param cheap - stored cheap model.
		* @returns true when both provider and model are set.
		*/
		function hasCheapModel(cheap) {
			return (cheap?.provider ?? "") !== "" && (cheap?.model ?? "") !== "";
		}
		function SettingLine({ title, description, children, stacked = false }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-task-tree-config-line",
				"data-stacked": stacked || void 0,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-task-tree-config-text",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-config-title",
						children: title
					}), description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-config-description",
						children: description
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-task-tree-config-control",
					children
				})]
			});
		}
		function Section({ title, description, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dsh-task-tree-config-section",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: "dsh-task-tree-config-heading",
						children: title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-task-tree-config-section-description",
						children: description
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-config-lines",
						children
					})
				]
			});
		}
		const CLEAR_ID = "clear";
		function routeId(provider, model) {
			return JSON.stringify([provider, model]);
		}
		/**
		* Cheap-model picker fed by the Host model catalog; a choice is written at once.
		* @param props - stored route, catalog, write action, and copy.
		* @returns the model and reasoning-effort selectors.
		*/
		function CheapModelPicker({ stored, catalog, disabled, onSave, onRetry, t }) {
			const [modelOpen, setModelOpen] = (0, react.useState)(false);
			const [effortOpen, setEffortOpen] = (0, react.useState)(false);
			const [state, setState] = (0, react.useState)("idle");
			const provider = stored?.provider ?? "";
			const model = stored?.model ?? "";
			const effort = stored?.reasoningEffort ?? "";
			const configured = provider !== "" && model !== "";
			const group = catalog.groups.find((item) => item.id === provider);
			const entry = group?.models.find((item) => item.id === model);
			const save = (value) => {
				setState("saving");
				onSave(value).then((ok) => {
					setState(ok ? "idle" : "failed");
				}, () => {
					setState("failed");
				});
			};
			const label = !configured ? t("config.unset") : entry === void 0 || group === void 0 ? catalog.status === "ready" ? t("config.unavailableModel", {
				provider,
				model
			}) : `${provider} · ${model}` : `${group.name} · ${entry.name}`;
			const items = catalog.groups.flatMap((item) => [{
				type: "label",
				id: `group:${item.id}`,
				text: item.name
			}, ...item.models.map((option) => ({
				id: routeId(item.id, option.id),
				label: option.name
			}))]);
			if (configured) items.push({
				type: "separator",
				id: "separator"
			}, {
				id: CLEAR_ID,
				label: t("config.clear")
			});
			const efforts = entry?.reasoning?.efforts ?? [];
			const effortName = efforts.find((item) => item.id === effort)?.name ?? t("config.effortDefault");
			const busy = disabled || state === "saving";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-task-tree-config-picker",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-task-tree-config-picker-row",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: modelOpen,
							onClose: () => {
								setModelOpen(false);
							},
							portal: true,
							align: "end",
							items,
							selectedId: configured ? routeId(provider, model) : void 0,
							onSelect: (id) => {
								setModelOpen(false);
								if (id === CLEAR_ID) {
									save({
										provider: "",
										model: "",
										reasoningEffort: ""
									});
									return;
								}
								const [nextProvider, nextModel] = JSON.parse(id);
								const option = catalog.groups.find((item) => item.id === nextProvider)?.models.find((item) => item.id === nextModel);
								save({
									provider: nextProvider,
									model: nextModel,
									reasoningEffort: option?.reasoning?.defaultEffort ?? ""
								});
							},
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "dsh-task-tree-select",
								"aria-haspopup": "menu",
								"aria-expanded": modelOpen,
								"aria-label": `${t("config.pickModel")}: ${label}`,
								disabled: busy || items.length === 0,
								"data-empty": !configured || void 0,
								onClick: () => {
									setModelOpen((open) => !open);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-task-tree-select-label",
									children: label
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronsUpDownOutlineRegular, { size: 14 })]
							})
						}), configured && efforts.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: effortOpen,
							onClose: () => {
								setEffortOpen(false);
							},
							portal: true,
							align: "end",
							items: efforts.map((item) => ({
								id: item.id,
								label: item.name
							})),
							selectedId: effort === "" ? void 0 : effort,
							onSelect: (id) => {
								setEffortOpen(false);
								save({
									provider,
									model,
									reasoningEffort: id
								});
							},
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "dsh-task-tree-select",
								"aria-haspopup": "menu",
								"aria-expanded": effortOpen,
								"aria-label": `${t("config.effort")}: ${effortName}`,
								disabled: busy,
								onClick: () => {
									setEffortOpen((open) => !open);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-task-tree-select-label",
									children: effortName
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronsUpDownOutlineRegular, { size: 14 })]
							})
						})]
					}),
					catalog.status === "loading" && catalog.groups.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "dsh-task-tree-config-status",
						role: "status",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, {
								state: "ongoing",
								size: 12
							}),
							" ",
							t("config.catalogLoading")
						]
					}),
					catalog.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "dsh-task-tree-config-status",
						"data-tone": "error",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							role: "alert",
							children: t("config.catalogError")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							onClick: onRetry,
							children: t("config.retry")
						})]
					}),
					catalog.status === "ready" && catalog.groups.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-task-tree-config-status",
						children: t("config.catalogEmpty")
					}),
					catalog.status === "ready" && catalog.partial && catalog.groups.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-task-tree-config-status",
						children: t("config.catalogPartial")
					}),
					state === "failed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-task-tree-config-status",
						"data-tone": "error",
						role: "alert",
						children: t("config.saveFailed")
					})
				]
			});
		}
		/**
		* Render the configuration page: Host generation options while the Host serves
		* them, plus this browser's display preferences.
		* @param props - page view, configuration sources, writers, and copy.
		* @returns the page body, or nothing for the summary view.
		*/
		function ConfigPage({ view, useConfig, useView, useCatalog, retryCatalog, setConfig, setMode, setFollowScroll, t }) {
			const config = useConfig((snapshot) => snapshot);
			const catalog = useCatalog((snapshot) => snapshot);
			const display = useView((value) => value.mode);
			const follow = useView((value) => value.followScroll);
			const id = (0, react.useId)();
			if (view !== "page") return null;
			const value = config.status === "ready" ? config.value : void 0;
			const locked = !config.writable;
			const cheap = hasCheapModel(value?.cheapModel);
			const cheapHint = cheap ? {} : { title: t("config.cheapMissing") };
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-task-tree-config",
				children: [value !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
					title: t("config.generation"),
					description: t("config.generationDescription"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingLine, {
						title: t("config.replaceTitle"),
						description: t("config.replaceTitleDescription"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
							checked: value.replaceTitle,
							label: t("config.replaceTitle"),
							disabled: locked,
							onChange: (next) => {
								setConfig("replaceTitle", next);
							}
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingLine, {
						title: t("config.mode"),
						description: cheap ? t("config.modeDescription") : t("config.cheapMissing"),
						stacked: true,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SegmentedControl, {
							id: `${id}-mode`,
							label: t("config.mode"),
							value: value.mode,
							disabled: locked,
							onChange: (next) => {
								setConfig("mode", next);
							},
							options: [
								{
									value: "fork",
									label: t("config.mode.fork")
								},
								{
									value: "fork-cheap",
									label: t("config.mode.forkCheap"),
									disabled: !cheap,
									...cheapHint
								},
								{
									value: "checkpoint",
									label: t("config.mode.checkpoint"),
									disabled: !cheap,
									...cheapHint
								}
							]
						})
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
					title: t("config.cheapModel"),
					description: t("config.cheapModelDescription"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingLine, {
						title: t("config.pickModel"),
						stacked: true,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheapModelPicker, {
							stored: value.cheapModel,
							catalog,
							disabled: locked,
							t,
							onSave: (next) => setConfig("cheapModel", next),
							onRetry: retryCatalog
						})
					}), locked && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-task-tree-config-section-description",
						children: t("config.readOnly")
					})]
				})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
					title: t("config.display"),
					description: t("config.displayDescription"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingLine, {
						title: t("config.position"),
						stacked: true,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SegmentedControl, {
							id: `${id}-display`,
							label: t("config.position"),
							value: display,
							onChange: setMode,
							options: [{
								value: "dock",
								label: t("config.position.dock")
							}, {
								value: "floating",
								label: t("config.position.floating")
							}]
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingLine, {
						title: t("config.follow"),
						description: t("config.followDescription"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
							checked: follow,
							label: t("config.follow"),
							onChange: setFollowScroll
						})
					})]
				})]
			});
		}
		//#endregion
		//#region src/client/definition.ts
		/** Chat renderer kind and Definition kind. */
		const CHANGE_KIND = "task-tree-change";
		/**
		* Read a result that the Chat row presents.
		* @param event - Client event envelope.
		* @returns row state, or undefined for unrelated events and reports without a visible change.
		*/
		function changeOf(event) {
			const result = readResult(event);
			if (result === void 0) return void 0;
			if (samePath(result.path, result.previousPath) && result.decisions.length === 0) return void 0;
			return {
				contextSeq: result.contextSeq,
				data: {
					id: result.id,
					seq: event.seq ?? result.contextSeq,
					path: result.path,
					previousPath: result.previousPath,
					detail: result.detail,
					decisions: result.decisions
				}
			};
		}
		/**
		* One row per report that changes the path or adds decisions. The row joins the
		* work-details run of the Step its record landed in (no `groupTree`) and sorts
		* just after the context the report describes.
		*/
		const taskChangeDefinition = {
			kind: CHANGE_KIND,
			target: "chat",
			match: (event) => {
				const change = changeOf(event);
				return change === void 0 ? null : {
					id: change.data.id,
					role: "start"
				};
			},
			start: (_context, match) => {
				const change = changeOf(match.event);
				/* v8 ignore next -- match() accepted this event, so it parses again */
				if (change === void 0) throw new Error("task-tree: invalid result record");
				return change;
			},
			update: (context) => context.state,
			buildViewNode: (context) => {
				const state = context.state;
				if (state === void 0) return null;
				return {
					key: context.key,
					kind: CHANGE_KIND,
					id: context.id,
					target: "chat",
					anchorSeq: state.contextSeq + .5,
					location: context.start?.location ?? context.matches[0]?.location ?? { kind: "unresolved" },
					visibility: "visible",
					data: state.data
				};
			}
		};
		//#endregion
		//#region src/client/locales.ts
		/** Chinese copy. */
		const zh = {
			panel: "事项",
			"change.title": "事项变更",
			"change.decisions": "新增决策 ({count})",
			"change.path": "事项路径",
			"decision.label": "决策",
			"decision.insert": "插入到输入框",
			"tree.label": "任务树",
			"tree.decisions": "{count} 条决策",
			"tree.status.done": "已完成",
			"tree.status.active": "进行中",
			"tree.status.current": "包含当前事项",
			"tree.status.pending": "尚未开始",
			"tree.jump": "跳转到此事项开始的位置",
			"tree.expand": "展开 {title}",
			"tree.collapse": "收起 {title}",
			"tree.snapshot": "截至此处",
			"tree.backToLatest": "回到最新",
			"dock.expand": "展开任务树",
			"dock.collapse": "收起任务树",
			"mode.toFloating": "改为右上角浮窗显示",
			"mode.toDock": "改为输入框上方显示",
			"float.show": "显示任务树",
			"float.hide": "隐藏任务树",
			"float.close": "关闭任务树",
			"page.title": "事项",
			"page.filter": "筛选",
			"page.all": "全部",
			"page.unread": "未读",
			"page.list": "会话事项",
			"page.loading": "正在加载事项",
			"page.error": "无法加载事项",
			"page.retry": "重试",
			"page.empty": "还没有会话生成事项",
			"page.emptyUnread": "没有未读的事项更新",
			"page.unreadMark": "有未读更新",
			"page.finished": "已全部完成",
			"page.inProgress": "进行中",
			"time.now": "刚刚",
			"time.minutes": "{n} 分钟前",
			"time.hours": "{n} 小时前",
			"time.days": "{n} 天前",
			"time.months": "{n} 个月前",
			"time.years": "{n} 年前",
			"config.generation": "事项生成",
			"config.generationDescription": "智能体工作时，在后台整理当前事项、进展和决策",
			"config.replaceTitle": "用最顶级事项作为会话标题",
			"config.replaceTitleDescription": "顶级事项变化时自动改写会话标题，手动改过的标题不会被覆盖",
			"config.mode": "进展生成方式",
			"config.modeDescription": "廉价模型更省费用，断点摘要可减少长会话的输入量",
			"config.mode.fork": "主模型",
			"config.mode.forkCheap": "廉价模型",
			"config.mode.checkpoint": "廉价模型 + 断点摘要",
			"config.cheapMissing": "在下方选择廉价模型后可用",
			"config.cheapModel": "廉价模型",
			"config.cheapModelDescription": "用于廉价模型模式的模型，从已配置的模型提供方中选择",
			"config.pickModel": "选择模型",
			"config.unset": "未设置",
			"config.clear": "清除",
			"config.effort": "推理强度",
			"config.effortDefault": "默认",
			"config.catalogLoading": "正在加载模型",
			"config.catalogError": "无法加载模型列表",
			"config.catalogPartial": "部分提供方的模型未能加载",
			"config.catalogEmpty": "没有可用的模型",
			"config.retry": "重试",
			"config.unavailableModel": "{provider} · {model}（不在当前模型列表中）",
			"config.saveFailed": "保存失败，请重试",
			"config.readOnly": "当前配置文件不可写入",
			"config.display": "显示",
			"config.displayDescription": "仅影响当前浏览器",
			"config.position": "任务树显示位置",
			"config.position.dock": "输入框上方",
			"config.position.floating": "右上角浮窗",
			"config.follow": "跟随对话位置",
			"config.followDescription": "向上翻看对话时，任务树回到当时的状态"
		};
		/** English copy in sentence case. */
		const en = {
			panel: "Tasks",
			"change.title": "Task changed",
			"change.decisions": "New decisions ({count})",
			"change.path": "Task path",
			"decision.label": "Decisions",
			"decision.insert": "Insert into the composer",
			"tree.label": "Task tree",
			"tree.decisions": "{count} decisions",
			"tree.status.done": "Done",
			"tree.status.active": "In progress",
			"tree.status.current": "Contains the current task",
			"tree.status.pending": "Not started",
			"tree.jump": "Jump to where this task started",
			"tree.expand": "Expand {title}",
			"tree.collapse": "Collapse {title}",
			"tree.snapshot": "As of here",
			"tree.backToLatest": "Back to latest",
			"dock.expand": "Expand task tree",
			"dock.collapse": "Collapse task tree",
			"mode.toFloating": "Show as a floating card",
			"mode.toDock": "Show above the composer",
			"float.show": "Show task tree",
			"float.hide": "Hide task tree",
			"float.close": "Close task tree",
			"page.title": "Tasks",
			"page.filter": "Filter",
			"page.all": "All",
			"page.unread": "Unread",
			"page.list": "Session tasks",
			"page.loading": "Loading tasks",
			"page.error": "Could not load tasks",
			"page.retry": "Retry",
			"page.empty": "No session has produced tasks yet",
			"page.emptyUnread": "No unread task updates",
			"page.unreadMark": "Has unread updates",
			"page.finished": "All done",
			"page.inProgress": "In progress",
			"time.now": "Just now",
			"time.minutes": "{n}m ago",
			"time.hours": "{n}h ago",
			"time.days": "{n}d ago",
			"time.months": "{n}mo ago",
			"time.years": "{n}y ago",
			"config.generation": "Task generation",
			"config.generationDescription": "While an agent works, keep its current task, progress, and decisions in the background",
			"config.replaceTitle": "Use the top-level task as the session title",
			"config.replaceTitleDescription": "Renames the session when the top-level task changes; titles you edited stay",
			"config.mode": "Progress generation",
			"config.modeDescription": "A cheap model costs less; checkpoints shrink the input of long sessions",
			"config.mode.fork": "Main model",
			"config.mode.forkCheap": "Cheap model",
			"config.mode.checkpoint": "Cheap model with checkpoints",
			"config.cheapMissing": "Choose a cheap model below to use these",
			"config.cheapModel": "Cheap model",
			"config.cheapModelDescription": "Model used by the cheap modes, chosen from the configured providers",
			"config.pickModel": "Choose model",
			"config.unset": "Not set",
			"config.clear": "Clear",
			"config.effort": "Reasoning effort",
			"config.effortDefault": "Default",
			"config.catalogLoading": "Loading models",
			"config.catalogError": "Could not load the model list",
			"config.catalogPartial": "Some providers could not list their models",
			"config.catalogEmpty": "No models are available",
			"config.retry": "Retry",
			"config.unavailableModel": "{provider} · {model} (not in the current model list)",
			"config.saveFailed": "Could not save. Try again.",
			"config.readOnly": "The configuration file is read-only",
			"config.display": "Display",
			"config.displayDescription": "Applies to this browser only",
			"config.position": "Task tree position",
			"config.position.dock": "Above the composer",
			"config.position.floating": "Floating card",
			"config.follow": "Follow the conversation position",
			"config.followDescription": "Scrolling back shows the tree as it was at that point"
		};
		/** Locale namespace registered by this plugin. */
		const NS = "taskTree";
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.31_immer@10.2.0_react@18.3.1/node_modules/zustand/esm/vanilla.mjs
		const createStoreImpl = (createState) => {
			let state;
			const listeners = /* @__PURE__ */ new Set();
			const setState = (partial, replace) => {
				const nextState = typeof partial === "function" ? partial(state) : partial;
				if (!Object.is(nextState, state)) {
					const previousState = state;
					state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
					listeners.forEach((listener) => listener(state, previousState));
				}
			};
			const getState = () => state;
			const getInitialState = () => initialState;
			const subscribe = (listener) => {
				listeners.add(listener);
				return () => listeners.delete(listener);
			};
			const destroy = () => {
				listeners.clear();
			};
			const api = {
				setState,
				getState,
				getInitialState,
				subscribe,
				destroy
			};
			const initialState = state = createState(setState, getState, api);
			return api;
		};
		const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.31_immer@10.2.0_react@18.3.1/node_modules/zustand/esm/middleware.mjs
		const subscribeWithSelectorImpl = (fn) => (set, get, api) => {
			const origSubscribe = api.subscribe;
			api.subscribe = (selector, optListener, options) => {
				let listener = selector;
				if (optListener) {
					const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
					let currentSlice = selector(api.getState());
					listener = (state) => {
						const nextSlice = selector(state);
						if (!equalityFn(currentSlice, nextSlice)) {
							const previousSlice = currentSlice;
							optListener(currentSlice = nextSlice, previousSlice);
						}
					};
					if (options == null ? void 0 : options.fireImmediately) optListener(currentSlice, currentSlice);
				}
				return origSubscribe(listener);
			};
			return fn(set, get, api);
		};
		const subscribeWithSelector = subscribeWithSelectorImpl;
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/immer@10.2.0/node_modules/immer/dist/immer.mjs
		var NOTHING = Symbol.for("immer-nothing");
		var DRAFTABLE = Symbol.for("immer-draftable");
		var DRAFT_STATE = Symbol.for("immer-state");
		function die(error, ...args) {
			throw new Error(`[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`);
		}
		var getPrototypeOf = Object.getPrototypeOf;
		function isDraft(value) {
			return !!value && !!value[DRAFT_STATE];
		}
		function isDraftable(value) {
			if (!value) return false;
			return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
		}
		var objectCtorString = Object.prototype.constructor.toString();
		var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
		function isPlainObject(value) {
			if (!value || typeof value !== "object") return false;
			const proto = Object.getPrototypeOf(value);
			if (proto === null || proto === Object.prototype) return true;
			const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
			if (Ctor === Object) return true;
			if (typeof Ctor !== "function") return false;
			let ctorString = cachedCtorStrings.get(Ctor);
			if (ctorString === void 0) {
				ctorString = Function.toString.call(Ctor);
				cachedCtorStrings.set(Ctor, ctorString);
			}
			return ctorString === objectCtorString;
		}
		function each(obj, iter, strict = true) {
			if (getArchtype(obj) === 0) (strict ? Reflect.ownKeys(obj) : Object.keys(obj)).forEach((key) => {
				iter(key, obj[key], obj);
			});
			else obj.forEach((entry, index) => iter(index, entry, obj));
		}
		function getArchtype(thing) {
			const state = thing[DRAFT_STATE];
			return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
		}
		function has(thing, prop) {
			return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
		}
		function set(thing, propOrOldValue, value) {
			const t = getArchtype(thing);
			if (t === 2) thing.set(propOrOldValue, value);
			else if (t === 3) thing.add(value);
			else thing[propOrOldValue] = value;
		}
		function is(x, y) {
			if (x === y) return x !== 0 || 1 / x === 1 / y;
			else return x !== x && y !== y;
		}
		function isMap(target) {
			return target instanceof Map;
		}
		function isSet(target) {
			return target instanceof Set;
		}
		function latest(state) {
			return state.copy_ || state.base_;
		}
		function shallowCopy(base, strict) {
			if (isMap(base)) return new Map(base);
			if (isSet(base)) return new Set(base);
			if (Array.isArray(base)) return Array.prototype.slice.call(base);
			const isPlain = isPlainObject(base);
			if (strict === true || strict === "class_only" && !isPlain) {
				const descriptors = Object.getOwnPropertyDescriptors(base);
				delete descriptors[DRAFT_STATE];
				let keys = Reflect.ownKeys(descriptors);
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					const desc = descriptors[key];
					if (desc.writable === false) {
						desc.writable = true;
						desc.configurable = true;
					}
					if (desc.get || desc.set) descriptors[key] = {
						configurable: true,
						writable: true,
						enumerable: desc.enumerable,
						value: base[key]
					};
				}
				return Object.create(getPrototypeOf(base), descriptors);
			} else {
				const proto = getPrototypeOf(base);
				if (proto !== null && isPlain) return { ...base };
				const obj = Object.create(proto);
				return Object.assign(obj, base);
			}
		}
		function freeze(obj, deep = false) {
			if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) return obj;
			if (getArchtype(obj) > 1) Object.defineProperties(obj, {
				set: dontMutateMethodOverride,
				add: dontMutateMethodOverride,
				clear: dontMutateMethodOverride,
				delete: dontMutateMethodOverride
			});
			Object.freeze(obj);
			if (deep) Object.values(obj).forEach((value) => freeze(value, true));
			return obj;
		}
		function dontMutateFrozenCollections() {
			die(2);
		}
		var dontMutateMethodOverride = { value: dontMutateFrozenCollections };
		function isFrozen(obj) {
			if (obj === null || typeof obj !== "object") return true;
			return Object.isFrozen(obj);
		}
		var plugins = {};
		function getPlugin(pluginKey) {
			const plugin = plugins[pluginKey];
			if (!plugin) die(0, pluginKey);
			return plugin;
		}
		var currentScope;
		function getCurrentScope() {
			return currentScope;
		}
		function createScope(parent_, immer_) {
			return {
				drafts_: [],
				parent_,
				immer_,
				canAutoFreeze_: true,
				unfinalizedDrafts_: 0
			};
		}
		function usePatchesInScope(scope, patchListener) {
			if (patchListener) {
				getPlugin("Patches");
				scope.patches_ = [];
				scope.inversePatches_ = [];
				scope.patchListener_ = patchListener;
			}
		}
		function revokeScope(scope) {
			leaveScope(scope);
			scope.drafts_.forEach(revokeDraft);
			scope.drafts_ = null;
		}
		function leaveScope(scope) {
			if (scope === currentScope) currentScope = scope.parent_;
		}
		function enterScope(immer2) {
			return currentScope = createScope(currentScope, immer2);
		}
		function revokeDraft(draft) {
			const state = draft[DRAFT_STATE];
			if (state.type_ === 0 || state.type_ === 1) state.revoke_();
			else state.revoked_ = true;
		}
		function processResult(result, scope) {
			scope.unfinalizedDrafts_ = scope.drafts_.length;
			const baseDraft = scope.drafts_[0];
			if (result !== void 0 && result !== baseDraft) {
				if (baseDraft[DRAFT_STATE].modified_) {
					revokeScope(scope);
					die(4);
				}
				if (isDraftable(result)) {
					result = finalize(scope, result);
					if (!scope.parent_) maybeFreeze(scope, result);
				}
				if (scope.patches_) getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope.patches_, scope.inversePatches_);
			} else result = finalize(scope, baseDraft, []);
			revokeScope(scope);
			if (scope.patches_) scope.patchListener_(scope.patches_, scope.inversePatches_);
			return result !== NOTHING ? result : void 0;
		}
		function finalize(rootScope, value, path) {
			if (isFrozen(value)) return value;
			const useStrictIteration = rootScope.immer_.shouldUseStrictIteration();
			const state = value[DRAFT_STATE];
			if (!state) {
				each(value, (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path), useStrictIteration);
				return value;
			}
			if (state.scope_ !== rootScope) return value;
			if (!state.modified_) {
				maybeFreeze(rootScope, state.base_, true);
				return state.base_;
			}
			if (!state.finalized_) {
				state.finalized_ = true;
				state.scope_.unfinalizedDrafts_--;
				const result = state.copy_;
				let resultEach = result;
				let isSet2 = false;
				if (state.type_ === 3) {
					resultEach = new Set(result);
					result.clear();
					isSet2 = true;
				}
				each(resultEach, (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2), useStrictIteration);
				maybeFreeze(rootScope, result, false);
				if (path && rootScope.patches_) getPlugin("Patches").generatePatches_(state, path, rootScope.patches_, rootScope.inversePatches_);
			}
			return state.copy_;
		}
		function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
			if (childValue == null) return;
			if (typeof childValue !== "object" && !targetIsSet) return;
			const childIsFrozen = isFrozen(childValue);
			if (childIsFrozen && !targetIsSet) return;
			if (isDraft(childValue)) {
				const res = finalize(rootScope, childValue, rootPath && parentState && parentState.type_ !== 3 && !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0);
				set(targetObject, prop, res);
				if (isDraft(res)) rootScope.canAutoFreeze_ = false;
				else return;
			} else if (targetIsSet) targetObject.add(childValue);
			if (isDraftable(childValue) && !childIsFrozen) {
				if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) return;
				if (parentState && parentState.base_ && parentState.base_[prop] === childValue && childIsFrozen) return;
				finalize(rootScope, childValue);
				if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && (isMap(targetObject) ? targetObject.has(prop) : Object.prototype.propertyIsEnumerable.call(targetObject, prop))) maybeFreeze(rootScope, childValue);
			}
		}
		function maybeFreeze(scope, value, deep = false) {
			if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) freeze(value, deep);
		}
		function createProxyProxy(base, parent) {
			const isArray = Array.isArray(base);
			const state = {
				type_: isArray ? 1 : 0,
				scope_: parent ? parent.scope_ : getCurrentScope(),
				modified_: false,
				finalized_: false,
				assigned_: {},
				parent_: parent,
				base_: base,
				draft_: null,
				copy_: null,
				revoke_: null,
				isManual_: false
			};
			let target = state;
			let traps = objectTraps;
			if (isArray) {
				target = [state];
				traps = arrayTraps;
			}
			const { revoke, proxy } = Proxy.revocable(target, traps);
			state.draft_ = proxy;
			state.revoke_ = revoke;
			return proxy;
		}
		var objectTraps = {
			get(state, prop) {
				if (prop === DRAFT_STATE) return state;
				const source = latest(state);
				if (!has(source, prop)) return readPropFromProto(state, source, prop);
				const value = source[prop];
				if (state.finalized_ || !isDraftable(value)) return value;
				if (value === peek(state.base_, prop)) {
					prepareCopy(state);
					return state.copy_[prop] = createProxy(value, state);
				}
				return value;
			},
			has(state, prop) {
				return prop in latest(state);
			},
			ownKeys(state) {
				return Reflect.ownKeys(latest(state));
			},
			set(state, prop, value) {
				const desc = getDescriptorFromProto(latest(state), prop);
				if (desc?.set) {
					desc.set.call(state.draft_, value);
					return true;
				}
				if (!state.modified_) {
					const current2 = peek(latest(state), prop);
					const currentState = current2?.[DRAFT_STATE];
					if (currentState && currentState.base_ === value) {
						state.copy_[prop] = value;
						state.assigned_[prop] = false;
						return true;
					}
					if (is(value, current2) && (value !== void 0 || has(state.base_, prop))) return true;
					prepareCopy(state);
					markChanged(state);
				}
				if (state.copy_[prop] === value && (value !== void 0 || prop in state.copy_) || Number.isNaN(value) && Number.isNaN(state.copy_[prop])) return true;
				state.copy_[prop] = value;
				state.assigned_[prop] = true;
				return true;
			},
			deleteProperty(state, prop) {
				if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
					state.assigned_[prop] = false;
					prepareCopy(state);
					markChanged(state);
				} else delete state.assigned_[prop];
				if (state.copy_) delete state.copy_[prop];
				return true;
			},
			getOwnPropertyDescriptor(state, prop) {
				const owner = latest(state);
				const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
				if (!desc) return desc;
				return {
					writable: true,
					configurable: state.type_ !== 1 || prop !== "length",
					enumerable: desc.enumerable,
					value: owner[prop]
				};
			},
			defineProperty() {
				die(11);
			},
			getPrototypeOf(state) {
				return getPrototypeOf(state.base_);
			},
			setPrototypeOf() {
				die(12);
			}
		};
		var arrayTraps = {};
		each(objectTraps, (key, fn) => {
			arrayTraps[key] = function() {
				arguments[0] = arguments[0][0];
				return fn.apply(this, arguments);
			};
		});
		arrayTraps.deleteProperty = function(state, prop) {
			return arrayTraps.set.call(this, state, prop, void 0);
		};
		arrayTraps.set = function(state, prop, value) {
			return objectTraps.set.call(this, state[0], prop, value, state[0]);
		};
		function peek(draft, prop) {
			const state = draft[DRAFT_STATE];
			return (state ? latest(state) : draft)[prop];
		}
		function readPropFromProto(state, source, prop) {
			const desc = getDescriptorFromProto(source, prop);
			return desc ? `value` in desc ? desc.value : desc.get?.call(state.draft_) : void 0;
		}
		function getDescriptorFromProto(source, prop) {
			if (!(prop in source)) return void 0;
			let proto = getPrototypeOf(source);
			while (proto) {
				const desc = Object.getOwnPropertyDescriptor(proto, prop);
				if (desc) return desc;
				proto = getPrototypeOf(proto);
			}
		}
		function markChanged(state) {
			if (!state.modified_) {
				state.modified_ = true;
				if (state.parent_) markChanged(state.parent_);
			}
		}
		function prepareCopy(state) {
			if (!state.copy_) state.copy_ = shallowCopy(state.base_, state.scope_.immer_.useStrictShallowCopy_);
		}
		var Immer2 = class {
			constructor(config) {
				this.autoFreeze_ = true;
				this.useStrictShallowCopy_ = false;
				this.useStrictIteration_ = true;
				/**
				* The `produce` function takes a value and a "recipe function" (whose
				* return value often depends on the base state). The recipe function is
				* free to mutate its first argument however it wants. All mutations are
				* only ever applied to a __copy__ of the base state.
				*
				* Pass only a function to create a "curried producer" which relieves you
				* from passing the recipe function every time.
				*
				* Only plain objects and arrays are made mutable. All other objects are
				* considered uncopyable.
				*
				* Note: This function is __bound__ to its `Immer` instance.
				*
				* @param {any} base - the initial state
				* @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
				* @param {Function} patchListener - optional function that will be called with all the patches produced here
				* @returns {any} a new state, or the initial state if nothing was modified
				*/
				this.produce = (base, recipe, patchListener) => {
					if (typeof base === "function" && typeof recipe !== "function") {
						const defaultBase = recipe;
						recipe = base;
						const self = this;
						return function curriedProduce(base2 = defaultBase, ...args) {
							return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
						};
					}
					if (typeof recipe !== "function") die(6);
					if (patchListener !== void 0 && typeof patchListener !== "function") die(7);
					let result;
					if (isDraftable(base)) {
						const scope = enterScope(this);
						const proxy = createProxy(base, void 0);
						let hasError = true;
						try {
							result = recipe(proxy);
							hasError = false;
						} finally {
							if (hasError) revokeScope(scope);
							else leaveScope(scope);
						}
						usePatchesInScope(scope, patchListener);
						return processResult(result, scope);
					} else if (!base || typeof base !== "object") {
						result = recipe(base);
						if (result === void 0) result = base;
						if (result === NOTHING) result = void 0;
						if (this.autoFreeze_) freeze(result, true);
						if (patchListener) {
							const p = [];
							const ip = [];
							getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
							patchListener(p, ip);
						}
						return result;
					} else die(1, base);
				};
				this.produceWithPatches = (base, recipe) => {
					if (typeof base === "function") return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
					let patches, inversePatches;
					return [
						this.produce(base, recipe, (p, ip) => {
							patches = p;
							inversePatches = ip;
						}),
						patches,
						inversePatches
					];
				};
				if (typeof config?.autoFreeze === "boolean") this.setAutoFreeze(config.autoFreeze);
				if (typeof config?.useStrictShallowCopy === "boolean") this.setUseStrictShallowCopy(config.useStrictShallowCopy);
				if (typeof config?.useStrictIteration === "boolean") this.setUseStrictIteration(config.useStrictIteration);
			}
			createDraft(base) {
				if (!isDraftable(base)) die(8);
				if (isDraft(base)) base = current(base);
				const scope = enterScope(this);
				const proxy = createProxy(base, void 0);
				proxy[DRAFT_STATE].isManual_ = true;
				leaveScope(scope);
				return proxy;
			}
			finishDraft(draft, patchListener) {
				const state = draft && draft[DRAFT_STATE];
				if (!state || !state.isManual_) die(9);
				const { scope_: scope } = state;
				usePatchesInScope(scope, patchListener);
				return processResult(void 0, scope);
			}
			/**
			* Pass true to automatically freeze all copies created by Immer.
			*
			* By default, auto-freezing is enabled.
			*/
			setAutoFreeze(value) {
				this.autoFreeze_ = value;
			}
			/**
			* Pass true to enable strict shallow copy.
			*
			* By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
			*/
			setUseStrictShallowCopy(value) {
				this.useStrictShallowCopy_ = value;
			}
			/**
			* Pass false to use faster iteration that skips non-enumerable properties
			* but still handles symbols for compatibility.
			*
			* By default, strict iteration is enabled (includes all own properties).
			*/
			setUseStrictIteration(value) {
				this.useStrictIteration_ = value;
			}
			shouldUseStrictIteration() {
				return this.useStrictIteration_;
			}
			applyPatches(base, patches) {
				let i;
				for (i = patches.length - 1; i >= 0; i--) {
					const patch = patches[i];
					if (patch.path.length === 0 && patch.op === "replace") {
						base = patch.value;
						break;
					}
				}
				if (i > -1) patches = patches.slice(i + 1);
				const applyPatchesImpl = getPlugin("Patches").applyPatches_;
				if (isDraft(base)) return applyPatchesImpl(base, patches);
				return this.produce(base, (draft) => applyPatchesImpl(draft, patches));
			}
		};
		function createProxy(value, parent) {
			const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
			(parent ? parent.scope_ : getCurrentScope()).drafts_.push(draft);
			return draft;
		}
		function current(value) {
			if (!isDraft(value)) die(10, value);
			return currentImpl(value);
		}
		function currentImpl(value) {
			if (!isDraftable(value) || isFrozen(value)) return value;
			const state = value[DRAFT_STATE];
			let copy;
			let strict = true;
			if (state) {
				if (!state.modified_) return state.base_;
				state.finalized_ = true;
				copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
				strict = state.scope_.immer_.shouldUseStrictIteration();
			} else copy = shallowCopy(value, true);
			each(copy, (key, childValue) => {
				set(copy, key, currentImpl(childValue));
			}, strict);
			if (state) state.finalized_ = false;
			return copy;
		}
		var produce = new Immer2().produce;
		//#endregion
		//#region ../deepseek-harness/packages/client/store/lib/index.js
		/**
		* React-free snapshot store engine (zustand vanilla + immer + subscribeWithSelector +
		* rafFlush middleware + opt-in persist + dev freeze) plus the declarative
		* shell over it: {@link defineStore} bakes an init/persist/actions literal
		* into a {@link StoreHandle}, the registration-side store seat of slot
		* terminals. Engine products are bare observables — subscribe/getSnapshot/
		* update/set, NO selector hook. Hook synthesis is ui-renderer's (the one
		* uSES bridge, cached per source at the binding site).
		*/
		/**
		* Notify an observer set without allowing one callback to starve the rest.
		* @param listeners - current observer callbacks; copied before dispatch.
		* @param label - diagnostic owner prefix.
		* @param args - callback arguments.
		*/
		function notifySubscribers(listeners, label, ...args) {
			for (const listener of [...listeners]) try {
				listener(...args);
			} catch (error) {
				console.error(`${label} subscriber failed:`, error);
			}
		}
		/** Batches subscriber notification into one flush per animation frame. */
		function rafBatch(notify) {
			const schedule = typeof requestAnimationFrame === "function" ? (fn) => {
				requestAnimationFrame(() => {
					fn();
				});
			} : (fn) => {
				queueMicrotask(fn);
			};
			let scheduled = false;
			return () => {
				if (scheduled) return;
				scheduled = true;
				schedule(() => {
					scheduled = false;
					notify();
				});
			};
		}
		/**
		* Create a snapshot store.
		*
		* Flush default is 'sync' (controlled inputs need same-tick echo); frame-driven
		* stores opt into 'raf', where a frame's worth of updates coalesces into one
		* notification. Known raf-mode tradeoff: a component mounting mid-frame reads
		* fresh state while existing subscribers hear it next flush — transient
		* frame-level skew, same nature as the object layer's microtask batching.
		*
		* @param init - initial state.
		* @param opts - flush mode and opt-in persistence (localStorage, keyed by name).
		* @returns the store.
		*/
		function createSnapshotStore(init, opts) {
			const withSelector = subscribeWithSelector(() => init);
			const api = createStore()(withSelector);
			if (opts?.persist) attachPersistence(api, opts.persist.name);
			let subscribe = (fn) => api.subscribe(() => {
				notifySubscribers([fn], "[client-store]");
			});
			if (opts?.flush === "raf") {
				const listeners = /* @__PURE__ */ new Set();
				const flush = rafBatch(() => {
					notifySubscribers(listeners, "[client-store]");
				});
				api.subscribe(flush);
				subscribe = (fn) => {
					listeners.add(fn);
					return () => {
						listeners.delete(fn);
					};
				};
			}
			return {
				getSnapshot: () => api.getState(),
				subscribe: (fn) => subscribe(fn),
				update: (mutator) => {
					api.setState(produce(api.getState(), (draft) => {
						mutator(draft);
					}), true);
				},
				set: (next) => {
					api.setState(devFreeze(next), true);
				}
			};
		}
		/**
		* Whole-value JSON persistence to localStorage. Hand-rolled instead of the
		* zustand persist middleware: its write path spreads state into an object
		* (`partialize({ ...get() })`), exploding primitive state (a persisted string
		* draft becomes {0:'h',1:'e',...}) — not fixable via merge/deserialize options
		* because the corruption happens before serialization. Storage failures
		* (quota, private mode) only disable persistence, never break the store.
		*/
		function attachPersistence(api, name) {
			if (typeof localStorage === "undefined") return;
			try {
				const raw = localStorage.getItem(name);
				if (raw !== null) api.setState(devFreeze(JSON.parse(raw)), true);
			} catch (error) {
				console.error(`snapshot store '${name}' rehydration failed:`, error);
			}
			api.subscribe((state) => {
				try {
					localStorage.setItem(name, JSON.stringify(state));
				} catch (error) {
					console.error(`snapshot store '${name}' persistence failed:`, error);
				}
			});
		}
		/** Deep-freeze draftable wholesale-set state outside production: set() bypasses immer's freeze. */
		function devFreeze(value) {
			return freeze(value, true);
		}
		//#endregion
		//#region src/client/stores.ts
		/**
		* Client-owned state: the persisted view preference, the persisted seen
		* watermarks, and the polled cross-session task list. Each factory is called
		* once inside `apply`; nothing here is a module-level instance.
		*/
		const DEFAULT_VIEW = {
			mode: "dock",
			dockExpanded: false,
			floatOpen: true,
			followScroll: true
		};
		const viewSchema = object({
			mode: _enum(["dock", "floating"]).catch(DEFAULT_VIEW.mode),
			dockExpanded: boolean().catch(DEFAULT_VIEW.dockExpanded),
			floatOpen: boolean().catch(DEFAULT_VIEW.floatOpen),
			followScroll: boolean().catch(DEFAULT_VIEW.followScroll)
		}).catch(DEFAULT_VIEW);
		/**
		* Create the persisted view preference.
		* @param name - localStorage key; tests pass a unique one.
		* @returns the store.
		*/
		function createViewStore(name = "dsh-task-tree.view.v1") {
			const store = createSnapshotStore(DEFAULT_VIEW, { persist: { name } });
			const stored = store.getSnapshot();
			const valid = viewSchema.parse(stored);
			if (JSON.stringify(valid) !== JSON.stringify(stored)) store.set(valid);
			const patch = (next) => {
				store.set({
					...store.getSnapshot(),
					...next
				});
			};
			return {
				getSnapshot: store.getSnapshot,
				subscribe: store.subscribe,
				setMode: (mode) => {
					patch({ mode });
				},
				setDockExpanded: (dockExpanded) => {
					patch({ dockExpanded });
				},
				setFloatOpen: (floatOpen) => {
					patch({ floatOpen });
				},
				setFollowScroll: (followScroll) => {
					patch({ followScroll });
				}
			};
		}
		const seenSchema = record(string(), number().int());
		/**
		* Create the persisted seen watermarks.
		* @param name - localStorage key; tests pass a unique one.
		* @returns the store.
		*/
		function createSeenStore(name = "dsh-task-tree.seen.v1") {
			const store = createSnapshotStore({}, { persist: { name } });
			if (!seenSchema.safeParse(store.getSnapshot()).success) store.set({});
			return {
				getSnapshot: store.getSnapshot,
				subscribe: store.subscribe,
				markSeen: (sessionId, seq) => {
					const current = store.getSnapshot();
					if ((current[sessionId] ?? -1) >= seq) return;
					store.set({
						...current,
						[sessionId]: seq
					});
				},
				prune: (keep) => {
					const current = store.getSnapshot();
					const entries = Object.entries(current).filter(([id]) => keep.has(id));
					if (entries.length !== Object.keys(current).length) store.set(Object.fromEntries(entries));
				}
			};
		}
		/**
		* Whether a list row has a report newer than the user's watermark.
		* @param row - list row.
		* @param seen - watermarks.
		* @returns true when unread.
		*/
		function isUnread(row, seen) {
			return row.lastRecordSeq > (seen[row.sessionId] ?? -1);
		}
		/** Fallback poll interval before the first successful response states one. */
		const INITIAL_POLL_MS = 15e3;
		/**
		* Create the list source.
		* @param options.call - performs the list RPC and returns its raw value, or throws.
		* @param options.onRows - receives every accepted row set (used to prune watermarks).
		* @returns the source.
		*/
		function createTaskListSource(options) {
			let snapshot = {
				status: "loading",
				rows: []
			};
			const listeners = /* @__PURE__ */ new Set();
			let interval = INITIAL_POLL_MS;
			let timer;
			let inflight;
			const publish = (next) => {
				snapshot = next;
				for (const listener of [...listeners]) listener();
			};
			const schedule = () => {
				if (timer !== void 0) clearTimeout(timer);
				timer = void 0;
				if (listeners.size === 0) return;
				timer = setTimeout(() => {
					timer = void 0;
					if (document.visibilityState === "visible") refresh();
					else schedule();
				}, interval);
			};
			const read = async () => {
				try {
					const parsed = listResponseSchema.safeParse(await options.call());
					if (!parsed.success) throw parsed.error;
					interval = parsed.data.pollIntervalMs;
					options.onRows?.(parsed.data.rows);
					publish({
						status: "ready",
						rows: parsed.data.rows
					});
				} catch {
					publish({
						status: "error",
						rows: snapshot.rows
					});
				}
			};
			const refresh = () => {
				inflight ??= read().finally(() => {
					inflight = void 0;
					schedule();
				});
				return inflight;
			};
			const onVisible = () => {
				if (document.visibilityState === "visible") refresh();
			};
			return {
				getSnapshot: () => snapshot,
				subscribe: (listener) => {
					listeners.add(listener);
					if (listeners.size === 1) {
						window.addEventListener("focus", onVisible);
						document.addEventListener("visibilitychange", onVisible);
						refresh();
					}
					return () => {
						if (!listeners.delete(listener) || listeners.size > 0) return;
						window.removeEventListener("focus", onVisible);
						document.removeEventListener("visibilitychange", onVisible);
						if (timer !== void 0) clearTimeout(timer);
						timer = void 0;
					};
				},
				refresh
			};
		}
		/**
		* Create the catalog source.
		* @param load - reads the Host model catalog.
		* @returns the source.
		*/
		function createModelCatalogSource(load) {
			let snapshot = {
				status: "idle",
				groups: [],
				partial: false
			};
			let generation = 0;
			const listeners = /* @__PURE__ */ new Set();
			const publish = (next) => {
				snapshot = next;
				for (const listener of [...listeners]) listener();
			};
			const read = () => {
				const current = ++generation;
				publish({
					...snapshot,
					status: "loading"
				});
				load().then((result) => {
					if (current !== generation) return;
					publish(result.ok ? {
						status: "ready",
						groups: result.value.groups,
						partial: result.value.failures.length > 0
					} : {
						status: "error",
						groups: snapshot.groups,
						partial: false
					});
				}, () => {
					if (current === generation) publish({
						status: "error",
						groups: snapshot.groups,
						partial: false
					});
				});
			};
			return {
				getSnapshot: () => snapshot,
				subscribe: (listener) => {
					listeners.add(listener);
					if (snapshot.status === "idle") read();
					return () => {
						listeners.delete(listener);
					};
				},
				refresh: () => {
					if (snapshot.status === "idle" && listeners.size === 0) return;
					read();
				},
				reset: () => {
					generation++;
					snapshot = {
						status: "idle",
						groups: [],
						partial: false
					};
					if (listeners.size > 0) read();
				}
			};
		}
		//#endregion
		//#region src/client/styles.ts
		/**
		* Stylesheet injected once per plugin activation. The dynamic Client bundle
		* carries no CSS Modules, so every class is prefixed `dsh-task-tree-` and only
		* theme tokens supply color, radius, elevation, and motion.
		*/
		const styles = `
/* ---------- shared row glyphs ---------- */
.dsh-task-tree-glyph { position:relative; flex:none; display:grid; place-items:center; width:16px; height:20px; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-glyph > * { grid-area:1 / 1; }
.dsh-task-tree-check { overflow:visible; }
.dsh-task-tree-check-ring { fill:none; stroke:var(--dsw-alias-state-business-primary); stroke-width:1.2; opacity:.4; }
.dsh-task-tree-check-path { fill:none; stroke:var(--dsw-alias-state-business-primary); stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:1; stroke-dashoffset:0; animation:dsh-task-tree-draw var(--ds-transition-duration-slow, 320ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-active-dot { width:8px; height:8px; border-radius:50%; background:var(--dsw-alias-label-secondary); }
.dsh-task-tree-step-dot { box-sizing:border-box; width:9px; height:9px; border-radius:50%; border:1.5px solid var(--dsw-alias-label-tertiary); }
.dsh-task-tree-pending-dot { box-sizing:border-box; width:10px; height:10px; border-radius:50%; border:1.2px dashed var(--dsw-alias-label-caption); }
.dsh-task-tree-glyph-status, .dsh-task-tree-glyph-chevron { display:grid; place-items:center;
  transition:opacity var(--ds-transition-duration-fast, 150ms) var(--ds-ease-in-out, ease), transform var(--ds-transition-duration-fast, 150ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-glyph-chevron { opacity:0; transform:scale(.8); color:var(--dsw-alias-label-secondary); }
.dsh-task-tree-item[data-expanded] .dsh-task-tree-glyph-status,
.dsh-task-tree-item[data-partial] .dsh-task-tree-glyph-status { opacity:0; transform:scale(.8); }
.dsh-task-tree-item[data-expanded] .dsh-task-tree-glyph-chevron,
.dsh-task-tree-item[data-partial] .dsh-task-tree-glyph-chevron { opacity:1; transform:none; }
@keyframes dsh-task-tree-draw { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }

/* ---------- tree rows ---------- */
.dsh-task-tree-rows-frame { position:relative; }
.dsh-task-tree-rows { display:flex; flex-direction:column; gap:2px; }
.dsh-task-tree-row { --dsh-task-tree-indent:calc(var(--dsh-task-tree-depth, 0) * 16px); min-width:0; padding-inline-start:var(--dsh-task-tree-indent); }
.dsh-task-tree-line { display:flex; align-items:center; gap:4px; min-width:0; }
.dsh-task-tree-item { display:flex; flex:1 1 auto; align-items:center; gap:8px; min-width:0; padding:2px 6px; border:0; border-radius:var(--dsw-radius-sm);
  background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:13px; line-height:20px; text-align:left; cursor:pointer;
  transition:background-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-item:focus-visible, .dsh-task-tree-badge:focus-visible, .dsh-task-tree-decision:focus-visible {
  outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:-2px; }
.dsh-task-tree-row[data-status="done"] .dsh-task-tree-title { color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-row[data-status="pending"] .dsh-task-tree-title { color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-row[data-status="active"] .dsh-task-tree-title { color:var(--dsw-alias-label-primary); font-weight:500; }
.dsh-task-tree-title { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-badge { flex:none; min-width:20px; height:18px; padding:0 6px; border:0; border-radius:9px; background:var(--dsw-alias-bg-layer-2);
  color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; line-height:18px; cursor:pointer; }
.dsh-task-tree-badge[aria-expanded="true"] { background:var(--dsw-alias-interactive-bg-active); color:var(--dsw-alias-label-primary); }
.dsh-task-tree-detail { margin:0; padding:0 6px 2px 30px; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:18px; overflow-wrap:anywhere;
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-row-decisions { padding:2px 6px 4px 30px; }
@keyframes dsh-task-tree-fade { from { opacity:0; } to { opacity:1; } }
@keyframes dsh-task-tree-slide { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }
@media (hover: hover) {
  .dsh-task-tree-item:hover, .dsh-task-tree-badge:hover { background:var(--dsw-alias-interactive-bg-hover); }
  .dsh-task-tree-item[data-expandable]:hover .dsh-task-tree-glyph-status { opacity:0; transform:scale(.8); }
  .dsh-task-tree-item[data-expandable]:hover .dsh-task-tree-glyph-chevron { opacity:1; transform:none; }
}

/* ---------- latest-level scroll viewport ---------- */
/* Bottom-anchored: a taller group reveals older rows at its top while the newest rows stay put. */
/* No overscroll-behavior here: while the group is only a clipped window (its scroll range is zero)
   a contained group drops the wheel instead of chaining it to the card body, and a group grown to
   the whole card height would leave the card unscrollable. The card body keeps the containment, so
   the wheel still stops there instead of scrolling the transcript. */
.dsh-task-tree-scroll-group { --dsh-task-tree-fade:22px; position:relative; display:flex; flex-direction:column; justify-content:flex-end;
  overflow:hidden; }
.dsh-task-tree-scroll-group[data-scrollable] { display:block; overflow-y:auto; scrollbar-width:thin; --dsh-scrollbar-width:6px;
  --dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2); }
.dsh-task-tree-scroll-group[data-faded] {
  -webkit-mask-image:linear-gradient(to bottom, transparent, black var(--dsh-task-tree-fade));
  mask-image:linear-gradient(to bottom, transparent, black var(--dsh-task-tree-fade)); }
.dsh-task-tree-scroll-group-content { position:relative; flex:none; display:flex; flex-direction:column; gap:2px; }

/* ---------- decision block ---------- */
.dsh-task-tree-decision-block { display:flex; flex-direction:column; gap:2px; padding:4px 0 4px 10px; border-left:2px solid var(--dsw-alias-border-l2);
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-decision-label { padding:0 6px; color:var(--dsw-alias-label-caption); font-size:11px; line-height:16px; }
.dsh-task-tree-decision-list { display:flex; flex-direction:column; gap:1px; margin:0; padding:0; list-style:none; }
.dsh-task-tree-decision { display:block; width:100%; padding:3px 6px; border:0; border-radius:var(--dsw-radius-sm); background:transparent;
  color:var(--dsw-alias-label-secondary); font:inherit; font-size:12px; line-height:18px; text-align:left; overflow-wrap:anywhere; cursor:pointer;
  transition:background-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-decision:disabled { cursor:default; color:var(--dsw-alias-label-tertiary); }
@media (hover: hover) {
  .dsh-task-tree-decision:not(:disabled):hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
}

/* ---------- card chrome shared by dock and float ---------- */
.dsh-task-tree-card-header { display:flex; align-items:center; gap:8px; min-width:0; }
.dsh-task-tree-card-toggle { display:flex; flex:1 1 auto; align-items:center; gap:10px; min-width:0; padding:0; border:0; background:transparent;
  font:inherit; text-align:left; cursor:pointer; }
.dsh-task-tree-card-lead { display:grid; flex:none; place-items:center; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-card-title { flex:0 1 auto; min-width:0; overflow:hidden; color:var(--dsw-alias-label-primary); font-size:13px; line-height:24px;
  font-weight:500; white-space:nowrap; text-overflow:ellipsis; }
.dsh-task-tree-icon-button { display:grid; flex:none; place-items:center; width:24px; height:24px; padding:0; border:0; border-radius:var(--dsw-radius-sm);
  background:transparent; color:var(--dsw-alias-label-tertiary); cursor:pointer; }
.dsh-task-tree-icon-button:focus-visible, .dsh-task-tree-header-toggle:focus-visible { color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-interactive-bg-hover); outline:none; }
.dsh-task-tree-pill { display:inline-flex; flex:none; align-items:center; gap:6px; height:22px; padding:0 10px; border:0; border-radius:11px;
  background:var(--dsw-alias-state-business-tertiary); color:var(--dsw-alias-state-business-primary); font:inherit; font-size:12px; line-height:18px;
  white-space:nowrap; cursor:pointer; animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-pill-dot { width:3px; height:3px; border-radius:50%; background:currentColor; opacity:.6; }
.dsh-task-tree-pill-action { font-weight:500; }
.dsh-task-tree-pill-row { display:flex; padding:0 12px 6px; }
.dsh-task-tree-scroll { overflow-y:auto; overscroll-behavior:contain; --dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2); }
@media (hover: hover) {
  .dsh-task-tree-icon-button:hover, .dsh-task-tree-header-toggle:hover { color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-interactive-bg-hover); }
  .dsh-task-tree-pill:hover { filter:brightness(0.97); }
}

/* ---------- dock ---------- */
.dsh-task-tree-dock { box-sizing:border-box; flex:none; overflow:hidden; margin:0 auto;
  width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));
  max-width:calc(var(--dsh-composer-card-max-width) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));
  padding:6px 12px; border:0; --dsw-elevation-stroke-color:var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg);
  background:var(--dsw-specific-menu); backdrop-filter:var(--dsw-menu-backdrop-filter); box-shadow:var(--dsw-elevation-panel);
  animation:dsh-task-tree-slide var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-collapse { display:grid; grid-template-rows:0fr; transition:grid-template-rows var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-collapse[data-open] { grid-template-rows:1fr; }
.dsh-task-tree-collapse-inner { min-height:0; overflow:hidden; }
.dsh-task-tree-dock .dsh-task-tree-scroll { max-height:min(60vh, 560px); margin-top:6px; padding-bottom:2px; }

/* ---------- floating ---------- */
.dsh-task-tree-header-toggle { display:inline-flex; flex:none; align-items:center; justify-content:center; width:28px; height:28px; padding:0;
  border:0; border-radius:28px; background:transparent; color:var(--dsw-alias-label-tertiary); cursor:pointer; }
.dsh-task-tree-header-toggle[aria-pressed="true"] { color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-interactive-bg-hover); }
.dsh-task-tree-float { position:fixed; z-index:50; box-sizing:border-box; display:flex; flex-direction:column; min-height:0; overflow:hidden;
  --dsw-elevation-stroke-color:var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg); background:var(--dsw-specific-menu);
  backdrop-filter:var(--dsw-menu-backdrop-filter); box-shadow:var(--dsw-elevation-prominent); color:var(--dsw-alias-label-primary);
  transform-origin:top right; opacity:0; transform:scale(.96) translateY(-4px); visibility:hidden; pointer-events:none;
  transition:opacity var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease), transform var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease),
    visibility 0s linear var(--ds-transition-duration, 200ms); }
.dsh-task-tree-float[data-open] { opacity:1; transform:none; visibility:visible; pointer-events:auto; transition-delay:0s; }
.dsh-task-tree-float > .dsh-task-tree-card-header { flex:none; padding:8px 8px 6px 12px; }
.dsh-task-tree-float > .dsh-task-tree-card-header > .dsh-task-tree-card-title { flex:1 1 auto; }
.dsh-task-tree-card-toggle + .dsh-task-tree-pill, .dsh-task-tree-card-toggle + .dsh-task-tree-icon-button { margin-left:auto; }
.dsh-task-tree-float-scroll { flex:1 1 auto; min-height:0; padding:0 6px 8px; }

/* ---------- chat change row ---------- */
.dsh-task-tree-change { display:flex; flex-direction:column; border-radius:var(--dsw-radius-sm);
  animation:dsh-task-tree-slide var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-change-title { font-weight:400; }
.dsh-task-tree-change-separator { flex:none; width:2px; height:2px; margin:0 8px; border-radius:1px; background:var(--dsw-alias-label-caption); }
.dsh-task-tree-change-summary { min-width:0; overflow:hidden; flex:1 1 auto; font-size:var(--dsh-content-font-size-secondary, 13px);
  line-height:calc(20px + var(--dsh-content-font-delta-secondary, 0px)); white-space:nowrap; text-overflow:ellipsis; }
.dsh-task-tree-change-summary[data-changed] { color:var(--dsw-alias-label-secondary); }
.dsh-task-tree-change-body { display:flex; flex-direction:column; gap:4px; padding:4px 0 6px calc(22px + var(--dsh-content-font-delta, 0px)); min-width:0;
  font-size:var(--dsh-content-font-size-secondary, 13px); line-height:calc(20px + var(--dsh-content-font-delta-secondary, 0px));
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-crumbs { display:flex; flex-wrap:wrap; align-items:center; gap:2px 0; margin:0; padding:0; list-style:none; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-crumbs li { min-width:0; overflow-wrap:anywhere; }
.dsh-task-tree-crumbs li + li::before { content:'›'; padding:0 6px; color:var(--dsw-alias-label-caption); }
.dsh-task-tree-crumbs li[data-changed] { color:var(--dsw-alias-label-primary); }
.dsh-task-tree-crumbs li[data-changed]:first-of-type, .dsh-task-tree-crumbs li:not([data-changed]) + li[data-changed] { font-weight:500; }
.dsh-task-tree-change-detail { margin:0; color:var(--dsw-alias-label-secondary); overflow-wrap:anywhere; }
.dsh-task-tree-flash { animation:dsh-task-tree-flash 600ms var(--ds-ease-in-out, ease) both; }
@keyframes dsh-task-tree-flash { 0%, 40% { background:var(--dsw-alias-state-business-tertiary); } 100% { background:transparent; } }

/* ---------- tasks page ---------- */
.dsh-task-tree-page { display:flex; width:100%; height:100%; min-width:0; min-height:0; overflow:hidden; color:var(--dsw-alias-label-primary);
  background:var(--dsw-alias-bg-base); font-size:14px; line-height:1.6; }
.dsh-task-tree-page-scroll { flex:1; min-height:0; overflow:auto; scrollbar-gutter:stable; --dsh-scrollbar-width:9px; --dsh-scrollbar-thumb-border:2px; }
.dsh-task-tree-page-content { max-width:960px; margin:0 auto; padding:0 clamp(24px, 4vw, 48px) 48px; }
@media (max-width: 767px) { .dsh-task-tree-page-content { padding-inline:20px; } }
.dsh-task-tree-page-heading { display:flex; align-items:center; gap:16px; padding-top:28px; margin-bottom:24px; }
[data-platform='darwin'] .dsh-task-tree-page-heading { padding-top:calc(28px + var(--dsh-frame-top-clearance, 0px)); }
.dsh-task-tree-page-heading h1 { margin:0; font-size:20px; line-height:28px; font-weight:500; }
.dsh-task-tree-filters { display:flex; flex-wrap:wrap; align-items:center; gap:8px 12px; margin-bottom:14px; }
.dsh-task-tree-filter { display:inline-flex; align-items:center; height:28px; padding:0 10px; border:0; border-radius:14px; background:transparent;
  color:var(--dsw-alias-label-tertiary); font:inherit; font-size:14px; line-height:22px; white-space:nowrap; cursor:pointer; }
.dsh-task-tree-filter[aria-pressed="true"] { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dsh-task-tree-page-rows { display:flex; flex-direction:column; gap:2px; margin:0; padding:0; list-style:none; }
.dsh-task-tree-page-row { display:flex; align-items:flex-start; gap:12px; width:100%; padding:8px; border:0; border-radius:12px; background:transparent;
  color:inherit; font:inherit; text-align:left; cursor:pointer; animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-page-row:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:-2px; }
.dsh-task-tree-page-glyph { display:grid; flex:none; place-items:center; width:16px; height:23px; }
.dsh-task-tree-page-content-col { display:flex; flex:1; flex-direction:column; min-width:0; }
.dsh-task-tree-page-title { overflow:hidden; font-weight:500; line-height:23px; text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-page-summary { display:block; margin-top:2px; overflow:hidden; color:var(--dsw-alias-label-tertiary); font-size:13px; line-height:21px;
  text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-page-meta { display:flex; flex:none; flex-direction:column; align-items:flex-end; color:var(--dsw-alias-label-tertiary); font-size:13px;
  line-height:23px; white-space:nowrap; font-variant-numeric:tabular-nums; }
.dsh-task-tree-page-meta time { color:var(--dsw-alias-label-caption); font-size:12px; line-height:21px; }
.dsh-task-tree-page-unread { display:grid; flex:none; place-items:center; width:8px; height:23px; }
.dsh-task-tree-page-empty { display:flex; flex-direction:column; align-items:center; padding:48px 20px; text-align:center; color:var(--dsw-alias-label-tertiary); font-size:14px; }
.dsh-task-tree-page-empty p { margin:0; }
.dsh-task-tree-page-empty-glyph { margin-bottom:12px; color:var(--dsw-alias-label-caption); }
.dsh-task-tree-page-empty-action { margin-top:16px; }
.dsh-task-tree-notice { display:flex; align-items:flex-start; flex-wrap:wrap; gap:9px; margin:0 0 20px; padding:12px 14px; border-radius:10px;
  background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-secondary); font-size:12px; line-height:20px; }
.dsh-task-tree-notice p { flex:1; margin:0; }
@media (hover: hover) {
  .dsh-task-tree-filter:hover, .dsh-task-tree-page-row:hover { background:var(--dsw-alias-interactive-bg-hover); }
}

/* ---------- unread mark ---------- */
.dsh-task-tree-panel-icon { position:relative; display:inline-grid; place-items:center; }
.dsh-task-tree-unread-dot { display:block; width:6px; height:6px; border-radius:50%; background:var(--dsw-alias-state-error-primary);
  animation:dsh-task-tree-pop var(--ds-transition-duration-slow, 320ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-unread-dot[data-placement="icon"] { position:absolute; top:-1px; right:-2px; box-shadow:0 0 0 1.5px var(--dsw-alias-bg-base); }
@keyframes dsh-task-tree-pop { 0% { transform:scale(0); } 60% { transform:scale(1.3); } 100% { transform:scale(1); } }


/* ---------- configuration page ---------- */
.dsh-task-tree-config { display:flex; flex-direction:column; gap:28px; }
.dsh-task-tree-config-section { display:flex; flex-direction:column; }
.dsh-task-tree-config-heading { margin:0; color:var(--dsw-alias-label-primary); font-size:14px; line-height:20px; font-weight:500; }
.dsh-task-tree-config-section-description { margin:4px 0 0; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:18px; }
.dsh-task-tree-config-lines { display:flex; flex-direction:column; margin-top:8px; }
.dsh-task-tree-config-line { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:14px 0;
  border-bottom:0.5px solid var(--dsw-alias-border-l2); }
.dsh-task-tree-config-line:last-child { border-bottom:0; }
.dsh-task-tree-config-line[data-stacked] { flex-wrap:wrap; gap:10px 24px; }
.dsh-task-tree-config-text { min-width:0; flex:1 1 220px; }
.dsh-task-tree-config-title { color:var(--dsw-alias-label-primary); font-size:14px; line-height:20px; }
.dsh-task-tree-config-description { margin-top:4px; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:18px; }
.dsh-task-tree-config-control { flex:none; display:flex; align-items:center; }
.dsh-task-tree-config-status { color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:18px;
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-config-status[data-tone="error"] { color:var(--dsw-alias-state-error-primary); }
.dsh-task-tree-config-picker { display:flex; flex-direction:column; align-items:flex-end; gap:6px; min-width:0; }
.dsh-task-tree-config-picker-row { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; }
.dsh-task-tree-select { display:inline-flex; align-items:center; gap:6px; max-width:320px; height:32px; padding:0 10px 0 12px; border:0.5px solid var(--dsw-alias-border-l3);
  border-radius:var(--dsw-radius-md); background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:13px; line-height:20px; cursor:pointer;
  transition:border-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease), background-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-select[data-empty] { color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-select[aria-expanded="true"] { background:var(--dsw-alias-interactive-bg-hover); }
.dsh-task-tree-select:disabled { cursor:default; opacity:.6; }
.dsh-task-tree-select:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:1px; }
.dsh-task-tree-select > svg { flex:none; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-select-label { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-config-status { display:flex; align-items:center; gap:8px; margin:0; }
@media (hover: hover) {
  .dsh-task-tree-select:not(:disabled):hover { border-color:var(--dsw-alias-border-l2); background:var(--dsw-alias-interactive-bg-hover); }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-task-tree-check-path, .dsh-task-tree-detail, .dsh-task-tree-decisions, .dsh-task-tree-pill,
  .dsh-task-tree-dock, .dsh-task-tree-change, .dsh-task-tree-change-body, .dsh-task-tree-flash, .dsh-task-tree-page-row,
  .dsh-task-tree-unread-dot, .dsh-task-tree-decision-block, .dsh-task-tree-config-status { animation:none; }
  .dsh-task-tree-collapse, .dsh-task-tree-float, .dsh-task-tree-item, .dsh-task-tree-glyph-status, .dsh-task-tree-glyph-chevron,
  .dsh-task-tree-decision, .dsh-task-tree-select { transition:none; }
}
`;
		//#endregion
		//#region src/tree.ts
		/**
		* Stable identity of the item named by a path prefix.
		* @param path - task path.
		* @param depth - zero-based depth of the item.
		* @returns the identity string.
		*/
		function nodeKey(path, depth) {
			return JSON.stringify(path.slice(0, depth + 1));
		}
		function keysOf(path) {
			return path.map((_, depth) => nodeKey(path, depth));
		}
		/**
		* Fold reports into a tree. Every report contributes structure; only reports up to the cutoff set statuses.
		* @param records - successful reports in log order.
		* @param options - cutoff and settlement; a number is accepted as the cutoff.
		* @returns the derived tree.
		*/
		function buildTree(records, options = {}) {
			const { cutoffSeq, settled = false } = typeof options === "number" ? { cutoffSeq: options } : options;
			const byKey = /* @__PURE__ */ new Map();
			const roots = [];
			for (const record of records) {
				const keys = keysOf(record.path);
				keys.forEach((key, depth) => {
					if (byKey.has(key)) return;
					const parentKey = depth === 0 ? void 0 : keys[depth - 1];
					const node = {
						key,
						title: record.path[depth],
						depth,
						parentKey,
						children: [],
						status: "pending",
						firstRecordId: record.id,
						firstSeq: record.seq,
						firstContextSeq: record.contextSeq,
						firstTurn: record.coveredTurn,
						lastSeq: void 0,
						completedSeq: void 0,
						decisions: [],
						detail: void 0
					};
					byKey.set(key, node);
					const parent = parentKey === void 0 ? void 0 : byKey.get(parentKey);
					if (parent === void 0) roots.push(node);
					else parent.children.push(node);
				});
			}
			const seen = /* @__PURE__ */ new Set();
			let onPath = /* @__PURE__ */ new Set();
			let latest;
			let included = 0;
			for (const record of records) {
				if (cutoffSeq !== void 0 && record.seq > cutoffSeq) continue;
				included++;
				latest = record;
				const keys = keysOf(record.path);
				const next = new Set(keys);
				for (const key of onPath) {
					const node = byKey.get(key);
					if (node !== void 0 && !next.has(key)) node.completedSeq = record.seq;
				}
				for (const key of keys) {
					const node = byKey.get(key);
					seen.add(key);
					node.lastSeq = record.seq;
					node.completedSeq = void 0;
				}
				const deepest = byKey.get(keys[keys.length - 1]);
				deepest.detail = record.detail;
				for (const text of record.decisions) deepest.decisions.push({
					text,
					recordId: record.id
				});
				onPath = next;
			}
			const focus = latest ?? (cutoffSeq !== void 0 ? records[0] : void 0);
			const activeKeys = focus === void 0 ? [] : keysOf(focus.path);
			const activeKey = latest === void 0 || settled ? void 0 : activeKeys[activeKeys.length - 1];
			let doneCount = 0;
			for (const node of byKey.values()) {
				if (!seen.has(node.key)) node.status = "pending";
				else if (onPath.has(node.key) && !settled) node.status = node.key === activeKey ? "active" : "current";
				else {
					node.status = "done";
					if (onPath.has(node.key)) node.completedSeq = latest?.seq;
				}
				if (node.status === "done") doneCount++;
			}
			return {
				roots,
				byKey,
				activeKeys,
				activeKey,
				latest,
				included,
				doneCount,
				totalCount: byKey.size
			};
		}
		/**
		* Compact rows of the tree. Every item starts collapsed: it lists the children that are not done and hides
		* the done ones, so work in progress stays visible. An item the user expanded lists all its children, and
		* each of those follows the same rule. The level holding the deepest focused item carries a `scrollGroup`.
		* @param tree - derived tree.
		* @param options - display options.
		* @returns rows in display order.
		*/
		function visibleRows(tree, options) {
			const rows = [];
			const deepestKey = tree.activeKeys[tree.activeKeys.length - 1];
			const latestParent = deepestKey === void 0 ? void 0 : tree.byKey.get(deepestKey)?.parentKey ?? "";
			const emitLevel = (siblings, depth, parentKey, group) => {
				if (siblings.length === 0) return;
				const scrollGroup = group ?? (parentKey === latestParent ? `scroll:${parentKey}` : void 0);
				for (const node of siblings) emitNode(node, depth, scrollGroup);
			};
			const emitNode = (node, depth, scrollGroup) => {
				const expandable = node.children.length > 0;
				const expanded = expandable && options.toggled.has(node.key);
				const listed = expanded ? node.children : node.children.filter((child) => child.status !== "done");
				rows.push({
					kind: "node",
					node,
					depth,
					expandable,
					expanded,
					partial: !expanded && listed.length > 0,
					scrollGroup
				});
				emitLevel(listed, depth + 1, node.key, scrollGroup);
			};
			emitLevel(tree.roots, 0, "", void 0);
			return rows;
		}
		//#endregion
		//#region src/client/ScrollGroup.tsx
		/**
		* Latest tree level shown as its newest items, with older siblings hidden
		* above. Scrolling up over it grows it upward while the newest rows stay at
		* its bottom; past the height limit it scrolls inside. Leaving it returns it
		* to its default height. Height follows its target through exponential
		* smoothing on animation frames, written straight to the element.
		*/
		/** Share of the window height the group may grow to before it scrolls inside. */
		const LIMIT_SHARE = .45;
		/** Height change per pixel of scroll input. */
		const SCROLL_GAIN = .4;
		/** Largest height change one input event may request. */
		const STEP_CAP_PX = 60;
		/** Smoothing time constant while following scroll input. */
		const TRACK_TAU_MS = 80;
		/** Smoothing time constant of the collapse back to the default height. */
		const COLLAPSE_TAU_MS = 120;
		/** Delay after a touch ends before the group collapses. */
		const TOUCH_COLLAPSE_MS = 600;
		/** Pixels per line for wheel events reported in lines. */
		const LINE_PX = 16;
		/** Remaining distance at which the animation snaps to its target. */
		const SETTLE_PX = .5;
		function reducedMotion() {
			return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
		}
		/**
		* Bottom-anchored, upward-growing viewport of the latest level.
		* @param props - default anchor row, change key, and rows.
		* @returns the group.
		*/
		function ScrollGroup({ anchorKey, contentKey, children }) {
			const outer = (0, react.useRef)(null);
			const inner = (0, react.useRef)(null);
			const metrics = (0, react.useRef)({
				base: 0,
				full: 0
			});
			const height = (0, react.useRef)(0);
			const target = (0, react.useRef)(0);
			const tau = (0, react.useRef)(TRACK_TAU_MS);
			const frame = (0, react.useRef)(0);
			const last = (0, react.useRef)(void 0);
			const [scrollable, setScrollable] = (0, react.useState)(false);
			const scrollableRef = (0, react.useRef)(false);
			const limit = () => Math.min(metrics.current.full, Math.max(metrics.current.base, Math.round(window.innerHeight * LIMIT_SHARE)));
			const paint = (0, react.useCallback)(() => {
				const element = outer.current;
				/* v8 ignore next -- the ref is attached before any paint */
				if (element === null) return;
				const { full } = metrics.current;
				if (full === 0) {
					element.style.removeProperty("height");
					delete element.dataset.faded;
					return;
				}
				element.style.height = `${height.current}px`;
				if (scrollableRef.current ? element.scrollTop > 0 : height.current < full - SETTLE_PX) element.dataset.faded = "";
				else delete element.dataset.faded;
				const inside = full > limit() && height.current >= limit() - SETTLE_PX && target.current >= limit();
				if (inside !== scrollableRef.current) {
					scrollableRef.current = inside;
					setScrollable(inside);
				}
			}, []);
			const step = (0, react.useCallback)((now) => {
				frame.current = 0;
				const dt = last.current === void 0 ? 16 : Math.min(34, now - last.current);
				last.current = now;
				const remaining = target.current - height.current;
				height.current = Math.abs(remaining) < SETTLE_PX ? target.current : height.current + remaining * (1 - Math.exp(-dt / tau.current));
				paint();
				if (height.current !== target.current) frame.current = requestAnimationFrame(step);
				else last.current = void 0;
			}, [paint]);
			const animateTo = (0, react.useCallback)((next, timeConstant) => {
				target.current = next;
				tau.current = timeConstant;
				if (reducedMotion()) {
					height.current = next;
					paint();
					return;
				}
				if (frame.current === 0) frame.current = requestAnimationFrame(step);
			}, [paint, step]);
			const measure = (0, react.useCallback)(() => {
				const content = inner.current;
				/* v8 ignore next -- the ref is attached before layout effects and observers run */
				if (content === null) return;
				const full = content.offsetHeight;
				const anchor = [...content.children].find((child) => child instanceof HTMLElement && child.dataset.rowKey === anchorKey);
				const base = anchor instanceof HTMLElement ? full - anchor.offsetTop : full;
				const first = metrics.current.full === 0;
				metrics.current = {
					base,
					full
				};
				const clamped = Math.min(limit(), Math.max(base, target.current));
				if (first || frame.current === 0) {
					target.current = clamped;
					height.current = clamped;
					paint();
				} else target.current = clamped;
			}, [anchorKey, paint]);
			(0, react.useLayoutEffect)(() => {
				measure();
				const content = inner.current;
				if (content === null || typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(measure);
				observer.observe(content);
				return () => {
					observer.disconnect();
				};
			}, [measure, contentKey]);
			(0, react.useLayoutEffect)(() => {
				const element = outer.current;
				if (!scrollable || element === null) return;
				element.scrollTop = element.scrollHeight;
				paint();
			}, [
				scrollable,
				contentKey,
				paint
			]);
			const collapse = (0, react.useCallback)(() => {
				animateTo(metrics.current.base, COLLAPSE_TAU_MS);
			}, [animateTo]);
			(0, react.useEffect)(() => {
				const element = outer.current;
				/* v8 ignore next -- the ref is attached before effects run */
				if (element === null) return;
				const apply = (deltaY) => {
					const { base } = metrics.current;
					if (metrics.current.full === 0) return false;
					if (deltaY > 0 && scrollableRef.current && element.scrollTop + element.clientHeight < element.scrollHeight - 1) return false;
					if (deltaY < 0 && scrollableRef.current) return false;
					const change = Math.max(-60, Math.min(STEP_CAP_PX, -deltaY * SCROLL_GAIN));
					const next = Math.min(limit(), Math.max(base, target.current + change));
					if (next === target.current) return false;
					animateTo(next, TRACK_TAU_MS);
					return true;
				};
				const onWheel = (event) => {
					const scale = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? window.innerHeight : 1;
					if (apply(event.deltaY * scale)) event.preventDefault();
				};
				let touchY;
				let touchTimer;
				const onTouchStart = (event) => {
					clearTimeout(touchTimer);
					touchY = event.touches[0]?.clientY;
				};
				const onTouchMove = (event) => {
					const y = event.touches[0]?.clientY;
					if (touchY === void 0 || y === void 0) return;
					const deltaY = (touchY - y) / SCROLL_GAIN;
					touchY = y;
					if (apply(deltaY)) event.preventDefault();
				};
				const onTouchEnd = () => {
					touchY = void 0;
					touchTimer = setTimeout(collapse, TOUCH_COLLAPSE_MS);
				};
				element.addEventListener("wheel", onWheel, { passive: false });
				element.addEventListener("touchstart", onTouchStart, { passive: true });
				element.addEventListener("touchmove", onTouchMove, { passive: false });
				element.addEventListener("touchend", onTouchEnd);
				return () => {
					element.removeEventListener("wheel", onWheel);
					element.removeEventListener("touchstart", onTouchStart);
					element.removeEventListener("touchmove", onTouchMove);
					element.removeEventListener("touchend", onTouchEnd);
					clearTimeout(touchTimer);
					if (frame.current !== 0) cancelAnimationFrame(frame.current);
					frame.current = 0;
				};
			}, [animateTo, collapse]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: outer,
				className: "dsh-task-tree-scroll-group",
				"data-scrollable": scrollable || void 0,
				onMouseLeave: collapse,
				onScroll: paint,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					ref: inner,
					className: "dsh-task-tree-scroll-group-content",
					children
				})
			});
		}
		//#endregion
		//#region src/client/TreeView.tsx
		/** Compact task tree shared by the dock card and the floating card. */
		/** Rows of the latest level visible without scrolling: its three newest rows. */
		const VISIBLE_LATEST = 3;
		const STATUS_LABEL = {
			done: "tree.status.done",
			active: "tree.status.active",
			current: "tree.status.current",
			pending: "tree.status.pending"
		};
		/**
		* Glyph drawn for one item status.
		* @param props.status - item status.
		* @param props.running - whether the active item animates.
		* @returns the decorative status mark.
		*/
		function StatusMark({ status, running }) {
			switch (status) {
				case "done": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckMark, {});
				case "active": return running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, {
					state: "ongoing",
					size: 12
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-task-tree-active-dot",
					"aria-hidden": "true"
				});
				case "current": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-task-tree-step-dot",
					"aria-hidden": "true"
				});
				case "pending": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-task-tree-pending-dot",
					"aria-hidden": "true"
				});
				/* v8 ignore next -- closed NodeStatus union */
				default: return null;
			}
		}
		/** @returns a neutral check whose stroke draws in when it first appears. */
		function CheckMark() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				className: "dsh-task-tree-check",
				viewBox: "0 0 16 16",
				width: "14",
				height: "14",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					className: "dsh-task-tree-check-ring",
					cx: "8",
					cy: "8",
					r: "6.5"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: "dsh-task-tree-check-path",
					d: "M5 8.3 7.1 10.4 11 6",
					pathLength: 1
				})]
			});
		}
		function depthStyle(depth) {
			return { "--dsh-task-tree-depth": depth };
		}
		function flip(set, key) {
			const next = new Set(set);
			if (!next.delete(key)) next.add(key);
			return next;
		}
		/**
		* Render the compact rows of a derived tree. An item with children toggles
		* its children; a leaf item reveals where it started. The latest level scrolls
		* inside its own viewport showing the newest items.
		* @param props - tree, Session, live state, jump and insertion actions, and copy.
		* @returns the row list.
		*/
		function TreeView({ tree, sessionId, live, running, onJump, onInsert, insertDisabled, t }) {
			const [toggled, setToggled] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const [openDecisions, setOpenDecisions] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const rows = (0, react.useMemo)(() => visibleRows(tree, { toggled }), [tree, toggled]);
			const toggle = (key) => {
				setToggled((current) => flip(current, key));
			};
			const renderRow = (row) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NodeRow, {
				row,
				running,
				onJump,
				onToggle: toggle,
				t,
				decisionsOpen: openDecisions.has(row.node.key),
				onInsert,
				insertDisabled,
				onToggleDecisions: () => {
					setOpenDecisions((current) => flip(current, row.node.key));
				}
			}, row.node.key);
			const contentKey = `${tree.latest?.seq ?? ""}:${rows.length}:${[...openDecisions].join("|")}`;
			const blocks = [];
			for (let index = 0; index < rows.length;) {
				const row = rows[index];
				const group = row.scrollGroup;
				if (group === void 0) {
					blocks.push(renderRow(row));
					index++;
					continue;
				}
				const members = [];
				while (index < rows.length && rows[index].scrollGroup === group) members.push(rows[index++]);
				const level = members.filter((member) => member.depth === members[0].depth);
				const anchor = level[Math.max(0, level.length - VISIBLE_LATEST)];
				blocks.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ScrollGroup, {
					anchorKey: anchor.node.key,
					contentKey,
					children: members.map(renderRow)
				}, group));
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-task-tree-rows-frame",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.AnimatedRows, {
					className: "dsh-task-tree-rows",
					role: "list",
					label: t("tree.label"),
					rowKeys: rows.map((row) => row.node.key),
					ready: true,
					resetKey: `${sessionId}:${live ? "live" : "past"}`,
					children: blocks
				})
			});
		}
		function NodeRow({ row, running, onJump, onToggle, t, decisionsOpen, onToggleDecisions, onInsert, insertDisabled }) {
			const { node } = row;
			const decisions = node.decisions.length;
			const status = t(STATUS_LABEL[node.status]);
			const title = node.status === "active" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.TextShimmer, {
				active: running,
				children: node.title
			}) : node.title;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				role: "listitem",
				"data-row-key": node.key,
				"data-status": node.status,
				className: "dsh-task-tree-row",
				style: depthStyle(row.depth),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-task-tree-line",
						children: [row.expandable ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dsh-task-tree-item",
							"data-expandable": "",
							"data-expanded": row.expanded || void 0,
							"data-partial": row.partial || void 0,
							"aria-expanded": row.expanded,
							"aria-label": t(row.expanded ? "tree.collapse" : "tree.expand", { title: node.title }),
							onClick: () => {
								onToggle(node.key);
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dsh-task-tree-glyph",
								role: "img",
								"aria-label": status,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-task-tree-glyph-status",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatusMark, {
										status: node.status,
										running
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dsh-task-tree-glyph-chevron",
									"aria-hidden": "true",
									children: row.expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutlineRegular, { size: 14 })
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-title",
								children: title
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dsh-task-tree-item",
							title: t("tree.jump"),
							onClick: () => {
								onJump({
									recordId: node.firstRecordId,
									contextSeq: node.firstContextSeq,
									turn: node.firstTurn
								});
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-glyph",
								role: "img",
								"aria-label": status,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatusMark, {
									status: node.status,
									running
								})
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-title",
								children: title
							})]
						}), decisions > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-task-tree-badge",
							"aria-expanded": decisionsOpen,
							"aria-label": t("tree.decisions", { count: decisions }),
							onClick: onToggleDecisions,
							children: decisions
						})]
					}),
					node.status === "active" && node.detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-task-tree-detail",
						children: node.detail
					}),
					decisionsOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-row-decisions",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DecisionList, {
							decisions: node.decisions.map((decision, index) => ({
								key: `${decision.recordId}:${index}`,
								text: decision.text
							})),
							onInsert,
							insertDisabled,
							t
						})
					})
				]
			});
		}
		//#endregion
		//#region src/client/TasksPage.tsx
		/** Tasks main panel: every Session's current task, newest first, with unread marks. */
		/**
		* Sidebar glyph with a red dot while any listed Session has an unread report.
		* @param props - requested size and list sources.
		* @returns the decorative icon.
		*/
		function TasksIcon({ size, useTaskList, useSeen }) {
			const rows = useTaskList((list) => list.rows);
			const seen = useSeen((value) => value);
			const unread = rows.some((row) => isUnread(row, seen));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "dsh-task-tree-panel-icon",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutlineRegular, { size }), unread && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-task-tree-unread-dot",
					"data-placement": "icon",
					"aria-hidden": "true"
				})]
			});
		}
		/**
		* Completion mark of one row: a check once every item is done, otherwise a hollow step dot.
		* @param props.finished - whether every listed item is done.
		* @param props.t - copy for the accessible status.
		* @returns the status mark.
		*/
		function RowMark({ finished, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "dsh-task-tree-glyph",
				role: "img",
				"aria-label": t(finished ? "page.finished" : "page.inProgress"),
				children: finished ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckMark, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-task-tree-step-dot",
					"aria-hidden": "true"
				})
			});
		}
		function timeLabel(at, now, t) {
			const { unit, n } = (0, _deepseek_ai_dsh_client_ui_primitives.relativeTime)(at, now);
			return t(`time.${unit}`, { n });
		}
		function summaryOf(row) {
			return [row.path.length > 1 ? row.path[row.path.length - 1] : void 0, row.detail].filter((part) => part !== void 0 && part !== "").join(" · ");
		}
		/**
		* Render the cross-session task list.
		* @param props - list sources, actions, and copy.
		* @returns the panel.
		*/
		function TasksPage({ useTaskList, useSeen, openSession, retry, t }) {
			const list = useTaskList((value) => value);
			const seen = useSeen((value) => value);
			const [filter, setFilter] = (0, react.useState)("all");
			const rows = (0, react.useMemo)(() => list.rows.filter((row) => filter === "all" || isUnread(row, seen)).toSorted((left, right) => right.updatedAt - left.updatedAt), [
				list.rows,
				filter,
				seen
			]);
			const now = Date.now();
			const populated = list.rows.length > 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				className: "dsh-task-tree-page",
				"aria-label": t("page.title"),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-task-tree-page-scroll",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-task-tree-page-content",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-task-tree-page-heading",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: t("page.title") })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-task-tree-filters",
								role: "group",
								"aria-label": t("page.filter"),
								children: ["all", "unread"].map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dsh-task-tree-filter",
									"aria-pressed": filter === value,
									onClick: () => {
										setFilter(value);
									},
									children: t(value === "all" ? "page.all" : "page.unread")
								}, value))
							}),
							list.status === "loading" && !populated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-task-tree-page-empty",
								role: "status",
								"aria-label": t("page.loading"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "ongoing" })
							}),
							list.status === "error" && (populated ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-task-tree-notice",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									role: "alert",
									children: t("page.error")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										retry();
									},
									children: t("page.retry")
								})]
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-task-tree-page-empty",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutlineRegular, {
										size: 24,
										className: "dsh-task-tree-page-empty-glyph"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										role: "alert",
										children: t("page.error")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										className: "dsh-task-tree-page-empty-action",
										onClick: () => {
											retry();
										},
										children: t("page.retry")
									})
								]
							})),
							list.status === "ready" && rows.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-task-tree-page-empty",
								role: "status",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutlineRegular, {
									size: 24,
									className: "dsh-task-tree-page-empty-glyph"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t(filter === "unread" && populated ? "page.emptyUnread" : "page.empty") })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: "dsh-task-tree-page-rows",
								"aria-label": t("page.list"),
								"aria-busy": list.status === "loading",
								children: rows.map((row) => {
									const unread = isUnread(row, seen);
									const summary = summaryOf(row);
									return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dsh-task-tree-page-row",
										"data-unread": unread || void 0,
										onClick: () => {
											openSession(row.sessionId, row.lastRecordSeq);
										},
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-task-tree-page-glyph",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowMark, {
													finished: row.totalCount > 0 && row.doneCount >= row.totalCount,
													t
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "dsh-task-tree-page-content-col",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dsh-task-tree-page-title",
													children: row.rootTitle
												}), summary !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dsh-task-tree-page-summary",
													children: summary
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-task-tree-page-meta",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", {
													dateTime: new Date(row.updatedAt).toISOString(),
													children: timeLabel(row.updatedAt, now, t)
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dsh-task-tree-page-unread",
												children: unread && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dsh-task-tree-unread-dot",
													role: "img",
													"aria-label": t("page.unreadMark")
												})
											})
										]
									}) }, row.sessionId);
								})
							})
						]
					})
				})
			});
		}
		/** Class that plays the jump highlight. */
		const FLASH_CLASS = "dsh-task-tree-flash";
		function attributeValue(value) {
			return `"${value.replace(/["\\]/gu, "\\$&")}"`;
		}
		/**
		* Find the conversation content element of one Session.
		* @param sessionId - Session shown by the pane.
		* @param root - document or subtree to search.
		* @returns the content element, or null while the Session is not rendered.
		*/
		function conversationContainer(sessionId, root = document) {
			return root.querySelector(`[data-conversation-content][data-conversation-session=${attributeValue(sessionId)}]`);
		}
		/**
		* Find the scrollport inside a conversation content element.
		* @param container - conversation content element.
		* @returns the scrollport, or null.
		*/
		function conversationScroller(container) {
			return container.querySelector("[data-conversation-scroll]");
		}
		/**
		* Whether a Chat row is laid out where the reader can see it: not hidden by a
		* collapsed Turn process and not clipped out of a capped process group body.
		* @param element - rendered row.
		* @returns whether its own position is meaningful.
		*/
		function isShown(element) {
			if (element.closest("[hidden], [data-turn-process-hidden]") !== null) return false;
			const rect = element.getBoundingClientRect();
			if (rect.height === 0) return false;
			const body = element.closest("[data-step-process-body]");
			if (body === null) return true;
			const bounds = body.getBoundingClientRect();
			return rect.bottom > bounds.top && rect.top < bounds.bottom;
		}
		function collectAnchors(container) {
			const rows = /* @__PURE__ */ new Map();
			for (const row of container.querySelectorAll("[data-task-tree-record]")) {
				const id = row.dataset.taskTreeRecord;
				if (id !== void 0 && !rows.has(id)) rows.set(id, row);
			}
			const groups = /* @__PURE__ */ new Map();
			const turns = /* @__PURE__ */ new Map();
			let firstTurn;
			for (const element of container.querySelectorAll("[data-chat-turn]")) {
				const turn = Number(element.dataset.chatTurn);
				if (!Number.isFinite(turn)) continue;
				if (firstTurn === void 0 || turn < firstTurn) firstTurn = turn;
				if (element.hasAttribute("data-chat-group-key")) groups.set(turn, element);
				turns.set(turn, element);
			}
			return {
				rows,
				groups,
				turns,
				firstTurn
			};
		}
		/**
		* Vertical position at which a record counts as read, or whether it is
		* already behind the loaded window.
		*/
		function recordEdge(anchors, record) {
			const row = anchors.rows.get(record.id);
			if (row !== void 0 && isShown(row)) return row.getBoundingClientRect().top;
			const turn = record.coveredTurn;
			if (turn === void 0) return void 0;
			const group = anchors.groups.get(turn);
			if (group !== void 0) return group.getBoundingClientRect().bottom;
			const last = anchors.turns.get(turn);
			if (last !== void 0) return last.getBoundingClientRect().bottom;
			if (anchors.firstTurn !== void 0 && turn < anchors.firstTurn) return "passed";
		}
		/**
		* Read the record cutoff for the current scroll position.
		* @param container - conversation content element of the Session.
		* @param records - reports in log order.
		* @returns undefined while the reader follows the bottom; otherwise the seq of
		* the last record above the reading line, or -1 when none is.
		*/
		function readingCutoff(container, records) {
			const scroller = conversationScroller(container);
			if (scroller === null) return void 0;
			if (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 48) return void 0;
			const composer = Number.parseFloat(getComputedStyle(scroller).getPropertyValue("--dsh-composer-height"));
			const line = scroller.getBoundingClientRect().bottom - (Number.isFinite(composer) ? composer : 0);
			const anchors = collectAnchors(container);
			let cutoff = -1;
			for (const record of records) {
				const edge = recordEdge(anchors, record);
				if (edge === "passed" || edge !== void 0 && edge <= line) cutoff = record.seq;
			}
			return cutoff;
		}
		/**
		* Find where a task started: its own Chat row, then its Turn's process group,
		* then the last rendered row of its Turn.
		* @param container - conversation content element of the Session.
		* @param recordId - report that introduced the task.
		* @param turn - Turn current when that report's context was captured.
		* @returns the element to reveal, or undefined while nothing is rendered.
		*/
		function startAnchor(container, recordId, turn) {
			const anchors = collectAnchors(container);
			const row = anchors.rows.get(recordId);
			if (row !== void 0 && isShown(row)) return row;
			if (turn === void 0) return row;
			const group = anchors.groups.get(turn);
			if (group !== void 0 && isShown(group)) return group;
			return container.querySelector(`button[data-turn-process=${attributeValue(String(turn))}]`) ?? group ?? anchors.turns.get(turn) ?? row;
		}
		/** Longest wait for loaded history to render the target's Turn. */
		const COMMIT_TIMEOUT_MS = 3e3;
		const nextFrame = (callback) => {
			requestAnimationFrame(() => {
				callback();
			});
		};
		function waitUntil(predicate, frame, timeoutMs) {
			const started = Date.now();
			return new Promise((resolve) => {
				const check = () => {
					if (predicate()) resolve(true);
					else if (Date.now() - started >= timeoutMs) resolve(false);
					else frame(check);
				};
				check();
			});
		}
		function turnOf(element, fallback) {
			const value = element?.closest("[data-chat-turn]")?.dataset.chatTurn;
			return value === void 0 ? fallback : Number(value);
		}
		/**
		* Header button of the closed process group that holds a row.
		* @param row - rendered Chat row.
		* @returns the button that opens the group, or undefined when the row is not in a closed group.
		*/
		function closedGroupToggle(row) {
			const group = row.closest("[data-chat-group-key]");
			const body = group?.querySelector(":scope > [data-step-process-body]");
			if (group == null || body == null || body.id === "") return void 0;
			return group.querySelector(`button[aria-controls=${attributeValue(body.id)}][aria-expanded="false"]`) ?? void 0;
		}
		/**
		* Open the folded Turn and the closed process group that hide a task's start,
		* wait for the row to lay out, then scroll to it and flash it. Falls back to
		* the Turn's group or header when the row cannot be shown.
		* @param container - conversation content element of the Session.
		* @param recordId - report that introduced the task.
		* @param turn - Turn current when that report's context was captured.
		* @param frame - frame scheduler.
		* @returns whether an element was revealed.
		*/
		async function revealStart(container, recordId, turn, frame = nextFrame) {
			const findRow = () => collectAnchors(container).rows.get(recordId);
			const rendered = () => findRow() !== void 0 || turn !== void 0 && container.querySelector(`[data-chat-turn=${attributeValue(String(turn))}]`) !== null;
			if (!rendered()) await waitUntil(rendered, frame, COMMIT_TIMEOUT_MS);
			const row = findRow();
			if (row === void 0 || !isShown(row)) {
				const folded = turnOf(row, turn);
				const header = folded === void 0 ? null : container.querySelector(`button[data-turn-process=${attributeValue(String(folded))}][aria-expanded="false"]`);
				if (header !== null && !header.disabled) {
					header.click();
					await waitUntil(() => {
						const current = findRow();
						return current !== void 0 && current.closest("[hidden], [data-turn-process-hidden]") === null;
					}, frame, 600);
				}
				const current = findRow();
				const toggle = current === void 0 || isShown(current) ? void 0 : closedGroupToggle(current);
				if (toggle !== void 0) {
					toggle.click();
					await waitUntil(() => {
						const next = findRow();
						return next !== void 0 && isShown(next);
					}, frame, 600);
				}
			}
			const anchor = startAnchor(container, recordId, turn);
			if (anchor === void 0) return false;
			await settleLayout(container, anchor, frame);
			revealAndFlash(anchor);
			await holdInView(container, () => anchor.isConnected ? anchor : startAnchor(container, recordId, turn), frame);
			return true;
		}
		/**
		* Scroll an element to the middle of its scrollport and flash it.
		* @param element - jump target.
		*/
		function revealAndFlash(element) {
			const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
			const scroller = element.closest("[data-conversation-scroll]");
			const far = scroller !== null && Math.abs(element.getBoundingClientRect().top - scroller.getBoundingClientRect().top) > scroller.clientHeight * 1.5;
			element.scrollIntoView({
				block: "center",
				behavior: reduced || far ? "auto" : "smooth"
			});
			flash(element);
		}
		/** Longest wait for the transcript layout to stop moving before a jump scrolls. */
		const SETTLE_TIMEOUT_MS = 1e3;
		/** Consecutive unchanged frames that count as settled. */
		const SETTLE_FRAMES = 3;
		/**
		* Wait until the target's position inside the scroll content and the content
		* height stop changing, so a jump does not scroll while Chat is still
		* restoring its reading position after loading history.
		* @param container - conversation content element of the Session.
		* @param target - element the jump will reveal.
		* @param frame - frame scheduler.
		* @returns settlement once stable or after the timeout.
		*/
		function settleLayout(container, target, frame = nextFrame) {
			const scroller = conversationScroller(container);
			if (scroller === null) return Promise.resolve(true);
			let previous = "";
			let stable = 0;
			return waitUntil(() => {
				target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
				const sample = `:`;
				stable = sample === previous ? stable + 1 : 0;
				previous = sample;
				return stable >= SETTLE_FRAMES;
			}, frame, SETTLE_TIMEOUT_MS);
		}
		/**
		* Play the jump highlight on an element, restarting it when it is already playing.
		* @param element - jump target.
		*/
		function flash(element) {
			element.classList.remove(FLASH_CLASS);
			element.offsetWidth;
			element.classList.add(FLASH_CLASS);
			window.setTimeout(() => {
				element.classList.remove(FLASH_CLASS);
			}, 600);
		}
		/** Time left for the smooth scroll before the hold starts correcting. */
		const HOLD_GRACE_MS = 400;
		/**
		* Keep a jump target inside the scrollport while freshly loaded history
		* commits: Chat restores its own reading position after a prepend, which can
		* move the transcript away from the target. Any reader input ends the hold.
		* @param container - conversation content element of the Session.
		* @param find - resolves the current target element.
		* @param frame - frame scheduler.
		* @returns settlement after the hold ends.
		*/
		function holdInView(container, find, frame = nextFrame) {
			const scroller = conversationScroller(container);
			if (scroller === null) return Promise.resolve();
			const started = Date.now();
			let interrupted = false;
			const stop = () => {
				interrupted = true;
			};
			const inputs = [
				"wheel",
				"touchstart",
				"keydown",
				"pointerdown"
			];
			for (const name of inputs) scroller.addEventListener(name, stop, { passive: true });
			return new Promise((resolve) => {
				const check = () => {
					const elapsed = Date.now() - started;
					if (interrupted || elapsed >= 1500) {
						for (const name of inputs) scroller.removeEventListener(name, stop);
						resolve();
						return;
					}
					const target = find();
					if (elapsed >= HOLD_GRACE_MS && target !== void 0 && target.isConnected) {
						const box = target.getBoundingClientRect();
						const view = scroller.getBoundingClientRect();
						if (box.bottom <= view.top || box.top >= view.bottom) {
							target.scrollIntoView({
								block: "center",
								behavior: "auto"
							});
							flash(target);
						}
					}
					frame(check);
				};
				frame(check);
			});
		}
		//#endregion
		//#region src/client/hooks.ts
		/** Component-internal behavioral hooks over the Session's own conversation DOM. */
		/**
		* Follow the transcript scroll position and report which records the reader has passed.
		* @param sessionId - Session whose conversation pane is observed.
		* @param records - reports in log order.
		* @param enabled - whether to follow the scroll position; when false the cutoff stays undefined.
		* @returns the cutoff and the action that returns to the latest output.
		*/
		function useReadingCutoff(sessionId, records, enabled = true) {
			const [measured, setCutoff] = (0, react.useState)(void 0);
			const cutoff = enabled ? measured : void 0;
			const recordsRef = (0, react.useRef)(records);
			recordsRef.current = records;
			(0, react.useEffect)(() => {
				if (!enabled) return;
				let frame = 0;
				let scroller = null;
				const measure = () => {
					frame = 0;
					const container = conversationContainer(sessionId);
					setCutoff(container === null ? void 0 : readingCutoff(container, recordsRef.current));
				};
				const schedule = () => {
					if (frame === 0) frame = requestAnimationFrame(measure);
				};
				const attach = () => {
					const container = conversationContainer(sessionId);
					const next = container === null ? null : conversationScroller(container);
					if (next === scroller) return;
					scroller?.removeEventListener("scroll", schedule);
					scroller = next;
					scroller?.addEventListener("scroll", schedule, { passive: true });
				};
				attach();
				schedule();
				const onResize = () => {
					attach();
					schedule();
				};
				window.addEventListener("resize", onResize);
				return () => {
					if (frame !== 0) cancelAnimationFrame(frame);
					scroller?.removeEventListener("scroll", schedule);
					window.removeEventListener("resize", onResize);
				};
			}, [
				sessionId,
				records,
				enabled
			]);
			return {
				cutoff,
				backToLatest: (0, react.useCallback)(() => {
					const container = conversationContainer(sessionId);
					const scroller = container === null ? null : conversationScroller(container);
					if (scroller === null) return;
					const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
					scroller.scrollTo({
						top: scroller.scrollHeight,
						behavior: reduced ? "auto" : "smooth"
					});
				}, [sessionId])
			};
		}
		/**
		* Build the jump action for one Session.
		* @param sessionId - Session whose transcript is scrolled.
		* @param ensureLoaded - pages the transcript back until the seq is loaded.
		* @returns a stable action revealing where a task started.
		*/
		function useJump(sessionId, ensureLoaded) {
			return (0, react.useCallback)((target) => {
				ensureLoaded(sessionId, target.contextSeq).catch(() => void 0).then(() => {
					requestAnimationFrame(() => {
						const container = conversationContainer(sessionId);
						if (container !== null) revealStart(container, target.recordId, target.turn);
					});
				});
			}, [sessionId, ensureLoaded]);
		}
		/**
		* Record the latest report as seen while this view is mounted and the page is visible.
		* @param sessionId - Session shown by the view.
		* @param latestSeq - seq of the latest report, if any.
		* @param markSeen - store action.
		*/
		function useMarkSeen(sessionId, latestSeq, markSeen) {
			(0, react.useEffect)(() => {
				if (latestSeq === void 0) return;
				const mark = () => {
					if (document.visibilityState === "visible") markSeen(sessionId, latestSeq);
				};
				mark();
				document.addEventListener("visibilitychange", mark);
				return () => {
					document.removeEventListener("visibilitychange", mark);
				};
			}, [
				sessionId,
				latestSeq,
				markSeen
			]);
		}
		//#endregion
		//#region src/client/TreeCards.tsx
		/** Dock card above the composer and floating card over the transcript, both showing one Session's tree. */
		const NO_RECORDS = Object.freeze([]);
		function useCardModel(props) {
			const { sessionId, records, running, useView, ensureLoaded, focusComposer, useInput, inputActions } = props;
			const { cutoff, backToLatest } = useReadingCutoff(sessionId, records, useView((view) => view.followScroll));
			const latestSeq = records[records.length - 1]?.seq;
			const live = cutoff === void 0 || latestSeq === void 0 || cutoff >= latestSeq;
			return {
				tree: (0, react.useMemo)(() => buildTree(records, live ? { settled: !running } : { cutoffSeq: cutoff }), [
					records,
					live,
					cutoff,
					running
				]),
				live,
				latestSeq,
				backToLatest,
				jump: useJump(sessionId, ensureLoaded),
				insert: useDecisionInsert({
					useInput,
					inputActions,
					focusComposer: (0, react.useCallback)(() => {
						focusComposer(sessionId);
					}, [focusComposer, sessionId])
				})
			};
		}
		function headerTitle(tree) {
			const key = tree.activeKey ?? tree.activeKeys[tree.activeKeys.length - 1];
			return key === void 0 ? "" : tree.byKey.get(key)?.title ?? "";
		}
		function SnapshotPill({ onClick, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "dsh-task-tree-pill",
				onClick,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("tree.snapshot") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-task-tree-pill-dot",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-task-tree-pill-action",
						children: t("tree.backToLatest")
					})
				]
			});
		}
		function ModeButton({ mode, onClick, t }) {
			const label = t(mode === "dock" ? "mode.toFloating" : "mode.toDock");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label,
				side: "bottom",
				portal: true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dsh-task-tree-icon-button",
					"aria-label": label,
					onClick,
					children: mode === "dock" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineRegular, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinOutlineRegular, { size: 14 })
				})
			});
		}
		/**
		* Dock entry: a collapsible card above the composer while the dock mode is selected.
		* @param props - framework Session seats, preference, callbacks, and copy.
		* @returns the card, or nothing without reports or in floating mode.
		*/
		function DockEntry(props) {
			const records = props.useProjection("taskTree", (value) => value?.records ?? NO_RECORDS);
			if (props.useView((view) => view.mode) !== "dock" || records.length === 0) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DockCard, {
				...props,
				records
			});
		}
		function DockCard(props) {
			const { sessionId, useSession, useView, setDockExpanded, setMode, markSeen, t } = props;
			const expanded = useView((view) => view.dockExpanded);
			const running = useSession((session) => session.running);
			const model = useCardModel({
				...props,
				running
			});
			useMarkSeen(sessionId, model.latestSeq, markSeen);
			const title = headerTitle(model.tree);
			const bodyId = `dsh-task-tree-dock-${sessionId}`;
			const toggleLabel = t(expanded ? "dock.collapse" : "dock.expand");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dsh-task-tree-dock",
				"aria-label": t("tree.label"),
				"data-expanded": expanded || void 0,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-task-tree-card-header",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "dsh-task-tree-card-toggle",
							"aria-expanded": expanded,
							"aria-controls": bodyId,
							"aria-label": toggleLabel,
							onClick: () => {
								setDockExpanded(!expanded);
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-card-lead",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutlineRegular, { size: 16 })
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-card-title",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.TextShimmer, {
									active: running && model.live,
									children: title
								})
							})]
						}),
						!model.live && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SnapshotPill, {
							onClick: model.backToLatest,
							t
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModeButton, {
							mode: "dock",
							onClick: () => {
								setMode("floating");
							},
							t
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-task-tree-icon-button",
							"aria-hidden": "true",
							tabIndex: -1,
							onClick: () => {
								setDockExpanded(!expanded);
							},
							children: expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronUpOutlineRegular, { size: 14 })
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-task-tree-collapse",
					id: bodyId,
					"data-open": expanded || void 0,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-collapse-inner",
						...expanded ? {} : { inert: "" },
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-task-tree-scroll",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TreeView, {
								tree: model.tree,
								sessionId,
								live: model.live,
								running,
								onJump: model.jump,
								...model.insert,
								t
							})
						})
					})
				})]
			});
		}
		/**
		* Header utility: toggles the floating card while the floating mode is selected.
		* @param props - framework Session seats, preference, callbacks, and copy.
		* @returns the toggle and its portaled card, or nothing.
		*/
		function FloatEntry(props) {
			const records = props.useProjection("taskTree", (value) => value?.records ?? NO_RECORDS);
			const mode = props.useView((view) => view.mode);
			const openState = props.useSession((session) => session.openState);
			const open = props.useView((view) => view.floatOpen);
			if (mode !== "floating" || openState !== "open" || records.length === 0) return null;
			const label = props.t(open ? "float.hide" : "float.show");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label,
				side: "bottom",
				align: "end",
				portal: true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dsh-task-tree-header-toggle",
					"aria-label": label,
					"aria-pressed": open,
					onClick: () => {
						props.setFloatOpen(!open);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWorkspaceTreeOutlineRegular, { size: 16 })
				})
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FloatCard, {
				...props,
				records,
				open
			})] });
		}
		const INSET = 12;
		const WIDTH = 320;
		function useContainerPlacement(sessionId) {
			const [placement, setPlacement] = (0, react.useState)();
			(0, react.useEffect)(() => {
				let observed = null;
				const observer = new ResizeObserver(() => {
					measure();
				});
				function measure() {
					const container = conversationContainer(sessionId);
					if (container !== observed) {
						if (observed !== null) observer.unobserve(observed);
						observed = container;
						if (container !== null) observer.observe(container);
					}
					if (container === null) {
						setPlacement(void 0);
						return;
					}
					const rect = container.getBoundingClientRect();
					const width = Math.max(0, Math.min(WIDTH, rect.width - INSET * 2));
					const next = {
						top: rect.top + INSET,
						left: rect.right - INSET - width,
						width,
						maxHeight: Math.max(0, rect.height / 2)
					};
					setPlacement((current) => current !== void 0 && current.top === next.top && current.left === next.left && current.width === next.width && current.maxHeight === next.maxHeight ? current : next);
				}
				measure();
				window.addEventListener("resize", measure);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", measure);
				};
			}, [sessionId]);
			return placement;
		}
		function FloatCard(props) {
			const { sessionId, open, useSession, setFloatOpen, setMode, markSeen, t } = props;
			const running = useSession((session) => session.running);
			const model = useCardModel({
				...props,
				running
			});
			useMarkSeen(sessionId, open ? model.latestSeq : void 0, markSeen);
			const placement = useContainerPlacement(sessionId);
			if (placement === void 0) return null;
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dsh-task-tree-float",
				style: {
					top: placement.top,
					left: placement.left,
					width: placement.width,
					maxHeight: placement.maxHeight
				},
				"data-open": open || void 0,
				"aria-label": t("tree.label"),
				"aria-hidden": !open || void 0,
				...open ? {} : { inert: "" },
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-task-tree-card-header",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-card-lead",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChecklistOutlineRegular, { size: 16 })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-task-tree-card-title",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.TextShimmer, {
									active: running && model.live,
									children: headerTitle(model.tree)
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModeButton, {
								mode: "floating",
								onClick: () => {
									setMode("dock");
								},
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
								label: t("float.close"),
								side: "bottom",
								align: "end",
								portal: true,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dsh-task-tree-icon-button",
									"aria-label": t("float.close"),
									onClick: () => {
										setFloatOpen(false);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, { size: 14 })
								})
							})
						]
					}),
					!model.live && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-pill-row",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SnapshotPill, {
							onClick: model.backToLatest,
							t
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-task-tree-scroll dsh-task-tree-float-scroll",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TreeView, {
							tree: model.tree,
							sessionId,
							live: model.live,
							running,
							onJump: model.jump,
							...model.insert,
							t
						})
					})
				]
			}), document.body);
		}
		//#endregion
		//#region src/client/index.ts
		/** Host configuration entry id, also the settings namespace. */
		const CONFIG_NAMESPACE = "task-tree";
		const PANEL_ID = "task-tree";
		/** npm package name keying the bundle configuration page. */
		const PACKAGE_NAME = "dsh-task-tree";
		/** Services read by the contributions. */
		const inject = [
			"slots",
			"locale",
			"uiConversation",
			"conversation",
			"sessions",
			"connection",
			"uiWorkspace",
			"workspaces",
			"configForms",
			"remote",
			"remote.session"
		];
		/**
		* Whether a Session can be opened from the Tasks panel.
		* @param ctx - plugin context.
		* @param id - listed Session.
		* @returns true when the Host lists it and it is not archived.
		*/
		function canOpen(ctx, id) {
			const sessions = ctx.sessions.list.getSnapshot();
			const workspaces = ctx.workspaces.list.getSnapshot();
			if (workspaces.state === "error" || sessions.phase === "pending" || workspaces.phase === "pending") return false;
			return !workspaces.archivedSessionIds.includes(id) && sessions.ids.includes(id);
		}
		/**
		* Register every task-tree contribution.
		* @param ctx - browser plugin context.
		*/
		function apply(ctx) {
			const connection = ctx.get("connection");
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}));
			const panelLabel = ctx.locale.bind(NS);
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.dshTaskTree = "";
				style.textContent = styles;
				document.head.append(style);
				return () => style.remove();
			});
			ctx.uiConversation.events.register(taskChangeDefinition);
			const view = createViewStore();
			const seen = createSeenStore();
			const taskList = createTaskListSource({
				call: async () => {
					const result = await connection.rpc.call(TASK_TREE_CHANNEL, LIST_METHOD, {});
					if (!result.ok) throw new Error(result.error.message);
					return result.value;
				},
				onRows: (rows) => {
					seen.prune(new Set(rows.map((row) => row.sessionId)));
				}
			});
			const markSeen = (sessionId, seq) => {
				seen.markSeen(sessionId, seq);
			};
			const focusComposer = (sessionId) => {
				const binding = ctx.sessions.binding(sessionId);
				if (binding !== void 0) ctx.conversation.input.for(binding.ctx).focus();
			};
			const composer = { focusComposer };
			const cards = {
				hooks: { view },
				setMode: (mode) => {
					view.setMode(mode);
				},
				setDockExpanded: (expanded) => {
					view.setDockExpanded(expanded);
				},
				setFloatOpen: (open) => {
					view.setFloatOpen(open);
				},
				markSeen,
				focusComposer,
				ensureLoaded: async (sessionId, seq) => {
					await ctx.sessions.binding(sessionId)?.session.loadThrough(seq);
				}
			};
			const tasks = {
				hooks: {
					taskList,
					seen
				},
				openSession: (sessionId, seq) => {
					if (!canOpen(ctx, sessionId)) return;
					seen.markSeen(sessionId, seq);
					ctx.uiWorkspace.openSession(sessionId);
				},
				retry: () => taskList.refresh()
			};
			const form = ctx.configForms.get(CONFIG_NAMESPACE);
			const catalog = createModelCatalogSource(() => ctx.remote.session.modelCatalog());
			ctx.effect(() => ctx.remote.$on("llm/adapters-updated", () => {
				catalog.refresh();
			}));
			ctx.effect(() => ctx.on("connection/reset", () => {
				catalog.reset();
			}));
			const configPage = {
				hooks: {
					config: form,
					view,
					catalog
				},
				retryCatalog: () => {
					catalog.refresh();
				},
				setConfig: (field, value) => form.set(field, value).catch(() => false),
				setMode: (mode) => {
					view.setMode(mode);
				},
				setFollowScroll: (follow) => {
					view.setFollowScroll(follow);
				}
			};
			ctx.slots.inject("conversation.chat.node", () => ctx.slots.register({
				name: "conversation.chat.node",
				key: CHANGE_KIND,
				locale: NS,
				inject: () => composer
			}, ChangeNode));
			ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
				name: "conversation.input.dock",
				id: "task-tree",
				order: 1,
				locale: NS,
				inject: () => cards
			}, DockEntry));
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "task-tree",
				order: -6,
				locale: NS,
				inject: () => cards
			}, FloatEntry));
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PANEL_ID,
				locale: NS,
				inject: () => tasks
			}, TasksPage));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PANEL_ID,
				order: 15,
				locale: NS,
				label: () => panelLabel("panel"),
				inject: () => tasks
			}, TasksIcon));
			ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: PACKAGE_NAME,
				locale: NS,
				inject: () => configPage
			}, ConfigPage));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map