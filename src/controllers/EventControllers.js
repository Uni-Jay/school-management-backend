const { Event } = require('../../models');

// ✅ Create Event — Only super_admin, school_super_admin, school_admin
exports.createEvent = async (req, res) => {
  try {
    const allowedRoles = ['super_admin', 'school_super_admin', 'school_admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized: insufficient role' });
    }

    const { title, description, start_date, end_date } = req.body;
    const school_id = req.user.school_id;

    const newEvent = await Event.create({
      title,
      description,
      start_date,
      end_date,
      school_id
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// ✅ Get All Events — All roles (filtered by school_id unless super_admin)
exports.getAllEvents = async (req, res) => {
  try {
    const where =
      req.user.role === 'super_admin' ? {} : { school_id: req.user.school_id };

    const events = await Event.findAll({ where });

    res.status(200).json(events);
  } catch (error) {
    console.error('Fetch Events Error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// ✅ Get Event by ID — All roles (only if same school or super_admin)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.user.role !== 'super_admin' && event.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Fetch Event Error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// ✅ Update Event — Only super_admin, school_super_admin, school_admin
exports.updateEvent = async (req, res) => {
  try {
    const allowedRoles = ['super_admin', 'school_super_admin', 'school_admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized: insufficient role' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.user.role !== 'super_admin' && event.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized: not your school' });
    }

    const { title, description, start_date, end_date } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.start_date = start_date || event.start_date;
    event.end_date = end_date || event.end_date;

    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// ✅ Delete Event — super_admin or same school
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.user.role !== 'super_admin' && event.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
