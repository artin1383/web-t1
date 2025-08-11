import React, {useRef} from "react";
import type {CanvasItem, NewShapeSession} from "@/lib/types";
import ShapeRenderer from "./ShapeRenderer";

interface CanvasProps {
    canvasRef: React.RefObject<HTMLDivElement | null>;
    canvasItems: CanvasItem[];
    setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
    creatingNewShape: NewShapeSession | null;
    setCreatingNewShape: (val: NewShapeSession | null) => void;
    previewPosition: { x: number; y: number } | null;
    setPreviewPosition: (val: { x: number; y: number } | null) => void;
    selectedItemId: number | null;
    setSelectedItemId: (val: number | null) => void;
    handleRemoveShape: (id: number) => void;
}

export default function Canvas({
                                   canvasRef,
                                   canvasItems,
                                   setCanvasItems,
                                   creatingNewShape,
                                   setCreatingNewShape,
                                   previewPosition,
                                   setPreviewPosition,
                                   selectedItemId,
                                   setSelectedItemId,
                                   handleRemoveShape
                               }: CanvasProps) {
    const draggingItemRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const resizingItemRef = useRef<{ id: number; startX: number; startY: number; startSize: number } | null>(null);

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (creatingNewShape) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newItem: CanvasItem = {
                id: Date.now(),
                shape: creatingNewShape.shape,
                x: x - creatingNewShape.offsetX,
                y: y - creatingNewShape.offsetY,
                size: 80,
            };
            setCanvasItems((prev) => [...prev, newItem]);
            setCreatingNewShape(null);
            setPreviewPosition(null);
            window.removeEventListener("mousemove", updatePreviewPosition);
        }
    };

    const updatePreviewPosition = (e: MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPreviewPosition({x: e.clientX - rect.left, y: e.clientY - rect.top});
    };

    const startDragging = (e: React.MouseEvent<HTMLDivElement>, item: CanvasItem) => {
        e.stopPropagation();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        draggingItemRef.current = {
            id: item.id,
            offsetX: e.clientX - rect.left - item.x,
            offsetY: e.clientY - rect.top - item.y,
        };
        window.addEventListener("mousemove", handleDragging);
        window.addEventListener("mouseup", stopDragging);
    };

    const handleDragging = (e: MouseEvent) => {
        const session = draggingItemRef.current;
        if (!session) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left - session.offsetX;
        const y = e.clientY - rect.top - session.offsetY;
        setCanvasItems((prev) =>
            prev.map((item) => (item.id === session.id ? {...item, x, y} : item))
        );
    };

    const stopDragging = () => {
        window.removeEventListener("mousemove", handleDragging);
        window.removeEventListener("mouseup", stopDragging);
        draggingItemRef.current = null;
    };

    const startResizing = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
        e.stopPropagation();
        const item = canvasItems.find((itm) => itm.id === id);
        if (!item) return;
        resizingItemRef.current = {
            id,
            startX: e.clientX,
            startY: e.clientY,
            startSize: item.size,
        };
        window.addEventListener("mousemove", handleResizing);
        window.addEventListener("mouseup", stopResizing);
    };

    const handleResizing = (e: MouseEvent) => {
        const session = resizingItemRef.current;
        if (!session) return;
        const delta = Math.max(e.clientX - session.startX, e.clientY - session.startY);
        setCanvasItems((prev) =>
            prev.map((item) =>
                item.id === session.id ? {...item, size: Math.max(40, session.startSize + delta)} : item
            )
        );
    };

    const stopResizing = () => {
        window.removeEventListener("mousemove", handleResizing);
        window.removeEventListener("mouseup", stopResizing);
        resizingItemRef.current = null;
    };

    return (
        <main
            ref={canvasRef}
            className="flex-1 bg-white rounded shadow relative h-[500px]"
            onMouseDown={handleCanvasMouseDown}
            onClick={() => setSelectedItemId(null)}
        >
            {canvasItems?.map((item) => (
                <div
                    key={item.id}
                    className={`absolute ${selectedItemId === item.id ? "ring-2 ring-blue-400" : ""}`}
                    style={{top: item.y, left: item.x}}
                    onMouseDown={(e) => startDragging(e, item)}
                    onDoubleClick={() => handleRemoveShape(item.id)}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                    }}
                >

                    <div className="relative">
                        <ShapeRenderer shape={item.shape} size={item.size}/>
                        {selectedItemId === item.id && (
                            <div
                                className="absolute right-[-8px] bottom-[-8px] w-4 h-4 border-2 border-blue-500 bg-white rounded-full cursor-nwse-resize"
                                onMouseDown={(e) => startResizing(e, item.id)}
                            />
                        )}
                    </div>
                </div>
            ))}

            {creatingNewShape && previewPosition && (
                <div
                    className="absolute opacity-50 pointer-events-none"
                    style={{
                        top: previewPosition.y - creatingNewShape.offsetY,
                        left: previewPosition.x - creatingNewShape.offsetX,
                    }}
                >
                    <ShapeRenderer shape={creatingNewShape.shape} size={80}/>
                </div>
            )}
        </main>
    );
}
