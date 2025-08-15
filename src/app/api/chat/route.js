import OpenAI from "openai";
import { getTeacherPersona } from "../../../utils/personas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { messages, teacher } = await request.json();

    if (!messages || !teacher) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const teacherPersona = getTeacherPersona(teacher);

    if (!teacherPersona) {
      return Response.json(
        { error: "Invalid teacher specified" },
        { status: 400 }
      );
    }

    const systemMessage = {
      role: "system",
      content: teacherPersona,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    return Response.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
