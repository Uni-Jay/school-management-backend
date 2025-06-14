const {
    Exam,
    Question,
    Option,
    StudentAnswer,
    Score,
    Student,
    Subject,
    ReportCard,
    GradeScheme,
  } = require('../../models');
  
  exports.createExam = async (req, res) => {
    try {
      const {
        name, description, class_id, subject_id, teacher_id,
        start_time, end_time, duration_minutes, total_marks,
        pass_mark, type
      } = req.body;
  
      const school_id = req.user.school_id;
  
      const exam = await Exam.create({
        name, description, class_id, subject_id, teacher_id,
        start_time, end_time, duration_minutes, total_marks,
        pass_mark, type, school_id
      });
  
      res.status(201).json(exam);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create exam' });
    }
  };
  
  exports.getExamsByClass = async (req, res) => {
    try {
      const { class_id } = req.params;
      const school_id = req.user.school_id;
  
      const exams = await Exam.findAll({ where: { class_id, school_id } });
      res.json(exams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch exams by class' });
    }
  };
  
  exports.getExamsByTeacher = async (req, res) => {
    try {
      const { teacher_id } = req.params;
      const school_id = req.user.school_id;
  
      const exams = await Exam.findAll({ where: { teacher_id, school_id } });
      res.json(exams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch exams by teacher' });
    }
  };
  
  exports.getExamsBySubject = async (req, res) => {
    try {
      const { subject_id } = req.params;
      const school_id = req.user.school_id;
  
      const exams = await Exam.findAll({ where: { subject_id, school_id } });
      res.json(exams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch exams by subject' });
    }
  };
  // Get exams filtered by class_id AND subject_id
  exports.getExamsByClassAndSubject = async (req, res) => {
    try {
      const { class_id, subject_id } = req.query;
      const school_id = req.user.school_id;
  
      if (!class_id || !subject_id) {
        return res.status(400).json({ error: 'class_id and subject_id query parameters are required' });
      }
  
      const exams = await Exam.findAll({
        where: { class_id, subject_id, school_id }
      });
  
      res.json(exams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch exams by class and subject' });
    }
  };

  
  
  // Create or update question - roles: teacher, superadmin, schoolSuperadmin, schoolAdmin
  exports.createQuestion = async (req, res) => {
    try {
      const { exam_id, question_text, question_type, mark } = req.body;
      const school_id = req.user.school_id;
  
      const question = await Question.create({
        exam_id,
        question_text,
        question_type,
        mark,
        school_id
      });
  
      res.status(201).json(question);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create question' });
    }
  };
  
  exports.updateQuestion = async (req, res) => {
    try {
      const { question_id } = req.params;
      const { question_text, question_type, mark } = req.body;
      const school_id = req.user.school_id;
  
      const question = await Question.findOne({ where: { id: question_id, school_id } });
      if (!question) return res.status(404).json({ error: 'Question not found' });
  
      question.question_text = question_text ?? question.question_text;
      question.question_type = question_type ?? question.question_type;
      question.mark = mark ?? question.mark;
  
      await question.save();
      res.json(question);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update question' });
    }
  };
  
  // Add option to question - same roles as questions
  exports.addOption = async (req, res) => {
    try {
      const { question_id, option_text, is_correct } = req.body;
      const school_id = req.user.school_id;
  
      const option = await Option.create({
        question_id,
        option_text,
        is_correct,
        school_id
      });
  
      res.status(201).json(option);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add option' });
    }
  };
  
  // Preview questions & options for an exam - accessible to all question roles
  exports.previewQuestions = async (req, res) => {
    try {
      const { exam_id } = req.params;
      const school_id = req.user.school_id;
  
      const questions = await Question.findAll({
        where: { exam_id, school_id },
        include: [{ model: Option }]
      });
  
      res.json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  };
  
  // Student submits answer to question
  exports.submitAnswer = async (req, res) => {
    try {
      const { exam_id, question_id, selected_option_id } = req.body;
      const student_id = req.user.id;
      const school_id = req.user.school_id;
  
      const answer = await StudentAnswer.create({
        exam_id,
        question_id,
        student_id,
        selected_option_id,
        school_id
      });
  
      res.status(201).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit answer' });
    }
  };
  
  // Student submits exam to calculate score
  exports.submitExam = async (req, res) => {
    try {
      const { exam_id, subject_id } = req.body;
      const student_id = req.user.id;
      const school_id = req.user.school_id;
  
      const answers = await StudentAnswer.findAll({
        where: { exam_id, student_id }
      });
  
      let totalScore = 0;
  
      for (const ans of answers) {
        const option = await Option.findByPk(ans.selected_option_id);
        const question = await Question.findByPk(ans.question_id);
  
        if (option && option.is_correct) {
          totalScore += question.mark;
        }
      }
  
      // Find the grade scheme for this school where totalScore fits
      const gradeScheme = await GradeScheme.findOne({
        where: {
          school_id,
          min_score: { [Op.lte]: totalScore },
          max_score: { [Op.gte]: totalScore }
        }
      });
  
      // Fallback grade or remarks if no scheme found
      const grade = gradeScheme ? gradeScheme.grade : 'Ungraded';
      const remarks = totalScore >= (await Exam.findByPk(exam_id))?.pass_mark ? 'Passed' : 'Failed';
  
      // Save score + grade/remarks
      await Score.create({
        student_id,
        exam_id,
        subject_id,
        score: totalScore,
        remarks: remarks,
        grade: grade,
        school_id
      });
  
      res.json({ message: 'Exam submitted', totalScore, grade, remarks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit exam' });
    }
  };
  
  
  // Get scores for a student (student only)
  exports.getStudentScores = async (req, res) => {
    try {
      const student_id = req.user.id;
      const scores = await Score.findAll({ where: { student_id } });
  
      res.json(scores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch scores' });
    }
  };
  
  // Get all student results within the school (admin/teacher/superadmin roles)
  exports.getAllStudentResults = async (req, res) => {
    try {
      const school_id = req.user.school_id;
  
      const results = await Score.findAll({
        where: { school_id },
        include: [
          { model: Student, attributes: ['id', 'full_name'] },
          { model: Exam, attributes: ['id', 'name'] },
          { model: Subject, attributes: ['id', 'name'] }
        ]
      });
  
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch all student results' });
    }
  };
  
  // Get all exam reports for a specific student
  exports.getStudentReports = async (req, res) => {
    try {
      const { student_id } = req.params;
  
      // Student can only access their own reports
      if (req.user.role === 'student' && req.user.id !== Number(student_id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      const reports = await Score.findAll({
        where: { student_id },
        include: [
          { model: Exam, attributes: ['id', 'name', 'start_time', 'end_time'] },
          { model: Subject, attributes: ['id', 'name'] }
        ]
      });
  
      res.json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch student reports' });
    }
  };
// Get exam by ID - accessible to all roles
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // Check if user has access to this exam
    if (req.user.role !== 'super_admin' && exam.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
}; 
exports.generateReportCard = async (req, res) => {
  try {
    const { student_id, term } = req.params;
    const school_id = req.user.school_id;

    // Authorization: students can only get their own report
    if (req.user.role === 'student' && req.user.id !== Number(student_id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get all scores for student for this term and school
    const scores = await Score.findAll({
      where: { student_id, term, school_id },
      include: [{ model: Subject, attributes: ['id', 'name'] }],
    });

    if (!scores.length) {
      return res.status(404).json({ error: 'No scores found for this student and term' });
    }

    // Calculate total and average score
    let total_score = 0;
    for (const score of scores) {
      total_score += score.score;
    }
    const average_score = total_score / scores.length;

    // TODO: calculate position/rank if needed — this requires comparing all students in school/class

    // Prepare subjects and scores array
    const subjectScores = scores.map(s => ({
      subject_id: s.subject_id,
      subject_name: s.Subject.name,
      score: s.score,
      remarks: s.remarks
    }));

    // Create or update ReportCard for this student and term
    let reportCard = await ReportCard.findOne({ where: { student_id, term, school_id } });
    if (!reportCard) {
      reportCard = await ReportCard.create({
        student_id,
        term,
        total_score,
        average_score,
        remarks: average_score >= 40 ? 'Passed' : 'Failed', // example logic
        school_id
      });
    } else {
      reportCard.total_score = total_score;
      reportCard.average_score = average_score;
      reportCard.remarks = average_score >= 40 ? 'Passed' : 'Failed';
      await reportCard.save();
    }

    // Respond with report card + detailed subjects & scores
    res.json({
      reportCard,
      subjects: subjectScores
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate report card' });
  }
};
