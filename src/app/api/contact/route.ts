import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";
import { saveLeadToFirestore } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side Zod validation
    const parseResult = contactFormSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || "Invalid form submission data.";
      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
        },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;

    // Save lead to Firestore Database
    try {
      await saveLeadToFirestore(validatedData);
    } catch (dbError) {
      console.warn("Firestore lead saving logged:", dbError);
    }

    // Dispatch email (or safe simulation logger if credentials aren't set)
    const result = await sendContactEmail(validatedData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Unable to send your message at this time.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. Our principal architect will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your request. Please try again or reach out via phone.",
      },
      { status: 500 }
    );
  }
}
