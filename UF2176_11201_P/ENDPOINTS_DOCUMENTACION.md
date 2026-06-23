# 📋 Documentación de Endpoints - Consultas SQL

## Base de Datos
La aplicación está basada en el esquema `academia.sql` con las siguientes tablas:
- **profesores** (profesor_id, nombre, edad, especialidad_id)
- **curso** (curso_id, nombre, horas, profesor_id)
- **especialidad** (especialidad_id, nombre, profesor_id)
- **alumnos** (alumno_id, nombre, email)
- **matriculas** (matricula_id, alumno_id, curso_id, fecha_matricula)

---

## 1️⃣ CONSULTA BÁSICA CON WHERE (Una condición)

### Endpoint
```
GET /api/consultas/profesores/por-edad
```

### Parámetros
- `edad` (number, required): Edad del profesor a filtrar

### SQL Usado
```sql
SELECT p.profesor_id AS id, p.nombre, p.edad 
FROM profesores p 
WHERE p.edad = $1
```

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/profesores/por-edad?edad=35
```

### Ejemplo de Response
```json
{
  "query_type": "WHERE con una condición",
  "total_resultados": 1,
  "parametros": {
    "edad": 35
  },
  "resultados": [
    {
      "id": 1,
      "nombre": "Ana García",
      "edad": 35
    }
  ]
}
```

### Validaciones
- ✅ edad es requerida y debe ser número
- ✅ edad debe estar entre 0 y 150
- ✅ Código de error: 400 si parámetro es inválido

---

## 2️⃣ CONSULTA CON WHERE DOBLE CONDICIONAL (AND)

### Endpoint
```
GET /api/consultas/profesores/rango
```

### Parámetros
- `min` (number, required): Edad mínima
- `max` (number, required): Edad máxima

### SQL Usado
```sql
SELECT p.profesor_id, p.nombre, p.edad 
FROM profesores p 
WHERE p.edad BETWEEN $1 AND $2
```

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/profesores/rango?min=30&max=50
```

### Ejemplo de Response
```json
{
  "query_type": "WHERE doble condicional (AND)",
  "total_resultados": 5,
  "parametros": {
    "min": 30,
    "max": 50
  },
  "resultados": [
    {
      "profesor_id": 1,
      "nombre": "Ana García",
      "edad": 35
    },
    {
      "profesor_id": 3,
      "nombre": "Laura Martínez",
      "edad": 29
    },
    {
      "profesor_id": 5,
      "nombre": "Marta López",
      "edad": 38
    },
    {
      "profesor_id": 7,
      "nombre": "Elena Torres",
      "edad": 33
    },
    {
      "profesor_id": 9,
      "nombre": "Patricia Romero",
      "edad": 31
    }
  ]
}
```

### Validaciones
- ✅ min y max son requeridos y deben ser números
- ✅ min no puede ser mayor que max
- ✅ Código de error: 400 si parámetros son inválidos

---

## 3️⃣ CONSULTA CON SUBCONSULTA

### Endpoint
```
GET /api/consultas/cursos/top-matriculados
```

### Parámetros
- Ninguno

### SQL Usado
```sql
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
```

### Objetivo
Obtener curso(s) cuya cantidad de matrículas sea igual al máximo total (usa subconsulta).

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/cursos/top-matriculados
```

### Ejemplo de Response
```json
{
  "query_type": "Subconsulta para obtener máximo",
  "total_resultados": 1,
  "descripcion": "Cursos cuya cantidad de matrículas sea igual al máximo",
  "sql": "SELECT c.curso_id, c.nombre, COUNT(m.matricula_id) AS total_matriculas...",
  "resultados": [
    {
      "curso_id": 1,
      "nombre": "HTML y CSS",
      "total_matriculas": 1
    }
  ]
}
```

### Validaciones
- ✅ Usa subconsulta para calcular el máximo
- ✅ Compara exactamente contra ese máximo
- ✅ Código de error: 500 si hay error interno

---

## 4️⃣ CONSULTA CON JOIN (2 tablas)

### Endpoint
```
GET /api/consultas/matriculas/alumno-curso
```

### Parámetros
- Ninguno

### SQL Usado
```sql
SELECT 
  m.matricula_id,
  a.nombre AS alumno_nombre,
  c.nombre AS curso_nombre,
  m.fecha_matricula
