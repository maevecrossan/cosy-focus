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
        <section className="mt-8 p-8 bg-emerald-900/40 rounded-3xl shadow-md w-full max-w-7xl">
            <div className="mb-6 flex justify-between">
                <h2 className="text-2xl font-bold">Your Focus board</h2>
                {!loading && !error && (
                    <span className="text-sm opacity-70">{items.length} items</span>
                )}
            </div>

            {loading && (
                <div className="rounded-xl border bg-white p-4">
                    Loading focus items…
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border bg-white p-4 text-red-600">
                    Error: {error}
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className="rounded-xl border bg-white p-6">
                    <p className="font-medium">No focus items yet.</p>
                    <p className="mt-1 text-sm opacity-70">
                        When you add some, they’ll show up here!
                    </p>
                </div>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Column title="Available" items={grouped.available} />
                    <Column title="In Focus" items={grouped.in_focus} />
                    <Column title="Completed" items={grouped.completed} />
                </div>
            )}
        </section>
    );
}