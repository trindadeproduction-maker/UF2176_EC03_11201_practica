const pool = require('../config/db');


const model = require('../models/consultasModel');

exports.ProfesoresPorEdad = async (req, res) => {
    try {
        const { edad } = req.query;

        if (!edad || isNaN(edad)) {
            return res.status(400).json({ error: "Edad inválida" });
        }

        const data = await model.getProfesoresPorEdad(Number(edad));

        res.json(data);
    } catch (err) {
            console.error("ERROR REAL:", err);
            res.status(500).json({ error: err.message });
        }
};

exports.ProfesoresPorRango = async (req, res) => {
    try {
        const { min, max } = req.query;

        if (!min || !max || isNaN(min) || isNaN(max)) {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }

        if (Number(min) > Number(max)) {
            return res.status(400).json({ error: "min no puede ser mayor que max" });
        }

        const data = await model.getProfesoresPorRango(Number(min), Number(max));

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.CursosTopMatriculados = async (req, res) => {
    try {
        const data = await model.getCursosTopMatriculados();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.MatriculasAlumnosCurso = async (req, res) => {
    try {
        const data = await model.getMatriculasAlumnoCurso();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.ProfesoresCursoEspecialidad = async (req, res) => {
    try {
        const data = await model.getProfesoresCursoEspecialidad();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.MatriculasTotalPorCurso = async (req, res) => {
    try {
        const data = await model.getMatriculasTotalPorCurso();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error interno" });
    }
};

exports.MatriculasCursosConMinimo = async (req, res) => {
    try {
        const { min } = req.query;

        if (!min || isNaN(min)) {
            return res.status(400).json({ error: "min inválido" });
        }

        const data = await model.getMatriculasCursosConMinimo(Number(min));

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error interno" });
    }
};
