import { Request, Response } from 'express';
import { connectDB } from '../database/index';
import Joi from 'joi';

/**
 * Create a new resource
 */
export const createResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, description } = value;
    const db = await connectDB();

    try {
      const result = await db.run(
        `INSERT INTO resources (name, description) VALUES (?, ?)`,
        [name, description]
      );

      res.status(201).json({
        id: result.lastID,
        name,
        description,
      });
    } finally {
      await db.close();
    }
  } catch (err) {
    console.error('Error in createResource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all resources
 */
export const getResources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;
    const db = await connectDB();

    try {
      const query = name
        ? `SELECT * FROM resources WHERE name LIKE ?`
        : `SELECT * FROM resources`;

      const params = name ? [`%${name}%`] : [];
      const resources = await db.all(query, params);

      res.status(200).json(resources);
    } finally {
      await db.close();
    }
  } catch (err) {
    console.error('Error in getResources:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a resource by ID
 */
export const getResourceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    try {
      const resource = await db.get(`SELECT * FROM resources WHERE id = ?`, [
        id,
      ]);

      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }

      res.status(200).json(resource);
    } finally {
      await db.close();
    }
  } catch (err) {
    console.error('Error in getResourceById:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a resource by ID
 */
export const updateResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, description } = value;
    const db = await connectDB();

    try {
      const result = await db.run(
        `UPDATE resources SET name = ?, description = ? WHERE id = ?`,
        [name, description, id]
      );

      if (result.changes === 0) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }

      res.status(200).json({ id, name, description });
    } finally {
      await db.close();
    }
  } catch (err) {
    console.error('Error in updateResource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a resource by ID
 */
export const deleteResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    try {
      const result = await db.run(`DELETE FROM resources WHERE id = ?`, [id]);

      if (result.changes === 0) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }

      res.status(200).json({ message: 'Resource deleted successfully' });
    } finally {
      await db.close();
    }
  } catch (err) {
    console.error('Error in deleteResource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
