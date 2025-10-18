import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

export const dynamic = "force-dynamic";

/**
 * GET /api/cv/test
 * 
 * Test endpoint to debug CV file in Supabase Storage
 */
export async function GET() {
  try {
    const bucketName = "cv-icons";
    const folderPath = "cv";

    // List all files in the cv folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (listError) {
      return NextResponse.json({
        error: "Failed to list files",
        details: listError,
      });
    }

    // Get public URL for CV.pdf
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${folderPath}/CV.pdf`);

    // Try to download the file
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(`${folderPath}/CV.pdf`);

    const downloadInfo = downloadError
      ? { error: downloadError.message }
      : {
          size: downloadData?.size,
          type: downloadData?.type,
          isBlob: downloadData instanceof Blob,
        };

    return NextResponse.json({
      bucket: bucketName,
      folder: folderPath,
      filesInFolder: files?.map(f => ({
        name: f.name,
        size: f.metadata?.size,
        contentType: f.metadata?.mimetype,
        lastModified: f.updated_at,
      })),
      publicUrl: urlData.publicUrl,
      downloadTest: downloadInfo,
    });
  } catch (err) {
    return NextResponse.json({
      error: "Unexpected error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
