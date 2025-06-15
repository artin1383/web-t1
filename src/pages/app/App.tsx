import React, {useState, useRef} from "react";
import type {CanvasItem, NewShapeSession} from "@/lib/types";
import Header from "@/components/app/Header";
import Sidebar from "@/components/app/Sidebar";
import Footer from "@/components/app/Footer";
import Canvas from "@/components/app/Canvas";

export default function App() {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [drawingName, setDrawingName] = useState("نقاشی من");
    const [isEditingName, setIsEditingName] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [creatingNewShape, setCreatingNewShape] = useState<NewShapeSession | null>(null);
    const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            drawingName,
            canvasItems
        }));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${drawingName}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target?.result as string);
            setDrawingName(data.drawingName ?? "نقاشی من");
            setCanvasItems(data.canvasItems ?? []);
        };
        reader.readAsText(file);
    };

    const handleRemoveShape = (id: number) => {
        setCanvasItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col gap-4">
            <Header
                drawingName={drawingName}
                setDrawingName={setDrawingName}
                isEditingName={isEditingName}
                setIsEditingName={setIsEditingName}
                handleExport={handleExport}
                handleImport={handleImport}
            />
            <div className="flex flex-1 gap-4">
                <Sidebar handleStartCreateShape={(e, shape) => {
                    e.preventDefault();
                    setCreatingNewShape({shape, offsetX: 40, offsetY: 40});
                    window.addEventListener("mousemove", (e: MouseEvent) => {
                        const rect = canvasRef.current?.getBoundingClientRect();
                        if (!rect) return;
                        setPreviewPosition({x: e.clientX - rect.left, y: e.clientY - rect.top});
                    });
                }}/>
                <Canvas
                    canvasRef={canvasRef}
                    canvasItems={canvasItems}
                    setCanvasItems={setCanvasItems}
                    creatingNewShape={creatingNewShape}
                    setCreatingNewShape={setCreatingNewShape}
                    previewPosition={previewPosition}
                    setPreviewPosition={setPreviewPosition}
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    handleRemoveShape={handleRemoveShape}
                />
            </div>
            <Footer canvasItems={canvasItems}/>
        </div>
    );
}