const { School } = require('../../models');
const { Op } = require('sequelize');

// CREATE
exports.createSchool = async (req, res) => {
  try {
    const {
      name,
      type,
      contact_email,
      phone,
      address,
      website,
      established_year,
      description
    } = req.body;

    const logo_url = req.file ? req.file.filename : null;

    const school = await School.create({
      name,
      type,
      contact_email,
      phone,
      address,
      website,
      established_year,
      description,
      logo_url
    });

    res.status(201).json({ message: 'School created successfully', school });
  } catch (error) {
    console.error('Create School Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.json(schools);
  } catch (error) {
    console.error('Get All Schools Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BY ID
exports.getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findByPk(id);
    if (!school) return res.status(404).json({ message: 'School not found' });

    res.json(school);
  } catch (error) {
    console.error('Get School by ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE
exports.updateSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findByPk(id);
    if (!school) return res.status(404).json({ message: 'School not found' });

    const {
      name,
      type,
      contact_email,
      phone,
      address,
      website,
      established_year,
      description
    } = req.body;

    const logo_url = req.file ? req.file.filename : school.logo_url;

    await school.update({
      name,
      type,
      contact_email,
      phone,
      address,
      website,
      established_year,
      description,
      logo_url
    });

    res.json({ message: 'School updated successfully', school });
  } catch (error) {
    console.error('Update School Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// SOFT DELETE (DEACTIVATE)
exports.deactivateSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findByPk(id);
    if (!school) return res.status(404).json({ message: 'School not found' });

    await school.update({ isActive: false });
    res.json({ message: 'School deactivated successfully' });
  } catch (error) {
    console.error('Deactivate School Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// REACTIVATE
exports.reactivateSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findByPk(id);
    if (!school) return res.status(404).json({ message: 'School not found' });

    await school.update({ isActive: true });
    res.json({ message: 'School reactivated successfully' });
  } catch (error) {
    console.error('Reactivate School Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// SEARCH BY NAME
exports.searchSchoolsByName = async (req, res) => {
  try {
    const { query } = req.query;

    const schools = await School.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`
        }
      }
    });

    res.json(schools);
  } catch (error) {
    console.error('Search Schools Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
