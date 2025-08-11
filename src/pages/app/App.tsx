import { useState, useRef } from 'react';
import type { CanvasItem, NewShapeSession } from '@/lib/types';
import Header from '@/components/app/Header';
import Sidebar from '@/components/app/Sidebar';
import Footer from '@/components/app/Footer';
import Canvas from '@/components/app/Canvas';
import axios from 'axios'; // اضافه کردن axios برای ارسال درخواست‌ها به سرور

export default function App() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [drawingName, setDrawingName] = useState('نقاشی من');
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [creatingNewShape, setCreatingNewShape] =
    useState<NewShapeSession | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [username, setUsername] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!username) {
      alert('لطفاً نام کاربری خود را وارد کنید');
      return;
    }

    try {
      await axios.post('http://localhost:4000/save/drawing', {
        username,
        data: { drawingName, canvasItems },
      });
      alert('نقاشی با موفقیت ذخیره شد');
    } catch (error) {
      alert('خطا در ذخیره نقاشی. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleImport = async () => {
    if (!username) {
      alert('لطفاً نام کاربری خود را وارد کنید');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/load/drawing/${username}`
      );
      const data = response.data[0].data;
      console.log(data);
      
      if (!data || data.length === 0) {
        alert('این کاربر نقاشی ندارد.');
        return
      }      
      setDrawingName(data.drawingName);
      setCanvasItems(data.canvasItems);
    } catch (error) {
      alert('این کاربر نقاشی ندارد.');
    }
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
        <Sidebar
          handleStartCreateShape={(e, shape) => {
            e.preventDefault();
            setCreatingNewShape({ shape, offsetX: 40, offsetY: 40 });
            window.addEventListener('mousemove', (e: MouseEvent) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (!rect) return;
              setPreviewPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            });
          }}
        />
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
      <Footer canvasItems={canvasItems} />
      <div className="mt-4">
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          نام کاربری
        </label>
        <input
          type="text"
          id="username"
          className="p-2 border rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="نام کاربری خود را وارد کنید"
        />
      </div>
    </div>
  );
}
