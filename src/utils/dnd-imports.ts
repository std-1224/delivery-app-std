// src/utils/dnd-imports.ts

import * as ReactBeautifulDnd from "react-beautiful-dnd";

// Export components with type assertions to fix TypeScript errors
export const DragDropContext = ReactBeautifulDnd.DragDropContext as any;
export const Droppable = ReactBeautifulDnd.Droppable as any;
export const Draggable = ReactBeautifulDnd.Draggable as any;

// Export types directly (these don't need type assertions)
export type DroppableProvided = ReactBeautifulDnd.DroppableProvided;
export type DraggableProvided = ReactBeautifulDnd.DraggableProvided;
export type DroppableStateSnapshot = ReactBeautifulDnd.DroppableStateSnapshot;
export type DraggableStateSnapshot = ReactBeautifulDnd.DraggableStateSnapshot;
export type DropResult = ReactBeautifulDnd.DropResult;
export type DroppableProps = ReactBeautifulDnd.DroppableProps;
export type DraggableProps = ReactBeautifulDnd.DraggableProps;
export type DragStart = ReactBeautifulDnd.DragStart;
export type DragUpdate = ReactBeautifulDnd.DragUpdate;

// Re-export any other types you might need