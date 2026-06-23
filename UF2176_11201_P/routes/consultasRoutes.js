const router = require("express").Router();
const consultasController = require("../controllers/consultasController");

/**
 * 1. CONSULTA BÁSICA CON WHERE - Una condición
 * GET /api/consultas/profesores/por-edad?edad=35
 * SQL: SELECT ... FROM profesores p WHERE p.edad = $1
 * Response: { query_type, total_resultados, parametros, resultados }
 */
router.get("/profesores/por-edad", consultasController.ProfesoresPorEdad);

/**
 * 2. CONSULTA CON WHERE DOBLE CONDICIONAL - Dos condiciones AND
 * GET /api/consultas/profesores/rango?min=30&max=50
 * SQL: SELECT ... FROM profesores p WHERE p.edad BETWEEN $1 AND $2
 * Response: { query_type, total_resultados, parametros, resultados }
 */
router.get("/profesores/rango", consultasController.ProfesoresPorRango);

/**
 * 3. CONSULTA CON SUBCONSULTA - Obtener curso(s) con máximo de matrículas
 * GET /api/consultas/cursos/top-matriculados
 * SQL: Usa subconsulta para calcular el máximo y compara contra él
 * Response: { query_type, total_resultados, sql, resultados }
 */
router.get("/cursos/top-matriculados", consultasController.CursosTopMatriculados);

/**
 * 4. CONSULTA CON JOIN - Relaciona 2 tablas (alumnos-cursos)
 * GET /api/consultas/matriculas/alumno-curso
 * SQL: JOIN alumnos, matriculas y cursos
 * Response: { query_type, total_resultados, sql, resultados }
 */
router.get("/matriculas/alumno-curso", consultasController.MatriculasAlumnosCurso);

/**
 * 5. CONSULTA CON 3 JOINS - Relaciona 3 tablas (profesor-curso-especialidad)
 * GET /api/consultas/profesores/curso-especialidad
 * SQL: JOIN profesores, cursos y especialidades
 * Response: { query_type, total_resultados, sql, resultados }
 */
router.get("/profesores/curso-especialidad", consultasController.ProfesoresCursoEspecialidad);

/**
 * 6. CONSULTA CON GROUP BY - Agregación con COUNT
 * GET /api/consultas/matriculas/total-por-curso
 * SQL: GROUP BY curso con COUNT
 * Response: { query_type, total_resultados, sql, resultados }
 */
router.get("/matriculas/total-por-curso", consultasController.MatriculasTotalPorCurso);

/**
 * 7. CONSULTA CON GROUP BY + HAVING - Filtrado de agregación
 * GET /api/consultas/matriculas/cursos-con-minimo?min=5
 * SQL: GROUP BY curso HAVING COUNT >= $1
 * Response: { query_type, total_resultados, parametros, sql, resultados }
 */
router.get("/matriculas/cursos-con-minimo", consultasController.MatriculasCursosConMinimo);

module.exports = router;

