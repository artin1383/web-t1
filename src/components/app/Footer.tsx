import {type CanvasItem, shapesList} from "@/lib/types";
import ShapeRenderer from "./ShapeRenderer";

interface FooterProps {
    canvasItems: CanvasItem[];
}

export default function Footer({canvasItems}: FooterProps) {
    return (
        <footer className="bg-white p-4 rounded shadow flex justify-center gap-8">
            {shapesList.map((shape) => (
                <div key={shape} className="flex items-center gap-2">
                    <ShapeRenderer shape={shape} size={24}/>
                    <span className="text-lg font-semibold">
            {canvasItems.filter((s) => s.shape === shape).length}
          </span>
                </div>
            ))}
        </footer>
    );
}
