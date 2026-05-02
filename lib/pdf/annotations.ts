// Shared annotation types used by the client editor and the server-side
// pdf-lib renderer. Coordinates are normalized to 0..1 of the page (top-left
// origin, y increases downward — same as a screen). The server flips Y when
// baking into PDF coordinates.

export type AnnotationBase = { id: string; page: number };

export type FontFamily = "helvetica" | "times" | "courier";
export type Align = "left" | "center" | "right";

export type TextAnnotation = AnnotationBase & {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;          // points
  color: string;             // #rrggbb
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: Align;
  fontFamily?: FontFamily;
  width?: number;            // optional bounding-box width (normalized)
};

export type HighlightAnnotation = AnnotationBase & {
  type: "highlight";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  opacity?: number;          // 0..1, default ~0.35
};

export type PencilAnnotation = AnnotationBase & {
  type: "pencil";
  points: [number, number][];
  color: string;
  width: number;             // points
};

export type MarkAnnotation = AnnotationBase & {
  type: "check" | "cross";
  x: number;
  y: number;
  size: number;              // normalized fraction of page width
  color: string;
};

export type ImageAnnotation = AnnotationBase & {
  type: "image";
  x: number;
  y: number;
  w: number;
  h: number;
  dataUrl: string;
};

export type SignatureAnnotation = AnnotationBase & {
  type: "signature";
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  dataUrl?: string;
};

export type EllipseAnnotation = AnnotationBase & {
  type: "ellipse";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;             // border color
  fill?: string | null;      // optional fill
  opacity?: number;          // 0..1
  borderWidth?: number;      // points
};

export type NoteAnnotation = AnnotationBase & {
  type: "note";
  x: number;
  y: number;
  text: string;
  color: string;
};

export type LinkAnnotation = AnnotationBase & {
  type: "link";
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  color: string;
};

export type Annotation =
  | TextAnnotation
  | HighlightAnnotation
  | PencilAnnotation
  | MarkAnnotation
  | ImageAnnotation
  | SignatureAnnotation
  | EllipseAnnotation
  | NoteAnnotation
  | LinkAnnotation;
