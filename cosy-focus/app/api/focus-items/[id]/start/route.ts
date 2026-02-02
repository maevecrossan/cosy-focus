// Next.js API route to start a focus item
import { NextResponse } from "next/server";

//Access the database
import { prisma } from "@/lib/prisma";

// PATCH /api/focus-items/[id]/start
// Changes the status of the focus item to "in_focus"
// PATCH updates a resource partially
export async function PATCH(request: Request) {
    // URL looks like: http://localhost:3000/api/focus-items/1/start
    const url = new URL(request.url);

    // Split path into segments: ["api","focus-items","1","start"]
    const segments = url.pathname.split("/").filter(Boolean);

    // Get the ID from the URL
    // Index 2 is deterministic based on the route structure
    const idSegment = segments[2]; // "1"
    // Convert ID to number
    const focusItemId = parseInt(idSegment ?? "", 10);

    // Validate ID
    // Prevents invalid input from ever reaching the database
    if (Number.isNaN(focusItemId)) {
        return NextResponse.json(
            { error: "Invalid focus item ID" }, 
            { status: 400 });
    }

    // Fetch the focus item from the database
    const focusItem = await prisma.focusItem.findUnique({
        where: { id: focusItemId },
    });

    // Handle case where focus item does not exist
    if (!focusItem) {
        return NextResponse.json({ error: "Focus item not found" }, { status: 404 });
    }

    // Only allow starting focus if the item is "available"
    if (focusItem.status !== "available") {
        return NextResponse.json(
            { error: `Cannot start focus from status: ${focusItem.status}` },
            { status: 409 }
        );
    }

    // Update the focus item's status to "in_focus"
    // Prisma generates an UPDATE query and returns the updated row
    const updatedItem = await prisma.focusItem.update({
        where: { id: focusItemId },
        data: { status: "in_focus" },
    });

    // Return the updated focus item
    // Lets the frontend update its state without guessing
    return NextResponse.json(updatedItem, { status: 200 });
}