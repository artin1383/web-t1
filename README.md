# 🖌️ React Drawing App

A fully interactive web-based drawing app built with **React + TypeScript + Vite**.  
The app allows users to create, move, resize, delete, import, and export simple shapes on a canvas. It's a great mini project demonstrating interactive state management, drag-and-drop, resizing, and file handling in React and i use tailwind and shadcn components.
شد 
---

## ✨ Features

- ✅ Add shapes: Circle, Square, Triangle
- ✅ Drag and move shapes freely on canvas
- ✅ Resize shapes with corner handles
- ✅ Delete shapes via double-click
- ✅ Export canvas to JSON file
- ✅ Import drawings from JSON file
- ✅ Rename drawings dynamically

```bash
src/
 ├── components/
 │    ├── app/
 │    │    ├── App.tsx          # Main application logic and state management
 │    │    ├── Header.tsx       # Import, export, rename functionality
 │    │    ├── Sidebar.tsx      # Shape picker sidebar
 │    │    ├── Footer.tsx       # Shape counter summary
 │    │    └── Canvas.tsx       # Interactive drawing area
 │    └── ShapeRenderer.tsx     # Rendering visual shapes
 ├── lib/
 │    └── types.ts              # Type definitions for shapes
 └── main.tsx
```

# 📖 Code Explanation

In this section, all project files and the logic of each component are explained.

---

## `types.ts`

This file defines all shared types across the app:

- `shapesList`: array of allowed shapes (Circle, Square, Triangle).
- `ShapeType`: type union for allowed shapes.
- `CanvasItem`: structure representing each shape on the canvas.
- `NewShapeSession`: temporary structure used while adding a new shape.

```typescript
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

```
### `App.tsx`

**Role:**  
Main component that manages global state and coordinates subcomponents.

**State Management:**

- `canvasItems`: list of all shapes on the canvas.
- `drawingName`: name of the drawing.
- `isEditingName`: toggles name edit mode.
- `selectedItemId`: id of selected shape.
- `creatingNewShape`: temporary state while creating a new shape.
- `previewPosition`: mouse position for shape preview.

**Handlers:**

- `handleExport`: exports current canvas state as JSON.
- `handleImport`: imports a JSON file and restores the drawing.
- `handleRemoveShape`: removes shape by ID.

**Renders:**

- `Header`
- `Sidebar`
- `Canvas`
- `Footer`

---

### `Header.tsx`

**Role:**  
Manages the top toolbar.

- Export button triggers JSON file download.
- Import button opens file picker to load a JSON file.

**Drawing name editing:**

- When `isEditingName` is true, shows input for editing.
- Otherwise shows the drawing name with edit (Pencil) icon.

```typescript
<Button onClick={handleExport}>Export</Button>
<Button onClick={handleImportClick}>Import</Button>
<input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} />
```

### `Sidebar.tsx`

**Role:**  
Displays available shape types.

- Clicking a shape starts the creation process for that shape.

```typescript
<div onMouseDown={(e) => handleStartCreateShape(e, shape)}>
  <ShapeRenderer shape={shape} size={32} />
</div>
```
### `Canvas.tsx`

**Role:**  
The core interactive component that handles all drawing logic.

#### Features:

##### Shape Creation

On canvas click while in creation mode:  
Calculates mouse position and adds a new shape.

```typescript
if (creatingNewShape) {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newItem: CanvasItem = { id: Date.now(), shape, x, y, size: 80 };
    setCanvasItems((prev) => [...prev, newItem]);
    setCreatingNewShape(null);
}
```
### Shape Selection

Clicking a shape sets it as `selectedItemId`.


### Shape Dragging

On shape mouse down → starts drag session.  
Stores mouse offset and updates shape position as mouse moves.

```typescript
window.addEventListener("mousemove", handleDragging);
window.addEventListener("mouseup", stopDragging);
```
### Shape Resizing

On resize handle mouse down → starts resize session.  
Calculates size delta and updates shape size.

```typescript
window.addEventListener("mousemove", handleResizing);
window.addEventListener("mouseup", stopResizing);
```
### Shape Deletion

Double-clicking a shape removes it via `handleRemoveShape`.

---

### Shape Preview

While creating a new shape, shows a semi-transparent preview following the cursor.

```typescript
<div className="absolute opacity-50 pointer-events-none">
  <ShapeRenderer shape={creatingNewShape.shape} size={80} />
</div>
```
### `ShapeRenderer.tsx`

**Role:**  
Renders the visual appearance of each shape using CSS.

#### Circle:

```typescript
case "Circle":
  return <div style={{width: size, height: size}} className="rounded-full bg-blue-400" />;
```
### Square

```typescript
case "Square":
  return <div style={{width: size, height: size}} className="bg-green-400" />;
```
### Triangle

```typescript

case "Triangle":
  return (
    <div style={{
      width: 0,
      height: 0,
      borderLeft: `${size/2}px solid transparent`,
      borderRight: `${size/2}px solid transparent`,
      borderBottom: `${size}px solid red`
    }} />
  );
```

### `Footer.tsx`

**Role:**  
Displays the live count of each shape type on the canvas.

- Uses `ShapeRenderer` to show small icons.
- Filters `canvasItems` to count shapes by type.

```typescript
{shapesList.map((shape) => (
  <div key={shape} className="flex items-center gap-2">
    <ShapeRenderer shape={shape} size={24} />
    <span>{canvasItems.filter((s) => s.shape === shape).length}</span>
  </div>
))}
```

### 🔄 Data Flow Summary

```text
User Interaction
      ↓
Sidebar → Start Shape Creation
      ↓
Canvas → Place Shape → Select → Drag → Resize → Delete
      ↓
App → Update Global State
      ↓
Header/Footer → Import/Export & Count Display
```
this report is generated by AI
