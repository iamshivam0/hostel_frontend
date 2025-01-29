import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "student" | "staff" | "parent";
  roomNumber?: string;
  parentId?: mongoose.Types.ObjectId;
  children?: mongoose.Types.ObjectId[];
  profilePicUrl?: string; // Optional field for profile picture
  resetPasswordToken?: string; 
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student", "staff", "parent"],
      default: "student",
    },
    roomNumber: {
      type: String,
      required: function (): boolean {
        return (this as IUser).role === "student";
      },
      sparse: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
      validate: {
        validator: function (value: mongoose.Types.ObjectId | undefined) {
          const user = this as IUser;
          if (value && user.role !== "student") {
            return false;
          }
          return true;
        },
        message: "Only students can have a parent assigned",
      },
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: function (this: IUser) {
            return this.role === "parent";
          },
          message: "Only parents can have children assigned",
        },
      },
    ],
    profilePicUrl: {
      type: String,
      default: null,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: null, // Default to null if no token is generated
    },
    resetPasswordExpires: {
      type: Date,
      default: null, // Default to null if no expiration is set
    },
  },
  {
    timestamps: true,
  }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
