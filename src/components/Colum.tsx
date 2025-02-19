import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";

type TaskType = {
    id: string;
    title: string;
    opened: string;
    author: string;
    comments: number;
    status: string;
};

type ColumnProps = {
    id: string;
    tasks: TaskType[];
};

export default function Column({ id, tasks }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className={'w-1/3 '}>
            <h2 className="text-lg text-center font-bold mb-4">{id}</h2>
            <div ref={setNodeRef} className="min-h-[70vh] border-2 border-black p-4 bg-gray-100 ">
                {tasks.map(task => (
                    <Task key={task.id}  id={task.id} author={task.author} opened={task.opened} comments={task.comments} title={task.title}/>

                ))}
            </div>
        </div>
    );
}