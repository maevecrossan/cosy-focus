import Column, { FocusItem } from "./Column";

const grouped = {
    available: [],
    in_focus: [],
    completed: [],
};

export default function FocusBoard() {
    return (
        <div className="min-h-screen bg-emerald-900/40 p-8">
            <h1 className="mb-8 text-3xl font-bold text-center text-gray-900">
                Focus Board Component
            </h1>

            <div className="min-w-7xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Column title="Available" items={grouped.available} />
                    <Column title="In Focus" items={grouped.in_focus} />
                    <Column title="Completed" items={grouped.completed} />
                </div>
            </div>

        </div>
    );
}