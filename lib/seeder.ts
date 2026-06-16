import { collection, doc, writeBatch, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const DEFAULT_COURSES = [
  {
    id: "COS301",
    title: "Software Engineering",
    units: 4,
    description: "Methodologies, designs, architectures, testing, agile workflows, and full-stack project development.",
    department: "Computer Science",
    scheduleDay: "Monday",
    scheduleTime: "09:00 - 11:00",
    room: "Babcock Hall A1"
  },
  {
    id: "COS305",
    title: "Database Systems",
    units: 3,
    description: "Relational database models, SQL queries, normalization, transactions, and NoSQL storage engines.",
    department: "Computer Science",
    scheduleDay: "Wednesday",
    scheduleTime: "11:00 - 13:00",
    room: "Science Lab 3"
  },
  {
    id: "COS401",
    title: "Artificial Intelligence",
    units: 4,
    description: "Search algorithms, knowledge representation, expert systems, neural networks, and modern LLM paradigms.",
    department: "Computer Science",
    scheduleDay: "Thursday",
    scheduleTime: "14:00 - 16:00",
    room: "Postgraduate Block"
  },
  {
    id: "COS201",
    title: "Java Programming",
    units: 3,
    description: "Classes, inheritance, polymorphism, interfaces, exception handling, multithreading, and desktop applications.",
    department: "Computer Science",
    scheduleDay: "Tuesday",
    scheduleTime: "10:00 - 12:00",
    room: "Babcock Hall B2"
  },
  {
    id: "MTS101",
    title: "Algebra & Trigonometry",
    units: 3,
    description: "Set theory, quadratic equations, partial fractions, complex numbers, series, and trigonometric functions.",
    department: "Mathematics",
    scheduleDay: "Friday",
    scheduleTime: "08:00 - 10:00",
    room: "General Lecture Theatre"
  },
  {
    id: "GST111",
    title: "Communication in English",
    units: 2,
    description: "Active reading, vocabulary builder, grammatical patterns, sentence structure, and academic paper design.",
    department: "General Studies",
    scheduleDay: "Monday",
    scheduleTime: "14:00 - 15:30",
    room: "Humanities Hall"
  }
];

export async function seedCoursesIfEmpty() {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    if (querySnapshot.empty) {
      console.log("Database courses empty, seeding mock university classes...");
      const batch = writeBatch(db);
      
      DEFAULT_COURSES.forEach((course) => {
        // We set dummy instructor ids to show in catalogs
        const courseWithInstructor = {
          ...course,
          instructorId: "demo-instructor-uid",
          instructorName: "Prof. Bankole Praise"
        };
        const docRef = doc(db, "courses", course.id);
        batch.set(docRef, courseWithInstructor);
      });
      
      await batch.commit();
      console.log("Seeding courses successfully completed.");
    }
  } catch (err) {
    console.error("Failed to seed courses:", err);
  }
}
