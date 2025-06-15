import type {ShapeType} from "@/lib/types";

interface ShapeRendererProps {
    shape: ShapeType;
    size: number;
}

export default function ShapeRenderer({shape, size}: ShapeRendererProps) {
    switch (shape) {
        case "Circle":
            return <div style={{width: size, height: size}} className="rounded-full bg-blue-400"/>;
        case "Square":
            return <div style={{width: size, height: size}} className="bg-green-400"/>;
        case "Triangle":
            return (
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`,
                        borderBottom: `${size}px solid red`,
                    }}
                />
            );
        default:
            return null;
    }
}
