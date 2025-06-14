const { Class } = require('../../models');

// Roles allowed to create, update, and delete classes
const allowedAdminRoles = ['super_admin', 'school_super_admin', 'school_admin'];

// ✅ Create class
exports.createClass = async (req, res) => {
  try {
    if (!allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Only admins can create classes' });
    }

    const { name, grade_level } = req.body;
    const school_id = req.user.school_id;

    const newClass = await Class.create({ name, grade_level, school_id });
    res.status(201).json(newClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

// ✅ Update class
exports.updateClass = async (req, res) => {
  try {
    if (!allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Only admins can update classes' });
    }

    const id = req.params.id;
    const { name, grade_level } = req.body;

    const classObj = await Class.findByPk(id);
    if (!classObj) return res.status(404).json({ error: 'Class not found' });

    if (req.user.role !== 'super_admin' && classObj.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    classObj.name = name || classObj.name;
    classObj.grade_level = grade_level || classObj.grade_level;

    await classObj.save();
    res.json(classObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

// ✅ Delete class
exports.deleteClass = async (req, res) => {
  try {
    if (!allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Only admins can delete classes' });
    }

    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) return res.status(404).json({ error: 'Class not found' });

    if (req.user.role !== 'super_admin' && classObj.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await classObj.destroy();
    res.json({ message: 'Class deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

// ✅ Delete class by ID (same as deleteClass)
exports.deleteClassById = async (req, res) => {
  try {
    if (!allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Only admins can delete classes' });
    }

    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) return res.status(404).json({ error: 'Class not found' });

    if (req.user.role !== 'super_admin' && classObj.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await classObj.destroy();
    res.json({ message: 'Class deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

// ✅ Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const school_id = req.user.role === 'super_admin' ? undefined : req.user.school_id;
    const where = school_id ? { school_id } : {};
    const classes = await Class.findAll({ where });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// ✅ Get one class by ID
exports.getClassById = async (req, res) => {
  try {
    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) return res.status(404).json({ error: 'Class not found' });

    if (req.user.role !== 'super_admin' && classObj.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(classObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
};

// ✅ Get classes by grade level
exports.getClassesByGradeLevel = async (req, res) => {
  try {
    const { grade_level } = req.params;
    const school_id = req.user.role === 'super_admin' ? undefined : req.user.school_id;

    const where = { grade_level };
    if (school_id) where.school_id = school_id;

    const classes = await Class.findAll({ where });
    if (!classes.length) return res.status(404).json({ error: 'No classes found for this grade level' });

    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes by grade level' });
  }
};

// ✅ Get classes by school ID
exports.getClassesBySchoolId = async (req, res) => {
  try {
    const school_id = req.params.school_id;
    const classes = await Class.findAll({ where: { school_id } });

    if (!classes.length) return res.status(404).json({ error: 'No classes found for this school' });

    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes by school ID' });
  }
};
// ✅ Get classes by teacher ID
exports.getClassesByTeacherId = async (req, res) => {
  try {
    const teacher_id = req.params.teacher_id;

    // Determine school scope
    const where = { teacher_id };
    if (req.user.role !== 'super_admin') {
      where.school_id = req.user.school_id;
    }

    const classes = await Class.findAll({ where });

    if (!classes.length) {
      return res.status(404).json({ error: 'No classes found for this teacher' });
    }

    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes by teacher ID' });
  }
};
