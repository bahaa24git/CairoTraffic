import Incident from '../models/Incident.js';

export const getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.findAll(req.query);
    res.json({ incidents });
  } catch (error) {
    next(error);
  }
};

export const createIncident = async (req, res, next) => {
  try {
    if (!req.body.title) return res.status(400).json({ message: 'Incident title is required.' });
    const incident = await Incident.create(req.body);
    res.status(201).json({ incident });
  } catch (error) {
    next(error);
  }
};

export const updateIncident = async (req, res, next) => {
  try {
    const incident = await Incident.update(req.params.id, req.body);
    if (!incident) return res.status(404).json({ message: 'Incident not found.' });
    res.json({ incident });
  } catch (error) {
    next(error);
  }
};

export const deleteIncident = async (req, res, next) => {
  try {
    const deleted = await Incident.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Incident not found.' });
    res.json({ message: 'Incident deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
