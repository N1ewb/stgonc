import { GoogleGenerativeAI } from "@google/generative-ai";
import idRefence from "../gemini/id.jpg";
const genAI = new GoogleGenerativeAI("AIzaSyBN9O2Uu7htpzQ-gG2dMkRGLFct7CzbYM0");

const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

function fileToGenerativePart(base64Data, mimeType) {
  const base64String = base64Data.split(",")[1]; // Remove the base64 prefix
  return {
    inlineData: {
      data: base64String,
      mimeType,
    },
  };
}

export async function runAiTest(IDImage) {
  const prompt =
    "check both if they are similar using the second image as the reference, if the organization name is not the similar then instantly just return is_similar: false, then return a json response with the first image as reference for OragnizationName: , studentIdNumber: , is_student: true or false, firstName:, middleInitial:, lastName:, is_similar: true or false, ";
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