FROM matriculas m
JOIN alumnos a ON a.alumno_id = m.alumno_id
JOIN curso c ON c.curso_id = m.curso_id
ORDER BY a.nombre, c.nombre
```

### Objetivo
Listar matrículas mostrando nombre del alumno y nombre del curso.

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/matriculas/alumno-curso
```

### Ejemplo de Response
```json
{
  "query_type": "JOIN entre 2 tablas",
  "total_resultados": 10,
  "descripcion": "Matrículas mostrando alumno y curso",
  "sql": "SELECT ... FROM matriculas m JOIN alumnos a ... JOIN curso c ...",
  "resultados": [
    {
      "matricula_id": 1,
      "alumno_nombre": "Oscar Burgos",
      "curso_nombre": "HTML y CSS",
      "fecha_matricula": "2025-09-01"
    },
    {
      "matricula_id": 2,
      "alumno_nombre": "Lucía Fernández",
      "curso_nombre": "PostgreSQL",
      "fecha_matricula": "2025-09-02"
    }
  ]
}
```

### Validaciones
- ✅ Muestra campos de ambas tablas
- ✅ JOIN correctamente relacionado
- ✅ Código de error: 500 si hay error interno

---

## 5️⃣ CONSULTA CON JOIN (3 tablas)

### Endpoint
```
GET /api/consultas/profesores/curso-especialidad
```

### Parámetros
- Ninguno

### SQL Usado
```sql
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
```

### Objetivo
Listar profesor, curso y especialidad correspondiente relacionando 3 tablas.

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/profesores/curso-especialidad
```

### Ejemplo de Response
```json
{
  "query_type": "JOIN entre 3 tablas",
  "total_resultados": 10,
  "descripcion": "Profesores, cursos y especialidades relacionadas",
  "sql": "SELECT ... FROM profesores p JOIN curso c ... JOIN especialidad e ...",
  "resultados": [
    {
      "profesor_id": 1,
      "profesor": "Ana García",
      "curso_id": 1,
      "curso": "HTML y CSS",
      "especialidad_id": 1,
      "especialidad": "Desarrollo Web"
    },
    {
      "profesor_id": 2,
      "profesor": "Juan Pérez",
      "curso_id": 2,
      "curso": "PostgreSQL",
      "especialidad_id": 2,
      "especialidad": "Bases de Datos"
    }
  ]
}
```

### Validaciones
- ✅ Muestra campos representativos de las 3 tablas
- ✅ JOINs correctamente relacionados
- ✅ Código de error: 500 si hay error interno

---

## 6️⃣ CONSULTA CON GROUP BY (Agregación)

### Endpoint
```
GET /api/consultas/matriculas/total-por-curso
```

### Parámetros
- Ninguno

### SQL Usado
```sql
SELECT 
  c.nombre AS curso,
  COUNT(m.matricula_id) AS total_alumnos
FROM curso c
JOIN matriculas m ON m.curso_id = c.curso_id
GROUP BY c.curso_id, c.nombre
```

### Objetivo
Mostrar cuántos alumnos hay matriculados por curso.

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/matriculas/total-por-curso
```

### Ejemplo de Response
```json
{
  "query_type": "GROUP BY con agregación",
  "total_resultados": 10,
  "descripcion": "Cantidad de alumnos matriculados por curso",
  "sql": "SELECT c.nombre, COUNT(m.matricula_id) AS total_alumnos FROM curso c...",
  "resultados": [
    {
      "curso": "HTML y CSS",
      "total_alumnos": 1
    },
    {
      "curso": "PostgreSQL",
      "total_alumnos": 1
    },
    {
      "curso": "Python Básico",
      "total_alumnos": 1
    },
    {
      "curso": "Java Orientado a Objetos",
      "total_alumnos": 1
    }
  ]
}
```

### Validaciones
- ✅ GROUP BY por curso
- ✅ Usa COUNT para agregación
- ✅ Código de error: 500 si hay error interno

