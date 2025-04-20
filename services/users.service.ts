import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersModel from "../models/users.model";
import {
  UserDetails,
  UserLoginPaylod,
  UserPayload,
} from "../interfaces/users.interface";
import { Messages } from "../utils/messages";

class UserServiceClass {
  async registerUser(payload: UserPayload) {
    const { name, email, password } = payload;
    const existingUser = await UsersModel.findOne({ where: { email } });

    if (existingUser) {
      throw new Error(Messages.Users.EMAIL_EXIST);
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const User: any = await UsersModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      user: {
        id: User.id,
        email: User.email,
        createdAt: User.createdAt,
        updatedAt: User.updatedAt,
      },
    };
  }

  async loginUser(payload: UserLoginPaylod) {
    const { email, password } = payload;

    const user: any = await UsersModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      },
    };
  }
}

const UserService = new UserServiceClass();
export default UserService;
