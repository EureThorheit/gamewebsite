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
/**
 * @enum {0 | 1 | 2}
 */
export const CellState = Object.freeze({
    Empty: 0, "0": "Empty",
    Red: 1, "1": "Red",
    Green: 2, "2": "Green",
});

const BoardFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_board_free(ptr >>> 0, 1));

export class Board {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoardFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_board_free(ptr, 0);
    }
    /**
     * @param {number} size
     */
    constructor(size) {
        const ret = wasm.board_new(size);
        this.__wbg_ptr = ret >>> 0;
        BoardFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} row
     * @param {number} col
     * @returns {Cell}
     */
    get_cell(row, col) {
        const ret = wasm.board_get_cell(this.__wbg_ptr, row, col);
        return Cell.__wrap(ret);
    }
    /**
     * @param {number} row
     * @param {number} col
     * @param {CellState} color
     * @returns {boolean}
     */
    set_cell(row, col, color) {
        const ret = wasm.board_set_cell(this.__wbg_ptr, row, col, color);
        return ret !== 0;
    }
    /**
     * @param {CellState} color
     * @returns {boolean}
     */
    skip_player(color) {
        const ret = wasm.board_skip_player(this.__wbg_ptr, color);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    game_over() {
        const ret = wasm.board_game_over(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {CellState} color
     * @returns {number}
     */
    cells_of_color(color) {
        const ret = wasm.board_cells_of_color(this.__wbg_ptr, color);
        return ret >>> 0;
    }
    /**
     * @param {CellState} color
     * @returns {Index}
     */
    best_move(color) {
        const ret = wasm.board_best_move(this.__wbg_ptr, color);
        return Index.__wrap(ret);
    }
}
if (Symbol.dispose) Board.prototype[Symbol.dispose] = Board.prototype.free;

const CellFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cell_free(ptr >>> 0, 1));

export class Cell {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Cell.prototype);
        obj.__wbg_ptr = ptr;
        CellFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cell_free(ptr, 0);
    }
    /**
     * @returns {CellState}
     */
    get state() {
        const ret = wasm.__wbg_get_cell_state(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {CellState} arg0
     */
    set state(arg0) {
        wasm.__wbg_set_cell_state(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Cell.prototype[Symbol.dispose] = Cell.prototype.free;

const IndexFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_index_free(ptr >>> 0, 1));

export class Index {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Index.prototype);
        obj.__wbg_ptr = ptr;
        IndexFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IndexFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_index_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get row() {
        const ret = wasm.__wbg_get_index_row(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set row(arg0) {
        wasm.__wbg_set_index_row(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get col() {
        const ret = wasm.__wbg_get_index_col(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set col(arg0) {
        wasm.__wbg_set_index_col(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Index.prototype[Symbol.dispose] = Index.prototype.free;

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
    imports.wbg.__wbg_wbindgenthrow_451ec1a8469d7eb6 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
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

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
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

    __wbg_init_memory(imports);

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
        module_or_path = new URL('reversi_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
