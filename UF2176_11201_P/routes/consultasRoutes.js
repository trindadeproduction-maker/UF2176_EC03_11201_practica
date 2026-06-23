const router = require("express").Router();
const consultasController = require("../controllers/consultasController");



router.get("/profesores/por-edad", consultasController.ProfesoresPorEdad);
//api/consultas/profesores/por-edad?edad=45    ok
router.get("/profesores/rango", consultasController.ProfesoresPorRango);
//api/consultas/profesores/rango?min=30&max=50 ok
router.get("/cursos/top-matriculados", consultasController.CursosTopMatriculados);
//api/consultas/cursos/top-matriculados?top=3 ok
router.get("/matriculas/alumnos-curso", consultasController.MatriculasAlumnosCurso);
//api/consultas/matriculas/alumnos-curso?curso=1 ok
router.get("/profesores/curso-especialidad", consultasController.ProfesoresCursoEspecialidad);
//api/consultas/profesores/curso-especialidad?curso=1&especialidad=2 ok
router.get("/matriculas/total-por-curso", consultasController.MatriculasTotalPorCurso);
//api/consultas/matriculas/total-por-curso?curso=1  ok
router.get("/matriculas/cursos-con-minimo", consultasController.MatriculasCursosConMinimo);
//api/consultas/matriculas/cursos-con-minimo?min=1  ok

module.exports = router;

