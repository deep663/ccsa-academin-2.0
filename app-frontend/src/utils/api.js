import axios from "axios";

axios.defaults.withCredentials = true;

/*---------------------------------------------------------------------------------------------------------------------------*/
// User Authentication APIs
export const register = async (formData) => {
  return await axios.post(`${window.location.origin}/api/v1/users/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const signin = async (email, password) => {
  return await axios.post(`api/v1/users/login`, { email, password });
};

export const signout = async () => {
  return await axios.post(`${window.location.origin}/api/v1/users/logout`);
};
/*---------------------------------------------------------------------------------------------------------------------------*/

// User Management APIs
export const getUsers = async () => {
  return await axios.get(`${window.location.origin}/api/v1/users/get-users`);
};

export const getProfile = async () => {
  return await axios.get(`${window.location.origin}/api/v1/users/profile`);
};

export const editProfile = async (formData) => {
  return await axios.patch(`${window.location.origin}/api/v1/users/edit-profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const verifyUser = async (userId) => {
  return await axios.patch(`${window.location.origin}/api/v1/users/verify/${userId}`);
};

export const deleteUser = async (userId) => {
  return await axios.delete(`${window.location.origin}/api/v1/users/${userId}`);
};

export const usersCounts = async () => {
  return await axios.get(`${window.location.origin}/api/v1/users/counts`); 
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Subjects API
export const getSubjects = async () => {
  return await axios.get(`${window.location.origin}/api/v1/subjects`);
}

export const getSemesterSubjects = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/subjects/${course}/${semester}`);
}

export const getTeacherSubjects = async ( teacherId, semester, course) => {
  return await axios.get(`${window.location.origin}/api/v1/subjects/${course}/${semester}/${teacherId}`);
}

export const createSubject = async (subject) => {
  return await axios.post(`${window.location.origin}/api/v1/subjects`, subject);
}

export const updateSubject = async (subjectId,subject) => {
  return await axios.patch(`${window.location.origin}/api/v1/subjects/${subjectId}`, subject);
}

export const deleteSubject = async (subjectId) => {
  return await axios.delete(`${window.location.origin}/api/v1/subjects/${subjectId}`);
}

export const getTotalSubjects = async () => {
  return await axios.get(`${window.location.origin}/api/v1/subjects/count`);
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Teachers API
export const getTeachers = async () => {
  return await axios.get(`${window.location.origin}/api/v1/teachers/`);
}

export const getTeacher = async () => {
  return await axios.get(`${window.location.origin}/api/v1/teachers/teacher`);
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Student API
export const getStudents = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/students/${course}/${semester}`);
}

export const getStudent = async () => {
  return await axios.get(`${window.location.origin}/api/v1/students/`);
}


/*---------------------------------------------------------------------------------------------------------------------------*/

//Notes API
export const createNote = async (formData) => {
  return await axios.post(`${window.location.origin}/api/v1/notes`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const getNotesByTeacher = async (teacherId) => {
  return await axios.get(`${window.location.origin}/api/v1/notes/${teacherId}`);
}

export const getNotesBySubject = async (subjectId) => {
  return await axios.get(`${window.location.origin}/api/v1/notes/subject/${subjectId}`);
}

export const updateNote = async (noteId, note) => {
  return await axios.patch(`$${window.location.origin}/api/v1/notes/${noteId}`, note);
}

export const deleteNote = async (noteId) => {
  return await axios.delete(`${window.location.origin}/api/v1/notes/${noteId}`);
}

export const getNotesCount = async (teacherId) => {
  return await axios.get(`${window.location.origin}/api/v1/notes/count/${teacherId}`);
}

export const getRecentNotesUpdates = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/notes/recent-updates/${course}/${semester}`);
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Assignments API
export const createAssignment = async (formData) => {
  return await axios.post(`${window.location.origin}/api/v1/assignments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const getAssignments = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/assignments/${course}/${semester}`);
}

export const getAssignmentsByTeacher = async (teacherId) => {
  return await axios.get(`${window.location.origin}/api/v1/assignments/${teacherId}`);
}

export const updateAssignment = async (assignmentId, assignment) => {
  return await axios.patch(`${window.location.origin}/api/v1/assignments/${assignmentId}`, assignment);
}

export const deleteAssignment = async (assignmentId) => {
  return await axios.delete(`${window.location.origin}/api/v1/assignments/${assignmentId}`);
}

export const getAssignmentsCount = async (teacherId) => {
  return await axios.get(`${window.location.origin}/api/v1/assignments/count/${teacherId}`);
}

export const getAssignmentReminders = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/assignments/reminders/${course}/${semester}`);
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Marks API

export const getMarksBySubject = async (course, semester, subject, examType) => {
  return await axios.get(`${window.location.origin}/api/v1/marks/${course}/${semester}/${subject}/${examType}`);
}

export const getStudentMarks = async (studentId) => {
  return await axios.get(`${window.location.origin}/api/v1/marks/${studentId}`);
}

export const addMarksMultiple = async (marks) => {
  return await axios.post(`${window.location.origin}/api/v1/marks/bulk`, marks);
}

export const deleteMarks = async (marksId) => {
  return await axios.delete(`${window.location.origin}/api/v1/marks/${marksId}`);
}

export const updateMarks = async (marksId, marks) => {
  return await axios.patch(`${window.location.origin}/api/v1/marks/${marksId}`, marks);
}

export const addMarks = async (marks) => {
  return await axios.post(`${window.location.origin}/api/v1/marks`, marks);
}

export const getRecentMarksUpdates = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/marks/recent-updates/${course}/${semester}`);
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Assignment Submission API
export const submitAssignment = async (formData) => {
  return await axios.post(`${window.location.origin}/api/v1/submission`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const getStudentSubmissions = async (studentId) => {
  return await axios.get(`${window.location.origin}/api/v1/submissions/s/${studentId}`);
}

export const getSubmissionsByAssignments = async (assignId) => {
  return await axios.get(`${window.location.origin}/api/v1/submissions/a/${assignId}`);
}

export const getRecentSubmissions = async (teacherId) => {
  return await axios.get(`${window.location.origin}/api/v1/submissions/recent/${teacherId}`);
}

export const getTodaySubmissions = async (teacherId) => {
  return await axios.get(`${window.location.origin}/api/v1/submissions/today/${teacherId}`);
}
/*---------------------------------------------------------------------------------------------------------------------------*/

//Project API
export const getProjectSubmissions = async (course, semester) => {
  return await axios.get(`${window.location.origin}/api/v1/projects/${course}/${semester}`);
}

export const getStudentProjectSubmissions = async (studentId) => {
  return await axios.get(`${window.location.origin}/api/v1/projects/${studentId}`);
}

export const submitProject = async (formData) => {
  return await axios.post(`${window.location.origin}/api/v1/projects`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const deleteProject = async (id) => {
  return await axios.delete(`${window.location.origin}/api/v1/projects/${id}`);
};
