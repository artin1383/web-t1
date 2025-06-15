import React from "react";
import {shapesList, type ShapeType} from "@/lib/types";
import ShapeRenderer from "./ShapeRenderer";

interface SidebarProps {
    handleStartCreateShape: (e: React.MouseEvent<HTMLDivElement>, shape: ShapeType) => void;
}

export default function Sidebar({handleStartCreateShape}: SidebarProps) {
    return (
        <aside className="w-48 bg-white p-4 rounded shadow flex flex-col items-center gap-4">
            {shapesList.map((shape) => (
                <div
                    key={shape}
                    className="cursor-pointer p-2 border rounded w-16 h-16 flex items-center justify-center"
                    onMouseDown={(e) => handleStartCreateShape(e, shape)}
                >
                    <ShapeRenderer shape={shape} size={32}/>
                </div>
            ))}
        </aside>
    );
}
