const { User, SchoolSuperAdmin, School,   } = require('../../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { sendWelcomeNotification } = require('../../utils/notificationsHelper');

function generatePassword(full_name, birthday) {
  const birthYear = birthday ? birthday.split('-')[0] : '1234';
  const firstName = full_name?.split(' ')[0] || 'user';
  const special = '@';
  return `${firstName}${birthYear}${special}`;
}

// CREATE
exports.createSchoolSuperAdmin = async (req, res) => {
  try {
    const {
      full_name, email, school_id,
      phone, address, blood_type, gender, birthday, teacher_id
    } = req.body;

    const img = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const plainPassword = generatePassword(full_name, birthday);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: 'school_super_admin',
      school_id
    });

    const superAdmin = await SchoolSuperAdmin.create({
      user_id: user.id,
      phone,
      address,
      img,
      blood_type,
      gender,
      birthday,
      school_id,
      teacher_id: teacher_id || null
    });

    await sendWelcomeNotification({
      school_id,
      full_name,
      email,
      phone,
      plainPassword
    });

    res.status(201).json({ message: 'School Super Admin created', superAdmin });
  } catch (error) {
    console.error('Create SchoolSuperAdmin Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL
exports.getAllSchoolSuperAdmins = async (req, res) => {
  try {
    const admins = await SchoolSuperAdmin.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    const response = admins.map(admin => ({
      ...admin.toJSON(),
      img: admin.img ? `${process.env.LOCAL_SERVER_API}/uploads/schoolSuperAdmins/${admin.img}` : null
    }));

    res.json(response);
  } catch (error) {
    console.error('Get All Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BY ID
exports.getSchoolSuperAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolSuperAdmin.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    if (!admin) return res.status(404).json({ message: 'Not found' });

    res.json(admin);
  } catch (error) {
    console.error('Get By ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE
exports.updateSchoolSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phone, address, blood_type, gender, birthday, teacher_id
    } = req.body;

    const admin = await SchoolSuperAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const img = req.file ? req.file.filename : admin.img;

    await admin.update({
      phone,
      address,
      blood_type,
      gender,
      birthday,
      teacher_id: teacher_id || null,
      img
    });

    res.json({ message: 'Updated successfully', admin });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE (HARD)
exports.deleteSchoolSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await SchoolSuperAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const user = await User.findByPk(admin.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    await admin.destroy();

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// SOFT DELETE
exports.softDeleteSchoolSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolSuperAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const user = await User.findByPk(admin.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: false });
    res.json({ message: 'User deactivated' });
  } catch (error) {
    console.error('Soft Delete Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// REACTIVATE
exports.reactivateSchoolSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolSuperAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const user = await User.findByPk(admin.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: true });
    res.json({ message: 'User reactivated' });
  } catch (error) {
    console.error('Reactivate Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BY SCHOOL ID
exports.getSchoolSuperAdminBySchoolID = async (req, res) => {
  try {
    const { school_id } = req.params;

    const admins = await SchoolSuperAdmin.findAll({
      where: { school_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    res.json(admins);
  } catch (error) {
    console.error('Fetch by school_id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// SEARCH BY SCHOOL ID + QUERY
exports.getSchoolSuperAdminBySchoolIDandSearch = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { query, gender, blood_type } = req.query;

    const userWhere = {};
    if (query) userWhere[Op.or] = [
      { full_name: { [Op.like]: `%${query}%` } },
      { email:     { [Op.like]: `%${query}%` } },
    ];

    const adminWhere = { school_id };
    if (gender) adminWhere.gender = gender;
    if (blood_type) adminWhere.blood_type = blood_type;

    const admins = await SchoolSuperAdmin.findAll({
      where: adminWhere,
      include: [
        { model: User, as: 'user', where: userWhere, attributes: ['id','full_name','email'] },
        { model: School, as: 'school', attributes: ['id','name'] }
      ]
    });

    res.json(admins);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.searchSchoolSuperAdmins = async (req, res) => {
  try {
    const { query = '', gender } = req.query;

    const userConditions = [
      { full_name: { [Op.like]: `%${query}%` } },
      { email: { [Op.like]: `%${query}%` } }
    ];

    const schoolCondition = {
      name: { [Op.like]: `%${query}%` }
    };

    const admins = await SchoolSuperAdmin.findAll({
      where: {
        ...(gender && { gender })
      },
      include: [
        {
          model: User,
          as: 'user',
          where: {
            [Op.or]: userConditions
          },
          attributes: ['id', 'full_name', 'email', 'role']
        },
        {
          model: School,
          as: 'school',
          required: false,
          attributes: ['id', 'name'],
          where: query ? schoolCondition : undefined
        }
      ]
    });

    res.json(admins);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
