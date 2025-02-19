import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import Column from './components/Colum';
import Task from './components/Task';
import Header from "./components/Header.tsx";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store.ts";

type TaskType = {
    id: string;
    title: string;
    status: string;
};

export default function App() {
    const { issues } = useSelector((state: RootState) => state.github);

    const [tasks, setTasks] = useState<TaskType[]>(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });


    useEffect(() => {
        if (issues.length > 0) {
            setTasks(issues.map(issue => ({ ...issue })));
        }
    }, [issues]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const [activeId, setActiveId] = useState<string | null>(null);

    function handleDragStart(event: { active: { id: string } }) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: { active: { id: string }; over: { id: string | null } }) {
        const { active, over } = event;
        if (!over) return;

        setTasks((tasks) => {
            const updatedTasks = tasks.map(task => ({ ...task }));
            const activeTask = updatedTasks.find(task => task.id === active.id);
            const overTask = updatedTasks.find(task => task.id === over.id);

            if (activeTask) {
                const activeIndex = updatedTasks.indexOf(activeTask);
                updatedTasks.splice(activeIndex, 1);

                if (overTask) {
                    const overIndex = updatedTasks.indexOf(overTask);
                    updatedTasks.splice(overIndex, 0, { ...activeTask, status: overTask.status });
                } else {
                    updatedTasks.push({ ...activeTask, status: over.id });
                }
            }

            return updatedTasks;
        });

        setActiveId(null);
    }

    const statuses = ["To Do", "In Progress", "Done"];

    return (
        <>
            <Header />
            <div className="flex justify-between space-x-2 pl-2 py-2 mt-5">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                >
                    {statuses.map((status) => (
                        <Column key={status} id={status} tasks={tasks.filter(task => task.status === status)} />
                    ))}
                    <DragOverlay>
                        {activeId ? <Task task={tasks.find(task => task.id === activeId)} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </>
    );
}
