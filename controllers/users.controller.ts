import { HttpStatusCode } from "axios";
import { SendResponse } from "../utils/helpers";
import { Messages } from "../utils/messages";
import UserService from "../services/users.service";

class UsersControllerClass {
  async register(req: any, res: any) {
    try {
      const { name, email, password } = req.body;
      const payload = { name, email, password };

      const data = await UserService.registerUser(payload);

      return SendResponse({
        res,
        status: HttpStatusCode.Created,
        message: Messages.Users.REGISTRATION_SUCCESS,
        data,
      });
    } catch (error: any) {
      return SendResponse({
        res,
        status: HttpStatusCode.InternalServerError,
        message: "Error registering user: " + error.message,
      });
    }
  }

    async login(req: any, res: any) {
      try {
        const { email, password } = req.body;
        const payload = { email, password };

        const data = await UserService.loginUser(payload);

        return SendResponse({
          res,
          status: HttpStatusCode.Ok,
          message: Messages.Users.LOGIN_SUCCESS,
          data,
        });
      } catch (error: any) {
        return SendResponse({
          res,
          status: HttpStatusCode.Unauthorized,
          message: "Invalid login credentials: " + error.message,
        });
      }
    }
}

const UsersController = new UsersControllerClass();
export default UsersController;
