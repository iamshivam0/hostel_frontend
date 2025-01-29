import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";

// Controller to handle CSV file import with update logic
export const importOrUpdateUsersFromCSV = async (
  req: Request,
  res: Response
) => {
  const filePath = req.file?.path; // Multer stores the uploaded file path here
  if (!filePath) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  const errors: string[] = []; // Array to store any errors
  const updatedUsers: string[] = []; // Array to track updated user emails
  const insertedUsers: string[] = []; // Array to track newly inserted user emails

  try {
    const users: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const user = {
          email: row.email,
          password: row.password, // Consider hashing if not hashed in CSV
          firstName: row.firstName,
          lastName: row.lastName,
          role: row.role,
          roomNumber: row.roomNumber,
        };
        users.push(user);
        console.log(user);
      })
      .on("end", async () => {
        for (const userData of users) {
          try {
            const existingUser: IUser | null = await User.findOne({
              email: userData.email,
            });

            if (existingUser) {
              // Update existing user details
              await User.updateOne({ email: userData.email }, userData);
              updatedUsers.push(userData.email);
            } else {
              // Insert new user
              const newUser = new User(userData);
              await newUser.save();
              insertedUsers.push(userData.email);
            }
          } catch (error: any) {
            errors.push(
              `Error processing email ${userData.email}: ${error.message}`
            );
          }
        }

        // Send response after processing all users
        res.status(200).json({
          message: "CSV processed successfully",
          insertedCount: insertedUsers.length,
          updatedCount: updatedUsers.length,
          errors,
        });

        // Cleanup: Delete the uploaded file
        fs.unlinkSync(filePath);
      });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during CSV import" });
  }
};
