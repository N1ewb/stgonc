import { GoogleGenerativeAI } from "@google/generative-ai";
import idRefence from "../gemini/id.jpg";
const genAI = new GoogleGenerativeAI("AIzaSyBN9O2Uu7htpzQ-gG2dMkRGLFct7CzbYM0");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(base64Data, mimeType) {
  const base64String = base64Data.split(",")[1]; 
  return {
    inlineData: {
      data: base64String,
      mimeType,
    },
  };
}

export async function runAiTest(IDImage) {
  const prompt = `
Check both if they are similar using the second image as the reference. 
If the organization name is not similar, return {"is_similar": false}. 
Otherwise, return a valid JSON response with the following structure:
{
  "OrganizationName": "",
  "studentIdNumber": "",
  "is_student": true or false,
  "firstName": "",
  "middleInitial": "",
  "lastName": "",
  "is_similar": true or false
},
please note to remove the "JSON" word and the unnecessary backticks and qoutation mark in your output
`
const imageParts = [
    fileToGenerativePart(IDImage, "image/png"),
    fileToGenerativePart(idRefence, "image/jpeg"),
  ];
  console.log(imageParts);
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error :", error);
  }
}
