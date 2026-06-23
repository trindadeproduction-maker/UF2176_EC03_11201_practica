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

async function getCursosTopMatriculados(top = 3) {
  const result = await db.query(
    `
    SELECT 
      c.curso_id,
      c.nombre,
      COUNT(m.matricula_id) AS total_matriculas
    FROM curso c
    LEFT JOIN matriculas m ON m.curso_id = c.curso_id
    GROUP BY c.curso_id, c.nombre
    ORDER BY total_matriculas DESC
    LIMIT $1
    `,
    [top]
  );

  return result.rows;
}

async function getMatriculasAlumnoCurso() {
  const result = await db.query(
    `
    SELECT 
      a.nombre AS alumno,
      c.nombre AS curso
    FROM matriculas m
    JOIN alumnos a ON a.alumno_id = m.alumno_id
    JOIN curso c ON c.curso_id = m.curso_id
    `
  );

  return result.rows;
}

async function getProfesoresCursoEspecialidad() {
  const result = await db.query(
    `
    SELECT 
      p.nombre AS profesor,
      c.nombre AS curso,
      e.nombre AS especialidad
    FROM profesores p
    JOIN curso c ON c.profesor_id = p.profesor_id
    JOIN especialidad e ON e.especialidad_id = p.especialidad_id
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