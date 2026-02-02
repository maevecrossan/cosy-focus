"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

    // Refresh function to re-fetch focus items
    const refresh = useCallback(async () => {
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
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        refresh();
    }, [refresh]);

    // useMemo to avoid re-running on every render.
    // Only re-runs when items change.
    // Note: we avoid storing grouped in state because 
    // that would duplicate data. useMemo caches the result 
    // until items changes
    const grouped = useMemo(() => {
        return {
            available: items.filter(item => item.status === 'available'),
            in_focus: items.filter(item => item.status === 'in_focus'),
            completed: items.filter(item => item.status === 'completed'),
        };
    }, [items]);

    // Function to start a focus item
    // Calls the API to change status to "in_focus"
    async function startFocus(id: number) {
        const res = await fetch(`/api/focus-items/${id}/start`, { method: "PATCH" });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error ?? `Failed to start focus (${res.status})`);
        }
        await refresh();
    }

    // Function to complete a focus item
    // Calls the API to change status to "completed"
    async function completeFocus(id: number) {
        const res = await fetch(`/api/focus-items/${id}/complete`, { method: "PATCH" });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error ?? `Failed to complete (${res.status})`);
        }
        await refresh();
    }

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
                    <Column title="Available" items={grouped.available} onStart={startFocus} onComplete={completeFocus}/>
                    <Column title="In Focus" items={grouped.in_focus} onStart={startFocus} onComplete={completeFocus}/>
                    <Column title="Completed" items={grouped.completed} onStart={startFocus} onComplete={completeFocus}/>
                </div>
            )}
        </section>
    );
}