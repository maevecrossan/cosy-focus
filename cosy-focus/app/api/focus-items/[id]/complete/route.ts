import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// For a more complete explanation, see the start route implementation

// PATCH /api/focus-items/[id]/complete
// Changes the status of the focus item to "completed"

export async function PATCH(request: Request) {
    // 1. Parse URL
    const url = new URL(request.url);

    // 2. Split path into segments
    const segments = url.pathname.split("/").filter(Boolean);

    // 3. Extract ID segment
    const idSegment = segments[2];

    // 4. Convert to number
    const focusItemId = parseInt(idSegment ?? "", 10);

    // 5. Validate ID
    if (Number.isNaN(focusItemId)) {
        return NextResponse.json(
            { error: "Invalid focus item ID" }, 
            { status: 400 }
        );
    }

    // 6. Fetch focus item
    const focusItem = await prisma.focusItem.findUnique({
        where: { id: focusItemId },
    });

    // 7. Handle not found
    if (!focusItem) {
        return NextResponse.json(
            { error: "Focus item not found" }, 
            { status: 404 }
        );
    }

    // 8. Validate current status (in_focus can only be completed)
    if (focusItem.status !== "in_focus") {
        return NextResponse.json(
            { error: `Cannot complete item from status: ${focusItem.status}` },
            { status: 409 }
        );
    }

    // 9. Update status to completed
    const updatedItem = await prisma.focusItem.update({
        where: { id: focusItemId },
        data: { status: "completed" },
    });

    // 10. Return updated item
    return NextResponse.json(updatedItem);
}