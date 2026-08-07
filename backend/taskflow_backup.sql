--
-- PostgreSQL database dump
--

\restrict PvkExilXvCOjAzeRIxODLJFHVwDsTvwz1ZJjik1mF34cGmvks8OA20ISwonSgdd

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: Activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activity" (
    id text NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "projectId" text NOT NULL,
    "userId" text NOT NULL,
    "taskId" text
);


ALTER TABLE public."Activity" OWNER TO postgres;

--
-- Name: Attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attachment" (
    id text NOT NULL,
    filename text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileSize" integer NOT NULL,
    "mimeType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "taskId" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Attachment" OWNER TO postgres;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "taskId" text NOT NULL,
    "userId" text NOT NULL,
    "parentId" text
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: Invitation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invitation" (
    id text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    token text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "projectId" text NOT NULL,
    "senderId" text NOT NULL,
    "recipientId" text
);


ALTER TABLE public."Invitation" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "projectId" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ownerId" text NOT NULL,
    category text,
    color text,
    "coverImage" text,
    "maxMembers" integer DEFAULT 20 NOT NULL,
    visibility text DEFAULT 'private'::text NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: ProjectMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectMember" (
    id text NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "projectId" text NOT NULL
);


ALTER TABLE public."ProjectMember" OWNER TO postgres;

--
-- Name: Subtask; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subtask" (
    id text NOT NULL,
    text text NOT NULL,
    done boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "taskId" text NOT NULL
);


ALTER TABLE public."Subtask" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'todo'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "projectId" text NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _TaskAssignees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_TaskAssignees" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_TaskAssignees" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, type, message, "createdAt", "projectId", "userId", "taskId") FROM stdin;
cmsaj5x6c0003iype5871ik2o	project_created	Project "My First Project" was created	2026-08-01 15:32:46.26	cmsaj5x5j0001iypez6xhr3gk	cms9g9lk20000iy9yu0tlydif	\N
cmsajb4su0008iypeujjisui3	project_created	Project "Our stuff" was created	2026-08-01 15:36:49.422	cmsajb4sa0006iypeyp8jry8s	cmsajagv50004iypecllfoac2	\N
\.


--
-- Data for Name: Attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attachment" (id, filename, "fileUrl", "fileSize", "mimeType", "createdAt", "taskId", "userId") FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "createdAt", "updatedAt", "taskId", "userId", "parentId") FROM stdin;
\.


--
-- Data for Name: Invitation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invitation" (id, email, role, token, status, "expiresAt", "createdAt", "projectId", "senderId", "recipientId") FROM stdin;
cmsajbjr8000aiypefswckvv2	oyedohosemudiamen@gmail.com	member	36d5c241d2b09a35d48202f1a76f4783763fcb3d8526db69b41982b7f9e154c6	pending	2026-08-08 15:37:08.802	2026-08-01 15:37:08.804	cmsajb4sa0006iypeyp8jry8s	cmsajagv50004iypecllfoac2	\N
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, content, "createdAt", "updatedAt", "projectId", "userId") FROM stdin;
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, description, "createdAt", "updatedAt", "ownerId", category, color, "coverImage", "maxMembers", visibility) FROM stdin;
cmsaj5x5j0001iypez6xhr3gk	My First Project	Testing the TaskFlow project system	2026-08-01 15:32:46.23	2026-08-01 15:32:46.23	cms9g9lk20000iy9yu0tlydif	software	#6366f1	\N	20	public
cmsajb4sa0006iypeyp8jry8s	Our stuff	yeah	2026-08-01 15:36:49.401	2026-08-01 15:36:49.401	cmsajagv50004iypecllfoac2	software	#6366f1	\N	20	public
\.


--
-- Data for Name: ProjectMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectMember" (id, role, "joinedAt", "userId", "projectId") FROM stdin;
\.


--
-- Data for Name: Subtask; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subtask" (id, text, done, "createdAt", "updatedAt", "taskId") FROM stdin;
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, description, status, priority, "dueDate", "createdAt", "updatedAt", "projectId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt") FROM stdin;
cms9g9lk20000iy9yu0tlydif	oyedohosemudiamen@gmail.com	$2b$10$rD6xOj6OiqF/galosJUv5.rfTkvuJjtkOUnwH1QmIhCtY7C7tAAlq	Oyedoh David	2026-07-31 21:23:52.803	2026-07-31 21:23:52.803
cmsajagv50004iypecllfoac2	admin@mudia.com	$2b$10$EqlPdjpaFP7y1n0mmL04k.VYAjWjpIkUT6.YRZTnj/ijGZba.Im86	Jacob Mathhew	2026-08-01 15:36:18.402	2026-08-01 15:36:18.402
\.


--
-- Data for Name: _TaskAssignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_TaskAssignees" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5e4f52f6-d2c1-4b4b-82c7-256dc6582535	c97b494320b67b6268243fdde5cebc2978dc9d3ccf6cf9983d32bc37e79cad9a	2026-07-31 04:59:49.549317+01	20260731035949_add_task_assignees	\N	\N	2026-07-31 04:59:49.496196+01	1
af8ca491-ec28-456e-a09f-be9dc006fb26	e817c2fb178dabf577d75b12d6a19f0c4d1ab553f5204712975ca16a81b6c711	2026-07-31 19:48:00.647743+01	20260731184800_add_workspace_models	\N	\N	2026-07-31 19:48:00.602115+01	1
e9ef1c81-792f-44b4-a3f1-536d037d4822	2a6db7fe9f1a24d548aee7e98b882c56ad7cf50a031bdabd7e0aeaf7a1421071	2026-07-31 21:42:14.075806+01	20260731204214_add_task_detail_models	\N	\N	2026-07-31 21:42:14.039613+01	1
\.


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Attachment Attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Invitation Invitation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: ProjectMember ProjectMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Subtask Subtask_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subtask"
    ADD CONSTRAINT "Subtask_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _TaskAssignees _TaskAssignees_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TaskAssignees"
    ADD CONSTRAINT "_TaskAssignees_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Attachment_taskId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Attachment_taskId_idx" ON public."Attachment" USING btree ("taskId");


--
-- Name: Comment_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_parentId_idx" ON public."Comment" USING btree ("parentId");


--
-- Name: Comment_taskId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_taskId_idx" ON public."Comment" USING btree ("taskId");


--
-- Name: Invitation_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invitation_token_key" ON public."Invitation" USING btree (token);


--
-- Name: ProjectMember_userId_projectId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectMember_userId_projectId_key" ON public."ProjectMember" USING btree ("userId", "projectId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _TaskAssignees_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_TaskAssignees_B_index" ON public."_TaskAssignees" USING btree ("B");


--
-- Name: Activity Activity_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Activity Activity_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Activity Activity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attachment Attachment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attachment Attachment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invitation Invitation_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invitation Invitation_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invitation Invitation_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invitation"
    ADD CONSTRAINT "Invitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectMember ProjectMember_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectMember ProjectMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subtask Subtask_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subtask"
    ADD CONSTRAINT "Subtask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Task Task_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _TaskAssignees _TaskAssignees_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TaskAssignees"
    ADD CONSTRAINT "_TaskAssignees_A_fkey" FOREIGN KEY ("A") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TaskAssignees _TaskAssignees_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TaskAssignees"
    ADD CONSTRAINT "_TaskAssignees_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict PvkExilXvCOjAzeRIxODLJFHVwDsTvwz1ZJjik1mF34cGmvks8OA20ISwonSgdd

