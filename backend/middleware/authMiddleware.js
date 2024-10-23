import jwt from "jsonwebtoken";
import { supabaseClient } from "../lib/supabaseClient.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the token
      const { data: user, error } = await supabaseClient
        .from("users")
        .select("id, name, email, role, department")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        res.status(401);
        throw new Error("Not authorized");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};
