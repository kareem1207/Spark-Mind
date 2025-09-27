import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(request) {
  try {
    // Get user session
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();

    // Extract data from form
    const submissionData = {
      user_email: formData.get("user_email"),
      memory_score: parseInt(formData.get("memory_score")) || 0,
      stroop_score: parseInt(formData.get("stroop_score")) || 0,
      image_recall_score: parseInt(formData.get("image_recall_score")) || 0,
      audio_files: {},
    };

    // Extract audio files
    const audioKeys = ["audio_q1", "audio_q2", "audio_q3", "audio_q4"];
    for (const key of audioKeys) {
      const audioFile = formData.get(key);
      if (audioFile && audioFile.size > 0) {
        // Convert to buffer for processing
        const buffer = Buffer.from(await audioFile.arrayBuffer());
        submissionData.audio_files[key] = {
          filename: audioFile.name,
          size: audioFile.size,
          buffer: buffer,
        };
      }
    }

    // Log submission for debugging
    console.log("Assessment submission received:", {
      user_email: submissionData.user_email,
      memory_score: submissionData.memory_score,
      stroop_score: submissionData.stroop_score,
      image_recall_score: submissionData.image_recall_score,
      audio_files_count: Object.keys(submissionData.audio_files).length,
    });

    // Here you would typically:
    // 1. Save scores to database
    // 2. Save audio files to storage (S3, etc.)
    // 3. Queue audio files for transcription/analysis
    // 4. Send to your Python backend for AI analysis

    // For now, we'll simulate processing
    const response = {
      success: true,
      message: "Assessment submitted successfully",
      submission_id: `sub_${Date.now()}`,
      data: {
        user_email: submissionData.user_email,
        scores: {
          memory_score: submissionData.memory_score,
          stroop_score: submissionData.stroop_score,
          image_recall_score: submissionData.image_recall_score,
        },
        audio_files_received: Object.keys(submissionData.audio_files).length,
        timestamp: new Date().toISOString(),
      },
    };

    // TODO: Integrate with your Python backend
    // Example integration:
    /*
    const pythonBackendResponse = await fetch('http://your-python-backend/api/submit-tests', {
      method: 'POST',
      body: formData, // Forward the original FormData
    });
    
    if (!pythonBackendResponse.ok) {
      throw new Error('Python backend processing failed');
    }
    
    const pythonResult = await pythonBackendResponse.json();
    */

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Assessment submission error:", error);

    return NextResponse.json(
      {
        error: "Failed to process assessment submission",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
