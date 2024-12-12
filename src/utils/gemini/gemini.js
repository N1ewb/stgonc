import { GoogleGenerativeAI } from "@google/generative-ai";
import idRefence from "../gemini/id.jpg";
const genAI = new GoogleGenerativeAI("AIzaSyB4Ur-_AJGxMIaedWN5S3eRBFGM9YflQ44");

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
  You are provided with two images:
  1. The first image is the ID to test.
  2. The second image is the reference ID.
  
  Perform the following:
  1. Extract details such as OrganizationName, studentIdNumber, firstName, middleInitial, and lastName from the first image.
  2. Compare the extracted details with the reference ID image (second image).
  
  Rules:
  - If the OrganizationName does not match, return: { "is_similar": false }.
  - If the OrganizationName matches, return all extracted details in the following format:
  {
    "OrganizationName": "",
    "studentIdNumber": "",
    "is_student": true or false,
    "firstName": "",
    "middleInitial": "",
    "lastName": "",
    "is_similar": true
  }.
  IMPORTANT:
  - Do not include any backticks or the word "JSON" in your response.
  - Ensure the output starts with '{' and ends with '}'.
  `;
  
  
const imageParts = [
    fileToGenerativePart(IDImage, "image/png"),
    fileToGenerativePart(idRefence, "image/jpeg"),
  ];
  console.log(imageParts);
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return {text, message: "Succesfuly processed image", status: 'Success'}
  } catch (error) {
    return {text: null, message:`Error occured, ${error.message}`, status: 'failed'}
  }
}
