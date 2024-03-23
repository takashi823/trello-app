"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer from "./SortableContainer";
import { Item } from "./Item";

export const Container = () => {
  // Todoタスクとして管理するアイテムリスト
  const [items, setItems] = useState<{
    [key: string]: string[];
  }>({
    container1: ["英単語を覚える", "犬の散歩をする", "会話する"],
    container2: ["日用品を買う", "お菓子を食べる"],
    container3: [
      "サッカーを観戦する",
      "服を買う",
      "テレビを観る",
      "夕飯を作る",
    ],
    container4: [],
  });

  //アイテムリストのリソースid
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  // ドラッグの開始、移動、終了時に許可するインプット
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key: string) =>
      items[key].includes(id.toString())
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    setActiveId(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;

    if (!overId) return;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId.toString());
      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(id);
    const overIndex = items[overContainer].indexOf(overId.toString());

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
    setActiveId(undefined);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContainer
        id="container1"
        label="TO DO"
        items={items.container1}
      />
      <SortableContainer
        id="container2"
        label="IN PROGRESS"
        items={items.container2}
      />
      <SortableContainer
        id="container3"
        label="REVIEW"
        items={items.container3}
      />
      <SortableContainer
        id="container4"
        label="DONE"
        items={items.container4}
      />

      <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
    </DndContext>
  );
};
