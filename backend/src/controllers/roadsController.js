import Road from '../models/Road.js';

export const getRoads = async (req, res, next) => {
  try {
    const roads = await Road.findAll();
    res.json({ roads });
  } catch (error) {
    next(error);
  }
};

export const getRoad = async (req, res, next) => {
  try {
    const road = await Road.findById(req.params.id);
    if (!road) return res.status(404).json({ message: 'Road not found.' });
    res.json({ road });
  } catch (error) {
    next(error);
  }
};

export const createRoad = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Road name is required.' });

    const road = await Road.create(req.body);
    res.status(201).json({ road });
  } catch (error) {
    next(error);
  }
};

export const updateRoad = async (req, res, next) => {
  try {
    const road = await Road.update(req.params.id, req.body);
    if (!road) return res.status(404).json({ message: 'Road not found.' });
    res.json({ road });
  } catch (error) {
    next(error);
  }
};

export const deleteRoad = async (req, res, next) => {
  try {
    const deleted = await Road.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Road not found.' });
    res.json({ message: 'Road deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
