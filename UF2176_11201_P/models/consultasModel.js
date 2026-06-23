const db = require("../config/db");

async function getProfesoresPorEdad(edad) {
  const result = await db.query(
    "SELECT p.profesor_id AS id, p.nombre, p.edad FROM profesores p WHERE p.edad = $1",
    [edad]
  );
  return result.rows;
}

async function getProfesoresPorRango(min, max) {
  const result = await db.query(
    "SELECT p.profesor_id, p.nombre, p.edad FROM profesores p WHERE p.edad BETWEEN $1 AND $2",
    [min, max]
  );
  return result.rows;
}

async function getCursosTopMatriculados() {
  // Subconsulta para obtener cursos cuya cantidad de matrículas sea igual al máximo
  const result = await db.query(
    `
    SELECT 
      c.curso_id,
      c.nombre,
      COUNT(m.matricula_id) AS total_matriculas
    FROM curso c
    LEFT JOIN matriculas m ON m.curso_id = c.curso_id
    GROUP BY c.curso_id, c.nombre
    HAVING COUNT(m.matricula_id) = (
      SELECT MAX(matricula_count)
      FROM (
        SELECT COUNT(matricula_id) AS matricula_count
        FROM matriculas
        GROUP BY curso_id
      ) AS subquery
    )
    `
  );

  return result.rows;
}

async function getMatriculasAlumnoCurso() {
  // JOIN entre 2 tablas: alumnos y cursos a través de matriculas
  const result = await db.query(
    `
    SELECT 
      m.matricula_id,
      a.nombre AS alumno_nombre,
      c.nombre AS curso_nombre,
      m.fecha_matricula
    FROM matriculas m
    JOIN alumnos a ON a.alumno_id = m.alumno_id
    JOIN curso c ON c.curso_id = m.curso_id
    ORDER BY a.nombre, c.nombre
    `
  );

  return result.rows;
}

async function getProfesoresCursoEspecialidad() {
  // JOIN entre 3 tablas: profesores, cursos y especialidades
  const result = await db.query(
    `
    SELECT 
      p.profesor_id,
      p.nombre AS profesor,
      c.curso_id,
      c.nombre AS curso,
      e.especialidad_id,
      e.nombre AS especialidad
    FROM profesores p
    JOIN curso c ON c.profesor_id = p.profesor_id
    JOIN especialidad e ON e.especialidad_id = p.especialidad_id
    ORDER BY p.nombre, c.nombre
    `
  );

  return result.rows;
}

async function getMatriculasTotalPorCurso() {
  const result = await db.query(
    `
    SELECT 
      c.nombre AS curso,
      COUNT(m.matricula_id) AS total_alumnos
    FROM curso c
    JOIN matriculas m ON m.curso_id = c.curso_id
    GROUP BY c.curso_id, c.nombre
    `
  );

  return result.rows;
}

async function getMatriculasCursosConMinimo(min) {
  const result = await db.query(
    `
    SELECT 
      c.nombre AS curso,
      COUNT(m.matricula_id) AS total_alumnos
    FROM curso c
    JOIN matriculas m ON m.curso_id = c.curso_id
    GROUP BY c.curso_id, c.nombre
    HAVING COUNT(m.matricula_id) >= $1
    `,
    [min]
  );

  return result.rows;
}

module.exports = {
  getProfesoresPorEdad,
  getProfesoresPorRango,
  getCursosTopMatriculados,
  getMatriculasAlumnoCurso,
  getProfesoresCursoEspecialidad,
  getMatriculasTotalPorCurso,
  getMatriculasCursosConMinimo
};