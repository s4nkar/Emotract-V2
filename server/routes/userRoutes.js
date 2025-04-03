
import { updateProfile ,logoutUser, login, searchContact, register,} from "../controllers/usercontroller.js";
const router = express.Router();

// Route for User Registration
router.post('/register', register);
router.post('/login', login);
router.get('/search-contact', searchContact);

// Update user profile
router.put("/update-profile/:id", updateProfile);
router.post('/logout/:id',logoutUser);


export default router;
