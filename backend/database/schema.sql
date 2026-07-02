--
-- PostgreSQL database dump
--

\restrict uwpKYeAdCA3EiddS3EGSzMbhXa51t6Z5HF5Rh7UpCdr73ZtL7Ceq2dckZX4pFn6

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-01 17:31:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 40962)
-- Name: alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnos (
    id_alumno integer NOT NULL,
    nombre character varying(20) NOT NULL,
    apellidos character varying(40) NOT NULL,
    correo character varying(50) NOT NULL,
    contrasena character varying(255) CONSTRAINT "alumnos_contrsaena_not_null" NOT NULL,
    fecha date NOT NULL
);


ALTER TABLE public.alumnos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 40961)
-- Name: alumnos_id_alumno_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumnos_id_alumno_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumnos_id_alumno_seq OWNER TO postgres;

--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 219
-- Name: alumnos_id_alumno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumnos_id_alumno_seq OWNED BY public.alumnos.id_alumno;


--
-- TOC entry 222 (class 1259 OID 40970)
-- Name: encuesta_general; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encuesta_general (
    id_general integer NOT NULL,
    edad integer NOT NULL,
    sexo character(1) NOT NULL,
    carrera character varying(100) NOT NULL,
    cuatrimestre integer CONSTRAINT encuesta_general_n_inscripcion_not_null NOT NULL,
    burnout_previo boolean NOT NULL,
    actividad_f boolean NOT NULL,
    tratamiento_psiquia boolean NOT NULL,
    tratamiento_psico boolean NOT NULL,
    id_alumno integer NOT NULL,
    trabajo boolean NOT NULL
);


ALTER TABLE public.encuesta_general OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 40969)
-- Name: encuesta_general_id_general_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encuesta_general_id_general_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encuesta_general_id_general_seq OWNER TO postgres;

--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 221
-- Name: encuesta_general_id_general_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encuesta_general_id_general_seq OWNED BY public.encuesta_general.id_general;


--
-- TOC entry 226 (class 1259 OID 41015)
-- Name: predicciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predicciones (
    id_prediccion integer NOT NULL,
    id_alumno integer
);


ALTER TABLE public.predicciones OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41014)
-- Name: predicciones_id_prediccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.predicciones_id_prediccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.predicciones_id_prediccion_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 225
-- Name: predicciones_id_prediccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.predicciones_id_prediccion_seq OWNED BY public.predicciones.id_prediccion;


--
-- TOC entry 224 (class 1259 OID 40993)
-- Name: registro_diario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registro_diario (
    id_registro integer NOT NULL,
    fecha date NOT NULL,
    h_sueno real NOT NULL,
    cal_sueno integer NOT NULL,
    n_comidas integer NOT NULL,
    hor_comidas character varying(9),
    cal_consumo integer NOT NULL,
    h_osio real NOT NULL,
    cal_consumo_tec integer NOT NULL,
    uso_ia boolean NOT NULL,
    aplicacion character varying(20),
    pregunta_objetivo real NOT NULL,
    id_alumno integer
);


ALTER TABLE public.registro_diario OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 40992)
-- Name: registro_diario_id_registro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registro_diario_id_registro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registro_diario_id_registro_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 223
-- Name: registro_diario_id_registro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registro_diario_id_registro_seq OWNED BY public.registro_diario.id_registro;


