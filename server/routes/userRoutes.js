import express from "express";
import { updateProfile ,logoutUser,} from "../controllers/usercontroller.js";


const router = express.Router();

// Update user profile
router.put("/update-profile/:id", updateProfile);
router.post('/logout/:id',logoutUser);





export default router;
