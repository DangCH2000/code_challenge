import { Request, Response } from 'express';
import { connectDB } from '../database/index';
import Joi from 'joi';

/**
 * Create a new resource in the database.
 * 
 * @param {Request} req - The HTTP request object, containing the resource data in the body.
 * @param {Response} res - The HTTP response object, used to send the response back to the client.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const createResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body using Joi schema
    const schema = Joi.object({
      name: Joi.string().required(), // 'name' is required and must be a string
      description: Joi.string().optional(), // 'description' is optional and can be a string
    });

    // Validate the incoming request data
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message }); // Send a 400 error if validation fails
      return;
    }

    const { name, description } = value; // Extract validated values
    const db = await connectDB(); // Connect to the database

    try {
      // Insert the new resource into the database
      const result = await db.run(
        `INSERT INTO resources (name, description) VALUES (?, ?)`,
        [name, description]
      );

      // Respond with the newly created resource's details
      res.status(201).json({
        id: result.lastID, // The ID of the newly created resource
        name,
        description,
      });
    } finally {
      await db.close(); // Ensure the database connection is closed
    }
  } catch (err) {
    console.error('Error in createResource:', err); // Log any server-side errors
    res.status(500).json({ message: 'Internal server error' }); // Respond with a 500 error
  }
};

/**
 * Retrieve all resources from the database.
 * Optionally filter resources by 'name' query parameter.
 * 
 * @param {Request} req - The HTTP request object, containing optional query parameters.
 * @param {Response} res - The HTTP response object, used to send the retrieved resources back to the client.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getAllResources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query; // Get optional 'name' query parameter
    const db = await connectDB(); // Connect to the database

    try {
      // Build the query: filter by 'name' if provided
      const query = name
        ? `SELECT * FROM resources WHERE name LIKE ?`
        : `SELECT * FROM resources`;

      // Use query parameter if 'name' is provided, otherwise use an empty array
      const params = name ? [`%${name}%`] : [];
      const resources = await db.all(query, params); // Execute the query

      // Respond with the retrieved resources
      res.status(200).json(resources);
    } finally {
      await db.close(); // Ensure the database connection is closed
    }
  } catch (err) {
    console.error('Error in getAllResources:', err); // Log any server-side errors
    res.status(500).json({ message: 'Internal server error' }); // Respond with a 500 error
  }
};

/**
 * Retrieve a single resource by its ID.
 * 
 * @param {Request} req - The HTTP request object, containing the resource ID in the path parameters.
 * @param {Response} res - The HTTP response object, used to send the resource back to the client.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getResourceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Extract the 'id' from the request parameters
    const db = await connectDB(); // Connect to the database

    try {
      // Query the database for the resource with the specified ID
      const resource = await db.get(`SELECT * FROM resources WHERE id = ?`, [
        id,
      ]);

      if (!resource) {
        res.status(404).json({ message: 'Resource not found' }); // Respond with 404 if not found
        return;
      }

      res.status(200).json(resource); // Respond with the found resource
    } finally {
      await db.close(); // Ensure the database connection is closed
    }
  } catch (err) {
    console.error('Error in getResourceById:', err); // Log any server-side errors
    res.status(500).json({ message: 'Internal server error' }); // Respond with a 500 error
  }
};

/**
 * Update an existing resource by its ID.
 * 
 * @param {Request} req - The HTTP request object, containing the resource ID in the path parameters and updated data in the body.
 * @param {Response} res - The HTTP response object, used to send the updated resource back to the client.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const updateResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Extract the 'id' from the request parameters

    // Validate request body using Joi schema
    const schema = Joi.object({
      name: Joi.string().required(), // 'name' is required
      description: Joi.string().optional(), // 'description' is optional
    });

    // Validate the incoming request data
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message }); // Send a 400 error if validation fails
      return;
    }

    const { name, description } = value; // Extract validated values
    const db = await connectDB(); // Connect to the database

    try {
      // Update the resource in the database
      const result = await db.run(
        `UPDATE resources SET name = ?, description = ? WHERE id = ?`,
        [name, description, id]
      );

      if (result.changes === 0) {
        res.status(404).json({ message: 'Resource not found' }); // Respond with 404 if the resource doesn't exist
        return;
      }

      // Respond with the updated resource details
      res.status(200).json({ id, name, description });
    } finally {
      await db.close(); // Ensure the database connection is closed
    }
  } catch (err) {
    console.error('Error in updateResource:', err); // Log any server-side errors
    res.status(500).json({ message: 'Internal server error' }); // Respond with a 500 error
  }
};

/**
 * Delete a resource by its ID.
 * 
 * @param {Request} req - The HTTP request object, containing the resource ID in the path parameters.
 * @param {Response} res - The HTTP response object, used to confirm deletion or handle errors.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const deleteResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Extract the 'id' from the request parameters
    const db = await connectDB(); // Connect to the database

    try {
      // Delete the resource from the database
      const result = await db.run(`DELETE FROM resources WHERE id = ?`, [id]);

      if (result.changes === 0) {
        res.status(404).json({ message: 'Resource not found' }); // Respond with 404 if the resource doesn't exist
        return;
      }

      res.status(200).json({ message: 'Resource deleted successfully' }); // Respond with success message
    } finally {
      await db.close(); // Ensure the database connection is closed
    }
  } catch (err) {
    console.error('Error in deleteResource:', err); // Log any server-side errors
    res.status(500).json({ message: 'Internal server error' }); // Respond with a 500 error
  }
};
