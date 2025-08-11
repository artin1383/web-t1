import { type ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface HeaderProps {
  drawingName: string;
  setDrawingName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  handleExport: () => void;
  handleImport: () => void;
}

export default function Header({
  drawingName,
  setDrawingName,
  isEditingName,
  setIsEditingName,
  handleExport,
  handleImport,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white rounded shadow gap-4">
      <div className="flex gap-2">
        <Button onClick={handleExport}>Export</Button>
        <Button onClick={handleImport}>Import</Button>
      </div>
      {isEditingName ? (
        <input
          value={drawingName}
          onChange={(e) => setDrawingName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditingName(false);
            }
          }}
          autoFocus
          className="border p-2 rounded text-right"
        />
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingName(true)}
          >
            <Pencil size={18} />
          </Button>
          <h1 className="text-xl font-bold">{drawingName}</h1>
        </div>
      )}
    </header>
  );
}
