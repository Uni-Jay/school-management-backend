const { SuperAdmin, User, School } = require('../../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Create Super Admin (and associated User)
exports.createSuperAdmin = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      address,
      blood_type,
      gender,
      birthday
    } = req.body;
    const img = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(password || 'Super@123', 10);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      school_id: null // super_admin not tied to one school
    });

    const superAdmin = await SuperAdmin.create({
      user_id: user.id,
      phone,
      address,
      img,
      blood_type,
      gender,
      birthday
    });

    res.status(201).json({ message: 'Super Admin created', user, superAdmin });
  } catch (error) {
    console.error('Error creating super admin:', error);
    res.status(500).json({ error: 'Failed to create super admin' });
  }
};

// Get all Super Admins
exports.getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ superAdmins });
  } catch (error) {
    console.error('Error fetching super admins:', error);
    res.status(500).json({ error: 'Failed to fetch super admins' });
  }
};

// Get super admin by user id
exports.getSuperAdminByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // this is user_id

    const superAdmin = await SuperAdmin.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role']
        }
      ]
    });

    if (!superAdmin) {
      return res.status(404).json({ error: 'Super Admin not found' });
    }

    res.json({ superAdmin });
  } catch (error) {
    console.error('Error fetching super admin:', error);
    res.status(500).json({ error: 'Failed to fetch super admin' });
  }
};

// Get Super Admin by ID
exports.getSuperAdminById = async (req, res) => {
  try {
    const userId = req.params.id;  // this is user_id

    const superAdmin = await SuperAdmin.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role']
        }
      ]
    });

    if (!superAdmin) {
      return res.status(404).json({ error: 'Super Admin not found' });
    }

    res.json({ superAdmin });
  } catch (error) {
    console.error('Error fetching super admin:', error);
    res.status(500).json({ error: 'Failed to fetch super admin' });
  }
};


// Update Super Admin
exports.updateSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone,
      address,
      img = req.file ? req.file.filename : null, // Use uploaded file if exists
      blood_type,
      gender,
      birthday
    } = req.body;

    const superAdmin = await SuperAdmin.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!superAdmin) {
      return res.status(404).json({ error: 'Super Admin not found' });
    }

    // Update related user
    if (superAdmin.user) {
      await superAdmin.user.update({ full_name, email });
    }

    await superAdmin.update({
      phone,
      address,
      img,
      blood_type,
      gender,
      birthday
    });

    res.json({ message: 'Super Admin updated successfully', superAdmin });
  } catch (error) {
    console.error('Error updating super admin:', error);
    res.status(500).json({ error: 'Failed to update super admin' });
  }
};

// Delete Super Admin (and optionally User)
exports.deleteSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const superAdmin = await SuperAdmin.findByPk(id);

    if (!superAdmin) {
      return res.status(404).json({ error: 'Super Admin not found' });
    }

    const userId = superAdmin.user_id;

    await superAdmin.destroy();
    await User.destroy({ where: { id: userId } });

    res.json({ message: 'Super Admin and associated user deleted successfully' });
  } catch (error) {
    console.error('Error deleting super admin:', error);
    res.status(500).json({ error: 'Failed to delete super admin' });
  }
};
