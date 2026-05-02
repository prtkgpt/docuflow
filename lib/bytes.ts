// Convert any Buffer/Uint8Array/ArrayBuffer to a plain Uint8Array backed
// by a fresh ArrayBuffer (never SharedArrayBuffer or Buffer<ArrayBufferLike>).
// This is required because newer TS DOM libs reject the wider
// `Uint8Array<ArrayBufferLike>` type for things like pdf-lib's load(),
// Response body and BlobPart.
export function toUint8(input: Buffer | Uint8Array | ArrayBuffer): Uint8Array {
  if (input instanceof ArrayBuffer) {
    const view = new Uint8Array(input);
    const out = new Uint8Array(view.byteLength);
    out.set(view);
    return out;
  }
  const out = new Uint8Array(input.byteLength);
  out.set(new Uint8Array(input.buffer, input.byteOffset, input.byteLength));
  return out;
}
