import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { studentProfile, courses, enrollments, attendanceRecords, query } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Construct a rich, professional prompt based on student data
    const prompt = `
You are the AI Academic Advisor for the University Management Information System (UMIS).
Provide highly actionable, personalized, encouraging, and critical academic advising to the student.

--- Student Profile ---
Name: ${studentProfile.name}
Email: ${studentProfile.email}
Matric/Student ID: ${studentProfile.studentId || "N/A"}
Level: ${studentProfile.level || "N/A"}
Department: ${studentProfile.department || "N/A"}

--- Registered Courses & Academic History ---
${enrollments && enrollments.length > 0 
  ? enrollments.map((en: any) => `- Course Code: ${en.courseId}, Title: ${en.courseTitle}, Credits: ${en.courseUnits}, Semester: ${en.semester}, Current Numerical Score: ${en.score !== undefined ? en.score : "N/A"}, Grade: ${en.grade || "Pending"}, Status: ${en.status}`).join("\n")
  : "No courses currently registered / no historical grade records."
}

--- Detailed Course Catalog ---
${courses && courses.length > 0
  ? courses.map((c: any) => `- ${c.id}: ${c.title} (${c.units} Units) taught by ${c.instructorName || "TBD"} on ${c.scheduleDay} at ${c.scheduleTime}`).join("\n")
  : "No university courses listed."
}

--- Attendance Overview ---
${attendanceRecords && attendanceRecords.length > 0
  ? `Student has documented check-ins in class sessions.`
  : "No classes attended yet."
}

--- Student's Specific Query ---
"${query || "Please analyze my current academic standing, attendance rates, grades, and suggest strategies to maintain/improve my GPA and master my courses."}"

--- Guidelines for response ---
1. Address the student by their name in a friendly, supportive tone.
2. Calculate or analyze their current CGPA / GPA if grades are available (A = 5 points, B = 4 points, C = 3 points, D = 2 points, F = 0 points - standard Nigerian/Babcock university 5-point scale, or 4-point scale, but standard Nigerian grading scale for Babcock is 5.0 CGPA system. Please base on a 5.0 CGPA system!).
3. Give distinct recommendations for courses they might be struggling in (scores below 50 are failing / D/F grades, scores 70+ are A grades).
4. Outline a strategic study schedule or resources recommendation based on their courses.
5. Remind them of the attendance requirement (typically 75% attendance is required to sit for exams in Babcock University!). Ask them to keep tracking their real-time attendance using the UMIS portal.
6. Provide output in beautifully formatted markdown with clear headings. Keep it precise, professional, and do not include any fictional placeholders or system-internal details.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred while generating academic advice." },
      { status: 500 }
    );
  }
}
