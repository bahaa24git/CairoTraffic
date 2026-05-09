import { db } from "./src/config/db.js";

db.prepare("UPDATE users SET role = ? WHERE email = ?")
  .run("admin", "mohamed@mail.com");

console.log("User is now admin");