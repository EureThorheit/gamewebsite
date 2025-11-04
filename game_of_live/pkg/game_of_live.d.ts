/* tslint:disable */
/* eslint-disable */
export class CellID {
  free(): void;
  [Symbol.dispose](): void;
  constructor(chunk_pos_x: number, chunk_pos_y: number, index: number);
  chunk_pos_x: number;
  chunk_pos_y: number;
  cell_index: number;
}
export class Chunk {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  cell_alive(index: number): boolean;
  set_cell_alive(index: number): void;
  static new(pos_x: number, pos_y: number): Chunk;
  cells(): BigUint64Array;
  active(): boolean;
  flip_cell(index: number): void;
  get_pos_x(): number;
  get_pos_y(): number;
}
export class ChunkSimd {
  free(): void;
  [Symbol.dispose](): void;
  cell_alive(index: number): boolean;
  set_cell_alive(index: bigint): void;
  constructor(pos_x: number, pos_y: number);
  cells(): BigUint64Array;
  active(): boolean;
  flip_cell(index: bigint): void;
  get_pos_x(): number;
  get_pos_y(): number;
}
export class Grid {
  free(): void;
  [Symbol.dispose](): void;
  get_iteration(): bigint;
  get_active_chunks(): Chunk[];
  constructor();
  update(): void;
  add_chunk(chunk: Chunk): void;
  flip_cell(cell: CellID): void;
  get_chunk(key: KeySimd): Chunk;
}
export class GridSimd {
  free(): void;
  [Symbol.dispose](): void;
  get_iteration(): bigint;
  get_active_chunks(): ChunkSimd[];
  constructor();
  update(): void;
  add_chunk(chunk: ChunkSimd): void;
  flip_cell(cell: CellID): void;
  get_chunk(key: Key): ChunkSimd;
}
export class Key {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
}
export class KeySimd {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_chunksimd_free: (a: number, b: number) => void;
  readonly __wbg_gridsimd_free: (a: number, b: number) => void;
  readonly __wbg_key_free: (a: number, b: number) => void;
  readonly chunksimd_active: (a: number) => number;
  readonly chunksimd_cell_alive: (a: number, b: number) => number;
  readonly chunksimd_cells: (a: number) => [number, number];
  readonly chunksimd_flip_cell: (a: number, b: bigint) => void;
  readonly chunksimd_get_pos_x: (a: number) => number;
  readonly chunksimd_get_pos_y: (a: number) => number;
  readonly chunksimd_new: (a: number, b: number) => number;
  readonly chunksimd_set_cell_alive: (a: number, b: bigint) => void;
  readonly gridsimd_add_chunk: (a: number, b: number) => void;
  readonly gridsimd_flip_cell: (a: number, b: number) => void;
  readonly gridsimd_get_active_chunks: (a: number) => [number, number];
  readonly gridsimd_get_chunk: (a: number, b: number) => number;
  readonly gridsimd_get_iteration: (a: number) => bigint;
  readonly gridsimd_new: () => number;
  readonly gridsimd_update: (a: number) => void;
  readonly __wbg_cellid_free: (a: number, b: number) => void;
  readonly __wbg_chunk_free: (a: number, b: number) => void;
  readonly __wbg_get_cellid_cell_index: (a: number) => number;
  readonly __wbg_get_cellid_chunk_pos_x: (a: number) => number;
  readonly __wbg_get_cellid_chunk_pos_y: (a: number) => number;
  readonly __wbg_grid_free: (a: number, b: number) => void;
  readonly __wbg_keysimd_free: (a: number, b: number) => void;
  readonly __wbg_set_cellid_cell_index: (a: number, b: number) => void;
  readonly __wbg_set_cellid_chunk_pos_x: (a: number, b: number) => void;
  readonly __wbg_set_cellid_chunk_pos_y: (a: number, b: number) => void;
  readonly cellid_new: (a: number, b: number, c: number) => number;
  readonly chunk_active: (a: number) => number;
  readonly chunk_cell_alive: (a: number, b: number) => number;
  readonly chunk_cells: (a: number) => [number, number];
  readonly chunk_flip_cell: (a: number, b: number) => void;
  readonly chunk_get_pos_x: (a: number) => number;
  readonly chunk_get_pos_y: (a: number) => number;
  readonly chunk_new: (a: number, b: number) => number;
  readonly chunk_set_cell_alive: (a: number, b: number) => void;
  readonly grid_add_chunk: (a: number, b: number) => void;
  readonly grid_flip_cell: (a: number, b: number) => void;
  readonly grid_get_active_chunks: (a: number) => [number, number];
  readonly grid_get_chunk: (a: number, b: number) => number;
  readonly grid_get_iteration: (a: number) => bigint;
  readonly grid_new: () => number;
  readonly grid_update: (a: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
