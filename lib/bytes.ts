// Convert any Buffer/Uint8Array to a plain Uint8Array.
// Newer TypeScript DOM libs reject `Buffer<ArrayBufferLike>` where a plain
// `Uint8Array` is expected (e.g. pdf-lib's load, Response body). This helper
// normalizes the type without copying when the input is already a Uint8Array.
export function toUint8(input: Buffer | Uint8Array | ArrayBuffer): Uint8Array {
  if (input instanceof Uint8Array) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  return new Uint8Array(input);
}
