const { GradeScheme } = require('../../models');

// Create a new grade scheme
exports.createGradeScheme = async (req, res) => {
  try {
    const { grade, min_score, max_score, remarks } = req.body;
    const school_id = req.user.school_id;

    if (!grade || min_score === undefined || max_score === undefined) {
      return res.status(400).json({ error: 'grade, min_score, and max_score are required' });
    }

    const newGradeScheme = await GradeScheme.create({
      school_id,
      grade,
      min_score,
      max_score,
      remarks
    });

    res.status(201).json(newGradeScheme);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create grade scheme' });
  }
};

// Get all grade schemes for the current user's school
exports.getGradeSchemes = async (req, res) => {
  try {
    const school_id = req.user.school_id;

    const gradeSchemes = await GradeScheme.findAll({ where: { school_id } });

    res.json(gradeSchemes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grade schemes' });
  }
};

// Get one grade scheme by ID (only if it belongs to user's school)
exports.getGradeSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const gradeScheme = await GradeScheme.findOne({ where: { id, school_id } });
    if (!gradeScheme) return res.status(404).json({ error: 'Grade scheme not found' });

    res.json(gradeScheme);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grade scheme' });
  }
};

// Update a grade scheme by ID (only within user's school)
exports.updateGradeScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;
    const { grade, min_score, max_score, remarks } = req.body;

    const gradeScheme = await GradeScheme.findOne({ where: { id, school_id } });
    if (!gradeScheme) return res.status(404).json({ error: 'Grade scheme not found' });

    gradeScheme.grade = grade ?? gradeScheme.grade;
    gradeScheme.min_score = min_score ?? gradeScheme.min_score;
    gradeScheme.max_score = max_score ?? gradeScheme.max_score;
    gradeScheme.remarks = remarks ?? gradeScheme.remarks;

    await gradeScheme.save();

    res.json(gradeScheme);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update grade scheme' });
  }
};

// Delete (soft or hard) a grade scheme by ID (only within user's school)
exports.deleteGradeScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const gradeScheme = await GradeScheme.findOne({ where: { id, school_id } });
    if (!gradeScheme) return res.status(404).json({ error: 'Grade scheme not found' });

    await gradeScheme.destroy();

    res.json({ message: 'Grade scheme deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete grade scheme' });
  }
};
