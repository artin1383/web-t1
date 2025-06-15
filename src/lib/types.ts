export const shapesList = ["Circle", "Square", "Triangle"] as const;
export type ShapeType = typeof shapesList[number];

export interface CanvasItem {
    id: number;
    shape: ShapeType;
    x: number;
    y: number;
    size: number;
}

export interface NewShapeSession {
    shape: ShapeType;
    offsetX: number;
    offsetY: number;
}
