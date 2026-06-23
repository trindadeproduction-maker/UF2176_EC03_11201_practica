const router = require("express").Router();

const {
    getProfesores,
    getProfesor
 
} = require("../controllers/profesoresController");
const authMiddleware = require("../controllers/middlewares/authMiddleware");
const handleValidation = require("../controllers/middlewares/handleValidation");
const profesorValidator = require("../controllers/middlewares/validators/profesorValidator");

router.get("/", getProfesores);
router.get("/:id", getProfesor);
module.exports = router;