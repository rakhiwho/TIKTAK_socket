import mongoose, { Schema, model  } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "provide an email!"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    friend: {
      type: [mongoose.Schema.Types.ObjectId],  
      ref: "user",  
      default: [],
    },
    invites: {
      type: [Number],
      default: [],
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenEXpiry: Date,
    refreshToken: String,
    refreshTokenEXpiry: Date,
  },
  { timestamps: true }
);
 
  
const UserModel = model("user", userSchema);
export default UserModel;
