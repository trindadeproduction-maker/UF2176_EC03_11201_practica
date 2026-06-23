const pool = require('../config/db');


const model = require('../models/consultasModel');

exports.ProfesoresPorEdad = async (req, res) => {
    try {
        const { edad } = req.query;

        if (!edad || isNaN(edad)) {
            return res.status(400).json({ 
                error: "Parámetro 'edad' inválido o faltante",
                sql: "SELECT p.profesor_id AS id, p.nombre, p.edad FROM profesores p WHERE p.edad = $1"
            });
        }

        const edadNum = Number(edad);
        if (edadNum < 0 || edadNum >= 150) {
            return res.status(400).json({ error: "Edad debe estar entre 0 y 150" });
        }

        const data = await model.getProfesoresPorEdad(edadNum);

        res.json({
            query_type: "WHERE con una condición",
            total_resultados: data.length,
            parametros: { edad: edadNum },
            resultados: data
        });
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};

exports.ProfesoresPorRango = async (req, res) => {
    try {
        const { min, max } = req.query;

        if (!min || !max || isNaN(min) || isNaN(max)) {
            return res.status(400).json({ 
                error: "Parámetros 'min' y 'max' requeridos y deben ser números",
                sql: "SELECT p.profesor_id, p.nombre, p.edad FROM profesores p WHERE p.edad BETWEEN $1 AND $2"
            });
        }

        const minNum = Number(min);
        const maxNum = Number(max);

        if (minNum > maxNum) {
            return res.status(400).json({ error: "Parámetro 'min' no puede ser mayor que 'max'" });
        }

        const data = await model.getProfesoresPorRango(minNum, maxNum);

        res.json({
            query_type: "WHERE doble condicional (AND)",
            total_resultados: data.length,
            parametros: { min: minNum, max: maxNum },
            resultados: data
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};

exports.CursosTopMatriculados = async (req, res) => {
    try {
        const data = await model.getCursosTopMatriculados();
        res.json({
            query_type: "Subconsulta para obtener máximo",
            total_resultados: data.length,
            descripcion: "Cursos cuya cantidad de matrículas sea igual al máximo",
            sql: `SELECT c.curso_id, c.nombre, COUNT(m.matricula_id) AS total_matriculas
                   FROM curso c LEFT JOIN matriculas m ON m.curso_id = c.curso_id
                   GROUP BY c.curso_id, c.nombre
                   HAVING COUNT(m.matricula_id) = (SELECT MAX(matricula_count) FROM ...)`,
            resultados: data
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};

exports.MatriculasAlumnosCurso = async (req, res) => {
    try {
        const data = await model.getMatriculasAlumnoCurso();
        res.json({
            query_type: "JOIN entre 2 tablas",
            total_resultados: data.length,
            descripcion: "Matrículas mostrando alumno y curso",
            sql: `SELECT m.matricula_id, a.nombre AS alumno_nombre, c.nombre AS curso_nombre, m.fecha_matricula
                   FROM matriculas m
                   JOIN alumnos a ON a.alumno_id = m.alumno_id
                   JOIN curso c ON c.curso_id = m.curso_id`,
            resultados: data
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};

exports.ProfesoresCursoEspecialidad = async (req, res) => {
    try {
        const data = await model.getProfesoresCursoEspecialidad();
        res.json({
            query_type: "JOIN entre 3 tablas",
            total_resultados: data.length,
            descripcion: "Profesores, cursos y especialidades relacionadas",
            sql: `SELECT p.profesor_id, p.nombre AS profesor, c.curso_id, c.nombre AS curso, 
                          e.especialidad_id, e.nombre AS especialidad
                   FROM profesores p
                   JOIN curso c ON c.profesor_id = p.profesor_id
                   JOIN especialidad e ON e.especialidad_id = p.especialidad_id`,
            resultados: data
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};

exports.MatriculasTotalPorCurso = async (req, res) => {
    try {
        const data = await model.getMatriculasTotalPorCurso();
        res.json({
            query_type: "GROUP BY con agregación",
            total_resultados: data.length,
            descripcion: "Cantidad de alumnos matriculados por curso",
            sql: `SELECT c.nombre AS curso, COUNT(m.matricula_id) AS total_alumnos
                   FROM curso c
                   JOIN matriculas m ON m.curso_id = c.curso_id
                   GROUP BY c.curso_id, c.nombre`,
            resultados: data
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};

exports.MatriculasCursosConMinimo = async (req, res) => {
    try {
        const { min } = req.query;

        if (!min || isNaN(min)) {
            return res.status(400).json({ 
                error: "Parámetro 'min' requerido y debe ser un número",
                sql: `SELECT c.nombre, COUNT(m.matricula_id) AS total_alumnos
                       FROM curso c JOIN matriculas m ON m.curso_id = c.curso_id
                       GROUP BY c.curso_id, c.nombre
                       HAVING COUNT(m.matricula_id) >= $1`
            });
        }

        const minNum = Number(min);
        if (minNum < 0) {
            return res.status(400).json({ error: "Parámetro 'min' no puede ser negativo" });
        }

        const data = await model.getMatriculasCursosConMinimo(minNum);

        res.json({
            query_type: "GROUP BY + HAVING",
            total_resultados: data.length,
            parametros: { minimo_matriculas: minNum },
            descripcion: `Cursos con al menos ${minNum} matrículas`,
            sql: `SELECT c.nombre, COUNT(m.matricula_id) AS total_alumnos
                   FROM curso c
                   JOIN matriculas m ON m.curso_id = c.curso_id
                   GROUP BY c.curso_id, c.nombre
                   HAVING COUNT(m.matricula_id) >= $1`,
            resultados: data
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalles: err.message });
    }
};
