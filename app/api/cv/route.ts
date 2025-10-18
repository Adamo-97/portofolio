import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0; // Don't cache, always fetch latest

/**
 * GET /api/cv
 * 
 * Downloads the CV.pdf file from Supabase Storage.
 * This allows you to update your CV in Supabase without changing code.
 * Just replace the CV.pdf file in your storage bucket.
 */
export async function GET() {
  try {
    const bucketName = "cv-icons"; // Your Supabase storage bucket name
    const filePath = "cv/CV.pdf"; // Path to CV file in the bucket

    console.log("[/api/cv] Attempting to download from:", bucketName, filePath);

    // Get the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      console.error("[/api/cv] Supabase download error:", error);
      return NextResponse.json(
        { error: "Failed to fetch CV from storage", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("[/api/cv] No data returned from Supabase");
      return NextResponse.json(
        { error: "CV file not found" },
        { status: 404 }
      );
    }

    console.log("[/api/cv] File downloaded successfully, size:", data.size, "type:", data.type);

    // Check if the downloaded file is actually a PDF
    if (!data.type.includes('pdf') && !data.type.includes('octet-stream')) {
      console.error("[/api/cv] Downloaded file is not a PDF. Type:", data.type);
      return NextResponse.json(
        { error: "File is not a PDF", fileType: data.type },
        { status: 400 }
      );
    }

    // Convert blob to buffer for response
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="CV.pdf"',
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error("[/api/cv] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
