/* tslint:disable */
/* eslint-disable */
export enum CellState {
  Empty = 0,
  Red = 1,
  Green = 2,
}
export class Board {
  free(): void;
  [Symbol.dispose](): void;
  constructor(size: number);
  get_cell(row: number, col: number): Cell;
  set_cell(row: number, col: number, color: CellState): boolean;
  skip_player(color: CellState): boolean;
  game_over(): boolean;
  cells_of_color(color: CellState): number;
  best_move(color: CellState): Index;
}
export class Cell {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  state: CellState;
}
export class Index {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  row: number;
  col: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_cell_free: (a: number, b: number) => void;
  readonly __wbg_get_cell_state: (a: number) => number;
  readonly __wbg_set_cell_state: (a: number, b: number) => void;
  readonly __wbg_board_free: (a: number, b: number) => void;
  readonly board_new: (a: number) => number;
  readonly board_get_cell: (a: number, b: number, c: number) => number;
  readonly board_set_cell: (a: number, b: number, c: number, d: number) => number;
  readonly board_skip_player: (a: number, b: number) => number;
  readonly board_game_over: (a: number) => number;
  readonly board_cells_of_color: (a: number, b: number) => number;
  readonly board_best_move: (a: number, b: number) => number;
  readonly __wbg_index_free: (a: number, b: number) => void;
  readonly __wbg_get_index_row: (a: number) => number;
  readonly __wbg_set_index_row: (a: number, b: number) => void;
  readonly __wbg_get_index_col: (a: number) => number;
  readonly __wbg_set_index_col: (a: number, b: number) => void;
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
