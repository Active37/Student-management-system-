import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  writeBatch 
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { seedCoursesIfEmpty } from "./seeder";

const DEMO_STUDENT_EMAIL = "student@babcock-umis.edu.ng";
const DEMO_STUDENT_PASS = "babcockStudent123!";

const DEMO_INSTRUCTOR_EMAIL = "instructor@babcock-umis.edu.ng";
const DEMO_INSTRUCTOR_PASS = "babcockInstructor123!";

export async function loginAsDemoStudent() {
  await seedCoursesIfEmpty();
  try {
    const cred = await signInWithEmailAndPassword(auth, DEMO_STUDENT_EMAIL, DEMO_STUDENT_PASS);
    await checkAndCreateStudentProfile(cred.user.uid);
    return cred.user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      // Create user
      try {
        const cred = await createUserWithEmailAndPassword(auth, DEMO_STUDENT_EMAIL, DEMO_STUDENT_PASS);
        await checkAndCreateStudentProfile(cred.user.uid, true);
        return cred.user;
      } catch (err: any) {
        console.error("Failed to create demo student:", err);
        throw err;
      }
    }
    throw error;
  }
}

export async function loginAsDemoInstructor() {
  await seedCoursesIfEmpty();
  try {
    const cred = await signInWithEmailAndPassword(auth, DEMO_INSTRUCTOR_EMAIL, DEMO_INSTRUCTOR_PASS);
    await checkAndCreateInstructorProfile(cred.user.uid);
    return cred.user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      // Create user
      try {
        const cred = await createUserWithEmailAndPassword(auth, DEMO_INSTRUCTOR_EMAIL, DEMO_INSTRUCTOR_PASS);
        await checkAndCreateInstructorProfile(cred.user.uid, true);
        return cred.user;
      } catch (err: any) {
        console.error("Failed to create demo instructor:", err);
        throw err;
      }
    }
    throw error;
  }
}

async function checkAndCreateStudentProfile(uid: string, forceCreate = false) {
  const profileRef = doc(db, "users", uid);
  const profileSnap = await getDoc(profileRef);
  
  if (!profileSnap.exists() || forceCreate) {
    // Create student profile
    await setDoc(profileRef, {
      uid: uid,
      name: "Chinedu Okafor",
      email: DEMO_STUDENT_EMAIL,
      role: "student",
      studentId: "BU22CSC1001",
      department: "Computer Science",
      phone: "+234 812 345 6789",
      level: "300L"
    });
    
    // Seed initial student registration & grades so they have dynamic graphics out of the box!
    await seedDemoEnrollments(uid);
  }
}

async function checkAndCreateInstructorProfile(uid: string, forceCreate = false) {
  const profileRef = doc(db, "users", uid);
  const profileSnap = await getDoc(profileRef);
  
  if (!profileSnap.exists() || forceCreate) {
    // Create instructor profile
    await setDoc(profileRef, {
      uid: uid,
      name: "Prof. Bankole Praise",
      email: DEMO_INSTRUCTOR_EMAIL,
      role: "instructor",
      studentId: "STAFF-BU8922",
      department: "Computer Science",
      phone: "+234 803 777 8888",
      level: "Professor / Chair"
    });
  }
}

async function seedDemoEnrollments(studentUid: string) {
  try {
    const enrollmentsRef = collection(db, "enrollments");
    const snap = await getDocs(enrollmentsRef);
    
    // Only register if no enrollments for this student exist
    const studentEnrollments = snap.docs.filter(doc => doc.data().studentId === studentUid);
    if (studentEnrollments.length === 0) {
      console.log("Seeding demo enrollments & grades for demo student...");
      const batch = writeBatch(db);
      
      const enrollmentsData = [
        {
          id: `${studentUid}_COS201`,
          studentId: studentUid,
          studentName: "Chinedu Okafor",
          courseId: "COS201",
          courseTitle: "Java Programming",
          courseUnits: 3,
          semester: "2025 Fall",
          score: 82,
          grade: "A",
          status: "completed"
        },
        {
          id: `${studentUid}_MTS101`,
          studentId: studentUid,
          studentName: "Chinedu Okafor",
          courseId: "MTS101",
          courseTitle: "Algebra & Trigonometry",
          courseUnits: 3,
          semester: "2025 Fall",
          score: 48,
          grade: "D",
          status: "completed"
        },
        {
          id: `${studentUid}_GST111`,
          studentId: studentUid,
          studentName: "Chinedu Okafor",
          courseId: "GST111",
          courseTitle: "Communication in English",
          courseUnits: 2,
          semester: "2025 Fall",
          score: 75,
          grade: "A",
          status: "completed"
        },
        {
          id: `${studentUid}_COS301`,
          studentId: studentUid,
          studentName: "Chinedu Okafor",
          courseId: "COS301",
          courseTitle: "Software Engineering",
          courseUnits: 4,
          semester: "2026 Spring",
          score: 71,
          grade: "A",
          status: "active"
        },
        {
          id: `${studentUid}_COS305`,
          studentId: studentUid,
          studentName: "Chinedu Okafor",
          courseId: "COS305",
          courseTitle: "Database Systems",
          courseUnits: 3,
          semester: "2026 Spring",
          score: 64,
          grade: "B",
          status: "active"
        }
      ];
      
      enrollmentsData.forEach(item => {
        const docRef = doc(db, "enrollments", item.id);
        batch.set(docRef, item);
      });
      
      // Let's also preseed a few attendance records so the student analytics have attendance values!
      // Attendance records combination of studentId_sessionId
      // We will add session ids "atten_COS301_s1", "atten_COS301_s2", "atten_COS305_s1"
      // sessions in attendance_sessions:
      const session1Ref = doc(db, "attendance_sessions", "atten_COS301_s1");
      batch.set(session1Ref, {
        id: "atten_COS301_s1",
        courseId: "COS301",
        date: "2026-06-15",
        otp: "4820",
        active: false,
        createdAt: "2026-06-15T09:05:00Z",
        instructorId: "demo-instructor-uid"
      });

      const session2Ref = doc(db, "attendance_sessions", "atten_COS301_s2");
      batch.set(session2Ref, {
        id: "atten_COS301_s2",
        courseId: "COS301",
        date: "2026-06-16",
        otp: "9912",
        active: true, // Let one stay active
        createdAt: "2026-06-16T09:02:00Z",
        instructorId: "demo-instructor-uid"
      });

      const record1Ref = doc(db, "attendance_records", `${studentUid}_atten_COS301_s1`);
      batch.set(record1Ref, {
        id: `${studentUid}_atten_COS301_s1`,
        studentId: studentUid,
        studentName: "Chinedu Okafor",
        studentMatric: "BU22CSC1001",
        sessionId: "atten_COS301_s1",
        courseId: "COS301",
        timestamp: "2026-06-15T09:12:05Z",
        status: "present"
      });

      await batch.commit();
      console.log("Demo student enrollments and records successfully seeded.");
    }
  } catch (error) {
    console.error("Failed to seed demo student enrollments:", error);
  }
}
