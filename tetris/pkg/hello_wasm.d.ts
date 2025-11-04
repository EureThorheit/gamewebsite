/* tslint:disable */
/* eslint-disable */
export enum TetrominoColor {
  NONE = 0,
  LightBlue = 1,
  Yellow = 2,
  Purple = 3,
  Green = 4,
  Red = 5,
  Blue = 6,
  Orange = 7,
}
export class Grid {
  free(): void;
  [Symbol.dispose](): void;
  constructor(size_x: number, size_y: number, tetromino_type: number);
  move_tetromino_right(): void;
  move_tetromino_left(): void;
  move_tetromino_down(new_tetromino: number): boolean;
  rotate_tetromino_right(): void;
  rotate_tetromino_left(): void;
  checked_spawn(tetromino: number): boolean;
  clear_line(): void;
  get_level(): number;
  get_score(): number;
  get_print(index: number): Print;
}
export class Print {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  color: TetrominoColor;
  text: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_grid_free: (a: number, b: number) => void;
  readonly grid_new: (a: number, b: number, c: number) => number;
  readonly grid_move_tetromino_right: (a: number) => void;
  readonly grid_move_tetromino_left: (a: number) => void;
  readonly grid_move_tetromino_down: (a: number, b: number) => number;
  readonly grid_rotate_tetromino_right: (a: number) => void;
  readonly grid_rotate_tetromino_left: (a: number) => void;
  readonly grid_checked_spawn: (a: number, b: number) => number;
  readonly grid_clear_line: (a: number) => void;
  readonly grid_get_level: (a: number) => number;
  readonly grid_get_score: (a: number) => number;
  readonly grid_get_print: (a: number, b: number) => number;
  readonly __wbg_print_free: (a: number, b: number) => void;
  readonly __wbg_get_print_color: (a: number) => number;
  readonly __wbg_set_print_color: (a: number, b: number) => void;
  readonly __wbg_get_print_text: (a: number) => number;
  readonly __wbg_set_print_text: (a: number, b: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