--
-- TOC entry 4824 (class 2604 OID 40965)
-- Name: alumnos id_alumno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos ALTER COLUMN id_alumno SET DEFAULT nextval('public.alumnos_id_alumno_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 40973)
-- Name: encuesta_general id_general; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_general ALTER COLUMN id_general SET DEFAULT nextval('public.encuesta_general_id_general_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 41018)
-- Name: predicciones id_prediccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predicciones ALTER COLUMN id_prediccion SET DEFAULT nextval('public.predicciones_id_prediccion_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 40996)
-- Name: registro_diario id_registro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_diario ALTER COLUMN id_registro SET DEFAULT nextval('public.registro_diario_id_registro_seq'::regclass);


--
-- TOC entry 4989 (class 0 OID 40962)
-- Dependencies: 220
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnos (id_alumno, nombre, apellidos, correo, contrasena, fecha) FROM stdin;
\.


--
-- TOC entry 4991 (class 0 OID 40970)
-- Dependencies: 222
-- Data for Name: encuesta_general; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encuesta_general (id_general, edad, sexo, carrera, cuatrimestre, burnout_previo, actividad_f, tratamiento_psiquia, tratamiento_psico, id_alumno, trabajo) FROM stdin;
\.


--
-- TOC entry 4995 (class 0 OID 41015)
-- Dependencies: 226
-- Data for Name: predicciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.predicciones (id_prediccion, id_alumno) FROM stdin;
\.


--
-- TOC entry 4993 (class 0 OID 40993)
-- Dependencies: 224
-- Data for Name: registro_diario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registro_diario (id_registro, fecha, h_sueno, cal_sueno, n_comidas, hor_comidas, cal_consumo, h_osio, cal_consumo_tec, uso_ia, aplicacion, pregunta_objetivo, id_alumno) FROM stdin;
\.


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 219
-- Name: alumnos_id_alumno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumnos_id_alumno_seq', 1, false);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 221
-- Name: encuesta_general_id_general_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encuesta_general_id_general_seq', 1, false);


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 225
-- Name: predicciones_id_prediccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.predicciones_id_prediccion_seq', 1, false);


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 223
-- Name: registro_diario_id_registro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registro_diario_id_registro_seq', 1, false);


--
-- TOC entry 4829 (class 2606 OID 40968)
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id_alumno);


--
-- TOC entry 4833 (class 2606 OID 40986)
-- Name: encuesta_general encuesta_general_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_general
    ADD CONSTRAINT encuesta_general_pkey PRIMARY KEY (id_general);


--
-- TOC entry 4837 (class 2606 OID 41021)
-- Name: predicciones predicciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predicciones
    ADD CONSTRAINT predicciones_pkey PRIMARY KEY (id_prediccion);


--
-- TOC entry 4835 (class 2606 OID 41008)
-- Name: registro_diario registro_diario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_diario
    ADD CONSTRAINT registro_diario_pkey PRIMARY KEY (id_registro);


--
-- TOC entry 4831 (class 2606 OID 49153)
-- Name: alumnos uc_correo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT uc_correo UNIQUE (correo);


--
-- TOC entry 4838 (class 2606 OID 40987)
-- Name: encuesta_general encuesta_general_id_alumno_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_general
    ADD CONSTRAINT encuesta_general_id_alumno_fkey FOREIGN KEY (id_alumno) REFERENCES public.alumnos(id_alumno);


--
-- TOC entry 4840 (class 2606 OID 41022)
-- Name: predicciones predicciones_id_alumno_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predicciones
    ADD CONSTRAINT predicciones_id_alumno_fkey FOREIGN KEY (id_alumno) REFERENCES public.alumnos(id_alumno);


--
-- TOC entry 4839 (class 2606 OID 41009)
-- Name: registro_diario registro_diario_id_alumno_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_diario
    ADD CONSTRAINT registro_diario_id_alumno_fkey FOREIGN KEY (id_alumno) REFERENCES public.alumnos(id_alumno);


--
--  Procedimientos y vistas de la base de datos (para agilizar esto)
--

-- Crear cuenta

CREATE OR REPLACE FUNCTION register(
    v_nombre VARCHAR(20),
    v_apellidos VARCHAR(40),
    v_correo VARCHAR(50),
    v_contrasena VARCHAR(255),
    v_fecha DATE
)
RETURNS TABLE(
    id_alumno INTEGER,
    nombre VARCHAR,
    apellidos VARCHAR,
    correo VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO alumnos(nombre, apellidos, correo, contrasena, fecha)
    VALUES (v_nombre, v_apellidos, v_correo, v_contrasena, v_fecha)
    RETURNING alumnos.id_alumno, alumnos.nombre, alumnos.apellidos, alumnos.correo;
END;
$$;


-- Verificar

CREATE OR REPLACE FUNCTION login_cred(v_correo CHARACTER VARYING(50))
RETURNS TABLE(
    id_alumno INTEGER,
    nombre VARCHAR,
    apellidos VARCHAR,
    correo VARCHAR,
    contrasena VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT alumnos.id_alumno, alumnos.nombre, alumnos.apellidos, alumnos.correo, alumnos.contrasena
    FROM alumnos WHERE alumnos.correo = v_correo;
END;
$$ LANGUAGE plpgsql;


-- Buscar alumno

CREATE OR REPLACE FUNCTION alumno(v_id INTEGER)
RETURNS TABLE(
    id INTEGER,
    correo VARCHAR,
    contrasena VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT alumnos.id_alumno, alumnos.correo, alumnos.contrasena
    FROM alumnos WHERE alumnos.id_alumno = v_id;
END;
$$ LANGUAGE plpgsql;


-- Cambiar contrasena

CREATE OR REPLACE PROCEDURE pass_change(
    v_id INTEGER,
    v_contrasena CHARACTER VARYING(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE alumnos SET alumnos.contrasena = v_contrasena
    WHERE alumnos.id_alumno = v_id;
END;
$$;


-- Borrar la cuenta (vamos por fin :D)

CREATE OR REPLACE PROCEDURE delete_acc(
    v_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM alumnos
    WHERE alumnos.id_alumno = v_id;
END;
$$;


-- Visualizar registros diarios

CREATE OR REPLACE FUNCTION registros_vista()
RETURNS TABLE(
    id_registro INTEGER,
    fecha DATE,
    h_sueno REAL,
    cal_sueno INTEGER,
    n_comidas INTEGER,
    hor_comidas VARCHAR,
    cal_consumo INTEGER,
    h_osio REAL,
    cal_consumo_tec INTEGER,
    uso_ia BOOLEAN,
    aplicacion VARCHAR,
    pregunta_objetivo REAL,
    id_alumno INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT registro_diario.id_registro, registro_diario.fecha, registro_diario.h_sueno, registro_diario.cal_sueno, registro_diario.n_comidas, registro_diario.hor_comidas, registro_diario.cal_consumo, registro_diario.h_osio, registro_diario.cal_consumo_tec, registro_diario.uso_ia, registro_diario.aplicacion, registro_diario.pregunta_objetivo, registro_diario.id_alumno
    FROM registro_diario;
END;
$$ LANGUAGE plpgsql;


-- Visualizar registros diarios de un alumno específico

CREATE OR REPLACE FUNCTION registros_spec(v_id INTEGER)
RETURNS TABLE(
    id_registro INTEGER,
    fecha DATE,
    h_sueno REAL,
    cal_sueno INTEGER,
    n_comidas INTEGER,
    hor_comidas VARCHAR,
    cal_consumo INTEGER,
    h_osio REAL,
    cal_consumo_tec INTEGER,
    uso_ia BOOLEAN,
    aplicacion VARCHAR,
    pregunta_objetivo REAL,
    id_alumno INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT registro_diario.id_registro, registro_diario.fecha, registro_diario.h_sueno, registro_diario.cal_sueno, registro_diario.n_comidas, registro_diario.hor_comidas, registro_diario.cal_consumo, registro_diario.h_osio, registro_diario.cal_consumo_tec, registro_diario.uso_ia, registro_diario.aplicacion, registro_diario.pregunta_objetivo, registro_diario.id_alumno
    FROM registro_diario WHERE registro_diario.id_alumno = v_id;
END;
$$ LANGUAGE plpgsql;


-- Inserción de datos del registro diario

CREATE OR REPLACE PROCEDURE register_insert(
    v_fecha DATE,
    v_h_sueno REAL,
    v_cal_sueno INTEGER,
    v_n_comidas INTEGER,
    v_hor_comidas CHARACTER VARYING(9),
    v_cal_consumo INTEGER,
    v_h_osio REAL,
    v_cal_consumo_tec INTEGER,
    v_uso_ia BOOLEAN,
    v_aplicacion CHARACTER VARYING(20),
    v_pregunta_objetivo REAL,
    v_id_alumno INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO registro_diario (fecha, h_sueno, cal_sueno, n_comidas, hor_comidas, cal_consumo, h_osio, cal_consumo_tec, uso_ia, aplicacion, pregunta_objetivo, id_alumno)
    VALUES (v_fecha, v_h_sueno, v_cal_sueno, v_n_comidas, v_hor_comidas, v_cal_consumo, v_h_osio, v_cal_consumo_tec, v_uso_ia, v_aplicacion, v_pregunta_objetivo, v_id_alumno);
END;
$$;


-- Búsqueda del registro único de la encuesta general

CREATE OR REPLACE FUNCTION registro_vista(v_id INTEGER)
RETURNS TABLE(
    id_general INTEGER,
    edad INTEGER,
    sexo VARCHAR,
    carrera VARCHAR,
    institucion VARCHAR,
    n_inscripcion INTEGER,
    burnout_previo BOOLEAN,
    actividad_f BOOLEAN,
    tratamiento_psiquia BOOLEAN,
    tratamiento_psico BOOLEAN,
    id_alumno INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT encuesta_general.id_general, encuesta_general.edad, encuesta_general.sexo, encuesta_general.carrera, encuesta_general.institucion, encuesta_general.n_inscripcion, encuesta_general.burnout_previo, encuesta_general.actividad_f, encuesta_general.tratamiento_psiquia, encuesta_general.tratamiento_psico, encuesta_general.id_alumno
    FROM encuesta_general WHERE encuesta_general.id_alumno = v_id;
END;
$$ LANGUAGE plpgsql;


-- Inserción de datos en la encuesta general

CREATE OR REPLACE FUNCTION general_insert(
    v_edad INTEGER,
    v_sexo CHARACTER VARYING(25),
    v_carrera CHARACTER VARYING(100),
    v_institucion CHARACTER VARYING(100),
    v_n_inscripcion INTEGER,
    v_burnout_previo BOOLEAN,
    v_actividad_f BOOLEAN,
    v_tratamiento_psiquia BOOLEAN,
    v_tratamiento_psico BOOLEAN,
    v_id_alumno INTEGER
)
RETURNS TABLE (
    edad INTEGER,
    sexo VARCHAR,
    carrera VARCHAR,
    institucion VARCHAR,
    n_inscripcion INTEGER,
    burnout_previo BOOLEAN,
    actividad_f BOOLEAN,
    tratamiento_psiquia BOOLEAN,
    tratamiento_psico BOOLEAN,
    id_alumno INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO encuesta_general (edad, sexo, carrera, institucion, n_inscripcion, burnout_previo, actividad_f, tratamiento_psiquia, tratamiento_psico, id_alumno)
    VALUES (v_edad, v_sexo, v_carrera, v_institucion, v_n_inscripcion, v_burnout_previo, v_actividad_f, v_tratamiento_psiquia, v_tratamiento_psico, v_id_alumno);
    RETURNING encuesta_general.edad, encuesta_general.sexo, encuesta_general.carrera, encuesta_general.institucion, encuesta_general.n_inscripcion, encuesta_general.burnout_previo, encuesta_general.actividad_f, encuesta_general.tratamiento_psiquia, encuesta_general.tratamiento_psico, encuesta_general.id_alumno;
END;
$$;

-- Completed on 2026-06-17 20:02:01

--
-- PostgreSQL database dump complete
--

\unrestrict uwpKYeAdCA3EiddS3EGSzMbhXa51t6Z5HF5Rh7UpCdr73ZtL7Ceq2dckZX4pFn6

