
import { updateProfile ,logoutUser,} from "../controllers/usercontroller.js";

import { register, searchContact } from '../controllers/userController.js';
import { login } from '../controllers/userController.js';

const router = express.Router();

// Route for User Registration
router.post('/register', register);
router.post('/login', login);
router.get('/search-contact', searchContact);
// Update user profile
router.put("/update-profile/:id", updateProfile);
router.post('/logout/:id',logoutUser);


export default router;
