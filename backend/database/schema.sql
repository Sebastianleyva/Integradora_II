--
-- PostgreSQL database dump
--

\restrict EvzFMdPe8cdNbVWEHnpDQ0sgkgR52ln3Kdpd6XReqfxbUfmvvRDZoIT6NC1BaWG

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-10 08:37:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 65545)
-- Name: Administradores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Administradores" (
    id integer NOT NULL,
    nombre character varying(30) NOT NULL,
    "contraseña" character varying(50) NOT NULL
);


ALTER TABLE public."Administradores" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 40962)
-- Name: alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnos (
    id_alumno integer NOT NULL,
    nombre character varying(20) NOT NULL,
    apellidos character varying(40) NOT NULL,
    correo character varying(50) NOT NULL,
    contrasena character varying(255) CONSTRAINT "alumnos_contrsae¤a_not_null" NOT NULL,
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
-- TOC entry 4997 (class 0 OID 0)
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
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 221
-- Name: encuesta_general_id_general_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encuesta_general_id_general_seq OWNED BY public.encuesta_general.id_general;


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
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 223
-- Name: registro_diario_id_registro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registro_diario_id_registro_seq OWNED BY public.registro_diario.id_registro;


--
-- TOC entry 4823 (class 2604 OID 40965)
-- Name: alumnos id_alumno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos ALTER COLUMN id_alumno SET DEFAULT nextval('public.alumnos_id_alumno_seq'::regclass);


--
-- TOC entry 4824 (class 2604 OID 40973)
-- Name: encuesta_general id_general; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_general ALTER COLUMN id_general SET DEFAULT nextval('public.encuesta_general_id_general_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 40996)
-- Name: registro_diario id_registro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_diario ALTER COLUMN id_registro SET DEFAULT nextval('public.registro_diario_id_registro_seq'::regclass);


--
-- TOC entry 4991 (class 0 OID 65545)
-- Dependencies: 225
-- Data for Name: Administradores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Administradores" (id, nombre, "contraseña") FROM stdin;
\.


--
-- TOC entry 4986 (class 0 OID 40962)
-- Dependencies: 220
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnos (id_alumno, nombre, apellidos, correo, contrasena, fecha) FROM stdin;
\.


--
-- TOC entry 4988 (class 0 OID 40970)
-- Dependencies: 222
-- Data for Name: encuesta_general; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encuesta_general (id_general, edad, sexo, carrera, cuatrimestre, burnout_previo, actividad_f, tratamiento_psiquia, tratamiento_psico, id_alumno, trabajo) FROM stdin;
\.


--
-- TOC entry 4990 (class 0 OID 40993)
-- Dependencies: 224
-- Data for Name: registro_diario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registro_diario (id_registro, fecha, h_sueno, cal_sueno, n_comidas, hor_comidas, cal_consumo, h_osio, cal_consumo_tec, uso_ia, aplicacion, pregunta_objetivo, id_alumno) FROM stdin;
\.


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 219
-- Name: alumnos_id_alumno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumnos_id_alumno_seq', 1, false);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 221
-- Name: encuesta_general_id_general_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encuesta_general_id_general_seq', 1, false);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 223
-- Name: registro_diario_id_registro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registro_diario_id_registro_seq', 1, false);


--
-- TOC entry 4835 (class 2606 OID 65552)
-- Name: Administradores Administradores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Administradores"
    ADD CONSTRAINT "Administradores_pkey" PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 40968)
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id_alumno);


--
-- TOC entry 4831 (class 2606 OID 40986)
-- Name: encuesta_general encuesta_general_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_general
    ADD CONSTRAINT encuesta_general_pkey PRIMARY KEY (id_general);


--
-- TOC entry 4833 (class 2606 OID 41008)
-- Name: registro_diario registro_diario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_diario
    ADD CONSTRAINT registro_diario_pkey PRIMARY KEY (id_registro);


--
-- TOC entry 4829 (class 2606 OID 49153)
-- Name: alumnos uc_correo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT uc_correo UNIQUE (correo);


--
-- TOC entry 4836 (class 2606 OID 40987)
-- Name: encuesta_general encuesta_general_id_alumno_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta_general
    ADD CONSTRAINT encuesta_general_id_alumno_fkey FOREIGN KEY (id_alumno) REFERENCES public.alumnos(id_alumno);


--
-- TOC entry 4837 (class 2606 OID 41009)
-- Name: registro_diario registro_diario_id_alumno_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_diario
    ADD CONSTRAINT registro_diario_id_alumno_fkey FOREIGN KEY (id_alumno) REFERENCES public.alumnos(id_alumno);


-- Completed on 2026-07-10 08:37:57

--
-- PostgreSQL database dump complete
--

\unrestrict EvzFMdPe8cdNbVWEHnpDQ0sgkgR52ln3Kdpd6XReqfxbUfmvvRDZoIT6NC1BaWG

