const { Assignment } = require('../models');

const allowedToCreateOrUpdate = ['super_admin', 'school_super_admin', 'school_admin', 'teacher'];

exports.createAssignment = async (req, res) => {
  try {
    // Only allow roles except parent and student
    if (!allowedToCreateOrUpdate.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to create assignments' });
    }

    const { title, description, due_date, lesson_id, school_id } = req.body;

    if (!title || !due_date || !lesson_id || !school_id) {
      return res.status(400).json({ error: 'title, due_date, lesson_id, and school_id are required' });
    }

    // Optional: Verify that the user's school matches the assignment school (if needed)
    if (req.user.school_id !== school_id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'You cannot create assignments for another school' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      due_date,
      lesson_id,
      school_id
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    if (!allowedToCreateOrUpdate.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to update assignments' });
    }

    const assignmentId = req.params.id;
    const { title, description, due_date, lesson_id, school_id } = req.body;

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Optional: Verify that the user belongs to the same school as the assignment (unless super_admin)
    if (req.user.school_id !== assignment.school_id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'You cannot update assignments for another school' });
    }

    await assignment.update({
      title: title ?? assignment.title,
      description: description ?? assignment.description,
      due_date: due_date ?? assignment.due_date,
      lesson_id: lesson_id ?? assignment.lesson_id,
      school_id: school_id ?? assignment.school_id
    });

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};
// Get all assignments
exports.getAllAssignments = async (req, res) => {
    try {
      // Optionally filter assignments by school_id of the logged-in user
      const filter = {};
      if (req.user.school_id && req.user.role !== 'super_admin') {
        filter.school_id = req.user.school_id;
      }
  
      const assignments = await Assignment.findAll({ where: filter });
      res.json(assignments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  };
  
  // Get assignment by ID
  exports.getAssignmentById = async (req, res) => {
    try {
      const assignment = await Assignment.findByPk(req.params.id);
  
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      // Verify school matches if not super_admin
      if (req.user.role !== 'super_admin' && req.user.school_id !== assignment.school_id) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      res.json(assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch assignment' });
    }
  };
  
  // Student submits an assignment (simplified example)
  exports.submitAssignment = async (req, res) => {
    try {
      const assignmentId = req.params.id;
      const studentId = req.user.id; // user id from JWT
      const { submissionText, submissionFileUrl } = req.body; // e.g., text or file URL
  
      // You should have a Submission model (not defined here)
      // Basic validation:
      if (!submissionText && !submissionFileUrl) {
        return res.status(400).json({ error: 'Submission content required' });
      }
  
      // Verify assignment exists and belongs to the student's school
      const assignment = await Assignment.findByPk(assignmentId);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      if (assignment.school_id !== req.user.school_id) {
        return res.status(403).json({ error: 'Cannot submit assignment for another school' });
      }
  
      // Example: create submission record
      // You need to create a Submission model with fields: assignment_id, student_id, submission_text, submission_file_url, submitted_at, etc.
      const Submission = require('../models').Submission; // Adjust path if needed
  
      const submission = await Submission.create({
        assignment_id: assignmentId,
        student_id: studentId,
        submission_text: submissionText,
        submission_file_url: submissionFileUrl,
        submitted_at: new Date()
      });
  
      res.status(201).json(submission);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit assignment' });
    }
  };
// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    if (!allowedToCreateOrUpdate.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to delete assignments' });
    }

    const assignmentId = req.params.id;
    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Optional: Verify that the user belongs to the same school as the assignment (unless super_admin)
    if (req.user.school_id !== assignment.school_id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'You cannot delete assignments for another school' });
    }

    await assignment.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};  