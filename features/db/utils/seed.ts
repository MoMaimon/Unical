import { prisma } from "./prisma"



async function main() {
  console.log('Starting seed...')

  // Clear existing data (optional - uncomment if needed)
  // await prisma.times.deleteMany()
  // await prisma.sections.deleteMany()
  // await prisma.lecturer.deleteMany()
  // await prisma.courses.deleteMany()
  // await prisma.departments.deleteMany()
  // await prisma.colleges.deleteMany()
  // await prisma.degrees.deleteMany()

  // Create Degrees
  const bachelor = await prisma.degrees.create({
    data: {
      arabicName: 'بكالوريوس',
      englishName: 'Bachelor',
    }
  })

  const master = await prisma.degrees.create({
    data: {
      arabicName: 'ماجستير',
      englishName: 'Master',
    }
  })

  const doctorate = await prisma.degrees.create({
    data: {
      arabicName: 'دكتوراه',
      englishName: 'Doctorate',
    }
  })

  console.log('Created degrees')

  // Create Colleges
  const engineering = await prisma.colleges.create({
    data: {
      arabicName: 'كلية الهندسة',
      englishName: 'College of Engineering',
    }
  })

  const science = await prisma.colleges.create({
    data: {
      arabicName: 'كلية العلوم',
      englishName: 'College of Science',
    }
  })

  const business = await prisma.colleges.create({
    data: {
      arabicName: 'كلية إدارة الأعمال',
      englishName: 'College of Business Administration',
    }
  })

  console.log('Created colleges')

  // Create Departments
  const computerEngineering = await prisma.departments.create({
    data: {
      collegeId: engineering.id,
      arabicName: 'هندسة الحاسب',
      englishName: 'Computer Engineering',
    }
  })

  const electricalEngineering = await prisma.departments.create({
    data: {
      collegeId: engineering.id,
      arabicName: 'الهندسة الكهربائية',
      englishName: 'Electrical Engineering',
    }
  })

  const mathematics = await prisma.departments.create({
    data: {
      collegeId: science.id,
      arabicName: 'الرياضيات',
      englishName: 'Mathematics',
    }
  })

  const physics = await prisma.departments.create({
    data: {
      collegeId: science.id,
      arabicName: 'الفيزياء',
      englishName: 'Physics',
    }
  })

  const marketing = await prisma.departments.create({
    data: {
      collegeId: business.id,
      arabicName: 'التسويق',
      englishName: 'Marketing',
    }
  })

  console.log('Created departments')

  // Create Courses
  const dataStructures = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: computerEngineering.id,
      courseCode: 'CSE201',
      arabicName: 'هياكل البيانات',
      englishName: 'Data Structures',
      creditHours: 3,
    }
  })

  const algorithms = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: computerEngineering.id,
      courseCode: 'CSE301',
      arabicName: 'الخوارزميات',
      englishName: 'Algorithms',
      creditHours: 3,
    }
  })

  const databases = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: computerEngineering.id,
      courseCode: 'CSE205',
      arabicName: 'قواعد البيانات',
      englishName: 'Databases',
      creditHours: 3,
    }
  })

  const circuitAnalysis = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: electricalEngineering.id,
      courseCode: 'EEE202',
      arabicName: 'تحليل الدوائر',
      englishName: 'Circuit Analysis',
      creditHours: 3,
    }
  })

  const calculus1 = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: mathematics.id,
      courseCode: 'MATH101',
      arabicName: 'حساب التفاضل والتكامل 1',
      englishName: 'Calculus I',
      creditHours: 3,
    }
  })

  const linearAlgebra = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: mathematics.id,
      courseCode: 'MATH202',
      arabicName: 'الجبر الخطي',
      englishName: 'Linear Algebra',
      creditHours: 3,
    }
  })

  const quantumMechanics = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: physics.id,
      courseCode: 'PHYS301',
      arabicName: 'ميكانيكا الكم',
      englishName: 'Quantum Mechanics',
      creditHours: 3,
    }
  })

  const marketingFundamentals = await prisma.courses.create({
    data: {
      degreeId: bachelor.id,
      departmentId: marketing.id,
      courseCode: 'MKTG201',
      arabicName: 'أساسيات التسويق',
      englishName: 'Marketing Fundamentals',
      creditHours: 3,
    }
  })

  console.log('Created courses')

  // Create Lecturers
  const drAhmed = await prisma.lecturer.create({
    data: {
      name: 'Dr. Ahmed Al-Rashid',
    }
  })

  const drFatima = await prisma.lecturer.create({
    data: {
      name: 'Dr. Fatima Al-Zahrani',
    }
  })

  const drMohammed = await prisma.lecturer.create({
    data: {
      name: 'Dr. Mohammed Al-Otaibi',
    }
  })

  const drSarah = await prisma.lecturer.create({
    data: {
      name: 'Dr. Sarah Al-Saud',
    }
  })

  const drKhalid = await prisma.lecturer.create({
    data: {
      name: 'Dr. Khalid Al-Ghamdi',
    }
  })

  console.log('Created lecturers')

  // Create Sections and Times
  const now = new Date()
  const startTime = new Date(now)
  startTime.setHours(9, 0, 0, 0)
  const endTime = new Date(now)
  endTime.setHours(10, 30, 0, 0)

  const startTime2 = new Date(now)
  startTime2.setHours(11, 0, 0, 0)
  const endTime2 = new Date(now)
  endTime2.setHours(12, 30, 0, 0)

  const startTime3 = new Date(now)
  startTime3.setHours(14, 0, 0, 0)
  const endTime3 = new Date(now)
  endTime3.setHours(15, 30, 0, 0)

  // Section 1: Data Structures (Dr. Ahmed - Monday & Wednesday)
  const section1 = await prisma.sections.create({
    data: {
      courseId: dataStructures.id,
      lecturerId: drAhmed.id,
      times: {
        create: [
          {
            days: 10, // Monday & Wednesday
            startTime: startTime,
            endTime: endTime,
            startMinutes: 9 * 60,
            endMinutes: 10 * 60 + 30,
            room: 'Room 201',
            isOnline: false,
          },
        ]
      }
    }
  })

  // Section 2: Algorithms (Dr. Fatima - Tuesday & Thursday)
  const section2 = await prisma.sections.create({
    data: {
      courseId: algorithms.id,
      lecturerId: drFatima.id,
      times: {
        create: [
          {
            days: 5, // Sunday & Tuesday
            startTime: startTime,
            endTime: endTime,
            startMinutes: 9 * 60,
            endMinutes: 10 * 60 + 30,
            room: 'Room 202',
            isOnline: false,
          },
          {
            days: 16, // Thursday
            startTime: startTime,
            endTime: endTime,
            startMinutes: 9 * 60,
            endMinutes: 10 * 60 + 30,
            room: 'Online',
            isOnline: true,
          }
        ]
      }
    }
  })

  // Section 3: Databases (Dr. Mohammed - Online - Sunday)
  const section3 = await prisma.sections.create({
    data: {
      courseId: databases.id,
      lecturerId: drMohammed.id,
      times: {
        create: [
          {
            days: 0, // Sunday
            startTime: startTime2,
            endTime: endTime2,
            startMinutes: 11 * 60,
            endMinutes: 12 * 60 + 30,
            room: 'Online',
            isOnline: true,
          }
        ]
      }
    }
  })

  // Section 4: Circuit Analysis (Dr. Sarah - Monday & Wednesday)
  const section4 = await prisma.sections.create({
    data: {
      courseId: circuitAnalysis.id,
      lecturerId: drSarah.id,
      times: {
        create: [
          {
            days: 1, // Monday
            startTime: startTime3,
            endTime: endTime3,
            startMinutes: 14 * 60,
            endMinutes: 15 * 60 + 30,
            room: 'Lab 101',
            isOnline: false,
          },
          {
            days: 3, // Wednesday
            startTime: startTime3,
            endTime: endTime3,
            startMinutes: 14 * 60,
            endMinutes: 15 * 60 + 30,
            room: 'Lab 101',
            isOnline: false,
          }
        ]
      }
    }
  })

  // Section 5: Calculus I (Dr. Khalid - Tuesday & Thursday)
  const section5 = await prisma.sections.create({
    data: {
      courseId: calculus1.id,
      lecturerId: drKhalid.id,
      times: {
        create: [
          {
            days: 2, // Tuesday
            startTime: startTime2,
            endTime: endTime2,
            startMinutes: 11 * 60,
            endMinutes: 12 * 60 + 30,
            room: 'Room 301',
            isOnline: false,
          },
          {
            days: 4, // Thursday
            startTime: startTime2,
            endTime: endTime2,
            startMinutes: 11 * 60,
            endMinutes: 12 * 60 + 30,
            room: 'Room 301',
            isOnline: false,
          }
        ]
      }
    }
  })

  console.log('Created sections and times')

  // Summary
  console.log('\n✅ Seed completed successfully!')
  console.log(`Created: ${await prisma.degrees.count()} degrees`)
  console.log(`Created: ${await prisma.colleges.count()} colleges`)
  console.log(`Created: ${await prisma.departments.count()} departments`)
  console.log(`Created: ${await prisma.courses.count()} courses`)
  console.log(`Created: ${await prisma.lecturer.count()} lecturers`)
  console.log(`Created: ${await prisma.sections.count()} sections`)
  console.log(`Created: ${await prisma.times.count()} time slots`)
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })