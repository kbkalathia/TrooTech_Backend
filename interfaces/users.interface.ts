export interface UserDetails {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserPayload = Pick<UserDetails, "name" | "email" | "password">;

export type UserLoginPaylod = Pick<UserDetails, "email" | "password">;
