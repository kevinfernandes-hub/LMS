const BASE_URL = 'http://localhost:5001/api';

async function testEndpoints() {
  console.log('--- Testing Student Endpoints ---');
  try {
    // 1. Student Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student1@stvincentngp.edu.in', password: 'student123' })
    });
    
    if (!loginRes.ok) throw new Error(`Student login failed: ${loginRes.status}`);
    const studentCookie = loginRes.headers.get('set-cookie');
    console.log('✅ Student Login: Success');

    // 2. Student Courses
    const coursesRes = await fetch(`${BASE_URL}/courses`, {
      headers: { 'Cookie': studentCookie }
    });
    if (!coursesRes.ok) throw new Error(`Student courses failed: ${coursesRes.status}`);
    const courses = await coursesRes.json();
    console.log(`✅ Student Courses: Found ${courses.length} courses`);

    if (courses.length > 0) {
      const courseId = courses[0].id;
      
      // 3. Student Assignments
      const assignRes = await fetch(`${BASE_URL}/assignments/${courseId}/assignments`, {
        headers: { 'Cookie': studentCookie }
      });
      if (!assignRes.ok) throw new Error(`Student assignments failed: ${assignRes.status}`);
      const assignments = await assignRes.json();
      console.log(`✅ Student Assignments: Found ${assignments.length} for course ${courseId}`);

      // 4. Student Announcements
      const annRes = await fetch(`${BASE_URL}/announcements/${courseId}/announcements`, {
        headers: { 'Cookie': studentCookie }
      });
      if (!annRes.ok) throw new Error(`Student announcements failed: ${annRes.status}`);
      const announcements = await annRes.json();
      console.log(`✅ Student Announcements: Found ${announcements.length} for course ${courseId}`);
    }

  } catch (err) {
    console.error('❌ Student tests failed:', err.message);
  }

  console.log('\n--- Testing Teacher Endpoints ---');
  try {
    // 1. Teacher Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher1@stvincentngp.edu.in', password: 'teacher123' })
    });
    
    if (!loginRes.ok) throw new Error(`Teacher login failed: ${loginRes.status}`);
    const teacherCookie = loginRes.headers.get('set-cookie');
    console.log('✅ Teacher Login: Success');

    // 2. Teacher Courses
    const coursesRes = await fetch(`${BASE_URL}/courses`, {
      headers: { 'Cookie': teacherCookie }
    });
    if (!coursesRes.ok) throw new Error(`Teacher courses failed: ${coursesRes.status}`);
    const courses = await coursesRes.json();
    console.log(`✅ Teacher Courses: Found ${courses.length} courses`);

    if (courses.length > 0) {
      const courseId = courses[0].id;

      // 3. Teacher Assignments (Management)
      const assignRes = await fetch(`${BASE_URL}/assignments/${courseId}/assignments`, {
        headers: { 'Cookie': teacherCookie }
      });
      if (!assignRes.ok) throw new Error(`Teacher assignments failed: ${assignRes.status}`);
      const assignments = await assignRes.json();
      console.log(`✅ Teacher Assignments: Found ${assignments.length} for course ${courseId}`);

      // 4. Teacher Enrollments check
      const enrollRes = await fetch(`${BASE_URL}/courses/${courseId}/enrollments`, {
        headers: { 'Cookie': teacherCookie }
      });
      if (!enrollRes.ok) throw new Error(`Teacher enrollments failed: ${enrollRes.status}`);
      const enrollments = await enrollRes.json();
      console.log(`✅ Teacher Enrollments: Found ${enrollments.length} students in course ${courseId}`);
    }

  } catch (err) {
    console.error('❌ Teacher tests failed:', err.message);
  }
}

testEndpoints();
