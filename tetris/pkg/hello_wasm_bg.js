let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


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

function _assertChar(c) {
    if (typeof(c) === 'number' && (c >= 0x110000 || (c >= 0xD800 && c < 0xE000))) throw new Error(`expected a valid Unicode scalar value, found ${c}`);
}
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
export const TetrominoColor = Object.freeze({
    NONE: 0, "0": "NONE",
    LightBlue: 1, "1": "LightBlue",
    Yellow: 2, "2": "Yellow",
    Purple: 3, "3": "Purple",
    Green: 4, "4": "Green",
    Red: 5, "5": "Red",
    Blue: 6, "6": "Blue",
    Orange: 7, "7": "Orange",
});

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
     * @param {number} size_x
     * @param {number} size_y
     * @param {number} tetromino_type
     */
    constructor(size_x, size_y, tetromino_type) {
        const ret = wasm.grid_new(size_x, size_y, tetromino_type);
        this.__wbg_ptr = ret >>> 0;
        GridFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    move_tetromino_right() {
        wasm.grid_move_tetromino_right(this.__wbg_ptr);
    }
    move_tetromino_left() {
        wasm.grid_move_tetromino_left(this.__wbg_ptr);
    }
    /**
     * @param {number} new_tetromino
     * @returns {boolean}
     */
    move_tetromino_down(new_tetromino) {
        const ret = wasm.grid_move_tetromino_down(this.__wbg_ptr, new_tetromino);
        return ret !== 0;
    }
    rotate_tetromino_right() {
        wasm.grid_rotate_tetromino_right(this.__wbg_ptr);
    }
    rotate_tetromino_left() {
        wasm.grid_rotate_tetromino_left(this.__wbg_ptr);
    }
    /**
     * @param {number} tetromino
     * @returns {boolean}
     */
    checked_spawn(tetromino) {
        const ret = wasm.grid_checked_spawn(this.__wbg_ptr, tetromino);
        return ret !== 0;
    }
    clear_line() {
        wasm.grid_clear_line(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get_level() {
        const ret = wasm.grid_get_level(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_score() {
        const ret = wasm.grid_get_score(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Print}
     */
    get_print(index) {
        const ret = wasm.grid_get_print(this.__wbg_ptr, index);
        return Print.__wrap(ret);
    }
}
if (Symbol.dispose) Grid.prototype[Symbol.dispose] = Grid.prototype.free;

const PrintFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_print_free(ptr >>> 0, 1));

export class Print {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Print.prototype);
        obj.__wbg_ptr = ptr;
        PrintFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrintFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_print_free(ptr, 0);
    }
    /**
     * @returns {TetrominoColor}
     */
    get color() {
        const ret = wasm.__wbg_get_print_color(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {TetrominoColor} arg0
     */
    set color(arg0) {
        wasm.__wbg_set_print_color(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string}
     */
    get text() {
        const ret = wasm.__wbg_get_print_text(this.__wbg_ptr);
        return String.fromCodePoint(ret);
    }
    /**
     * @param {string} arg0
     */
    set text(arg0) {
        const char0 = arg0.codePointAt(0);
        _assertChar(char0);
        wasm.__wbg_set_print_text(this.__wbg_ptr, char0);
    }
}
if (Symbol.dispose) Print.prototype[Symbol.dispose] = Print.prototype.free;

export function __wbg_wbindgenthrow_451ec1a8469d7eb6(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

