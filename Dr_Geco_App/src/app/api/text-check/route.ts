import { NextResponse } from "next/server";
import User from "@/app/db/schema";
import FormData from "form-data";
import fetch from "node-fetch";
import sanitizeHtml from "sanitize-html";

interface TextCheckRequests {
  text: string;
  language: string;
  _id: string;
}

// Function to sanitize and correct the sentence
async function sanitizeAndCorrectSentence(sentence: any) {
  // Sanitize the HTML content to get plain text
  const plainTextSentence = sanitizeHtml(sentence, {
    allowedTags: [], // No HTML tags allowed, only plain text
    allowedAttributes: {}, // No HTML attributes allowed
  });

  return await correctSentence(plainTextSentence);
}

// Function to make a POST request to the Flask API
async function correctSentence(sentence: any) {
  const apiUrl = "http://127.0.0.1:5000/api/gec"; // API endpoint
  const form = new FormData();
  form.append("sentence", sentence);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: form, // Send the form data
      // Headers are automatically set by the form-data object
    });
    const data: any = await response.json();
    if (response.ok) {
      console.log("API Response:", data);
      return data.corrected;
    } else {
      console.error("API Error:", data.message);
      return sentence; // Return original sentence in case of error
    }
  } catch (error) {
    console.error("Error correcting sentence:", error);
    return sentence; // Return original sentence in case of network error
  }
}
export async function POST(req: Request) {
  const { text, language, _id } = await req.json();
  const user = await User.findOne({ _id: _id });
  let corrections = [];

  if (user.plan !== "free" || user.prompts > 1000) {
    return NextResponse.json({ error: "Plan limit reached or invalid plan." });
  }

  if (!text) {
    return NextResponse.json({ error: "No content provided." });
  }

  await User.findByIdAndUpdate({ _id: _id }, { prompts: user.prompts + 1 });

  const sentences = text
    .split(/(?<=\.)/)
    .map((s: any) => s.trim())
    .filter((s: any) => s);
  const correctionPromises = sentences.map(sanitizeAndCorrectSentence);

  const correctionResults = await Promise.all(correctionPromises);

  const correctedParagraph = correctionResults.join(" ");
 
  return NextResponse.json({
    success: {
      correct: true,
      text: correctedParagraph,
    },
  });
}

// export async function POST(req: Request) {
//   const { text, language, _id }: TextCheckRequests = await req.json();

//   const promptGrammar: string = `${text}`;
//   const user = await User.findOne({ _id: _id });
//   let corrections = [];

//   if (user.plan == "free") {
//     if (user.prompts <= 1000) {
//       if (text) {
//         await User.findByIdAndUpdate(
//           { _id: _id },
//           { prompts: user.prompts + 1 }
//         );
//         //here we will make a request and receive data from the model

//         try {
//           console.log("0");
//           const correctionModel = await PipelineSingleton.getInstance();
//           console.log("1");
//           const sentences = promptGrammar.split(".");
//           console.log(sentences);
//           console.log("2");

//           for (let i = 0; i < sentences.length; i++) {
//             const sentence = sentences[i].trim();
//             console.log("3");
//             if (sentence.length === 0) {
//               continue;
//             }

//             try {
//               const corrected = await correctionModel(`grammar: ${sentence}`);

//               console.log("4");
//               console.log(corrected);
//               const correctedText = corrected[0].generatedText;
//               corrections.push(correctedText);
//               const correctedParagraph = corrections.join(". ") + ".";
//               return NextResponse.json({
//                 success: {
//                   correct: true,
//                   text: correctedParagraph,
//                 },
//               });
//             } catch (error) {
//               return NextResponse.json({ error: "Error correcting sentence:" });
//             }
//           }
//         } catch (error) {
//           return NextResponse.json({ error: "Failed to load the model." });
//         }
//       } else {
//         return NextResponse.json({ error: "No content" });
//       }
//     } else {
//       return NextResponse.json({ error: "You used your free plan ai prompts" });
//     }
//   }

// }
