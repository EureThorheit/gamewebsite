let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

let cachedBigUint64ArrayMemory0 = null;

function getBigUint64ArrayMemory0() {
    if (cachedBigUint64ArrayMemory0 === null || cachedBigUint64ArrayMemory0.byteLength === 0) {
        cachedBigUint64ArrayMemory0 = new BigUint64Array(wasm.memory.buffer);
    }
    return cachedBigUint64ArrayMemory0;
}

function getArrayU64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getBigUint64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

const CellIDFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cellid_free(ptr >>> 0, 1));

export class CellID {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellIDFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cellid_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get chunk_pos_x() {
        const ret = wasm.__wbg_get_cellid_chunk_pos_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set chunk_pos_x(arg0) {
        wasm.__wbg_set_cellid_chunk_pos_x(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get chunk_pos_y() {
        const ret = wasm.__wbg_get_cellid_chunk_pos_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set chunk_pos_y(arg0) {
        wasm.__wbg_set_cellid_chunk_pos_y(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get cell_index() {
        const ret = wasm.__wbg_get_cellid_cell_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set cell_index(arg0) {
        wasm.__wbg_set_cellid_cell_index(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} chunk_pos_x
     * @param {number} chunk_pos_y
     * @param {number} index
     */
    constructor(chunk_pos_x, chunk_pos_y, index) {
        const ret = wasm.cellid_new(chunk_pos_x, chunk_pos_y, index);
        this.__wbg_ptr = ret >>> 0;
        CellIDFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) CellID.prototype[Symbol.dispose] = CellID.prototype.free;

const ChunkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chunk_free(ptr >>> 0, 1));

export class Chunk {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Chunk.prototype);
        obj.__wbg_ptr = ptr;
        ChunkFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChunkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chunk_free(ptr, 0);
    }
    /**
     * @param {number} index
     * @returns {boolean}
     */
    cell_alive(index) {
        const ret = wasm.chunk_cell_alive(this.__wbg_ptr, index);
        return ret !== 0;
    }
    /**
     * @param {number} index
     */
    set_cell_alive(index) {
        wasm.chunk_set_cell_alive(this.__wbg_ptr, index);
    }
    /**
     * @param {number} pos_x
     * @param {number} pos_y
     * @returns {Chunk}
     */
    static new(pos_x, pos_y) {
        const ret = wasm.chunk_new(pos_x, pos_y);
        return Chunk.__wrap(ret);
    }
    /**
     * @returns {BigUint64Array}
     */
    cells() {
        const ret = wasm.chunk_cells(this.__wbg_ptr);
        var v1 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * @returns {boolean}
     */
    active() {
        const ret = wasm.chunk_active(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} index
     */
    flip_cell(index) {
        wasm.chunk_flip_cell(this.__wbg_ptr, index);
    }
    /**
     * @returns {number}
     */
    get_pos_x() {
        const ret = wasm.chunk_get_pos_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_pos_y() {
        const ret = wasm.chunk_get_pos_y(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) Chunk.prototype[Symbol.dispose] = Chunk.prototype.free;

const ChunkSimdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chunksimd_free(ptr >>> 0, 1));

export class ChunkSimd {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChunkSimd.prototype);
        obj.__wbg_ptr = ptr;
        ChunkSimdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChunkSimdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chunksimd_free(ptr, 0);
    }
    /**
     * @param {number} index
     * @returns {boolean}
     */
    cell_alive(index) {
        const ret = wasm.chunksimd_cell_alive(this.__wbg_ptr, index);
        return ret !== 0;
    }
    /**
     * @param {bigint} index
     */
    set_cell_alive(index) {
        wasm.chunksimd_set_cell_alive(this.__wbg_ptr, index);
    }
    /**
     * @param {number} pos_x
     * @param {number} pos_y
     */
    constructor(pos_x, pos_y) {
        const ret = wasm.chunksimd_new(pos_x, pos_y);
        this.__wbg_ptr = ret >>> 0;
        ChunkSimdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {BigUint64Array}
     */
    cells() {
        const ret = wasm.chunksimd_cells(this.__wbg_ptr);
        var v1 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * @returns {boolean}
     */
    active() {
        const ret = wasm.chunksimd_active(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {bigint} index
     */
    flip_cell(index) {
        wasm.chunksimd_flip_cell(this.__wbg_ptr, index);
    }
    /**
     * @returns {number}
     */
    get_pos_x() {
        const ret = wasm.chunksimd_get_pos_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_pos_y() {
        const ret = wasm.chunksimd_get_pos_y(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) ChunkSimd.prototype[Symbol.dispose] = ChunkSimd.prototype.free;

const GridFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_grid_free(ptr >>> 0, 1));

export class Grid {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GridFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_grid_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get_iteration() {
        const ret = wasm.grid_get_iteration(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {Chunk[]}
     */
    get_active_chunks() {
        const ret = wasm.grid_get_active_chunks(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    constructor() {
        const ret = wasm.grid_new();
        this.__wbg_ptr = ret >>> 0;
        GridFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    update() {
        wasm.grid_update(this.__wbg_ptr);
    }
    /**
     * @param {Chunk} chunk
     */
    add_chunk(chunk) {
        _assertClass(chunk, Chunk);
        var ptr0 = chunk.__destroy_into_raw();
        wasm.grid_add_chunk(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {CellID} cell
     */
    flip_cell(cell) {
        _assertClass(cell, CellID);
        var ptr0 = cell.__destroy_into_raw();
        wasm.grid_flip_cell(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {KeySimd} key
     * @returns {Chunk}
     */
    get_chunk(key) {
        _assertClass(key, KeySimd);
        var ptr0 = key.__destroy_into_raw();
        const ret = wasm.grid_get_chunk(this.__wbg_ptr, ptr0);
        return Chunk.__wrap(ret);
    }
}
if (Symbol.dispose) Grid.prototype[Symbol.dispose] = Grid.prototype.free;

const GridSimdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_gridsimd_free(ptr >>> 0, 1));

export class GridSimd {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GridSimdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gridsimd_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get_iteration() {
        const ret = wasm.gridsimd_get_iteration(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {ChunkSimd[]}
     */
    get_active_chunks() {
        const ret = wasm.gridsimd_get_active_chunks(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    constructor() {
        const ret = wasm.gridsimd_new();
        this.__wbg_ptr = ret >>> 0;
        GridSimdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    update() {
        wasm.gridsimd_update(this.__wbg_ptr);
    }
    /**
     * @param {ChunkSimd} chunk
     */
    add_chunk(chunk) {
        _assertClass(chunk, ChunkSimd);
        var ptr0 = chunk.__destroy_into_raw();
        wasm.gridsimd_add_chunk(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {CellID} cell
     */
    flip_cell(cell) {
        _assertClass(cell, CellID);
        var ptr0 = cell.__destroy_into_raw();
        wasm.gridsimd_flip_cell(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {Key} key
     * @returns {ChunkSimd}
     */
    get_chunk(key) {
        _assertClass(key, Key);
        var ptr0 = key.__destroy_into_raw();
        const ret = wasm.gridsimd_get_chunk(this.__wbg_ptr, ptr0);
        return ChunkSimd.__wrap(ret);
    }
}
if (Symbol.dispose) GridSimd.prototype[Symbol.dispose] = GridSimd.prototype.free;

const KeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_key_free(ptr >>> 0, 1));

export class Key {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_key_free(ptr, 0);
    }
}
if (Symbol.dispose) Key.prototype[Symbol.dispose] = Key.prototype.free;

const KeySimdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keysimd_free(ptr >>> 0, 1));

export class KeySimd {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeySimdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keysimd_free(ptr, 0);
    }
}
if (Symbol.dispose) KeySimd.prototype[Symbol.dispose] = KeySimd.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_throw_b855445ff6a94295 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_chunk_new = function(arg0) {
        const ret = Chunk.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_chunksimd_new = function(arg0) {
        const ret = ChunkSimd.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigUint64ArrayMemory0 = null;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('game_of_live_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
