import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import ProductsController from "./controllers/products.controller";
import UsersController from "./controllers/users.controller";
import CartsController from "./controllers/carts.controller";
import { Server, Socket } from "socket.io";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  isAdmin?: boolean;
}

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
  path: "/socket.io",
});

// Socket.IO connection handling
io.on("connection", (socket: AuthenticatedSocket) => {
  console.log("Client connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  // Add this to confirm connection
  socket.emit("connected", { message: "Successfully connected" });
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Users
app.post("/api/add-user", UsersController.register);
app.post("/api/login", UsersController.login);

// Products
app.get("/api/products", ProductsController.fetchProducts);
app.post("/api/add-product", ProductsController.addProduct);
app.patch("/api/update-product/:id", ProductsController.updateProduct);
app.delete("/api/remove-product/:id", ProductsController.removeProduct);

// Carts
app.get("/api/cart-details/:userId", CartsController.getUserCart);
app.post("/api/add-to-cart/:userId", CartsController.addToCart);
app.delete("/api/delete-cart/:cartId", CartsController.deleteUserCart);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO is running on ws://localhost:${PORT}/socket.io`);
});
