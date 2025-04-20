// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import referenceIdImage from "../gemini/id.jpg";

export async function runAiTest(idToTestImage) {
  // Convert images to base64 if they're File objects
  const getBase64 = async (imageInput) => {
    // If it's already a base64 string
    if (typeof imageInput === "string" && imageInput.startsWith("data:")) {
      return imageInput;
    }

    // If it's a File object
    if (imageInput instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageInput);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    throw new Error("Unsupported image format");
  };

  const idToTestBase64 = await getBase64(idToTestImage);
  const referenceIdBase64 = await getBase64(referenceIdImage);

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
  - Don't put the response in an Array
  `;

  try {
    // Import axios dynamically to avoid issues with SSR
    const axios = (await import("axios")).default;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-thinking-exp:free",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: idToTestBase64 } },
              { type: "image_url", image_url: { url: referenceIdBase64 } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
      }
    );

    // Extract content from OpenRouter response

    const responseText = response.data.choices[0].message.content;
    console.log("response: ", responseText);
    try {
      return {
        text: responseText,
        message: "Successfully processed image",
        status: "Success",
      };
    } catch (parseError) {
      return {
        data: null,
        text: responseText,
        message: "Received response but failed to parse as JSON",
        status: "partial",
      };
    }
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    return {
      data: null,
      message: `Error occurred: ${
        error.response?.data?.error?.message || error.message
      }`,
      status: "failed",
    };
  }
}
