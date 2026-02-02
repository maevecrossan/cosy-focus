// Card component to display a focus item with title, description and status
"use client";

import { useState } from 'react';
import { FocusItem } from './Column';
import Button from '../ui/Button';

type FocusItemCardProps = {
    item: FocusItem;
    onStart: (id: number) => Promise<void>;
    onComplete: (id: number) => Promise<void>;
};

export default function FocusItemCard({ item, onStart, onComplete }: FocusItemCardProps) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handler for starting focus
    async function handleStart() {
        try {
            setBusy(true);
            setError(null);
            await onStart(item.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setBusy(false);
        }
    }

    // Handler for completing focus
    async function handleComplete() {
        try {
            setBusy(true);
            setError(null);
            await onComplete(item.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setBusy(false);
        }
    }

    return (
        <section>
            <div className="rounded-xl border bg-white p-3">
                <div className="mb-2 space-y-1 inline-block">
                    <h4 className="text-md font-medium">
                        <span className="text-sm text-gray-500">#{item.id}</span> {item.title}
                        </h4>
                </div>

                {/* Actions */}
                {/* temporary buttons while API is being developed */}
                {item.status === "available" && (
                    <button
                        onClick={handleStart}
                        disabled={busy}
                        className="w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {busy ? "Starting..." : "Start Focus"}
                    </button>
                )}

                {item.status === "in_focus" && (
                    <button
                        onClick={handleComplete}
                        disabled={busy}
                        className="w-full rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
                    >
                        {busy ? "Completing..." : "Complete"}
                    </button>
                )}

                {item.status === "completed" && null}

                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>
        </section>
    );
}