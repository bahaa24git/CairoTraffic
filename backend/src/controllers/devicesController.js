import Device from '../models/Device.js';

const makeDeviceController = (table, label) => ({
  getAll: async (req, res, next) => {
    try {
      const items = await Device.findAll(table);
      res.json({ [table]: items });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      if (!req.body.name) return res.status(400).json({ message: `${label} name is required.` });
      const item = await Device.create(table, req.body);
      res.status(201).json({ [label.toLowerCase()]: item });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const item = await Device.update(table, req.params.id, req.body);
      if (!item) return res.status(404).json({ message: `${label} not found.` });
      res.json({ [label.toLowerCase()]: item });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const deleted = await Device.delete(table, req.params.id);
      if (!deleted) return res.status(404).json({ message: `${label} not found.` });
      res.json({ message: `${label} deleted successfully.` });
    } catch (error) {
      next(error);
    }
  },
});

export const camerasController = makeDeviceController('cameras', 'Camera');
export const sensorsController = makeDeviceController('sensors', 'Sensor');
