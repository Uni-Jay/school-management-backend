const { Announcement, User, School } = require('../models');

// ✅ Create new announcement
exports.createAnnouncement = async (req, res) => {
    try {
      const { title, message, school_id } = req.body;
      const posted_by = req.user.id;  // Get from JWT payload set by roleAuth middleware
  
      if (!title || !message || !school_id) {
        return res.status(400).json({ error: 'Title, message, and school_id are required' });
      }
  
      // Optional: check if req.user.school_id === school_id to restrict posting only to user's school
      if (req.user.school_id !== school_id) {
        return res.status(403).json({ error: 'You cannot post announcements for another school' });
      }
  
      const announcement = await Announcement.create({
        title,
        message,
        posted_by,
        school_id
      });
  
      res.status(201).json(announcement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  };

// ✅ Get all announcements (optionally filtered by school_id)
exports.getAllAnnouncements = async (req, res) => {
  const { school_id } = req.query;

  try {
    const whereClause = school_id ? { school_id } : {};
    const announcements = await Announcement.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'author', attributes: ['id', 'full_name', 'email'] },
        { model: School, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// ✅ Get a single announcement by ID
exports.getAnnouncementById = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'full_name', 'email'] },
        { model: School, attributes: ['id', 'name'] }
      ]
    });

    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
};

// ✅ Update an announcement
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    await announcement.update(req.body);
    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

// ✅ Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    await announcement.destroy();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