---

## 7️⃣ CONSULTA CON GROUP BY + HAVING (Filtrado de agregación)

### Endpoint
```
GET /api/consultas/matriculas/cursos-con-minimo
```

### Parámetros
- `min` (number, required): Cantidad mínima de matrículas

### SQL Usado
```sql
SELECT 
  c.nombre AS curso,
  COUNT(m.matricula_id) AS total_alumnos
FROM curso c
JOIN matriculas m ON m.curso_id = c.curso_id
GROUP BY c.curso_id, c.nombre
HAVING COUNT(m.matricula_id) >= $1
```

### Objetivo
Listar solo cursos que tengan al menos `min` matrículas.

### Ejemplo de Request
```
GET http://localhost:3000/api/consultas/matriculas/cursos-con-minimo?min=1
```

### Ejemplo de Response
```json
{
  "query_type": "GROUP BY + HAVING",
  "total_resultados": 10,
  "parametros": {
    "minimo_matriculas": 1
  },
  "descripcion": "Cursos con al menos 1 matrículas",
  "sql": "SELECT c.nombre, COUNT(m.matricula_id) AS total_alumnos FROM curso c...",
  "resultados": [
    {
      "curso": "HTML y CSS",
      "total_alumnos": 1
    },
    {
      "curso": "PostgreSQL",
      "total_alumnos": 1
    },
    {
      "curso": "Python Básico",
      "total_alumnos": 1
    }
  ]
}
```

### Validaciones
- ✅ min es requerido y debe ser número
- ✅ min no puede ser negativo
- ✅ GROUP BY por curso
- ✅ HAVING con COUNT >= min
- ✅ Código de error: 400 si parámetro es inválido, 500 si error interno

---

## 📊 Resumen de Tipos de Consultas

| # | Tipo | Endpoint | SQL Clave |
|---|------|----------|-----------|
| 1 | WHERE básico | `/profesores/por-edad` | `WHERE p.edad = $1` |
| 2 | WHERE doble | `/profesores/rango` | `WHERE p.edad BETWEEN $1 AND $2` |
| 3 | Subconsulta | `/cursos/top-matriculados` | `HAVING ... = (SELECT MAX(...))` |
| 4 | JOIN 2 tablas | `/matriculas/alumno-curso` | `JOIN alumnos ... JOIN curso` |
| 5 | JOIN 3 tablas | `/profesores/curso-especialidad` | `JOIN curso ... JOIN especialidad` |
| 6 | GROUP BY | `/matriculas/total-por-curso` | `GROUP BY ... COUNT(...)` |
| 7 | GROUP BY + HAVING | `/matriculas/cursos-con-minimo` | `GROUP BY ... HAVING COUNT >= $1` |

---

## ✅ Criterios de Evaluación Implementados

- ✅ **Correcta implementación del tipo de consulta**: Cada endpoint implementa el tipo de consulta especificado
- ✅ **Uso correcto de parámetros**: Validaciones en cada endpoint que requiere parámetros
- ✅ **Respuesta JSON clara y ordenada**: Responses incluyen metadata sobre el tipo de consulta y SQL usado
- ✅ **Buen manejo de errores**: Códigos HTTP correctos (400 para errores de validación, 500 para errores internos)
- ✅ **Código limpio y entendible**: Separación clara entre controller, model y router; comentarios documenting

---

## 🚀 Cómo Probar

1. Inicia el servidor:
   ```bash
   npm start
   ```

2. Prueba los endpoints con cualquier cliente HTTP (Postman, curl, etc.):
   ```bash
   curl http://localhost:3000/api/consultas/profesores/por-edad?edad=35
   curl http://localhost:3000/api/consultas/profesores/rango?min=30&max=50
   curl http://localhost:3000/api/consultas/cursos/top-matriculados
   curl http://localhost:3000/api/consultas/matriculas/alumno-curso
   curl http://localhost:3000/api/consultas/profesores/curso-especialidad
   curl http://localhost:3000/api/consultas/matriculas/total-por-curso
   curl http://localhost:3000/api/consultas/matriculas/cursos-con-minimo?min=1
   ```

