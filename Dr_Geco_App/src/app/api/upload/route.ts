// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// export async function POST(req: NextRequest) {
//   const data = await req.formData();
//   const file: File | null = data.get("file") as unknown as File;

//   if (!file) {
//     console.log("No file");
//     return NextResponse.json({ error: "No such a file" });
//   }

//   console.log(file.name);
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const filePath = path.join(process.cwd(), "/public", file.name);

//   fs.writeFileSync(filePath, buffer);

//   return NextResponse.json({ success: true });
// }
// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import User from "@/app/db/schema";
import connectMongo from "@/app/db/database";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const _id = data.get("_id") as string;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" });
    }

    // Write file temporarily to disk for processing
    const filePath = path.join(process.cwd(), "/public", file.name);
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(bytes));

    // Extract text from the .docx file
    let extractedText = "";
    let extractionResult = await mammoth.extractRawText({ path: filePath });
    extractedText = extractionResult.value;
    fs.unlinkSync(filePath); // Remove the temporary file

    // Update the database
    await connectMongo();
    await User.findOneAndUpdate(
      { _id },
      {
        $push: {
          documents: {
            title: file.name,
            text: extractedText,
            status: "created",
            language: "American English",
          },
        },
      }
    );

    // Fetch the newly added document ID
    const document = await User.find({ _id }).select("documents");
    const documentId =
      document[0].documents[document[0].documents.length - 1]._id;

    console.log("File uploaded and text extracted");
    return NextResponse.json({
      status: "added",
      documentId: documentId,
      _id: _id,
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: "Error processing the request" });
  }
}

