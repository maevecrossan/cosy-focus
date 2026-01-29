"use client";

import { useEffect, useMemo, useState } from "react";
import Column, { FocusItem } from "./Column";

type FocusStatus = 'available' | 'in_focus' | 'completed';

type ApiFocusItem = {
    id: number;
    title: string;
    status: FocusStatus;
    updatedAt: string;
    createdAt: string;
}

const grouped = {
    available: [],
    in_focus: [],
    completed: [],
};

export default function FocusBoard() {

    const [items, setItems] = useState<ApiFocusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch('/api/focus-items', { cache: 'no-store' });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);

                const data: ApiFocusItem[] = await res.json();
                setItems(data); //only re-renders on success. loading = true when request is in flight
            } catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // useMemo to avoid re-running on every render.
    // Only re-runs when items change.
        // Note: we avoid storing grouped in state because 
        // that would duplicate data. useMemo caches the result 
        // until items changes
    const grouped = useMemo(() => {
        const base = {
            available: [] as FocusItem[],
            in_focus: [] as FocusItem[],
            completed: [] as FocusItem[],
        };

        for (const item of items) {
            if (item.status === "available") base.available.push(item);
            else if (item.status === "in_focus") base.in_focus.push(item);
            else base.completed.push(item);
        }

        return base;
    }, [items]);

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