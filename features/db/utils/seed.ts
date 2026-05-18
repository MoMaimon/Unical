import { prisma } from "./prisma";

// Helper function to generate random number between min and max
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to get random item from array
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Day bitmask values (Sunday = 1, Monday = 2, Tuesday = 4, Wednesday = 8, Thursday = 16, Friday = 32, Saturday = 64)
const DAYS = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 4,
  WEDNESDAY: 8,
  THURSDAY: 16,
  FRIDAY: 32,
  SATURDAY: 64,
};

// Generate random day combination
const generateDaysBitmask = () => {
  const dayValues = Object.values(DAYS);
  const numDays = randomBetween(1, 3);
  const selectedDays = new Set<number>();

  while (selectedDays.size < numDays) {
    selectedDays.add(randomItem(dayValues));
  }

  return Array.from(selectedDays).reduce((sum, day) => sum + day, 0);
};

async function main() {
  console.log("Starting seed generation...");

  // ==================== DEGREES ====================
  const degreesData = [
    { arabicName: "بكالوريوس", englishName: "Bachelor" },
    { arabicName: "ماجستير", englishName: "Master" },
    { arabicName: "دكتوراه", englishName: "Doctorate" },
    { arabicName: "دبلوم", englishName: "Diploma" },
    { arabicName: "بكالوريوس تطبيقي", englishName: "Applied Bachelor" },
    { arabicName: "ماجستير تنفيذي", englishName: "Executive Master" },
    { arabicName: "بكالوريوس شرف", englishName: "Bachelor with Honors" },
    { arabicName: "دبلوم عالي", englishName: "Higher Diploma" },
  ];

  const degrees = [];
  for (const degree of degreesData) {
    const created = await prisma.degrees.create({
      data: degree,
    });
    degrees.push(created);
  }
  console.log(`Created ${degrees.length} degrees`);

  // ==================== COLLEGES ====================
  const collegesData = [
    { arabicName: "كلية الهندسة", englishName: "College of Engineering" },
    { arabicName: "كلية العلوم", englishName: "College of Science" },
    {
      arabicName: "كلية إدارة الأعمال",
      englishName: "College of Business Administration",
    },
    { arabicName: "كلية الطب", englishName: "College of Medicine" },
    {
      arabicName: "كلية تقنية المعلومات",
      englishName: "College of Information Technology",
    },
    {
      arabicName: "كلية الآداب والعلوم الإنسانية",
      englishName: "College of Arts and Humanities",
    },
    { arabicName: "كلية الحقوق", englishName: "College of Law" },
    { arabicName: "كلية الصيدلة", englishName: "College of Pharmacy" },
    { arabicName: "كلية طب الأسنان", englishName: "College of Dentistry" },
    { arabicName: "كلية التربية", englishName: "College of Education" },
    {
      arabicName: "كلية العلوم الصحية",
      englishName: "College of Health Sciences",
    },
    {
      arabicName: "كلية الفنون والتصميم",
      englishName: "College of Arts and Design",
    },
    { arabicName: "كلية الزراعة", englishName: "College of Agriculture" },
    {
      arabicName: "كلية الطب البيطري",
      englishName: "College of Veterinary Medicine",
    },
    { arabicName: "كلية العمارة", englishName: "College of Architecture" },
  ];

  const colleges = [];
  for (const college of collegesData) {
    const created = await prisma.colleges.create({
      data: college,
    });
    colleges.push(created);
  }
  console.log(`Created ${colleges.length} colleges`);

  // ==================== DEPARTMENTS ====================
  const departmentsByCollege: Record<
    string,
    Array<{ arabicName: string; englishName: string }>
  > = {
    "كلية الهندسة": [
      { arabicName: "الهندسة المدنية", englishName: "Civil Engineering" },
      {
        arabicName: "الهندسة الميكانيكية",
        englishName: "Mechanical Engineering",
      },
      {
        arabicName: "الهندسة الكهربائية",
        englishName: "Electrical Engineering",
      },
      { arabicName: "الهندسة الكيميائية", englishName: "Chemical Engineering" },
      { arabicName: "هندسة الحاسوب", englishName: "Computer Engineering" },
      { arabicName: "هندسة الصناعية", englishName: "Industrial Engineering" },
      { arabicName: "هندسة الطيران", englishName: "Aerospace Engineering" },
      { arabicName: "الهندسة الطبية", englishName: "Biomedical Engineering" },
    ],
    "كلية العلوم": [
      { arabicName: "الرياضيات", englishName: "Mathematics" },
      { arabicName: "الفيزياء", englishName: "Physics" },
      { arabicName: "الكيمياء", englishName: "Chemistry" },
      { arabicName: "الأحياء", englishName: "Biology" },
      { arabicName: "الإحصاء", englishName: "Statistics" },
      { arabicName: "علوم الأرض", englishName: "Earth Sciences" },
    ],
    "كلية إدارة الأعمال": [
      { arabicName: "إدارة الأعمال", englishName: "Business Administration" },
      { arabicName: "المحاسبة", englishName: "Accounting" },
      { arabicName: "المالية", englishName: "Finance" },
      { arabicName: "التسويق", englishName: "Marketing" },
      {
        arabicName: "إدارة الموارد البشرية",
        englishName: "Human Resource Management",
      },
      {
        arabicName: "نظم المعلومات الإدارية",
        englishName: "Management Information Systems",
      },
    ],
    "كلية تقنية المعلومات": [
      { arabicName: "علوم الحاسوب", englishName: "Computer Science" },
      { arabicName: "نظم المعلومات", englishName: "Information Systems" },
      { arabicName: "الأمن السيبراني", englishName: "Cybersecurity" },
      {
        arabicName: "الذكاء الاصطناعي",
        englishName: "Artificial Intelligence",
      },
      { arabicName: "علوم البيانات", englishName: "Data Science" },
      { arabicName: "هندسة البرمجيات", englishName: "Software Engineering" },
    ],
  };

  const departments = [];
  for (const college of colleges) {
    const deptList = departmentsByCollege[college.arabicName] || [
      {
        arabicName: `قسم ${college.arabicName}`,
        englishName: `Department of ${college.englishName}`,
      },
      {
        arabicName: `قسم الدراسات المتقدمة في ${college.arabicName}`,
        englishName: `Advanced Studies in ${college.englishName}`,
      },
    ];

    for (const dept of deptList) {
      const created = await prisma.departments.create({
        data: {
          collegeId: college.id,
          arabicName: dept.arabicName,
          englishName: dept.englishName,
        },
      });
      departments.push(created);
    }
  }
  console.log(`Created ${departments.length} departments`);

  // ==================== COURSES ====================
  const coursePrefixes = [
    { code: "CIV", arabic: "هندسة مدنية", english: "Civil Engineering" },
    {
      code: "MEC",
      arabic: "هندسة ميكانيكية",
      english: "Mechanical Engineering",
    },
    {
      code: "ELE",
      arabic: "هندسة كهربائية",
      english: "Electrical Engineering",
    },
    { code: "CSC", arabic: "علوم حاسوب", english: "Computer Science" },
    { code: "BUS", arabic: "إدارة أعمال", english: "Business" },
    { code: "MTH", arabic: "رياضيات", english: "Mathematics" },
    { code: "PHY", arabic: "فيزياء", english: "Physics" },
    { code: "CHM", arabic: "كيمياء", english: "Chemistry" },
    { code: "BIO", arabic: "أحياء", english: "Biology" },
    { code: "ACC", arabic: "محاسبة", english: "Accounting" },
    { code: "FIN", arabic: "مالية", english: "Finance" },
    { code: "MKT", arabic: "تسويق", english: "Marketing" },
    { code: "HRM", arabic: "موارد بشرية", english: "Human Resources" },
    { code: "CYS", arabic: "أمن سيبراني", english: "Cybersecurity" },
    { code: "DAT", arabic: "علوم بيانات", english: "Data Science" },
    { code: "SWE", arabic: "هندسة برمجيات", english: "Software Engineering" },
  ];

  const courses = [];
  const courseNames = [
    { arabic: "مقدمة في", english: "Introduction to" },
    { arabic: "أساسيات", english: "Fundamentals of" },
    { arabic: "متقدم في", english: "Advanced" },
    { arabic: "تطبيقات", english: "Applications of" },
    { arabic: "نظريات", english: "Theories of" },
    { arabic: "مشروع", english: "Project in" },
    { arabic: "تصميم", english: "Design of" },
    { arabic: "تحليل", english: "Analysis of" },
    { arabic: "إدارة", english: "Management of" },
    { arabic: "تطوير", english: "Development of" },
  ];

  for (let i = 0; i < 200; i++) {
    const prefix = randomItem(coursePrefixes);
    const level = randomBetween(1, 4);
    const number = randomBetween(100, 499);
    const courseCode = `${prefix.code}${level}${number}`;
    const nameTemplate = randomItem(courseNames);

    const degree = randomItem(degrees);
    const department = randomItem(departments);
    const creditHours = randomBetween(1, 4);

    const course = await prisma.courses.create({
      data: {
        degreeId: degree.id,
        departmentId: department.id,
        courseCode: courseCode,
        arabicName: `${nameTemplate.arabic} ${prefix.arabic}`,
        englishName: `${nameTemplate.english} ${prefix.english}`,
        creditHours: creditHours,
      },
    });
    courses.push(course);

    if ((i + 1) % 50 === 0) {
      console.log(`Created ${i + 1} courses...`);
    }
  }
  console.log(`Created ${courses.length} courses`);

  // ==================== LECTURERS ====================
  const firstNames = [
    "Ahmed",
    "Mohammed",
    "Ali",
    "Hassan",
    "Omar",
    "Yusuf",
    "Ibrahim",
    "Khalid",
    "Fatima",
    "Aisha",
    "Nora",
    "Layla",
    "Sara",
    "Maryam",
    "Zainab",
    "Huda",
    "John",
    "David",
    "Michael",
    "Robert",
    "James",
    "William",
    "Richard",
    "Thomas",
    "Sarah",
    "Emma",
    "Lisa",
    "Jennifer",
    "Maria",
    "Susan",
    "Linda",
    "Patricia",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Al-Rashid",
    "Al-Farsi",
    "Al-Zahrani",
    "Al-Otaibi",
    "Al-Dossari",
    "Al-Qahtani",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
  ];

  const lecturers = [];
  for (let i = 0; i < 80; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const lecturer = await prisma.lecturer.create({
      data: {
        name: `${firstName} ${lastName}`,
      },
    });
    lecturers.push(lecturer);
  }
  console.log(`Created ${lecturers.length} lecturers`);

  // ==================== SECTIONS AND TIMES ====================
  const sectionNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rooms = [
    "A101",
    "A102",
    "A103",
    "A104",
    "A105",
    "B201",
    "B202",
    "B203",
    "B204",
    "B205",
    "C301",
    "C302",
    "C303",
    "C304",
    "C305",
    "Lab-1",
    "Lab-2",
    "Lab-3",
    "Lab-4",
    "Lab-5",
    "Online-Zoom-A",
    "Online-Zoom-B",
    "Online-Zoom-C",
  ];

  const totalSections = 500;
  let sectionsCreated = 0;

  for (let i = 0; i < totalSections; i++) {
    const course = randomItem(courses);
    const lecturer = randomItem(lecturers);
    const sectionNo = randomItem(sectionNumbers);
    const status = randomBetween(0, 2); // 0: closed, 1: open, 2: full

    const section = await prisma.sections.create({
      data: {
        courseId: course.id,
        lecturerId: lecturer.id,
        sectionNo: sectionNo,
        status: status,
      },
    });

    // Create 1-3 time slots per section
    const numTimeSlots = randomBetween(1, 3);
    for (let j = 0; j < numTimeSlots; j++) {
      const daysBitmask = generateDaysBitmask();
      const startHour = randomBetween(8, 19);
      const startMinute = randomBetween(0, 3) * 15;
      const duration = randomBetween(50, 110);
      const endMinutes = startHour * 60 + startMinute + duration;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;

      const startDate = new Date();
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMinute, 0, 0);

      const isOnline = Math.random() > 0.7;
      const room = isOnline
        ? rooms[randomBetween(20, 22)]
        : randomItem(rooms.slice(0, 20));

      await prisma.times.create({
        data: {
          sectionId: section.id,
          days: daysBitmask,
          startTime: startDate,
          endTime: endDate,
          startMinutes: startHour * 60 + startMinute,
          endMinutes: endMinutes,
          room: room,
          isOnline: isOnline,
        },
      });
    }

    sectionsCreated++;
    if (sectionsCreated % 100 === 0) {
      console.log(
        `Created ${sectionsCreated} sections with their time slots...`,
      );
    }
  }

  console.log(`Total sections created: ${sectionsCreated}`);

  // ==================== ADDITIONAL DATA FOR RICHNESS ====================

  // Create more courses for specific departments to ensure variety
  console.log("Creating specialized courses...");
  const specializedCourses = [];

  for (let i = 0; i < 100; i++) {
    const department = randomItem(departments);
    const degree = randomItem(degrees);
    const level = randomBetween(1, 4);
    const prefix = department.englishName.substring(0, 3).toUpperCase();
    const courseCode = `${prefix}${level}${randomBetween(100, 499)}`;

    const specializedCourse = await prisma.courses.create({
      data: {
        degreeId: degree.id,
        departmentId: department.id,
        courseCode: courseCode,
        arabicName: `${department.arabicName} - مقرر متخصص ${i + 1}`,
        englishName: `${department.englishName} - Specialized Course ${i + 1}`,
        creditHours: randomBetween(2, 4),
      },
    });
    specializedCourses.push(specializedCourse);

    // Create sections for these specialized courses
    for (let k = 0; k < randomBetween(1, 3); k++) {
      const lecturer = randomItem(lecturers);
      const section = await prisma.sections.create({
        data: {
          courseId: specializedCourse.id,
          lecturerId: lecturer.id,
          sectionNo: randomItem(sectionNumbers),
          status: randomBetween(0, 2),
        },
      });

      // Add 1-2 time slots
      for (let t = 0; t < randomBetween(1, 2); t++) {
        const daysBitmask = generateDaysBitmask();
        const startHour = randomBetween(8, 20);
        const startMinute = randomBetween(0, 3) * 15;
        const duration = randomBetween(50, 110);
        const endMinutes = startHour * 60 + startMinute + duration;

        await prisma.times.create({
          data: {
            sectionId: section.id,
            days: daysBitmask,
            startTime: new Date(
              new Date().setHours(startHour, startMinute, 0, 0),
            ),
            endTime: new Date(
              new Date().setHours(
                Math.floor(endMinutes / 60),
                endMinutes % 60,
                0,
                0,
              ),
            ),
            startMinutes: startHour * 60 + startMinute,
            endMinutes: endMinutes,
            room: randomItem(rooms),
            isOnline: Math.random() > 0.8,
          },
        });
      }
    }
  }

  console.log(
    `Created ${specializedCourses.length} specialized courses with sections`,
  );

  // Final statistics
  const finalStats = await prisma.$transaction([
    prisma.degrees.count(),
    prisma.colleges.count(),
    prisma.departments.count(),
    prisma.courses.count(),
    prisma.lecturer.count(),
    prisma.sections.count(),
    prisma.times.count(),
  ]);

  console.log("\n=== FINAL DATABASE STATISTICS ===");
  console.log(`Degrees: ${finalStats[0]}`);
  console.log(`Colleges: ${finalStats[1]}`);
  console.log(`Departments: ${finalStats[2]}`);
  console.log(`Courses: ${finalStats[3]}`);
  console.log(`Lecturers: ${finalStats[4]}`);
  console.log(`Sections: ${finalStats[5]}`);
  console.log(`Time Slots: ${finalStats[6]}`);
  console.log("================================\n");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
