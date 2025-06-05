import express from "express"; // Get Express to help make our web server
import { forgotPassword, resetPassword, getusers } from "../controller/forgotController.js"; // Bring in the functions we made for password stuff

const router = express.Router(); // Make a new router to handle our routes (paths)

// When someone forgets their password, this route helps start the reset
router.post("/forgot-password", forgotPassword);

// When someone wants to set a new password, this route helps do that
router.post("/reset-password", resetPassword);

// This route gives back all users (for checking/testing maybe)
router.get("/get-users", getusers);

export default router; // Let other files use this router