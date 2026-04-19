import { query } from './src/db/pool.js';

async function seedPlaylists() {
  try {
    console.log('🚀 Seeding SQL and Maths Playlist Courses with REAL links...');

    // 1. Get a teacher to assign courses to
    const teacherRes = await query("SELECT id FROM users WHERE role = 'teacher' LIMIT 1");
    if (teacherRes.rows.length === 0) {
      console.error('❌ No teacher found. Please run main seed first.');
      return;
    }
    const teacherId = teacherRes.rows[0].id;

    // Cleanup previous seed data to avoid duplicates
    await query("DELETE FROM courses WHERE title IN ($1, $2)", 
      ['CS50 SQL: Database Management', 'Advanced Mathematics: Full Foundation']);

    // 2. Create SQL Playlist Course
    const sqlCourseRes = await query(
      `INSERT INTO courses (teacher_id, title, academic_year, subject, cover_color, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [teacherId, 'CS50 SQL: Database Management', '2024-2025', 'CS', '#4B2676', 'Introduction to databases with SQL, featuring the complete CS50 curriculum.']
    );
    const sqlCourseId = sqlCourseRes.rows[0].id;
    console.log('✓ SQL Course created');

    // 3. Add SQL Modules (Materials) with real YouTube links
    const sqlModules = [
      { title: 'CS50 SQL Lecture 0 – Querying', url: 'https://www.youtube.com/watch?v=vLp_H72G980' },
      { title: 'CS50 SQL Lecture 1 – Relating', url: 'https://www.youtube.com/watch?v=vG9zWz_0D9M' },
      { title: 'CS50 SQL Lecture 2 – Designing', url: 'https://www.youtube.com/watch?v=L2x669M-v3k' },
      { title: 'CS50 SQL Lecture 3 – Writing', url: 'https://www.youtube.com/watch?v=mDRE3O_1J88' },
      { title: 'CS50 SQL Lecture 4 – Viewing', url: 'https://www.youtube.com/watch?v=m-vYvFm_Czs' },
      { title: 'CS50 SQL Lecture 5 – Optimizing', url: 'https://www.youtube.com/watch?v=ZfJ1uL6qFfI' },
    ];

    for (const mod of sqlModules) {
      await query(
        `INSERT INTO materials (course_id, created_by, title, description, link_url) 
         VALUES ($1, $2, $3, $4, $5)`,
        [sqlCourseId, teacherId, mod.title, 'Full lecture from Harvard University.', mod.url]
      );
    }
    console.log('✓ SQL Modules added with real links');

    // 4. Create Maths Playlist Course
    const mathsCourseRes = await query(
      `INSERT INTO courses (teacher_id, title, academic_year, subject, cover_color, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [teacherId, 'Advanced Mathematics: Full Foundation', '2024-2025', 'MATH', '#7C5CFC', 'Comprehensive mathematical foundation for engineering and data science.']
    );
    const mathsCourseId = mathsCourseRes.rows[0].id;
    console.log('✓ Maths Course created');

    // 5. Add Maths Modules with real YouTube links
    const mathsModules = [
      { title: 'College Algebra – Full Course', url: 'https://www.youtube.com/watch?v=LwCRRUa8yTU' },
      { title: 'Linear Algebra – Full Course', url: 'https://www.youtube.com/watch?v=JnTa9X9838E' },
      { title: 'Statistics – Full Course', url: 'https://www.youtube.com/watch?v=H7P607_U72k' },
      { title: 'Calculus – Full Course', url: 'https://www.youtube.com/watch?v=0_u6_6N3Eks' },
    ];

    for (const mod of mathsModules) {
      await query(
        `INSERT INTO materials (course_id, created_by, title, description, link_url) 
         VALUES ($1, $2, $3, $4, $5)`,
        [mathsCourseId, teacherId, mod.title, 'In-depth mathematical concepts for advanced learners.', mod.url]
      );
    }
    console.log('✓ Maths Modules added with real links');

    // 6. Add Fake Assignments
    const fakeAssignments = [
      { course_id: sqlCourseId, title: 'SQL Querying Lab 1', instructions: 'Submit a PDF containing your SQL queries for the "Querying" lecture exercises.' },
      { course_id: sqlCourseId, title: 'ERD Design Assignment', instructions: 'Draw an ERD for a university portal and upload it here.' },
      { course_id: mathsCourseId, title: 'Algebra Problem Set', instructions: 'Solve the 10 problems shared in the Algebra module and upload your steps.' },
      { course_id: mathsCourseId, title: 'Final Calculus Integration Quiz', instructions: 'A comprehensive quiz on integration techniques covered in the Calculus course.' },
    ];

    for (const ass of fakeAssignments) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      await query(
        `INSERT INTO assignments (course_id, created_by, title, instructions, due_date, points) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ass.course_id, teacherId, ass.title, ass.instructions, dueDate.toISOString(), 100]
      );
    }
    console.log('✓ Fake assignments added');

    const assignmentsRes = await query("SELECT id, course_id FROM assignments WHERE course_id IN ($1, $2)", [sqlCourseId, mathsCourseId]);
    const assignmentsList = assignmentsRes.rows;

    // 7. Create invite codes
    const coursesToInvite = [sqlCourseId, mathsCourseId];
    for (const cid of coursesToInvite) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await query(
        `INSERT INTO course_invite_codes (course_id, code, created_by) VALUES ($1, $2, $3)`,
        [cid, code, teacherId]
      );
    }
    console.log('✓ Invite codes created');

    // 8. Enroll all students
    const studentsRes = await query("SELECT id FROM users WHERE role = 'student'");
    const studentIds = studentsRes.rows.map(s => s.id);

    for (const studentId of studentIds) {
      await query("INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [studentId, sqlCourseId]);
      await query("INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [studentId, mathsCourseId]);
    }
    console.log('✓ All students enrolled in new courses');

    // 9. Create fake submissions
    for (const ass of assignmentsList) {
      // Each student has a 70% chance of having submitted
      for (const studentId of studentIds) {
        if (Math.random() > 0.3) {
          const submittedAt = new Date();
          submittedAt.setDate(submittedAt.getDate() - Math.floor(Math.random() * 3));
          
          await query(
            `INSERT INTO submissions (assignment_id, user_id, submission_text, status, submitted_at) 
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
            [
              ass.id, 
              studentId, 
              'This is my automated submission for testing the grading system.', 
              'submitted', 
              submittedAt.toISOString()
            ]
          );
        }
      }
    }
    console.log('✓ Fake submissions created for students');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedPlaylists();
