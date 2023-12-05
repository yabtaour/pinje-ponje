--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE admin;
ALTER ROLE admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:efuTEfxzUbx+xyKFMyAtqw==$1yjm3c4lLIoJ9IBTIHhearXCC7ARf2FT2Uo60dpeYOw=:WJCYKXaSfpvR2To5dQ6ynwBiYos0ZWhc64cZxlgeZEc=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "dev_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dev_db; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE dev_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE dev_db OWNER TO admin;

\connect dev_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ChatRole; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."ChatRole" AS ENUM (
    'MEMBER',
    'ADMIN',
    'OWNER'
);


ALTER TYPE public."ChatRole" OWNER TO admin;

--
-- Name: GameMode; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."GameMode" AS ENUM (
    'VSONE',
    'VSBOT',
    'VSALL'
);


ALTER TYPE public."GameMode" OWNER TO admin;

--
-- Name: GameResult; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."GameResult" AS ENUM (
    'WIN',
    'LOSE',
    'DRAW'
);


ALTER TYPE public."GameResult" OWNER TO admin;

--
-- Name: GameStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."GameStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'FINISHED'
);


ALTER TYPE public."GameStatus" OWNER TO admin;

--
-- Name: MemberState; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."MemberState" AS ENUM (
    'ACTIVE',
    'MUTED',
    'BANNED'
);


ALTER TYPE public."MemberState" OWNER TO admin;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."NotificationType" AS ENUM (
    'FRIEND_REQUEST',
    'FRIEND_REQUEST_ACCEPTED',
    'GAME_INVITE',
    'GAME_INVITE_REJECTED',
    'GROUPE_CHAT_INVITE'
);


ALTER TYPE public."NotificationType" OWNER TO admin;

--
-- Name: Rank; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Rank" AS ENUM (
    'UNRANKED',
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD'
);


ALTER TYPE public."Rank" OWNER TO admin;

--
-- Name: RoomType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."RoomType" AS ENUM (
    'PUBLIC',
    'PROTECTED',
    'PRIVATE',
    'DM'
);


ALTER TYPE public."RoomType" OWNER TO admin;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Status" AS ENUM (
    'INGAME',
    'ONLINE',
    'OFFLINE',
    'SPECTATING',
    'INQUEUE'
);


ALTER TYPE public."Status" OWNER TO admin;

--
-- Name: playerStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."playerStatus" AS ENUM (
    'WINNER',
    'LOSER'
);


ALTER TYPE public."playerStatus" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ChatMessage; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ChatMessage" (
    id integer NOT NULL,
    content text NOT NULL,
    "roomId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatMessage" OWNER TO admin;

--
-- Name: ChatMessage_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."ChatMessage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChatMessage_id_seq" OWNER TO admin;

--
-- Name: ChatMessage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."ChatMessage_id_seq" OWNED BY public."ChatMessage".id;


--
-- Name: ChatRoom; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ChatRoom" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text,
    "roomType" public."RoomType" DEFAULT 'DM'::public."RoomType" NOT NULL
);


ALTER TABLE public."ChatRoom" OWNER TO admin;

--
-- Name: ChatRoom_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."ChatRoom_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChatRoom_id_seq" OWNER TO admin;

--
-- Name: ChatRoom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."ChatRoom_id_seq" OWNED BY public."ChatRoom".id;


--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."FriendRequest" (
    id integer NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO admin;

--
-- Name: FriendRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."FriendRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FriendRequest_id_seq" OWNER TO admin;

--
-- Name: FriendRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."FriendRequest_id_seq" OWNED BY public."FriendRequest".id;


--
-- Name: Friendship; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Friendship" (
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL,
    "friendId" integer NOT NULL
);


ALTER TABLE public."Friendship" OWNER TO admin;

--
-- Name: Game; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Game" (
    id integer NOT NULL,
    mode public."GameMode" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Game" OWNER TO admin;

--
-- Name: Game_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Game_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Game_id_seq" OWNER TO admin;

--
-- Name: Game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Game_id_seq" OWNED BY public."Game".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    senderid integer NOT NULL,
    receiverid integer NOT NULL,
    type public."NotificationType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Notification" OWNER TO admin;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO admin;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: Player; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Player" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    status public."playerStatus" NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    "gameId" integer NOT NULL,
    accuracy double precision DEFAULT 0 NOT NULL,
    consitency double precision DEFAULT 0 NOT NULL,
    reflex double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Player" OWNER TO admin;

--
-- Name: Player_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Player_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Player_id_seq" OWNER TO admin;

--
-- Name: Player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Player_id_seq" OWNED BY public."Player".id;


--
-- Name: Profile; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Profile" (
    id integer NOT NULL,
    avatar text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    userid integer NOT NULL,
    bio character varying(255) DEFAULT 'I am a new player'::character varying
);


ALTER TABLE public."Profile" OWNER TO admin;

--
-- Name: Profile_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Profile_id_seq" OWNER TO admin;

--
-- Name: Profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Profile_id_seq" OWNED BY public."Profile".id;


--
-- Name: RoomMembership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."RoomMembership" (
    id integer NOT NULL,
    role public."ChatRole" NOT NULL,
    "userId" integer NOT NULL,
    "roomId" integer NOT NULL,
    state public."MemberState" DEFAULT 'ACTIVE'::public."MemberState" NOT NULL,
    "unmuteTime" timestamp(3) without time zone,
    read boolean DEFAULT false NOT NULL
);


ALTER TABLE public."RoomMembership" OWNER TO admin;

--
-- Name: RoomMembership_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."RoomMembership_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RoomMembership_id_seq" OWNER TO admin;

--
-- Name: RoomMembership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."RoomMembership_id_seq" OWNED BY public."RoomMembership".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    intraid integer,
    "twoFactorSecret" text,
    "googleId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text,
    status public."Status" DEFAULT 'ONLINE'::public."Status" NOT NULL,
    "twoFactor" boolean DEFAULT false NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    accuracy double precision DEFAULT 0 NOT NULL,
    consitency double precision DEFAULT 0 NOT NULL,
    reflex double precision DEFAULT 0 NOT NULL,
    "winRate" double precision DEFAULT 0 NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    "gamePoints" integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 0 NOT NULL,
    rank public."Rank" DEFAULT 'UNRANKED'::public."Rank" NOT NULL,
    username text NOT NULL,
    "gameInvitesSent" integer DEFAULT 0
);


ALTER TABLE public."User" OWNER TO admin;

--
-- Name: UserBlocking; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."UserBlocking" (
    "blockerId" integer NOT NULL,
    "blockedId" integer NOT NULL
);


ALTER TABLE public."UserBlocking" OWNER TO admin;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO admin;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Name: ChatMessage id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChatMessage" ALTER COLUMN id SET DEFAULT nextval('public."ChatMessage_id_seq"'::regclass);


--
-- Name: ChatRoom id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChatRoom" ALTER COLUMN id SET DEFAULT nextval('public."ChatRoom_id_seq"'::regclass);


--
-- Name: FriendRequest id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FriendRequest" ALTER COLUMN id SET DEFAULT nextval('public."FriendRequest_id_seq"'::regclass);


--
-- Name: Game id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Game" ALTER COLUMN id SET DEFAULT nextval('public."Game_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Player id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Player" ALTER COLUMN id SET DEFAULT nextval('public."Player_id_seq"'::regclass);


--
-- Name: Profile id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Profile" ALTER COLUMN id SET DEFAULT nextval('public."Profile_id_seq"'::regclass);


--
-- Name: RoomMembership id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."RoomMembership" ALTER COLUMN id SET DEFAULT nextval('public."RoomMembership_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ChatMessage" (id, content, "roomId", "userId", "createdAt") FROM stdin;
1	Morning change dinner.	1	16	2023-12-05 18:22:20.288
2	Everybody customer vote start economic miss place.	1	16	2023-12-05 18:22:20.294
3	Recognize kitchen trip manager decision.	1	16	2023-12-05 18:22:20.295
4	Leave bring best contain exactly month.	1	16	2023-12-05 18:22:20.295
5	Energy class parent out.	1	16	2023-12-05 18:22:20.296
6	Game watch budget mean organization.	1	16	2023-12-05 18:22:20.297
7	Young position after full structure course set care.	1	16	2023-12-05 18:22:20.297
8	For others south tree thousand social action.	1	16	2023-12-05 18:22:20.298
9	His risk out coach wide size.	1	16	2023-12-05 18:22:20.299
10	Particular own cause under high table debate.	1	16	2023-12-05 18:22:20.299
11	Stop official never determine just.	1	17	2023-12-05 18:22:20.3
12	Make situation sport learn clear.	1	17	2023-12-05 18:22:20.301
13	Base year spend investment quite keep hundred.	1	17	2023-12-05 18:22:20.301
14	Prevent almost account here.	1	17	2023-12-05 18:22:20.302
15	Final hotel television.	1	17	2023-12-05 18:22:20.303
16	Face any morning poor.	1	17	2023-12-05 18:22:20.303
17	Dark set half leader.	1	17	2023-12-05 18:22:20.304
18	Of practice staff fly hard quality.	1	17	2023-12-05 18:22:20.304
19	Become determine suggest to.	1	17	2023-12-05 18:22:20.305
20	As hundred without phone right.	1	17	2023-12-05 18:22:20.305
21	Rich so wear white seat listen sea kind.	2	16	2023-12-05 18:22:20.309
22	Determine trip fire window.	2	16	2023-12-05 18:22:20.31
23	Speech human assume level involve fear.	2	16	2023-12-05 18:22:20.31
24	North too full let.	2	16	2023-12-05 18:22:20.311
25	Similar step right use.	2	16	2023-12-05 18:22:20.311
26	Government left size mouth again from.	2	16	2023-12-05 18:22:20.312
27	Senior drive friend after experience or.	2	16	2023-12-05 18:22:20.313
28	Include once drop foot analysis executive after.	2	16	2023-12-05 18:22:20.313
29	History condition throughout operation.	2	16	2023-12-05 18:22:20.314
30	Shoulder it note everyone.	2	16	2023-12-05 18:22:20.315
31	Hair into director recognize property pull.	2	17	2023-12-05 18:22:20.315
32	Wish outside lead strong computer.	2	17	2023-12-05 18:22:20.316
33	Common light brother only Mrs.	2	17	2023-12-05 18:22:20.317
34	Issue difficult compare a discuss.	2	17	2023-12-05 18:22:20.317
35	Majority physical data season.	2	17	2023-12-05 18:22:20.318
36	Financial stand begin but threat everyone.	2	17	2023-12-05 18:22:20.318
37	Local college value hair give.	2	17	2023-12-05 18:22:20.319
38	Spring food bad remain goal size.	2	17	2023-12-05 18:22:20.32
39	Big why born that spend.	2	17	2023-12-05 18:22:20.32
40	Else sort authority public word.	2	17	2023-12-05 18:22:20.321
41	Chair sport whether experience.	3	32	2023-12-05 18:22:21.378
42	Town per my walk able.	3	32	2023-12-05 18:22:21.379
43	Morning area six.	3	32	2023-12-05 18:22:21.379
44	Much much age imagine.	3	32	2023-12-05 18:22:21.38
45	Modern carry price serious education any.	3	32	2023-12-05 18:22:21.381
46	Late style population everything theory.	3	32	2023-12-05 18:22:21.382
47	Human site worry station.	3	32	2023-12-05 18:22:21.382
48	Hundred nature into perform apply.	3	32	2023-12-05 18:22:21.383
49	Course room left analysis feel.	3	32	2023-12-05 18:22:21.384
50	Group hard husband economy ahead tonight mean hotel.	3	32	2023-12-05 18:22:21.384
51	Expect field inside anyone attorney visit.	3	33	2023-12-05 18:22:21.385
52	Director black sister high identify community weight.	3	33	2023-12-05 18:22:21.386
53	Growth rather statement identify same best condition.	3	33	2023-12-05 18:22:21.386
54	Identify church body model when describe explain.	3	33	2023-12-05 18:22:21.387
55	Defense and guess.	3	33	2023-12-05 18:22:21.387
56	Degree report candidate truth outside.	3	33	2023-12-05 18:22:21.388
57	Seem rock leg story have should our.	3	33	2023-12-05 18:22:21.389
58	Grow a identify too.	3	33	2023-12-05 18:22:21.389
59	Process none nothing rate new.	3	33	2023-12-05 18:22:21.39
60	Read course Democrat success.	3	33	2023-12-05 18:22:21.39
61	Interesting politics really.	4	32	2023-12-05 18:22:21.393
62	Parent value long pretty.	4	32	2023-12-05 18:22:21.394
63	Agree kid effect set talk.	4	32	2023-12-05 18:22:21.395
64	Contain role success six.	4	32	2023-12-05 18:22:21.395
65	Theory baby drop attention walk very.	4	32	2023-12-05 18:22:21.396
66	Former then better go hear carry fear.	4	32	2023-12-05 18:22:21.397
67	She suddenly official instead hear Republican forget.	4	32	2023-12-05 18:22:21.397
68	What agreement nature beautiful in.	4	32	2023-12-05 18:22:21.398
69	Mention final matter school dark stand measure focus.	4	32	2023-12-05 18:22:21.399
70	Wonder candidate her everybody performance too.	4	32	2023-12-05 18:22:21.399
71	Sing away beyond both away remember military.	4	33	2023-12-05 18:22:21.4
72	Push tell west above.	4	33	2023-12-05 18:22:21.401
73	Whom particular economic quality rich.	4	33	2023-12-05 18:22:21.401
74	Form apply account business response send hospital.	4	33	2023-12-05 18:22:21.402
75	Box development author wish example training.	4	33	2023-12-05 18:22:21.402
76	Anyone goal business large eye role piece.	4	33	2023-12-05 18:22:21.403
77	Possible I investment bad agent always.	4	33	2023-12-05 18:22:21.404
78	Term ball line look key.	4	33	2023-12-05 18:22:21.404
79	Ahead nice how listen short down.	4	33	2023-12-05 18:22:21.405
80	Stay always wall strategy stop.	4	33	2023-12-05 18:22:21.406
81	Drive director wear charge thus class.	5	48	2023-12-05 18:22:22.632
82	Or lot gas need positive main.	5	48	2023-12-05 18:22:22.633
83	Name method such new financial world owner.	5	48	2023-12-05 18:22:22.634
84	Require no have tax experience behind water table.	5	48	2023-12-05 18:22:22.635
85	Sign continue customer across.	5	48	2023-12-05 18:22:22.635
86	Tv cut season democratic general thought.	5	48	2023-12-05 18:22:22.636
87	Course describe baby ground manager fish career red.	5	48	2023-12-05 18:22:22.636
88	Exist learn force oil black.	5	48	2023-12-05 18:22:22.637
89	Play available green almost mouth.	5	48	2023-12-05 18:22:22.638
90	Without minute skin be thank wish.	5	48	2023-12-05 18:22:22.638
91	International join cold news too.	5	49	2023-12-05 18:22:22.639
92	Style show discuss company bad husband suddenly.	5	49	2023-12-05 18:22:22.64
93	Southern about take Mrs senior.	5	49	2023-12-05 18:22:22.64
94	Understand evidence doctor skill name million order sport.	5	49	2023-12-05 18:22:22.641
95	Deep financial be agree modern listen radio mind.	5	49	2023-12-05 18:22:22.643
96	Number report case war address choice.	5	49	2023-12-05 18:22:22.644
97	Always growth inside discussion fight might newspaper last.	5	49	2023-12-05 18:22:22.645
98	Political south inside number remain north way.	5	49	2023-12-05 18:22:22.645
99	Identify popular enter pressure.	5	49	2023-12-05 18:22:22.646
100	Official go whether help believe drive.	5	49	2023-12-05 18:22:22.647
101	Fire different public girl discover.	6	48	2023-12-05 18:22:22.65
102	Employee establish set special nation receive rich.	6	48	2023-12-05 18:22:22.65
103	Material improve choice adult decide so.	6	48	2023-12-05 18:22:22.651
104	Environmental firm paper.	6	48	2023-12-05 18:22:22.652
105	Who current mother.	6	48	2023-12-05 18:22:22.653
106	Attention human positive hour education best.	6	48	2023-12-05 18:22:22.654
107	A somebody discover lawyer.	6	48	2023-12-05 18:22:22.654
108	Lay set form many part.	6	48	2023-12-05 18:22:22.655
109	Score politics case open experience gun them.	6	48	2023-12-05 18:22:22.655
110	While wife perhaps trade factor huge.	6	48	2023-12-05 18:22:22.656
111	Behind source be administration.	6	49	2023-12-05 18:22:22.657
112	Customer writer oil the recent trouble heavy.	6	49	2023-12-05 18:22:22.657
113	Reach month health down everybody political.	6	49	2023-12-05 18:22:22.658
114	Direction point parent into college care.	6	49	2023-12-05 18:22:22.658
115	Even third be among east boy.	6	49	2023-12-05 18:22:22.659
116	Our list firm.	6	49	2023-12-05 18:22:22.659
117	Strong image heart star.	6	49	2023-12-05 18:22:22.66
118	Probably them reason meeting Congress range them.	6	49	2023-12-05 18:22:22.661
119	Senior decision race bill group popular he.	6	49	2023-12-05 18:22:22.661
120	New reduce season one.	6	49	2023-12-05 18:22:22.662
121	Dream subject fine project war.	7	64	2023-12-05 18:22:23.499
122	Direction together condition father travel line wide.	7	64	2023-12-05 18:22:23.5
123	Pressure whom art state player trade new.	7	64	2023-12-05 18:22:23.501
124	Sing social management share teach behavior.	7	64	2023-12-05 18:22:23.501
125	Public organization skin during white movie.	7	64	2023-12-05 18:22:23.502
126	Letter wonder out imagine friend resource certain.	7	64	2023-12-05 18:22:23.503
127	Success daughter even win view course long.	7	64	2023-12-05 18:22:23.503
128	Four stay carry teacher beat public.	7	64	2023-12-05 18:22:23.504
129	Cultural week win shake hair design.	7	64	2023-12-05 18:22:23.504
130	Staff purpose service more mission remain try.	7	64	2023-12-05 18:22:23.505
131	Play in game voice American smile.	7	65	2023-12-05 18:22:23.505
132	Check like explain commercial fly.	7	65	2023-12-05 18:22:23.506
133	Painting upon turn accept.	7	65	2023-12-05 18:22:23.507
134	Follow upon father example father.	7	65	2023-12-05 18:22:23.507
135	Though scientist process dark call fight of show.	7	65	2023-12-05 18:22:23.508
136	Anyone yet follow many.	7	65	2023-12-05 18:22:23.508
137	Somebody politics purpose bad have.	7	65	2023-12-05 18:22:23.509
138	Federal per because plant which two against.	7	65	2023-12-05 18:22:23.51
139	Difficult number born doctor charge mission.	7	65	2023-12-05 18:22:23.511
140	Once though hope.	7	65	2023-12-05 18:22:23.512
141	Rise media station statement may.	8	64	2023-12-05 18:22:23.515
142	Help food kid responsibility example.	8	64	2023-12-05 18:22:23.516
143	Key not water to.	8	64	2023-12-05 18:22:23.516
144	Carry hour son heavy long.	8	64	2023-12-05 18:22:23.517
145	Child lay forget challenge physical build college.	8	64	2023-12-05 18:22:23.517
146	Fine instead could who hundred effect remember.	8	64	2023-12-05 18:22:23.518
147	Human by past face agent join side raise.	8	64	2023-12-05 18:22:23.519
148	Interesting people rise position important everyone around.	8	64	2023-12-05 18:22:23.519
149	Expect that toward probably.	8	64	2023-12-05 18:22:23.52
150	Of Mrs professor capital phone voice.	8	64	2023-12-05 18:22:23.521
151	What factor better form else keep.	8	65	2023-12-05 18:22:23.521
152	Attorney as much home baby picture.	8	65	2023-12-05 18:22:23.522
153	Huge consumer one there general and.	8	65	2023-12-05 18:22:23.522
154	Talk house production rock hope method beautiful low.	8	65	2023-12-05 18:22:23.523
155	Guy large financial board determine.	8	65	2023-12-05 18:22:23.524
156	Ahead wish find eight theory.	8	65	2023-12-05 18:22:23.524
157	Art son hot media.	8	65	2023-12-05 18:22:23.525
158	Either federal past order.	8	65	2023-12-05 18:22:23.525
159	Deal left collection defense.	8	65	2023-12-05 18:22:23.526
160	Specific involve its rest outside.	8	65	2023-12-05 18:22:23.527
161	But knowledge identify.	9	80	2023-12-05 18:22:24.174
162	Policy finish too time street.	9	80	2023-12-05 18:22:24.175
163	Can hotel sure democratic kind game.	9	80	2023-12-05 18:22:24.176
164	Standard court movement.	9	80	2023-12-05 18:22:24.177
165	Community above race follow view simply.	9	80	2023-12-05 18:22:24.178
166	Describe hold should building company remain.	9	80	2023-12-05 18:22:24.178
167	Onto really factor guess decide recently.	9	80	2023-12-05 18:22:24.179
168	Realize along store administration late.	9	80	2023-12-05 18:22:24.18
169	Determine stock government seat sea.	9	80	2023-12-05 18:22:24.18
170	Thought would back professor.	9	80	2023-12-05 18:22:24.181
171	Leader away process bring current our out.	9	81	2023-12-05 18:22:24.181
172	That education father rich.	9	81	2023-12-05 18:22:24.182
173	Factor although rate maybe.	9	81	2023-12-05 18:22:24.183
174	Help decade public hospital.	9	81	2023-12-05 18:22:24.183
175	Bill into least same.	9	81	2023-12-05 18:22:24.184
176	Amount political send.	9	81	2023-12-05 18:22:24.184
177	Themselves all current foreign of try article.	9	81	2023-12-05 18:22:24.185
178	Learn series head almost remember.	9	81	2023-12-05 18:22:24.185
179	By total director media at plant.	9	81	2023-12-05 18:22:24.186
180	Place purpose up fast.	9	81	2023-12-05 18:22:24.187
181	Whole tend effort hand.	10	80	2023-12-05 18:22:24.19
182	Development forward happy wonder whatever far.	10	80	2023-12-05 18:22:24.191
183	Beyond quickly else finally.	10	80	2023-12-05 18:22:24.192
184	Decide drug face understand.	10	80	2023-12-05 18:22:24.192
185	Well attorney total sea reduce.	10	80	2023-12-05 18:22:24.193
186	Case prepare season.	10	80	2023-12-05 18:22:24.193
187	Admit nor prove already close.	10	80	2023-12-05 18:22:24.195
188	Main until international us.	10	80	2023-12-05 18:22:24.195
189	Executive black relate total ever fish.	10	80	2023-12-05 18:22:24.196
190	Indicate some me second probably.	10	80	2023-12-05 18:22:24.197
191	Foreign age difference chance bit include western century.	10	81	2023-12-05 18:22:24.197
192	Care woman early local night recent hope.	10	81	2023-12-05 18:22:24.198
193	Happy short school ever.	10	81	2023-12-05 18:22:24.198
194	Project yeah agent official article officer discussion.	10	81	2023-12-05 18:22:24.199
195	Claim about attack thank authority he.	10	81	2023-12-05 18:22:24.2
196	Hit able a attack.	10	81	2023-12-05 18:22:24.2
197	Realize money contain them wear rest.	10	81	2023-12-05 18:22:24.201
198	Visit station become which adult.	10	81	2023-12-05 18:22:24.201
199	Serious peace have meeting bill toward simply position.	10	81	2023-12-05 18:22:24.202
200	Fall anyone such far later chance.	10	81	2023-12-05 18:22:24.203
201	Yourself stage discover capital.	11	96	2023-12-05 18:22:24.834
202	Nice charge nature area wait.	11	96	2023-12-05 18:22:24.835
203	Country bring message year through.	11	96	2023-12-05 18:22:24.835
204	Also almost almost arm short wrong.	11	96	2023-12-05 18:22:24.836
205	Across positive rich difficult whole.	11	96	2023-12-05 18:22:24.837
206	Box pull free charge name benefit.	11	96	2023-12-05 18:22:24.837
207	Character able glass western radio me.	11	96	2023-12-05 18:22:24.838
208	Field than fight structure difference.	11	96	2023-12-05 18:22:24.839
209	Loss able ability.	11	96	2023-12-05 18:22:24.839
210	Energy minute still war magazine worry.	11	96	2023-12-05 18:22:24.84
211	Choose effect without million.	11	97	2023-12-05 18:22:24.84
212	Campaign book stay case six image section.	11	97	2023-12-05 18:22:24.841
213	Improve speech happy adult because a staff.	11	97	2023-12-05 18:22:24.842
214	Hotel not several artist fact against thus store.	11	97	2023-12-05 18:22:24.842
215	Space huge everyone.	11	97	2023-12-05 18:22:24.843
216	Weight rule bar usually military after.	11	97	2023-12-05 18:22:24.844
217	Despite challenge too religious whose identify.	11	97	2023-12-05 18:22:24.844
218	Require power tonight those several social approach service.	11	97	2023-12-05 18:22:24.845
219	View rather fact attack yet drive notice.	11	97	2023-12-05 18:22:24.845
220	Card score power friend behind day.	11	97	2023-12-05 18:22:24.846
221	Left practice dog doctor evening.	12	96	2023-12-05 18:22:24.849
222	Child gun rate only single hard medical new.	12	96	2023-12-05 18:22:24.85
223	Again itself after near reduce politics sister.	12	96	2023-12-05 18:22:24.851
224	Writer and follow become alone price.	12	96	2023-12-05 18:22:24.851
225	Truth hotel listen hundred American black.	12	96	2023-12-05 18:22:24.852
226	Call although production within wonder.	12	96	2023-12-05 18:22:24.853
227	Raise simply scientist poor.	12	96	2023-12-05 18:22:24.853
228	Amount in talk accept.	12	96	2023-12-05 18:22:24.854
229	National thank person identify hand then season.	12	96	2023-12-05 18:22:24.854
230	Read wife every more why really support.	12	96	2023-12-05 18:22:24.855
231	Marriage star each how much.	12	97	2023-12-05 18:22:24.856
232	Property easy organization major fact thus.	12	97	2023-12-05 18:22:24.856
233	Feeling enter scene property difficult worry.	12	97	2023-12-05 18:22:24.857
234	Good appear above laugh.	12	97	2023-12-05 18:22:24.857
235	Himself why street.	12	97	2023-12-05 18:22:24.858
236	Kind wife its true sort.	12	97	2023-12-05 18:22:24.859
237	Growth me she you leg career business.	12	97	2023-12-05 18:22:24.859
238	Later too until particularly.	12	97	2023-12-05 18:22:24.86
239	Believe space say interview prevent network investment.	12	97	2023-12-05 18:22:24.86
240	Gas anything girl.	12	97	2023-12-05 18:22:24.861
241	Student thousand above follow.	13	112	2023-12-05 18:22:25.453
242	Him likely news room blue rich scientist.	13	112	2023-12-05 18:22:25.453
243	Walk building their TV system.	13	112	2023-12-05 18:22:25.454
244	It try whether into.	13	112	2023-12-05 18:22:25.455
245	Civil toward image paper laugh week need.	13	112	2023-12-05 18:22:25.455
246	Evening training deep maybe.	13	112	2023-12-05 18:22:25.456
247	Pattern design Congress war.	13	112	2023-12-05 18:22:25.457
248	Onto middle hundred fight sure sea forget company.	13	112	2023-12-05 18:22:25.457
249	Citizen institution job whether letter feel rest.	13	112	2023-12-05 18:22:25.458
250	Rather style task score debate early.	13	112	2023-12-05 18:22:25.459
251	Industry would wear attorney two.	13	113	2023-12-05 18:22:25.459
252	Education seem list small remember town.	13	113	2023-12-05 18:22:25.46
253	Owner sit adult all together.	13	113	2023-12-05 18:22:25.46
254	Finally car nature during market manage success.	13	113	2023-12-05 18:22:25.461
255	Even his here.	13	113	2023-12-05 18:22:25.462
256	Sometimes majority push drug.	13	113	2023-12-05 18:22:25.463
257	Trip stop friend manager manage have.	13	113	2023-12-05 18:22:25.463
258	Card beyond or thousand.	13	113	2023-12-05 18:22:25.464
259	Detail fly information.	13	113	2023-12-05 18:22:25.464
260	Investment scientist various who gas beat certainly.	13	113	2023-12-05 18:22:25.465
261	Both especially hear management.	14	112	2023-12-05 18:22:25.468
262	They physical so religious suggest.	14	112	2023-12-05 18:22:25.469
263	Pattern save focus general policy together respond everyone.	14	112	2023-12-05 18:22:25.469
264	Six four generation coach sing night commercial.	14	112	2023-12-05 18:22:25.47
265	We magazine although present entire.	14	112	2023-12-05 18:22:25.471
266	Degree crime choice pull argue consider security.	14	112	2023-12-05 18:22:25.471
267	Building especially suggest bag strategy pass.	14	112	2023-12-05 18:22:25.472
268	Area rest rise spring.	14	112	2023-12-05 18:22:25.472
269	Certain ball man like.	14	112	2023-12-05 18:22:25.473
270	Before course raise later agency.	14	112	2023-12-05 18:22:25.473
271	Two majority small hard bag.	14	113	2023-12-05 18:22:25.474
272	Eight party Mr authority operation to black create.	14	113	2023-12-05 18:22:25.475
273	Even always between page discuss.	14	113	2023-12-05 18:22:25.475
274	Poor hit pick other.	14	113	2023-12-05 18:22:25.476
275	That seek against fear.	14	113	2023-12-05 18:22:25.477
276	True strategy argue local wish.	14	113	2023-12-05 18:22:25.477
277	Rich knowledge issue.	14	113	2023-12-05 18:22:25.478
278	Visit crime join summer we it.	14	113	2023-12-05 18:22:25.478
279	Home five thousand rest store.	14	113	2023-12-05 18:22:25.48
280	Group last stop we.	14	113	2023-12-05 18:22:25.481
281	Whose law never including get.	15	128	2023-12-05 18:22:26.093
282	Mrs brother side represent stock grow sell.	15	128	2023-12-05 18:22:26.094
283	Doctor poor interest message.	15	128	2023-12-05 18:22:26.095
284	Low late poor look.	15	128	2023-12-05 18:22:26.095
285	Toward agreement drive now fast who.	15	128	2023-12-05 18:22:26.096
286	Agency sometimes remain where reach claim situation road.	15	128	2023-12-05 18:22:26.097
287	Deal soldier stop new.	15	128	2023-12-05 18:22:26.097
288	Establish trouble recent like up do.	15	128	2023-12-05 18:22:26.098
289	Stock step worry cover impact seek dark.	15	128	2023-12-05 18:22:26.098
290	Huge when against sit.	15	128	2023-12-05 18:22:26.099
291	Customer statement six century movement everyone star.	15	129	2023-12-05 18:22:26.099
292	Chair place authority would Congress area some.	15	129	2023-12-05 18:22:26.1
293	Everyone executive box responsibility quite exactly.	15	129	2023-12-05 18:22:26.101
294	Generation light direction spend.	15	129	2023-12-05 18:22:26.102
295	Laugh hear reveal sing.	15	129	2023-12-05 18:22:26.102
296	Smile join side source.	15	129	2023-12-05 18:22:26.103
297	Hotel Mr ready professor whether.	15	129	2023-12-05 18:22:26.104
298	Network rather ago second.	15	129	2023-12-05 18:22:26.104
299	Sense commercial our.	15	129	2023-12-05 18:22:26.105
300	Around key area available store hotel.	15	129	2023-12-05 18:22:26.105
301	Group TV listen management building sell dream.	16	128	2023-12-05 18:22:26.108
302	Magazine stock administration lead list company change example.	16	128	2023-12-05 18:22:26.109
303	Suddenly safe American suddenly.	16	128	2023-12-05 18:22:26.11
304	Effect movie price discover.	16	128	2023-12-05 18:22:26.11
305	Go check baby move kitchen maintain ask.	16	128	2023-12-05 18:22:26.111
306	Spend usually speak onto.	16	128	2023-12-05 18:22:26.112
307	To whose market culture purpose successful someone.	16	128	2023-12-05 18:22:26.112
308	Single child people operation although kitchen create tend.	16	128	2023-12-05 18:22:26.113
309	Fall state pretty work project opportunity never.	16	128	2023-12-05 18:22:26.114
310	Ever agent hand as accept TV.	16	128	2023-12-05 18:22:26.114
311	Recognize my success indicate cover challenge.	16	129	2023-12-05 18:22:26.115
312	Spring director itself interview look.	16	129	2023-12-05 18:22:26.115
313	Eye build source gun yes those.	16	129	2023-12-05 18:22:26.116
314	Voice too and though reason other charge.	16	129	2023-12-05 18:22:26.117
315	West now skin federal threat race.	16	129	2023-12-05 18:22:26.117
316	Manage writer state use can.	16	129	2023-12-05 18:22:26.118
317	Hard scientist activity yet strategy him.	16	129	2023-12-05 18:22:26.118
318	Prepare approach black each.	16	129	2023-12-05 18:22:26.119
319	Hour main figure blue current.	16	129	2023-12-05 18:22:26.12
320	Although popular energy enter easy computer according.	16	129	2023-12-05 18:22:26.12
321	Claim cause again interesting quickly window about.	17	144	2023-12-05 18:22:26.655
322	What scene fine soon.	17	144	2023-12-05 18:22:26.656
323	Community less wear.	17	144	2023-12-05 18:22:26.657
324	Magazine mind daughter.	17	144	2023-12-05 18:22:26.657
325	Term reflect machine effort environmental.	17	144	2023-12-05 18:22:26.658
326	Itself affect operation federal evening heavy fund structure.	17	144	2023-12-05 18:22:26.659
327	Yard drive option peace increase sure ask major.	17	144	2023-12-05 18:22:26.659
328	Scene mouth window alone.	17	144	2023-12-05 18:22:26.66
329	Daughter party start hand mother create easy.	17	144	2023-12-05 18:22:26.661
330	Method accept color develop.	17	144	2023-12-05 18:22:26.662
331	Sell painting college seat either.	17	145	2023-12-05 18:22:26.662
332	Ten cost inside but whether performance.	17	145	2023-12-05 18:22:26.663
333	Interesting sense owner control.	17	145	2023-12-05 18:22:26.663
334	Else physical decade structure.	17	145	2023-12-05 18:22:26.664
335	Child matter kind bank conference wait.	17	145	2023-12-05 18:22:26.665
336	Family him arm avoid production report.	17	145	2023-12-05 18:22:26.665
337	Town item over perform time.	17	145	2023-12-05 18:22:26.666
338	Education nature open already.	17	145	2023-12-05 18:22:26.666
339	Agreement get claim power voice car read.	17	145	2023-12-05 18:22:26.667
340	Wish he place prove.	17	145	2023-12-05 18:22:26.668
341	Game language not reflect yeah.	18	144	2023-12-05 18:22:26.671
342	Score seek population would do memory thus.	18	144	2023-12-05 18:22:26.671
343	Indicate nothing long actually dream.	18	144	2023-12-05 18:22:26.672
344	Every let half.	18	144	2023-12-05 18:22:26.672
345	Interesting relationship ago major realize nice.	18	144	2023-12-05 18:22:26.673
346	Authority thought only mission head cover.	18	144	2023-12-05 18:22:26.674
347	Color treatment usually democratic Democrat attorney.	18	144	2023-12-05 18:22:26.674
348	Senior gun star second south special rich court.	18	144	2023-12-05 18:22:26.675
349	Follow fast building until.	18	144	2023-12-05 18:22:26.675
350	Democrat pass the popular.	18	144	2023-12-05 18:22:26.676
351	This as then.	18	145	2023-12-05 18:22:26.677
352	Poor small work turn draw.	18	145	2023-12-05 18:22:26.677
353	Fast source perform situation thought personal.	18	145	2023-12-05 18:22:26.678
354	Letter occur sing operation company spring.	18	145	2023-12-05 18:22:26.678
355	Huge then attention government study modern.	18	145	2023-12-05 18:22:26.679
356	Though official industry perform by fish.	18	145	2023-12-05 18:22:26.68
357	Truth music why after thousand also specific.	18	145	2023-12-05 18:22:26.68
358	Subject building management science.	18	145	2023-12-05 18:22:26.681
359	Number group law.	18	145	2023-12-05 18:22:26.682
360	Feel president serve town down very.	18	145	2023-12-05 18:22:26.682
361	Remember realize tax with career son.	19	160	2023-12-05 18:22:27.425
362	Speech almost education adult.	19	160	2023-12-05 18:22:27.426
363	Score health act difference image article sometimes.	19	160	2023-12-05 18:22:27.427
364	Congress section very subject lead mind.	19	160	2023-12-05 18:22:27.428
365	East chair beat hotel provide.	19	160	2023-12-05 18:22:27.428
366	Agent us data hope.	19	160	2023-12-05 18:22:27.429
367	Improve assume knowledge apply approach.	19	160	2023-12-05 18:22:27.43
368	Republican probably me line fund trip.	19	160	2023-12-05 18:22:27.431
369	Wait energy near throughout.	19	160	2023-12-05 18:22:27.431
370	Get always notice myself begin line class.	19	160	2023-12-05 18:22:27.432
371	Later hear history.	19	161	2023-12-05 18:22:27.433
372	Focus no tax interesting memory suffer despite.	19	161	2023-12-05 18:22:27.434
373	Argue morning laugh I training.	19	161	2023-12-05 18:22:27.435
374	Century him line resource before possible most.	19	161	2023-12-05 18:22:27.435
375	Watch first painting physical movie read.	19	161	2023-12-05 18:22:27.436
376	Require human herself citizen data on before policy.	19	161	2023-12-05 18:22:27.437
377	Perform pattern modern participant.	19	161	2023-12-05 18:22:27.437
378	Type authority before wide factor Mr writer.	19	161	2023-12-05 18:22:27.438
379	Example Congress sport choice impact media.	19	161	2023-12-05 18:22:27.438
380	Soon think method perform water start week.	19	161	2023-12-05 18:22:27.439
381	Actually center quality entire act.	20	160	2023-12-05 18:22:27.442
382	Stage exactly voice story.	20	160	2023-12-05 18:22:27.443
383	Despite seem create owner analysis wife.	20	160	2023-12-05 18:22:27.444
384	Whatever foreign available program in field cover.	20	160	2023-12-05 18:22:27.444
385	Goal spring nothing have already general.	20	160	2023-12-05 18:22:27.445
386	Everybody hot star other modern source.	20	160	2023-12-05 18:22:27.445
387	Sell entire force accept hear.	20	160	2023-12-05 18:22:27.446
388	Water political camera bar current.	20	160	2023-12-05 18:22:27.447
389	Address public probably mouth authority.	20	160	2023-12-05 18:22:27.447
390	Join car final large probably.	20	160	2023-12-05 18:22:27.448
391	She bank on some brother sure once.	20	161	2023-12-05 18:22:27.448
392	Avoid born your course expect explain.	20	161	2023-12-05 18:22:27.449
393	Even quite group picture song read.	20	161	2023-12-05 18:22:27.45
394	Light produce mind travel science.	20	161	2023-12-05 18:22:27.45
395	Five forward down idea participant stop.	20	161	2023-12-05 18:22:27.451
396	Tv commercial response property discover fact foot.	20	161	2023-12-05 18:22:27.451
397	Article project although enough.	20	161	2023-12-05 18:22:27.452
398	Morning chair mission about wall.	20	161	2023-12-05 18:22:27.453
399	Majority rather system under answer.	20	161	2023-12-05 18:22:27.453
400	Minute police their whether ahead science activity far.	20	161	2023-12-05 18:22:27.454
401	Mother yes red meeting however hotel gun.	21	176	2023-12-05 18:22:27.989
402	Ago organization national responsibility.	21	176	2023-12-05 18:22:27.99
403	Focus company expect material responsibility mean particular.	21	176	2023-12-05 18:22:27.991
404	Smile picture simply care.	21	176	2023-12-05 18:22:27.991
405	Ok must car dinner season civil per article.	21	176	2023-12-05 18:22:27.992
406	Woman agreement who respond phone nearly see only.	21	176	2023-12-05 18:22:27.993
407	Picture soldier choice store at travel.	21	176	2023-12-05 18:22:27.993
408	Certain their senior have team high.	21	176	2023-12-05 18:22:27.994
409	Hold program sell.	21	176	2023-12-05 18:22:27.997
410	Require week management activity get call tough.	21	176	2023-12-05 18:22:27.998
411	Offer strong road space.	21	177	2023-12-05 18:22:27.999
412	Interesting democratic somebody major.	21	177	2023-12-05 18:22:27.999
413	Raise radio political role agreement win.	21	177	2023-12-05 18:22:28
414	Attorney chance chance believe Democrat.	21	177	2023-12-05 18:22:28.001
415	Team although painting truth know.	21	177	2023-12-05 18:22:28.001
416	Really always accept because born.	21	177	2023-12-05 18:22:28.002
417	Threat degree leader choose local laugh.	21	177	2023-12-05 18:22:28.002
418	Chance pay culture same environment decade.	21	177	2023-12-05 18:22:28.003
419	Politics already at already poor.	21	177	2023-12-05 18:22:28.004
420	Road public sell really mouth reason sign four.	21	177	2023-12-05 18:22:28.004
421	But even fill.	22	176	2023-12-05 18:22:28.007
422	Have word pull none out.	22	176	2023-12-05 18:22:28.008
423	Simple age red deal character.	22	176	2023-12-05 18:22:28.009
424	Threat middle baby identify cost down.	22	176	2023-12-05 18:22:28.009
425	Face never establish none mean act show.	22	176	2023-12-05 18:22:28.01
426	For pay even.	22	176	2023-12-05 18:22:28.011
427	General social professional collection street onto top factor.	22	176	2023-12-05 18:22:28.011
428	Network election nature city.	22	176	2023-12-05 18:22:28.012
429	Their find recent though strong.	22	176	2023-12-05 18:22:28.013
430	Approach participant election learn defense where.	22	176	2023-12-05 18:22:28.013
431	Along employee consumer day interview your measure.	22	177	2023-12-05 18:22:28.014
432	Week reduce high policy visit approach.	22	177	2023-12-05 18:22:28.015
433	Successful window must.	22	177	2023-12-05 18:22:28.015
434	Painting attention condition.	22	177	2023-12-05 18:22:28.016
435	Risk man cultural among north final fire.	22	177	2023-12-05 18:22:28.016
436	Population teacher build why long.	22	177	2023-12-05 18:22:28.017
437	Response economic enough probably your.	22	177	2023-12-05 18:22:28.018
438	First I top question plan best onto there.	22	177	2023-12-05 18:22:28.019
439	House attorney place none table need expect time.	22	177	2023-12-05 18:22:28.019
440	Ago natural usually trial produce hot stock.	22	177	2023-12-05 18:22:28.02
441	Agreement worker natural go.	23	192	2023-12-05 18:22:29.563
442	Think kind prevent different thank.	23	192	2023-12-05 18:22:29.564
443	Opportunity deal coach something real financial.	23	192	2023-12-05 18:22:29.565
444	Who man source born parent.	23	192	2023-12-05 18:22:29.565
445	Realize everything keep most case include court fine.	23	192	2023-12-05 18:22:29.566
446	Necessary market relationship most.	23	192	2023-12-05 18:22:29.567
447	Science toward tend college alone floor structure.	23	192	2023-12-05 18:22:29.567
448	Find team law much account street data.	23	192	2023-12-05 18:22:29.568
449	Local without talk reach.	23	192	2023-12-05 18:22:29.568
450	Focus begin wall out.	23	192	2023-12-05 18:22:29.569
451	Population summer senior structure improve up low million.	23	193	2023-12-05 18:22:29.57
452	Many response it evening per possible stage.	23	193	2023-12-05 18:22:29.57
453	Father strong charge.	23	193	2023-12-05 18:22:29.571
454	Defense significant she return several fact away society.	23	193	2023-12-05 18:22:29.571
455	Particularly anything certainly responsibility street.	23	193	2023-12-05 18:22:29.572
456	Movement agency born physical foreign indeed her.	23	193	2023-12-05 18:22:29.572
457	Letter personal prevent city.	23	193	2023-12-05 18:22:29.573
458	Attorney develop few management she.	23	193	2023-12-05 18:22:29.574
459	Boy color admit shoulder.	23	193	2023-12-05 18:22:29.574
460	Drive red when cell executive too.	23	193	2023-12-05 18:22:29.575
461	Thus drug participant.	24	192	2023-12-05 18:22:29.579
462	Question follow rate teacher quite movement see.	24	192	2023-12-05 18:22:29.579
463	Left smile court much evidence.	24	192	2023-12-05 18:22:29.58
464	Well open although.	24	192	2023-12-05 18:22:29.581
465	Cost south maybe east will.	24	192	2023-12-05 18:22:29.581
466	Easy lead author point family dog.	24	192	2023-12-05 18:22:29.582
467	Trade add entire food.	24	192	2023-12-05 18:22:29.582
468	My develop return field.	24	192	2023-12-05 18:22:29.583
469	Kid job money allow nation majority team.	24	192	2023-12-05 18:22:29.584
470	Example item education.	24	192	2023-12-05 18:22:29.584
471	There describe bank already.	24	193	2023-12-05 18:22:29.585
472	Tree fast religious little.	24	193	2023-12-05 18:22:29.585
473	American star simply argue save.	24	193	2023-12-05 18:22:29.586
474	Night light customer worker state hear military special.	24	193	2023-12-05 18:22:29.587
475	Such report first push avoid group begin.	24	193	2023-12-05 18:22:29.587
476	Issue apply imagine third.	24	193	2023-12-05 18:22:29.588
477	Another Mrs sound guess represent.	24	193	2023-12-05 18:22:29.589
478	Minute word life season face arm.	24	193	2023-12-05 18:22:29.589
479	Simply for when ago sell often staff begin.	24	193	2023-12-05 18:22:29.59
480	Return production possible me have car.	24	193	2023-12-05 18:22:29.59
481	Assume response since.	25	208	2023-12-05 18:22:30.164
482	Resource travel former tree brother.	25	208	2023-12-05 18:22:30.165
483	Arm laugh force response turn.	25	208	2023-12-05 18:22:30.166
484	Last blood manager rich.	25	208	2023-12-05 18:22:30.167
485	Treatment of reveal technology.	25	208	2023-12-05 18:22:30.167
486	That place administration past brother order technology.	25	208	2023-12-05 18:22:30.168
487	Lead each woman when.	25	208	2023-12-05 18:22:30.169
488	Star brother resource agency front read someone two.	25	208	2023-12-05 18:22:30.169
489	Set share who scene year great thought.	25	208	2023-12-05 18:22:30.17
490	Shoulder news a plant memory low east.	25	208	2023-12-05 18:22:30.17
491	Strategy only religious almost chance language serve.	25	209	2023-12-05 18:22:30.171
492	Effect everybody meet total reflect.	25	209	2023-12-05 18:22:30.172
493	Age important center give half anyone simply.	25	209	2023-12-05 18:22:30.172
494	Describe left allow two usually begin hair side.	25	209	2023-12-05 18:22:30.173
495	Nature than let relate main.	25	209	2023-12-05 18:22:30.173
496	Culture or defense good billion upon.	25	209	2023-12-05 18:22:30.174
497	We person try several news away.	25	209	2023-12-05 18:22:30.175
498	East across bring per small candidate say.	25	209	2023-12-05 18:22:30.175
499	Edge pressure anything measure politics.	25	209	2023-12-05 18:22:30.176
500	Happy how single local nation style.	25	209	2023-12-05 18:22:30.176
501	Democratic rule with practice.	26	208	2023-12-05 18:22:30.18
502	There why later modern real hair system.	26	208	2023-12-05 18:22:30.181
503	Authority computer foreign wonder force or.	26	208	2023-12-05 18:22:30.181
504	Return continue admit person of teacher.	26	208	2023-12-05 18:22:30.182
505	Guess all offer eye spend material blue.	26	208	2023-12-05 18:22:30.183
506	Six impact today entire.	26	208	2023-12-05 18:22:30.183
507	Million democratic talk program artist half.	26	208	2023-12-05 18:22:30.184
508	Physical start dinner world police heart.	26	208	2023-12-05 18:22:30.184
509	Bed themselves help wife now site policy.	26	208	2023-12-05 18:22:30.185
510	Effect woman relate federal second threat guess.	26	208	2023-12-05 18:22:30.186
511	Dark amount item organization.	26	209	2023-12-05 18:22:30.186
512	Character opportunity charge this parent low available.	26	209	2023-12-05 18:22:30.187
513	Others else within.	26	209	2023-12-05 18:22:30.188
514	Foreign attack appear why.	26	209	2023-12-05 18:22:30.188
515	Down whether special start evidence officer.	26	209	2023-12-05 18:22:30.189
516	Reduce value break charge quickly check everyone.	26	209	2023-12-05 18:22:30.19
517	Stay responsibility of above.	26	209	2023-12-05 18:22:30.191
518	Everything people north want goal practice allow operation.	26	209	2023-12-05 18:22:30.191
519	Third box wear house person.	26	209	2023-12-05 18:22:30.192
520	Start student he computer.	26	209	2023-12-05 18:22:30.192
521	Science drive section behind.	27	224	2023-12-05 18:22:30.76
522	Employee marriage clearly drug lead.	27	224	2023-12-05 18:22:30.761
523	Others in popular score which hear create.	27	224	2023-12-05 18:22:30.761
524	Model box method.	27	224	2023-12-05 18:22:30.762
525	Range movement themselves can.	27	224	2023-12-05 18:22:30.763
526	Suggest single evidence western spring door.	27	224	2023-12-05 18:22:30.763
527	Future part west information agreement visit.	27	224	2023-12-05 18:22:30.764
528	Computer get any service inside court girl.	27	224	2023-12-05 18:22:30.765
529	Mind build never pull ground leave listen.	27	224	2023-12-05 18:22:30.765
530	Ever scene check shoulder various within.	27	224	2023-12-05 18:22:30.766
531	Leave here discussion garden safe open.	27	225	2023-12-05 18:22:30.766
532	Matter animal analysis fine set myself late middle.	27	225	2023-12-05 18:22:30.767
533	Important own sound.	27	225	2023-12-05 18:22:30.768
534	Minute travel attorney health product work.	27	225	2023-12-05 18:22:30.768
535	Appear star who.	27	225	2023-12-05 18:22:30.769
536	Development during activity hard later.	27	225	2023-12-05 18:22:30.769
537	Federal everything score machine same scene.	27	225	2023-12-05 18:22:30.77
538	Four cup threat price hard.	27	225	2023-12-05 18:22:30.771
539	Especially different ground early increase almost my.	27	225	2023-12-05 18:22:30.771
540	Within fish point smile before expert another.	27	225	2023-12-05 18:22:30.772
541	Purpose particularly soldier rock memory suddenly.	28	224	2023-12-05 18:22:30.775
542	Yet despite pretty thousand.	28	224	2023-12-05 18:22:30.775
543	Carry lead affect local.	28	224	2023-12-05 18:22:30.776
544	Beautiful painting ahead sell.	28	224	2023-12-05 18:22:30.777
545	Attorney sometimes night indicate listen almost white.	28	224	2023-12-05 18:22:30.777
546	Office raise indeed its knowledge rule.	28	224	2023-12-05 18:22:30.778
547	Enter easy grow measure.	28	224	2023-12-05 18:22:30.779
548	Find indeed consumer think check six.	28	224	2023-12-05 18:22:30.78
549	Likely but arrive fire.	28	224	2023-12-05 18:22:30.78
550	Along of south focus.	28	224	2023-12-05 18:22:30.781
551	Maintain indeed resource reduce.	28	225	2023-12-05 18:22:30.781
552	Full win whatever.	28	225	2023-12-05 18:22:30.782
553	Push board suddenly everybody not.	28	225	2023-12-05 18:22:30.783
554	Feel light way certain.	28	225	2023-12-05 18:22:30.784
555	Answer into month increase through effect.	28	225	2023-12-05 18:22:30.784
556	Very page receive sound.	28	225	2023-12-05 18:22:30.785
557	Small piece where wrong something without.	28	225	2023-12-05 18:22:30.785
558	Prevent plant happy success support.	28	225	2023-12-05 18:22:30.786
559	Result factor force edge can worker data.	28	225	2023-12-05 18:22:30.787
560	Away recent I speak career.	28	225	2023-12-05 18:22:30.787
561	Thousand program away every few add.	29	240	2023-12-05 18:22:31.382
562	Place remember country court owner question.	29	240	2023-12-05 18:22:31.383
563	Ten everyone later then budget whether.	29	240	2023-12-05 18:22:31.383
564	Fund street important certain any must capital.	29	240	2023-12-05 18:22:31.384
565	Difference around ago really especially.	29	240	2023-12-05 18:22:31.385
566	Recognize listen environment marriage ago point people.	29	240	2023-12-05 18:22:31.386
567	Energy nation see that.	29	240	2023-12-05 18:22:31.386
568	Site head operation time now notice degree.	29	240	2023-12-05 18:22:31.387
569	Could anything before born tend store per nice.	29	240	2023-12-05 18:22:31.387
570	Win type serious final election fish four adult.	29	240	2023-12-05 18:22:31.388
571	Police skin popular miss it outside tonight.	29	241	2023-12-05 18:22:31.389
572	Actually majority son Democrat place almost.	29	241	2023-12-05 18:22:31.389
573	Hard perhaps have pay.	29	241	2023-12-05 18:22:31.39
574	Guess new nature second.	29	241	2023-12-05 18:22:31.39
575	It animal center by whole pass lot.	29	241	2023-12-05 18:22:31.391
576	Practice condition good camera management.	29	241	2023-12-05 18:22:31.391
577	Land bit civil rest focus team probably.	29	241	2023-12-05 18:22:31.392
578	Form quality theory gun security education.	29	241	2023-12-05 18:22:31.393
579	Training season return production child.	29	241	2023-12-05 18:22:31.393
580	Modern produce parent he.	29	241	2023-12-05 18:22:31.394
581	Class positive toward tell couple.	30	240	2023-12-05 18:22:31.397
582	Appear beyond size know.	30	240	2023-12-05 18:22:31.398
583	Though thing station might later red use more.	30	240	2023-12-05 18:22:31.398
584	His piece least economic statement black specific interview.	30	240	2023-12-05 18:22:31.399
585	By enjoy form authority tough treat.	30	240	2023-12-05 18:22:31.399
586	Season trade professor speak according way respond.	30	240	2023-12-05 18:22:31.4
587	Scientist buy parent its control whom.	30	240	2023-12-05 18:22:31.401
588	Serve suffer structure some relationship.	30	240	2023-12-05 18:22:31.401
589	Onto brother explain near risk board miss.	30	240	2023-12-05 18:22:31.402
590	Anything him loss bad until husband.	30	240	2023-12-05 18:22:31.402
591	Red statement property magazine magazine me another.	30	241	2023-12-05 18:22:31.403
592	Upon certain only season.	30	241	2023-12-05 18:22:31.403
593	Unit party by program player seven.	30	241	2023-12-05 18:22:31.404
594	Final partner budget everything debate happy.	30	241	2023-12-05 18:22:31.405
595	Behind movement nothing operation out management.	30	241	2023-12-05 18:22:31.405
596	Card attention important huge action.	30	241	2023-12-05 18:22:31.406
597	Difficult war wife significant.	30	241	2023-12-05 18:22:31.406
598	Source base indicate part none.	30	241	2023-12-05 18:22:31.407
599	Way wear tax recently.	30	241	2023-12-05 18:22:31.407
600	Son office employee season condition ten.	30	241	2023-12-05 18:22:31.408
601	Really letter sit visit charge leg.	31	256	2023-12-05 18:22:32.265
602	Can sell nor edge until.	31	256	2023-12-05 18:22:32.266
603	Close reason middle when.	31	256	2023-12-05 18:22:32.267
604	Care able include bed actually throughout.	31	256	2023-12-05 18:22:32.268
605	Play firm middle attorney.	31	256	2023-12-05 18:22:32.269
606	Unit none service.	31	256	2023-12-05 18:22:32.269
607	Law service training team fund board call.	31	256	2023-12-05 18:22:32.27
608	Let subject degree tough.	31	256	2023-12-05 18:22:32.271
609	Color friend our try discuss give shoulder.	31	256	2023-12-05 18:22:32.271
610	Woman writer public better what yes.	31	256	2023-12-05 18:22:32.272
611	Of material every writer benefit wait.	31	257	2023-12-05 18:22:32.272
612	Artist behavior find later up despite.	31	257	2023-12-05 18:22:32.273
613	Fire purpose from store school.	31	257	2023-12-05 18:22:32.274
614	Remember analysis chance whole reality.	31	257	2023-12-05 18:22:32.274
615	Relationship memory source lose serious account feeling.	31	257	2023-12-05 18:22:32.275
616	Know society free someone because public decade.	31	257	2023-12-05 18:22:32.275
617	Wall help drop effect claim two.	31	257	2023-12-05 18:22:32.276
618	Try oil actually performance than.	31	257	2023-12-05 18:22:32.277
619	Us space over generation reduce soldier.	31	257	2023-12-05 18:22:32.277
620	For stage piece seek technology boy voice.	31	257	2023-12-05 18:22:32.278
621	Success whole focus act purpose.	32	256	2023-12-05 18:22:32.281
622	Memory page gas drop more.	32	256	2023-12-05 18:22:32.281
623	Safe pull from.	32	256	2023-12-05 18:22:32.282
624	Decade too water traditional personal glass high.	32	256	2023-12-05 18:22:32.283
625	Mind southern decade work true.	32	256	2023-12-05 18:22:32.283
626	Security trade central executive difference discussion news the.	32	256	2023-12-05 18:22:32.284
627	Run wind commercial miss.	32	256	2023-12-05 18:22:32.284
628	Scene central add main end thank.	32	256	2023-12-05 18:22:32.285
629	Job help control single law purpose.	32	256	2023-12-05 18:22:32.286
630	Suggest camera billion news along rather early.	32	256	2023-12-05 18:22:32.286
631	Standard official finally Mrs.	32	257	2023-12-05 18:22:32.287
632	Heart surface offer world war.	32	257	2023-12-05 18:22:32.288
633	Concern mention listen college education turn operation.	32	257	2023-12-05 18:22:32.288
634	Describe woman government fear huge.	32	257	2023-12-05 18:22:32.289
635	Every nearly reality firm draw so push.	32	257	2023-12-05 18:22:32.29
636	Throw sport under cup.	32	257	2023-12-05 18:22:32.29
637	Bad myself Democrat.	32	257	2023-12-05 18:22:32.291
638	Everybody subject clear evidence bag American.	32	257	2023-12-05 18:22:32.291
639	Yeah general bad bar civil south.	32	257	2023-12-05 18:22:32.292
640	Similar last short few.	32	257	2023-12-05 18:22:32.292
641	War event account perhaps hard base summer.	33	272	2023-12-05 18:22:32.956
642	Letter I go blue research.	33	272	2023-12-05 18:22:32.957
643	Act decide home store seven current concern.	33	272	2023-12-05 18:22:32.958
644	Care set may image.	33	272	2023-12-05 18:22:32.959
645	Drop through five voice later sometimes mention.	33	272	2023-12-05 18:22:32.96
646	Writer itself behavior she find down.	33	272	2023-12-05 18:22:32.961
647	Down ago finally six card personal beautiful.	33	272	2023-12-05 18:22:32.961
648	Produce imagine return wait trip toward beat.	33	272	2023-12-05 18:22:32.962
649	Activity program edge bill chance.	33	272	2023-12-05 18:22:32.963
650	Position simply us thus subject drop practice.	33	272	2023-12-05 18:22:32.963
651	Special product picture west.	33	273	2023-12-05 18:22:32.964
652	Son hot floor say.	33	273	2023-12-05 18:22:32.964
653	Step shake the yeah.	33	273	2023-12-05 18:22:32.965
654	Alone interview from grow.	33	273	2023-12-05 18:22:32.966
655	Evidence range tax ground chance painting.	33	273	2023-12-05 18:22:32.966
656	Health hard produce little prepare idea.	33	273	2023-12-05 18:22:32.967
657	Article clear guess lawyer mission number few.	33	273	2023-12-05 18:22:32.968
658	Themselves foreign four it light full south.	33	273	2023-12-05 18:22:32.968
659	Human machine too bank provide.	33	273	2023-12-05 18:22:32.969
660	Page seven team into call seek.	33	273	2023-12-05 18:22:32.969
661	Small really forget note east media.	34	272	2023-12-05 18:22:32.973
662	Part almost power possible receive.	34	272	2023-12-05 18:22:32.973
663	Experience war can pay.	34	272	2023-12-05 18:22:32.974
664	Matter glass health reality mind somebody.	34	272	2023-12-05 18:22:32.975
665	Better certainly item alone leg star.	34	272	2023-12-05 18:22:32.975
666	Collection up tell Democrat tax gun sense.	34	272	2023-12-05 18:22:32.976
667	Cost Mrs maybe.	34	272	2023-12-05 18:22:32.976
668	Seat radio scene until.	34	272	2023-12-05 18:22:32.977
669	Measure behavior like you us alone area.	34	272	2023-12-05 18:22:32.978
670	Mean moment analysis.	34	272	2023-12-05 18:22:32.979
671	Lose heavy these nature team.	34	273	2023-12-05 18:22:32.979
672	But decade medical near cost couple.	34	273	2023-12-05 18:22:32.98
673	Make detail consumer size into difference might.	34	273	2023-12-05 18:22:32.98
674	Born space southern along.	34	273	2023-12-05 18:22:32.981
675	Bill someone able ask character.	34	273	2023-12-05 18:22:32.982
676	Reach arrive but want star make.	34	273	2023-12-05 18:22:32.982
677	Give tax myself foreign those item threat interesting.	34	273	2023-12-05 18:22:32.983
678	Walk month series unit either day.	34	273	2023-12-05 18:22:32.983
679	What reach any suffer middle window team.	34	273	2023-12-05 18:22:32.984
680	Start all forget himself receive base low.	34	273	2023-12-05 18:22:32.985
\.


--
-- Data for Name: ChatRoom; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ChatRoom" (id, name, "createdAt", "updatedAt", password, "roomType") FROM stdin;
1	meeting	2023-12-05 18:22:20.263	2023-12-05 18:22:20.263	Ati1jVHb&X	DM
2	car	2023-12-05 18:22:20.306	2023-12-05 18:22:20.306	12!4ZzObF+	DM
3	city	2023-12-05 18:22:21.37	2023-12-05 18:22:21.37	+4xf3JVkXS	DM
4	together	2023-12-05 18:22:21.391	2023-12-05 18:22:21.391	0EbMCCsd*5	DM
5	campaign	2023-12-05 18:22:22.628	2023-12-05 18:22:22.628	bjL0AhB^$C	DM
6	line	2023-12-05 18:22:22.647	2023-12-05 18:22:22.647	l_2DyogTQg	DM
7	president	2023-12-05 18:22:23.494	2023-12-05 18:22:23.494	)(c7E7z$4_	DM
8	game	2023-12-05 18:22:23.512	2023-12-05 18:22:23.512	!0rZ0yk_n_	DM
9	represent	2023-12-05 18:22:24.169	2023-12-05 18:22:24.169	A^P0Wr5c&a	DM
10	response	2023-12-05 18:22:24.187	2023-12-05 18:22:24.187	)r5AStLLV%	DM
11	indicate	2023-12-05 18:22:24.829	2023-12-05 18:22:24.829	O9JYO4Sf+)	DM
12	source	2023-12-05 18:22:24.847	2023-12-05 18:22:24.847	!od%UD9xf7	DM
13	term	2023-12-05 18:22:25.448	2023-12-05 18:22:25.448	3)B5Pt9LHW	DM
14	here	2023-12-05 18:22:25.466	2023-12-05 18:22:25.466	yW9vgCqB(7	DM
15	money	2023-12-05 18:22:26.088	2023-12-05 18:22:26.088	o2tWLiay@5	DM
16	if	2023-12-05 18:22:26.106	2023-12-05 18:22:26.106	*N3ejgpx3W	DM
17	image	2023-12-05 18:22:26.651	2023-12-05 18:22:26.651	+j0(LFJwPI	DM
18	second	2023-12-05 18:22:26.668	2023-12-05 18:22:26.668	8A(A6VOlW+	DM
19	increase	2023-12-05 18:22:27.421	2023-12-05 18:22:27.421	M&)FO1hkbU	DM
20	since	2023-12-05 18:22:27.44	2023-12-05 18:22:27.44	%#1M0*pnJ)	DM
21	do	2023-12-05 18:22:27.982	2023-12-05 18:22:27.982	4%7DzD^F!6	DM
22	deal	2023-12-05 18:22:28.005	2023-12-05 18:22:28.005	Qh4LKAOcK)	DM
23	keep	2023-12-05 18:22:29.558	2023-12-05 18:22:29.558	NK&$7FDt#&	DM
24	either	2023-12-05 18:22:29.576	2023-12-05 18:22:29.576	D#6@S&MzH_	DM
25	range	2023-12-05 18:22:30.159	2023-12-05 18:22:30.159	w%&7J9XwLq	DM
26	thought	2023-12-05 18:22:30.177	2023-12-05 18:22:30.177	U_+R35GncB	DM
27	life	2023-12-05 18:22:30.755	2023-12-05 18:22:30.755	uBHk0Qkq_7	DM
28	movement	2023-12-05 18:22:30.772	2023-12-05 18:22:30.772	tn2%BpjFa*	DM
29	spring	2023-12-05 18:22:31.377	2023-12-05 18:22:31.377	2ZZPd0Vn_1	DM
30	themselves	2023-12-05 18:22:31.394	2023-12-05 18:22:31.394	gY444CPr*)	DM
31	budget	2023-12-05 18:22:32.26	2023-12-05 18:22:32.26	v)8Ul7%roW	DM
32	loss	2023-12-05 18:22:32.278	2023-12-05 18:22:32.278	4cdGIWp^*F	DM
33	size	2023-12-05 18:22:32.951	2023-12-05 18:22:32.951	60TBGHXc(Y	DM
34	condition	2023-12-05 18:22:32.97	2023-12-05 18:22:32.97	+mcCz_tEC0	DM
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."FriendRequest" (id, "senderId", "receiverId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Friendship" ("createdAt", "userId", "friendId") FROM stdin;
\.


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Game" (id, mode, "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Notification" (id, senderid, receiverid, type, "createdAt", "updatedAt", read) FROM stdin;
\.


--
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Player" (id, "userId", status, score, "gameId", accuracy, consitency, reflex, "createdAt") FROM stdin;
\.


--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Profile" (id, avatar, "createdAt", "updatedAt", userid, bio) FROM stdin;
1	uploads/Avatars/eccentric-meh-4672042644171375.png	2023-12-05 17:05:47.181	2023-12-05 17:06:02.349	1	I am a new player
2	https://dummyimage.com/807x559	2023-12-05 18:22:20.209	2023-12-05 18:22:20.209	2	Increase high possible to. Activity ground rise nearly human. Population move us fine.\nQuickly instead black firm your fill. Person medical while because.
3	https://dummyimage.com/813x275	2023-12-05 18:22:20.237	2023-12-05 18:22:20.237	3	Never let issue seat ever left election itself.\nKey state commercial PM. Mean street find.\nEspecially sort ask fight hospital else. Choose your reveal child.
4	https://picsum.photos/862/7	2023-12-05 18:22:20.239	2023-12-05 18:22:20.239	4	Our design like local.\nHundred plan paper story contain feeling president. Even plan article local second.\nRelate tough edge tell final. I least kind feel.
5	https://dummyimage.com/788x505	2023-12-05 18:22:20.241	2023-12-05 18:22:20.241	5	Song number right seem box pay five. Figure wish manage city blood everything administration work. Identify management dog agreement who reason show.
6	https://dummyimage.com/175x972	2023-12-05 18:22:20.243	2023-12-05 18:22:20.243	6	Have about this. Political always bag between.\nBar player dark fear main. Might agency sure expert foot number. Stand effort pay create defense position several picture.
7	https://placekitten.com/126/504	2023-12-05 18:22:20.245	2023-12-05 18:22:20.245	7	Way back cup purpose war effect save. Major on daughter kind view arm line.\nSimply war board. Shoulder night physical street traditional. Teach seem sea play suddenly imagine bill quickly.
8	https://placekitten.com/789/598	2023-12-05 18:22:20.247	2023-12-05 18:22:20.247	8	The trip issue road range yeah read. Must discuss admit mention which. Floor future ten wall floor.\nExactly power others hair evidence already foot. Gas role beautiful his long service.
9	https://dummyimage.com/527x805	2023-12-05 18:22:20.249	2023-12-05 18:22:20.249	9	Energy return remain player quite hard.\nHim rise range. Owner so hold conference last.
10	https://dummyimage.com/57x532	2023-12-05 18:22:20.251	2023-12-05 18:22:20.251	10	Concern matter throw history plan so owner. Rather share daughter whose site drug respond. Unit explain seat be which write player.
11	https://dummyimage.com/105x121	2023-12-05 18:22:20.253	2023-12-05 18:22:20.253	11	International set purpose six. Edge painting year street suffer public technology.
12	https://picsum.photos/805/227	2023-12-05 18:22:20.255	2023-12-05 18:22:20.255	12	Past mind beyond learn country real score. Hospital bag free these. Mr threat budget news mention three nearly reason.
13	https://placekitten.com/634/644	2023-12-05 18:22:20.256	2023-12-05 18:22:20.256	13	Order million seat myself authority up. Able important experience former security million including. About across any many best despite. Guy marriage fear traditional able weight black.
14	https://picsum.photos/111/492	2023-12-05 18:22:20.258	2023-12-05 18:22:20.258	14	Result I here yourself. Four break project development official. Country gun somebody scientist officer newspaper from of. Ok join accept social.
15	https://picsum.photos/427/335	2023-12-05 18:22:20.26	2023-12-05 18:22:20.26	15	Gun present participant family American begin staff. Go close simple mind collection. Pass group movie forget tonight best final relationship.
16	https://dummyimage.com/508x478	2023-12-05 18:22:20.262	2023-12-05 18:22:20.262	16	Lose upon low act back owner. She through term teacher national read adult among. Administration marriage about during window three.
17	https://dummyimage.com/745x141	2023-12-05 18:22:20.286	2023-12-05 18:22:20.286	17	Hundred owner night throw meeting note anyone. Family hard specific. Happen into road think institution too.\nTeach certainly relationship low market other. Stand heavy animal image performance.
18	https://picsum.photos/1003/584	2023-12-05 18:22:21.334	2023-12-05 18:22:21.334	18	Long after with himself. Its sound drive both. Sing likely cover establish.\nSuggest success season quite style. Clearly Congress bad every resource open these. Agree these never personal response.
19	https://dummyimage.com/518x111	2023-12-05 18:22:21.338	2023-12-05 18:22:21.338	19	Seek interview former soldier drug practice. Upon for would probably although a.\nMission long find either question bill. Different stuff miss daughter. Close fear them too pass act.
20	https://picsum.photos/477/653	2023-12-05 18:22:21.342	2023-12-05 18:22:21.342	20	Us leg federal owner agent society buy. Four head Democrat impact hour finish. Ten break machine raise appear fear.\nInternational sign herself property. Media dream pressure address behavior through.
21	https://dummyimage.com/354x743	2023-12-05 18:22:21.344	2023-12-05 18:22:21.344	21	During rather fill thank detail but. Instead trip television prevent important kitchen.\nFinancial hard week whom describe. Theory test of rate leave computer popular break.
22	https://placekitten.com/724/739	2023-12-05 18:22:21.347	2023-12-05 18:22:21.347	22	Most scientist official follow over.\nAgainst end statement community never. Lead pass stop. Rise executive left I care.
23	https://picsum.photos/494/969	2023-12-05 18:22:21.35	2023-12-05 18:22:21.35	23	Right follow go action similar police. Summer dog ask bring real. Partner campaign rest protect.\nIts miss painting there site. Often model view doctor.
24	https://placekitten.com/188/115	2023-12-05 18:22:21.353	2023-12-05 18:22:21.353	24	Truth ball key suggest. Address wide beautiful outside.
25	https://picsum.photos/655/413	2023-12-05 18:22:21.356	2023-12-05 18:22:21.356	25	Federal choose social probably toward page. Himself truth authority need material growth.
26	https://dummyimage.com/396x417	2023-12-05 18:22:21.358	2023-12-05 18:22:21.358	26	Provide front future land bill growth. Those easy cup carry. East smile contain reduce any.\nShake set back blue. Machine tree side leave else.
27	https://placekitten.com/1010/131	2023-12-05 18:22:21.36	2023-12-05 18:22:21.36	27	American thousand economy blood. Different respond grow.\nDiscover still movie piece collection. Phone hour source story. Outside our blood someone race animal.
28	https://picsum.photos/285/354	2023-12-05 18:22:21.363	2023-12-05 18:22:21.363	28	Father strong community religious play. Rise total seven image line life.\nField once stand kid early source before. Keep shake no cold open detail cost level.
29	https://dummyimage.com/568x953	2023-12-05 18:22:21.365	2023-12-05 18:22:21.365	29	Scientist machine expert difference. Question old accept prevent stand why. Cultural identify Mr training if quite opportunity. Accept too pressure investment analysis share player.
30	https://dummyimage.com/903x804	2023-12-05 18:22:21.366	2023-12-05 18:22:21.366	30	Fight natural think turn someone.\nDegree executive democratic job body. Near social half. Over night reason painting become source student.
31	https://placekitten.com/798/698	2023-12-05 18:22:21.368	2023-12-05 18:22:21.368	31	Enough argue arrive why. Fear discuss remain sure home good occur. These training responsibility accept kitchen once.
32	https://placekitten.com/62/403	2023-12-05 18:22:21.37	2023-12-05 18:22:21.37	32	Buy personal poor evening how. Security well shake receive relate assume increase. Last job science remain key.
66	https://dummyimage.com/1024x707	2023-12-05 18:22:24.135	2023-12-05 18:22:24.135	66	Plan foreign senior discussion. Weight range tough subject want who out high.
33	https://dummyimage.com/13x502	2023-12-05 18:22:21.374	2023-12-05 18:22:21.374	33	Any scientist everything few. Attack space structure wife full entire adult process.\nRight look small return fear black Democrat. We which dinner.
34	https://picsum.photos/681/207	2023-12-05 18:22:22.59	2023-12-05 18:22:22.59	34	Husband learn report painting.\nCoach produce against many fight. Style account again.
35	https://placekitten.com/519/233	2023-12-05 18:22:22.593	2023-12-05 18:22:22.593	35	Report trouble media laugh performance analysis sure claim. Forward care authority Republican magazine evening send later.
36	https://placekitten.com/153/614	2023-12-05 18:22:22.596	2023-12-05 18:22:22.596	36	Player single everything work after opportunity. Congress when your hold end building life. Step make despite simply west loss.\nAdult return carry draw like when.
37	https://placekitten.com/999/763	2023-12-05 18:22:22.599	2023-12-05 18:22:22.599	37	Market help student office item late production.\nBuild maybe western chance hotel. Impact authority course wear.
38	https://placekitten.com/3/193	2023-12-05 18:22:22.602	2023-12-05 18:22:22.602	38	Address usually artist goal. A environmental newspaper late old politics pick. Attorney hit method particularly street gas.
39	https://dummyimage.com/382x203	2023-12-05 18:22:22.605	2023-12-05 18:22:22.605	39	Better event leave resource true under. Road admit executive fear possible myself coach. Prove involve above deal sign inside matter.
40	https://dummyimage.com/826x438	2023-12-05 18:22:22.608	2023-12-05 18:22:22.608	40	Letter relationship into million cold future audience. Exist other minute avoid.\nEnough other lawyer plan. Space down dinner usually fund hand level cost.
41	https://picsum.photos/77/108	2023-12-05 18:22:22.611	2023-12-05 18:22:22.611	41	Night among look realize scientist mind cause. Put as different same listen information ready. Election ball community well blue.\nWork per about low economic among store.
42	https://placekitten.com/381/480	2023-12-05 18:22:22.613	2023-12-05 18:22:22.613	42	Full away find professor act official together. Threat want pass citizen reach really else. Customer draw measure marriage low best office.
43	https://picsum.photos/238/443	2023-12-05 18:22:22.615	2023-12-05 18:22:22.615	43	Hear coach compare perhaps employee. Identify easy particularly loss owner. Deep society economic board science nearly until moment.
44	https://placekitten.com/810/168	2023-12-05 18:22:22.617	2023-12-05 18:22:22.617	44	Spring eat politics outside space. Author edge effort place agency leave shake. Summer too leader dog.
45	https://placekitten.com/348/501	2023-12-05 18:22:22.622	2023-12-05 18:22:22.622	45	Bring public claim believe low. Experience share Mrs race.\nSenior push party product we trade election. Perhaps enjoy everybody.
46	https://dummyimage.com/415x510	2023-12-05 18:22:22.623	2023-12-05 18:22:22.623	46	Send late body spring. Wait cup generation public picture first. Job lose add entire still among.\nOption cost general consider camera reveal adult. Raise most we myself address put.
47	https://picsum.photos/820/327	2023-12-05 18:22:22.625	2023-12-05 18:22:22.625	47	Treat decide two such radio. However responsibility only relate.\nSmile budget table surface million management loss. School town price spend old.
48	https://placekitten.com/524/280	2023-12-05 18:22:22.627	2023-12-05 18:22:22.627	48	Magazine process college.\nReceive kind black goal. Election in space thousand. Red leg measure change fly study treat.\nAgo method result read he. Heart stuff husband end although raise issue fine.
49	https://picsum.photos/448/617	2023-12-05 18:22:22.631	2023-12-05 18:22:22.631	49	Because though also think young. Family available parent. She citizen however west where. Lay various source know born develop.
50	https://placekitten.com/747/922	2023-12-05 18:22:23.458	2023-12-05 18:22:23.458	50	Go really science game food. Model long sense matter. Standard fine region prevent benefit offer plan. Rest born no bag.
51	https://picsum.photos/868/985	2023-12-05 18:22:23.462	2023-12-05 18:22:23.462	51	Ago other smile. Buy whole group television visit near allow. Type trouble surface series new.\nOver total into through cell. Need across establish reality sometimes professor college.
52	https://dummyimage.com/715x312	2023-12-05 18:22:23.464	2023-12-05 18:22:23.464	52	Western impact society hair. Difference do daughter. Behind great thing bit.
53	https://dummyimage.com/357x127	2023-12-05 18:22:23.467	2023-12-05 18:22:23.467	53	Radio avoid return give less sell detail need. Build number population table although. Throughout long night look many.
54	https://placekitten.com/231/132	2023-12-05 18:22:23.469	2023-12-05 18:22:23.469	54	Left today various take. Computer recent place natural common follow those.\nStage would article party can budget no. Do throw foot girl money cover.
55	https://dummyimage.com/5x691	2023-12-05 18:22:23.473	2023-12-05 18:22:23.473	55	Ten would message medical. Require expect line decade your tell they. Sure against today management.\nForget skin model us. Many end tend best because happen pattern.
56	https://dummyimage.com/866x947	2023-12-05 18:22:23.475	2023-12-05 18:22:23.475	56	Occur nation best police. Performance bag read understand. Practice give common later.\nUse heavy cause natural. Adult south color capital admit economy. Remember protect white enjoy growth audience.
57	https://dummyimage.com/499x829	2023-12-05 18:22:23.477	2023-12-05 18:22:23.477	57	Realize first build line social evening choice. While hold scene learn probably charge.
58	https://dummyimage.com/757x682	2023-12-05 18:22:23.479	2023-12-05 18:22:23.479	58	Power practice another. Box customer sit including. Nor stay single long board history although.\nOption anything executive industry kid sport. Begin medical that factor.
59	https://dummyimage.com/501x563	2023-12-05 18:22:23.481	2023-12-05 18:22:23.481	59	Somebody sister key husband these air four. Range marriage into right standard make.\nCould officer attention your outside environmental Mr. When of east memory study money firm.
60	https://dummyimage.com/110x390	2023-12-05 18:22:23.484	2023-12-05 18:22:23.484	60	Style enough write item. Activity simply page buy candidate gas yet.\nStrategy state small night result perhaps.\nHowever letter already sit become. Can interest style road citizen exist.
61	https://placekitten.com/728/780	2023-12-05 18:22:23.486	2023-12-05 18:22:23.486	61	Save well him live ago go happy discussion. Stuff nice year voice performance sport property. Hope together read side.\nBad throughout discover series official.
62	https://dummyimage.com/122x709	2023-12-05 18:22:23.489	2023-12-05 18:22:23.489	62	Enjoy paper their son commercial computer significant. Give industry build surface activity table inside.\nSure everything interview air tell own. Become would drug new group process.
63	https://picsum.photos/652/935	2023-12-05 18:22:23.491	2023-12-05 18:22:23.491	63	Issue any join start interest. Likely kid pattern significant one important professional production.
64	https://placekitten.com/939/534	2023-12-05 18:22:23.493	2023-12-05 18:22:23.493	64	Continue must throughout western product ahead easy choose. Go glass them board represent nature cold. Father parent whole wall plan law. Ball would part believe wish.
65	https://picsum.photos/795/716	2023-12-05 18:22:23.498	2023-12-05 18:22:23.498	65	Its have season majority. Special bring gun around design peace use. Approach decision customer experience.
67	https://dummyimage.com/762x900	2023-12-05 18:22:24.139	2023-12-05 18:22:24.139	67	Institution from rate. Guess similar best memory.\nAlso style north community rate. Human ready difficult call say. Tend difference type really you human arm. Occur star look.
68	https://picsum.photos/99/549	2023-12-05 18:22:24.143	2023-12-05 18:22:24.143	68	Class too experience social message worker life enjoy. Statement back order. About major never possible himself wonder.\nImagine fear newspaper would world discussion. Number history read.
69	https://picsum.photos/485/433	2023-12-05 18:22:24.145	2023-12-05 18:22:24.145	69	Realize authority where by well low explain win. Data so you total art bar science. Relate movement itself simple top kind.
70	https://placekitten.com/740/297	2023-12-05 18:22:24.148	2023-12-05 18:22:24.148	70	Until cell each price section together according. Large pick example.\nThose win want second. Station help method.\nAlong field region again instead class behavior. Sister matter forget.
71	https://placekitten.com/803/392	2023-12-05 18:22:24.15	2023-12-05 18:22:24.15	71	Project go TV spend tend maintain. War she hard street mother base his.\nParticipant onto force government policy factor her. Whole sing need responsibility rather draw offer structure.
72	https://dummyimage.com/492x563	2023-12-05 18:22:24.152	2023-12-05 18:22:24.152	72	Under prove throw pattern major result carry light.\nYeah person list skin than their. Recognize animal style. Huge treatment industry rate accept development.
73	https://picsum.photos/950/1015	2023-12-05 18:22:24.155	2023-12-05 18:22:24.155	73	Black foreign ground talk special.\nSchool lose until how right kid. Exist use night result since.\nAcross computer rule protect use as within. Page space participant tough. Card eight court six.
74	https://placekitten.com/89/352	2023-12-05 18:22:24.157	2023-12-05 18:22:24.157	74	Practice miss interview best fill stuff mean. Seem yes strategy.\nArea various religious the difficult. System drug fast.
75	https://dummyimage.com/609x203	2023-12-05 18:22:24.159	2023-12-05 18:22:24.159	75	Stay shake difficult later bag see environmental door. Eat price senior down arrive yourself.\nAccording sit from care.
76	https://dummyimage.com/874x1013	2023-12-05 18:22:24.161	2023-12-05 18:22:24.161	76	Seat contain bring. Project seem a chair wait. It stage rather.\nRaise staff change check often book. Church international wife.
77	https://picsum.photos/536/5	2023-12-05 18:22:24.163	2023-12-05 18:22:24.163	77	Top data available. Control focus candidate well appear stay total.\nMember specific air above past half effect.
78	https://placekitten.com/630/744	2023-12-05 18:22:24.165	2023-12-05 18:22:24.165	78	Bill out environmental something job herself. Sort power above general PM increase.\nDay design this high. Health as discussion usually matter throughout history.
79	https://dummyimage.com/141x872	2023-12-05 18:22:24.167	2023-12-05 18:22:24.167	79	Offer provide message high. Firm let simple action.\nEffect total site run beyond.\nMyself heavy hard art statement ask. Majority put west.
80	https://dummyimage.com/747x412	2023-12-05 18:22:24.168	2023-12-05 18:22:24.168	80	Decision share control call. Seek someone stock carry least knowledge effort everybody.\nImportant concern stage stand. Worker weight pass subject. Rest space simply huge.
81	https://dummyimage.com/994x44	2023-12-05 18:22:24.173	2023-12-05 18:22:24.173	81	Adult sell six explain while cut left series. Office rock family time mouth. Cause race top each blue the.
82	https://dummyimage.com/962x948	2023-12-05 18:22:24.797	2023-12-05 18:22:24.797	82	Collection meet say concern wonder authority look. Particularly as our his.\nPiece while table type truth human year inside. Home history campaign you. Nothing police thought whose.
83	https://picsum.photos/219/271	2023-12-05 18:22:24.801	2023-12-05 18:22:24.801	83	Black us perhaps still. Should seem phone single never anything glass.\nMarriage professor teacher sister beyond student future. Itself phone either field. Me make usually big contain spring likely.
84	https://placekitten.com/193/721	2023-12-05 18:22:24.803	2023-12-05 18:22:24.803	84	Box candidate whole sense available industry door. Why small water address future region.
85	https://placekitten.com/498/222	2023-12-05 18:22:24.805	2023-12-05 18:22:24.805	85	End case nor family word difference among.\nSecurity in break read. Rate thousand fill world.\nNews agency to next. Article ready already.
86	https://picsum.photos/1001/719	2023-12-05 18:22:24.808	2023-12-05 18:22:24.808	86	Lead seven us no truth.\nAble agree physical read live three international. Eight great rule become store social across they.\nGet buy thus art board. Time current cultural summer miss.
87	https://picsum.photos/579/234	2023-12-05 18:22:24.811	2023-12-05 18:22:24.811	87	Talk nice fast like entire dream. Art thing animal case cold. Test share former point it sell still.\nKitchen area certainly expect window. Couple sit change peace necessary.
88	https://dummyimage.com/882x355	2023-12-05 18:22:24.813	2023-12-05 18:22:24.813	88	Event girl world. Both here message. Experience prepare thank third ever.\nSuffer a place gun a. My raise mother cover.
89	https://placekitten.com/999/333	2023-12-05 18:22:24.816	2023-12-05 18:22:24.816	89	Be shoulder capital partner want ball. Relate myself wait too business save response. Writer story city building. Statement author point thing policy from.
90	https://placekitten.com/931/240	2023-12-05 18:22:24.818	2023-12-05 18:22:24.818	90	Movie its instead view rule. Hour your political wonder should compare.\nShe identify score choice. Into draw growth. Team tree color loss thought.
91	https://picsum.photos/498/117	2023-12-05 18:22:24.82	2023-12-05 18:22:24.82	91	Model all subject back necessary Democrat court. Agreement sense professional spring property feeling perhaps. Result finally my.
92	https://placekitten.com/509/637	2023-12-05 18:22:24.822	2023-12-05 18:22:24.822	92	Detail rest quality. Hand side need board boy statement form.\nLeg house side avoid parent society. View though either alone throw toward surface.
93	https://dummyimage.com/865x837	2023-12-05 18:22:24.824	2023-12-05 18:22:24.824	93	Popular culture ever. Especially matter point for exist manager would.\nScore player sometimes big. Idea assume stay station travel.
94	https://dummyimage.com/362x714	2023-12-05 18:22:24.825	2023-12-05 18:22:24.825	94	Tax thousand leader wide head however pay. Dinner would western challenge future ability. Once better care first modern which girl color.\nInvestment piece sometimes still player relate civil.
95	https://picsum.photos/165/872	2023-12-05 18:22:24.827	2023-12-05 18:22:24.827	95	Individual dark total sell face. Stand country back ever record. Set blood all gun one too.
96	https://placekitten.com/486/472	2023-12-05 18:22:24.828	2023-12-05 18:22:24.828	96	Outside machine course range worry would condition. Professional college gun imagine. Up heavy energy.\nThree turn bag idea weight morning available sister. Measure for draw national suffer.
97	https://picsum.photos/283/339	2023-12-05 18:22:24.833	2023-12-05 18:22:24.833	97	Another west beat possible.\nLaugh although south marriage amount understand human.\nSeat wonder up buy. Project yeah not nor meet energy.
98	https://placekitten.com/882/765	2023-12-05 18:22:25.415	2023-12-05 18:22:25.415	98	Owner from professor fire movement. Window hard we huge single present require mission. Their fall sense case which week.
99	https://placekitten.com/717/326	2023-12-05 18:22:25.419	2023-12-05 18:22:25.419	99	Crime itself we blood exactly condition. Place any country.\nPartner local something walk nice mean. Option figure service. Enjoy begin dog whose west reality call government.
100	https://picsum.photos/576/177	2023-12-05 18:22:25.423	2023-12-05 18:22:25.423	100	Style event movement environmental. Name call early sit certainly visit.\nTurn field Congress Mr. Recently field note really item specific.
101	https://placekitten.com/177/729	2023-12-05 18:22:25.426	2023-12-05 18:22:25.426	101	Degree role on good size. Their major professional land loss group. Fine itself fear stop politics if happen garden. Nation help ago.
102	https://picsum.photos/618/932	2023-12-05 18:22:25.429	2023-12-05 18:22:25.429	102	Person against opportunity hundred moment every girl land. Our good bad analysis.\nAgain arrive phone.
103	https://picsum.photos/943/51	2023-12-05 18:22:25.431	2023-12-05 18:22:25.431	103	Hear model knowledge sport usually standard responsibility data.\nHair start wife have money word positive. See you hand represent direction better force. Leader contain simple read born technology.
104	https://placekitten.com/341/206	2023-12-05 18:22:25.433	2023-12-05 18:22:25.433	104	These company specific wait clear rise generation. Government may we sense property. Couple learn for church soldier.\nStore technology most action nothing group.
105	https://dummyimage.com/495x214	2023-12-05 18:22:25.435	2023-12-05 18:22:25.435	105	Current amount support. Yourself accept several plan college population.\nStay ever school gas two subject star. Candidate rise suggest rule down.
106	https://picsum.photos/490/565	2023-12-05 18:22:25.438	2023-12-05 18:22:25.438	106	Administration by debate lot machine situation reflect. A this little from character late.
107	https://picsum.photos/680/150	2023-12-05 18:22:25.439	2023-12-05 18:22:25.439	107	Someone clear think new vote. Use suffer south enjoy. Firm professional weight herself personal.
108	https://dummyimage.com/943x725	2023-12-05 18:22:25.441	2023-12-05 18:22:25.441	108	Air former discover far language. East clear study cold wonder debate color practice. True least per campaign.\nTeacher box once least. Provide seven return adult use.
109	https://placekitten.com/94/717	2023-12-05 18:22:25.442	2023-12-05 18:22:25.442	109	Population sell finish respond pay myself. Wait population push chair beautiful develop wife imagine.\nThink ago either nearly see. Administration education Republican interview particular in.
110	https://picsum.photos/265/95	2023-12-05 18:22:25.444	2023-12-05 18:22:25.444	110	Watch reflect visit fast rock. Car scientist why reach alone. Risk method food force west former.\nFinally international central successful. Beautiful some support laugh. Ability create management.
111	https://picsum.photos/738/811	2023-12-05 18:22:25.446	2023-12-05 18:22:25.446	111	Just play heart tend agency. Cause challenge apply world great act great rate.\nHouse cover side into above science message strategy. Prove against quality leg nothing need season.
112	https://picsum.photos/308/62	2023-12-05 18:22:25.447	2023-12-05 18:22:25.447	112	Rate while accept assume law class. Speak receive follow suggest woman third white society.\nNumber well evening all current find realize. Nor east challenge hospital create girl.
113	https://picsum.photos/541/158	2023-12-05 18:22:25.451	2023-12-05 18:22:25.451	113	Whom environment raise big. Determine book many billion thing.\nMore white budget majority pretty. Represent voice what try however. Themselves piece least paper as environment as.
114	https://dummyimage.com/643x770	2023-12-05 18:22:26.05	2023-12-05 18:22:26.05	114	Assume hand success home. Win teacher soon town. Career few moment case ball public move help.\nEffort point coach industry five democratic operation.
115	https://dummyimage.com/533x190	2023-12-05 18:22:26.054	2023-12-05 18:22:26.054	115	Catch set board thing. Reduce wish inside hit democratic lead.\nLeg film check new although process. Against chance ready point edge design.
116	https://dummyimage.com/847x626	2023-12-05 18:22:26.056	2023-12-05 18:22:26.056	116	Itself rise popular save. Yet dark quality call seat.\nThat throw policy two scientist usually. Get short small sometimes sing process sense. Across adult prevent effect.
117	https://placekitten.com/71/671	2023-12-05 18:22:26.059	2023-12-05 18:22:26.059	117	Manage send rest treatment per plant treatment. Than if minute piece machine.\nTrue budget watch rise strategy project whether. Training reflect ground huge interesting.
118	https://dummyimage.com/139x504	2023-12-05 18:22:26.062	2023-12-05 18:22:26.062	118	Someone article no likely time fish quickly. My expert few green eat participant. Station statement available.
119	https://picsum.photos/330/446	2023-12-05 18:22:26.065	2023-12-05 18:22:26.065	119	Force both look stand live pressure. When owner fine become true painting. Tell well moment man kind teach firm.
120	https://picsum.photos/554/81	2023-12-05 18:22:26.068	2023-12-05 18:22:26.068	120	Rise growth training beat. First east big make bring.\nTheory far property perform. Defense television example. Similar defense significant require.
121	https://picsum.photos/885/764	2023-12-05 18:22:26.07	2023-12-05 18:22:26.07	121	Chair finally together role energy become. Surface southern say Congress fish interest trouble tend.\nLeft hot meet very business show matter. Event chair statement pressure bar industry.
122	https://placekitten.com/958/276	2023-12-05 18:22:26.073	2023-12-05 18:22:26.073	122	Social future three bag car. Style central seven foreign common enter. Business crime alone brother truth.
123	https://placekitten.com/833/961	2023-12-05 18:22:26.075	2023-12-05 18:22:26.075	123	Become public story music century total. Sister local create against present affect. Six yes car minute defense person later.\nWorker paper or at message. Provide analysis another owner.
124	https://dummyimage.com/289x958	2023-12-05 18:22:26.078	2023-12-05 18:22:26.078	124	Drive parent win peace arrive continue since. I enjoy organization.\nStaff they firm one election after. Notice put both see sense occur grow. Necessary though bill travel.
125	https://dummyimage.com/519x577	2023-12-05 18:22:26.08	2023-12-05 18:22:26.08	125	Relate woman letter together it. Suggest lot serious look their than mission.
126	https://dummyimage.com/469x247	2023-12-05 18:22:26.082	2023-12-05 18:22:26.082	126	Common often address bar attention rate. Speak development yes threat.\nGo wear him war piece different. Interesting between necessary water. Keep four us capital term soldier you.
127	https://dummyimage.com/644x901	2023-12-05 18:22:26.084	2023-12-05 18:22:26.084	127	Year support choose scientist soon seem pattern respond. Happy blood reality hour ok.\nStation million evening also. Trial face value media value accept poor. While adult test two name.
128	https://picsum.photos/82/276	2023-12-05 18:22:26.086	2023-12-05 18:22:26.086	128	Dog grow history sport church situation serve. Operation apply weight believe page in great.\nThought cell figure available move fill add. Admit civil another event third step point.
129	https://placekitten.com/101/184	2023-12-05 18:22:26.092	2023-12-05 18:22:26.092	129	Group worker culture learn public fight image. Institution sister sing hotel go street foreign. No rule training responsibility idea middle lawyer. Service star he television.
130	https://picsum.photos/869/899	2023-12-05 18:22:26.616	2023-12-05 18:22:26.616	130	Throw table piece nor spring. Mouth dinner cultural heart trial contain. Thing perhaps certainly pretty.\nModel be brother away. Say great but pretty. Again always view later inside program special.
131	https://placekitten.com/447/141	2023-12-05 18:22:26.62	2023-12-05 18:22:26.62	131	In approach human then. Provide movie garden hand difficult cover. Act serious reveal threat.\nThose trouble space street. Happen page strong citizen follow. Or area join admit.
132	https://picsum.photos/545/397	2023-12-05 18:22:26.623	2023-12-05 18:22:26.623	132	Compare off score suddenly cultural. Yourself provide already important several space nice article.\nChurch but put if explain effort. Could glass lose goal everything bit reason. Wind fall next rise.
133	https://picsum.photos/516/528	2023-12-05 18:22:26.626	2023-12-05 18:22:26.626	133	Movie land all ball piece doctor.\nManagement up reflect party yourself huge hundred. Field here public rather recently.
134	https://picsum.photos/107/19	2023-12-05 18:22:26.629	2023-12-05 18:22:26.629	134	Arm discover although look ball population network option. Special expert mind wind.
135	https://dummyimage.com/872x141	2023-12-05 18:22:26.631	2023-12-05 18:22:26.631	135	Idea house right child anything dog. Either probably than bit.\nThrow total shoulder pattern situation worry among sign. Despite rich successful. Down interview unit street wind response wide.
136	https://dummyimage.com/487x989	2023-12-05 18:22:26.633	2023-12-05 18:22:26.633	136	We marriage recent create power. Notice able decade and interview old impact.\nSection measure food if question natural. Action particular soon section. Cut several many carry.
137	https://dummyimage.com/206x483	2023-12-05 18:22:26.635	2023-12-05 18:22:26.635	137	Product should man how standard employee best. Movement create since state she sure.
138	https://picsum.photos/892/135	2023-12-05 18:22:26.637	2023-12-05 18:22:26.637	138	Law feeling wear policy catch sometimes. Set under coach property.\nEvent pretty leave return stuff.
139	https://picsum.photos/669/155	2023-12-05 18:22:26.639	2023-12-05 18:22:26.639	139	Responsibility mouth would level. True need tax heavy recognize film such. Political country environment south your kitchen everything.\nHelp age public break. Analysis lawyer hope poor.
140	https://picsum.photos/221/693	2023-12-05 18:22:26.641	2023-12-05 18:22:26.641	140	Rich personal such true turn receive peace. Car begin purpose suffer collection. Perform why easy name.
141	https://placekitten.com/961/137	2023-12-05 18:22:26.644	2023-12-05 18:22:26.644	141	Even air seven continue result. Player station whole gun need house. Message worry federal land. Determine laugh especially know court.\nEarly card Congress low. Chance image like run.
142	https://dummyimage.com/889x943	2023-12-05 18:22:26.646	2023-12-05 18:22:26.646	142	Administration beyond reduce ever if third. Leader suggest key box base you. Floor property along record special today exactly.
143	https://dummyimage.com/786x317	2023-12-05 18:22:26.648	2023-12-05 18:22:26.648	143	Much control image tell happy author agree. Front claim when cultural check. Free after which tough social.\nAlways common blood especially force fine. Knowledge possible possible financial.
144	https://picsum.photos/592/837	2023-12-05 18:22:26.65	2023-12-05 18:22:26.65	144	College total information send tax tree learn. Her black effort staff worker red. Save avoid rich leg. Mention right necessary pattern.
145	https://picsum.photos/20/227	2023-12-05 18:22:26.654	2023-12-05 18:22:26.654	145	Suddenly whose young without with whose. Money just instead north. Experience begin interesting risk environment page seem. Along minute late artist security my.
146	https://dummyimage.com/775x681	2023-12-05 18:22:27.386	2023-12-05 18:22:27.386	146	Vote arrive senior according become hand start final.\nHuge share hope news however relationship. Assume resource every night.\nProduction sister each law animal feeling leader.
147	https://picsum.photos/14/145	2023-12-05 18:22:27.389	2023-12-05 18:22:27.389	147	List crime movement. Cover prove science deal lawyer chance road. Drug three gun clearly feeling.
148	https://placekitten.com/702/634	2023-12-05 18:22:27.393	2023-12-05 18:22:27.393	148	Impact writer cold he purpose later.\nScience ready my white remember. Civil no citizen dark.\nInterest likely plan. Around oil similar easy current social success.
149	https://picsum.photos/880/837	2023-12-05 18:22:27.396	2023-12-05 18:22:27.396	149	About sit sit price. Blue design lawyer education various.\nRelationship short certain blue campaign politics concern. Authority land rich argue appear.
150	https://dummyimage.com/413x1011	2023-12-05 18:22:27.398	2023-12-05 18:22:27.398	150	House positive foot main. Already stuff focus law throw positive.\nTerm weight benefit choose suggest suggest. Third everything tell century. Scene significant television authority bring nature town.
151	https://placekitten.com/904/832	2023-12-05 18:22:27.4	2023-12-05 18:22:27.4	151	Nothing he nothing dark include. Each hot middle society carry important. Can manager guess assume.
152	https://picsum.photos/562/325	2023-12-05 18:22:27.403	2023-12-05 18:22:27.403	152	Note loss purpose year. Trouble center provide mother. Beyond bag improve owner local director.\nTown use baby look call Mrs clearly natural. Agreement establish senior.
153	https://placekitten.com/230/957	2023-12-05 18:22:27.405	2023-12-05 18:22:27.405	153	Husband they court let budget major. Side talk one federal myself home.\nServe girl reason. Born media tell somebody cell friend wall player.
154	https://dummyimage.com/772x827	2023-12-05 18:22:27.407	2023-12-05 18:22:27.407	154	Simply radio real management stage lay. Ok let entire rate there can imagine lose.
155	https://placekitten.com/546/924	2023-12-05 18:22:27.41	2023-12-05 18:22:27.41	155	Rise meet democratic center deep point stop. Forward gun course life friend suddenly land guess.\nCandidate study first face. Owner cup either last.
156	https://picsum.photos/40/446	2023-12-05 18:22:27.413	2023-12-05 18:22:27.413	156	Seem network identify walk. Side foot without.\nDemocratic four century happy rich film weight. Necessary billion always production value find. Nature capital staff chair.
157	https://dummyimage.com/610x165	2023-12-05 18:22:27.415	2023-12-05 18:22:27.415	157	Political hair prepare affect former. Between blue car explain. Say clear each letter hair issue force.
158	https://placekitten.com/686/563	2023-12-05 18:22:27.417	2023-12-05 18:22:27.417	158	Several always onto future unit trial middle usually. Traditional son fund radio until free letter attention.
159	https://placekitten.com/580/662	2023-12-05 18:22:27.418	2023-12-05 18:22:27.418	159	Key bring someone environment window ever listen. Right economy cultural often. Second on attorney member five.\nCheck hour service within here war after.
160	https://dummyimage.com/364x1018	2023-12-05 18:22:27.42	2023-12-05 18:22:27.42	160	Cup charge machine wife especially look. If push knowledge perhaps bad. Song question eye international.
161	https://dummyimage.com/409x598	2023-12-05 18:22:27.424	2023-12-05 18:22:27.424	161	Line method state head produce place easy consumer. Anyone according tell strategy get ready whole.\nTree citizen issue state gun. Control eight director environment fund you play.
162	https://picsum.photos/776/92	2023-12-05 18:22:27.947	2023-12-05 18:22:27.947	162	Something mother reveal image growth simple. Investment meeting right each outside from learn.\nFind we because natural investment lot. Fly red section nor usually ask.
163	https://dummyimage.com/146x655	2023-12-05 18:22:27.953	2023-12-05 18:22:27.953	163	White describe son kitchen heart report. Budget light long religious know.\nFeeling couple west everything now.
164	https://placekitten.com/607/520	2023-12-05 18:22:27.956	2023-12-05 18:22:27.956	164	Area expect someone. Civil college scene cut worry affect research. Sing enter owner audience court.\nCitizen again relate dream. Just manage cost. Marriage star movie ok dream sister network.
165	https://placekitten.com/380/987	2023-12-05 18:22:27.959	2023-12-05 18:22:27.959	165	Interest avoid meeting conference place science. Impact score turn perhaps detail computer. Local hope hope painting phone wide.\nReceive southern piece he cut. Himself seat dream authority.
166	https://placekitten.com/681/424	2023-12-05 18:22:27.961	2023-12-05 18:22:27.961	166	Focus front positive learn long society inside. Style cup success population trouble. Old her those rise throughout beyond through information.
167	https://picsum.photos/179/971	2023-12-05 18:22:27.964	2023-12-05 18:22:27.964	167	Prevent manage like military individual. Tonight difficult provide sort explain possible month. Watch popular responsibility sister pick campaign project.
168	https://picsum.photos/489/964	2023-12-05 18:22:27.967	2023-12-05 18:22:27.967	168	Thus drop single view course dark. Change case believe you audience.\nServe state idea method. Easy as much social line sister.\nRegion wait most suggest. Appear occur plant join.
169	https://dummyimage.com/439x439	2023-12-05 18:22:27.969	2023-12-05 18:22:27.969	169	Story when better new claim. Case simple fast form you early staff. Team ask research soon ask.\nPerson scene operation. Road in between discussion.\nLeg raise every blue.
170	https://dummyimage.com/956x511	2023-12-05 18:22:27.97	2023-12-05 18:22:27.97	170	Stop hospital central wrong rather their themselves. Not his although energy.\nCan body stuff major. Hold finally political loss another subject.
171	https://dummyimage.com/40x852	2023-12-05 18:22:27.972	2023-12-05 18:22:27.972	171	More same cause exactly pattern. Collection quickly along. Modern could three study.\nPhysical other believe approach see build. Citizen other light son. And message staff computer.
172	https://picsum.photos/760/9	2023-12-05 18:22:27.974	2023-12-05 18:22:27.974	172	Member heavy memory agency.\nProbably turn church world plant place fire. Father doctor yes gun trip guy probably. Where industry couple list short something.\nRisk cover throughout sing carry.
173	https://picsum.photos/335/609	2023-12-05 18:22:27.976	2023-12-05 18:22:27.976	173	Include able front expert certainly. Much street than himself night near.\nFinally way which. And every news so.\nVery tend church money behavior continue. Cell key walk technology man.
174	https://placekitten.com/673/135	2023-12-05 18:22:27.978	2023-12-05 18:22:27.978	174	American product ever world blue nice everyone.\nProfessor he into especially.\nWe attorney respond weight.
175	https://placekitten.com/41/995	2023-12-05 18:22:27.98	2023-12-05 18:22:27.98	175	Law look likely young world. Contain east from once more.\nJust establish matter have. Economy issue base.
176	https://picsum.photos/526/702	2023-12-05 18:22:27.981	2023-12-05 18:22:27.981	176	Human although sure eight common. Rate thousand start.\nNote organization customer I pattern subject. Within me respond stand pretty remember. Ball child style crime course according skill that.
177	https://dummyimage.com/184x373	2023-12-05 18:22:27.987	2023-12-05 18:22:27.987	177	Special month fear tonight. Police risk meet fire age.
178	https://placekitten.com/524/939	2023-12-05 18:22:29.527	2023-12-05 18:22:29.527	178	Around work early lawyer. Meeting argue support road then per. For knowledge report health.\nMeasure marriage body leave grow candidate whose. Blood avoid go.
179	https://picsum.photos/752/984	2023-12-05 18:22:29.531	2023-12-05 18:22:29.531	179	Big detail run particularly PM indeed. Smile himself friend drive strategy whether director.\nReally friend article. Boy center something close story policy. Kitchen trip spring. Foot or task more.
180	https://placekitten.com/989/841	2023-12-05 18:22:29.535	2023-12-05 18:22:29.535	180	Have Congress challenge imagine pay. Energy forget take man stock.\nJust democratic return leg. You analysis thing reveal tend.
181	https://placekitten.com/152/478	2023-12-05 18:22:29.537	2023-12-05 18:22:29.537	181	Bed name food focus we away dream. Former defense four practice. Lot whom feel turn anything then game.
182	https://picsum.photos/256/509	2023-12-05 18:22:29.54	2023-12-05 18:22:29.54	182	Prevent information left form year over development six. Environment various than assume about high probably.\nHouse many each care. West report partner loss. Nearly upon happy.
183	https://dummyimage.com/330x954	2023-12-05 18:22:29.542	2023-12-05 18:22:29.542	183	Decision continue deep hair better industry tell manage. Message against could style little second. Character trial relate though end.
184	https://picsum.photos/831/240	2023-12-05 18:22:29.544	2023-12-05 18:22:29.544	184	Dog technology resource job yes. Important quite weight yet practice world. Evidence measure so treat.\nProcess discussion company security. Leave report church whatever position center head.
185	https://dummyimage.com/754x373	2023-12-05 18:22:29.546	2023-12-05 18:22:29.546	185	Be night interesting. Leg night represent. Treat response ball plan eight employee.\nPower seem receive seek. Lot she after southern.
186	https://dummyimage.com/194x725	2023-12-05 18:22:29.548	2023-12-05 18:22:29.548	186	Computer buy voice determine financial idea. Unit miss order paper find. Available first teacher capital consider.
187	https://placekitten.com/799/225	2023-12-05 18:22:29.55	2023-12-05 18:22:29.55	187	Car accept his even with. Relationship church coach language resource some.
188	https://picsum.photos/47/417	2023-12-05 18:22:29.551	2023-12-05 18:22:29.551	188	Large pull color per. Position skill discover concern. Model major item we seek perhaps.\nFull stand southern whatever serve vote home. Democrat wind grow. Voice girl board case wall.
189	https://placekitten.com/602/123	2023-12-05 18:22:29.553	2023-12-05 18:22:29.553	189	Instead kid major major several toward win. Treatment price real including use sport. Late their major bill another accept few.
190	https://dummyimage.com/903x308	2023-12-05 18:22:29.554	2023-12-05 18:22:29.554	190	South nearly support office where write stand. Itself others wonder third professional I instead court.\nReach pretty necessary heart agreement rather under. Language join drive too any worry happy.
191	https://placekitten.com/560/219	2023-12-05 18:22:29.556	2023-12-05 18:22:29.556	191	Sound despite gas PM school. Nature kind dog likely contain position happen.\nRise future environmental. Something try between opportunity after learn throw. Follow moment usually that.
192	https://dummyimage.com/70x247	2023-12-05 18:22:29.557	2023-12-05 18:22:29.557	192	Tonight determine side enter scientist evening because skin. Three old art onto operation. Fall key message purpose test book attorney.\nKnowledge present tax reduce. Family miss sometimes.
193	https://dummyimage.com/386x150	2023-12-05 18:22:29.562	2023-12-05 18:22:29.562	193	Media though nation expert send. Full yourself feeling far situation cold wait. Ten plan over stand election discussion treatment.
194	https://picsum.photos/155/905	2023-12-05 18:22:30.127	2023-12-05 18:22:30.127	194	Especially method for happy base leave. Nature house word art parent group prove. Natural tough send reality significant eight industry.
195	https://dummyimage.com/341x748	2023-12-05 18:22:30.131	2023-12-05 18:22:30.131	195	Cell we eye difficult pick note she. Move parent cost who guy money feeling program. Add hospital letter building possible.
196	https://dummyimage.com/551x301	2023-12-05 18:22:30.134	2023-12-05 18:22:30.134	196	Off research administration put amount dog. Series example organization vote world director. Especially new cup. Process campaign raise maintain camera bag fly.
197	https://placekitten.com/40/953	2023-12-05 18:22:30.137	2023-12-05 18:22:30.137	197	Country ground important last deep state risk. Team economy other now control point western. Serve whose population budget stuff above not.
198	https://picsum.photos/833/901	2023-12-05 18:22:30.139	2023-12-05 18:22:30.139	198	Agreement key onto total. Too sometimes try require draw employee with. View sport drop offer body somebody. Wish always return get from teach dark then.
199	https://dummyimage.com/54x453	2023-12-05 18:22:30.141	2023-12-05 18:22:30.141	199	Manager during hotel night. Of trouble country. Treatment professor tend bit shake.\nPerform around teacher her for until million same. Lot large live system drug. Under value something call strategy.
200	https://placekitten.com/406/376	2023-12-05 18:22:30.144	2023-12-05 18:22:30.144	200	Miss management along Republican. Mouth seek fight society product. Third pressure rise raise.
201	https://placekitten.com/291/802	2023-12-05 18:22:30.146	2023-12-05 18:22:30.146	201	Tough through necessary itself.\nEnough happy paper child red provide relate. Stay material voice she though.
202	https://dummyimage.com/353x568	2023-12-05 18:22:30.148	2023-12-05 18:22:30.148	202	Interest very later system lawyer into believe mouth. Every someone serve than positive. Bad particular late research moment.
203	https://dummyimage.com/410x823	2023-12-05 18:22:30.15	2023-12-05 18:22:30.15	203	Republican near street from boy. Girl new newspaper popular entire happen boy act.\nInside such ask necessary any try. During rule hold meeting.
204	https://dummyimage.com/190x185	2023-12-05 18:22:30.152	2023-12-05 18:22:30.152	204	Use company chair already color point. Defense safe former them develop.\nBall until voice yes keep. Newspaper growth two. Maybe big visit pull about.
205	https://placekitten.com/257/775	2023-12-05 18:22:30.153	2023-12-05 18:22:30.153	205	Whether another as cover.\nKnow structure base. Gas draw write food weight on.\nPurpose day require employee. Drive lose city too tell wide economic bill. Your after street fund fear.
206	https://placekitten.com/575/610	2023-12-05 18:22:30.155	2023-12-05 18:22:30.155	206	Condition bar firm policy list short amount. Guess career production husband.\nDevelopment effort anything option front. Skin sell care arm final conference.
207	https://placekitten.com/358/1016	2023-12-05 18:22:30.156	2023-12-05 18:22:30.156	207	Down friend audience provide network art support. Example step evening seem career piece performance.\nSeven middle challenge dinner person hold.
208	https://picsum.photos/960/746	2023-12-05 18:22:30.158	2023-12-05 18:22:30.158	208	Make decade structure couple sign environmental. Reach civil answer although.\nMore go how rich machine through claim. Future everything chair. Suggest upon stop significant meet.
209	https://placekitten.com/870/359	2023-12-05 18:22:30.163	2023-12-05 18:22:30.163	209	Contain cold politics option region practice live official. Plant get here nice large also up.\nDirector stand pick billion body either. Budget field foot. Gun start type learn none.
210	https://placekitten.com/212/438	2023-12-05 18:22:30.723	2023-12-05 18:22:30.723	210	Manager consider sing seven likely can. Type cell finally dinner.\nCommunity town growth certain agency message result score. Relationship home suffer TV specific star.
211	https://placekitten.com/860/346	2023-12-05 18:22:30.727	2023-12-05 18:22:30.727	211	Authority miss party plan let just few. Must reflect have major culture activity.
212	https://dummyimage.com/575x655	2023-12-05 18:22:30.73	2023-12-05 18:22:30.73	212	Whether represent none relate serve almost notice. Everything lot wrong onto current what. Technology third six strong.
213	https://placekitten.com/531/998	2023-12-05 18:22:30.733	2023-12-05 18:22:30.733	213	Drug question hear often let finally. Debate base apply plan. World century research court remember.\nMove service painting enter else.
214	https://dummyimage.com/663x919	2023-12-05 18:22:30.735	2023-12-05 18:22:30.735	214	Month heavy effort rule Congress. Cultural since example stuff movie me real. Land church build media seat.
215	https://placekitten.com/426/858	2023-12-05 18:22:30.739	2023-12-05 18:22:30.739	215	Produce different somebody. Art second job. Tax voice those read.\nWhich kitchen significant pull. Explain treatment economy eye so tend. Strategy hair source effort edge religious.
216	https://dummyimage.com/73x57	2023-12-05 18:22:30.741	2023-12-05 18:22:30.741	216	Debate site chance experience poor. Conference toward feeling somebody realize central rock.\nSeveral science much often close itself TV bank. Summer go talk through your affect write.
217	https://placekitten.com/539/965	2023-12-05 18:22:30.743	2023-12-05 18:22:30.743	217	Party outside allow physical respond. World author south south own then man. Social customer million structure scene unit father word.
218	https://dummyimage.com/403x221	2023-12-05 18:22:30.745	2023-12-05 18:22:30.745	218	Better these campaign happy. Experience physical young better. Court detail send.\nTraditional plant full put. Talk open commercial than seek list gas.
219	https://dummyimage.com/357x959	2023-12-05 18:22:30.746	2023-12-05 18:22:30.746	219	Finally tend hit choose upon recent certain. Clearly produce pressure. Record plan throw shoulder institution behind.
220	https://dummyimage.com/959x482	2023-12-05 18:22:30.748	2023-12-05 18:22:30.748	220	Trip population hope ago care training argue political. Enter loss heart company forward green. Wall town choose me.
221	https://picsum.photos/130/327	2023-12-05 18:22:30.75	2023-12-05 18:22:30.75	221	Important if necessary leader. Police enough information friend campaign idea strong.
222	https://picsum.photos/478/801	2023-12-05 18:22:30.751	2023-12-05 18:22:30.751	222	Report situation sure. Feel process miss become admit. Accept hope significant something green.\nExample dinner phone man my. Plant choice people ten guess.
223	https://placekitten.com/137/13	2023-12-05 18:22:30.753	2023-12-05 18:22:30.753	223	Answer month baby often tree seven nature. Mission environmental including have fall animal morning. Manager start not over step next just.
224	https://picsum.photos/379/373	2023-12-05 18:22:30.755	2023-12-05 18:22:30.755	224	Country line themselves various wish eye. Huge save arm likely at investment. Exist it minute throw.\nTen management interest rock maybe let. Rock agree agreement trouble movie.
225	https://placekitten.com/983/120	2023-12-05 18:22:30.759	2023-12-05 18:22:30.759	225	Hear consider successful must successful the five. None authority indeed particularly recently. Tv threat note blue front. World enter mission change one.
226	https://placekitten.com/852/399	2023-12-05 18:22:31.347	2023-12-05 18:22:31.347	226	Where foreign couple cultural old right room admit.\nWish training population close we southern politics. Practice affect full add kid manager. Scene show story whether ask any.
227	https://dummyimage.com/757x388	2023-12-05 18:22:31.35	2023-12-05 18:22:31.35	227	Join or business particular water system loss.\nOffer item really up. Second maybe law debate will call. Political culture southern none smile.
228	https://picsum.photos/963/795	2023-12-05 18:22:31.354	2023-12-05 18:22:31.354	228	Church head discover window right. Let respond performance whose through less interest.
229	https://dummyimage.com/1001x95	2023-12-05 18:22:31.357	2023-12-05 18:22:31.357	229	Apply decide nor become leave prove happy.\nThemselves moment health land population. According main upon easy street type.
230	https://dummyimage.com/868x740	2023-12-05 18:22:31.359	2023-12-05 18:22:31.359	230	Home analysis source fly popular. Than eye start exactly only expect.\nTalk one ability. Animal plan resource soldier not. Different amount development hold speech present week.
231	https://placekitten.com/531/246	2023-12-05 18:22:31.361	2023-12-05 18:22:31.361	231	Fund against feeling sort effort. Matter phone design report board open everyone. Present one be maybe soldier beyond.
232	https://picsum.photos/547/822	2023-12-05 18:22:31.363	2023-12-05 18:22:31.363	232	Most himself machine hundred. Sell tell month might prepare head green. Particularly past race a until particularly democratic. Write central game nation market toward.
233	https://picsum.photos/19/900	2023-12-05 18:22:31.365	2023-12-05 18:22:31.365	233	Question modern pattern national air. Both onto operation product peace glass throughout operation. Project blood significant player spend reach group.
234	https://placekitten.com/691/792	2023-12-05 18:22:31.366	2023-12-05 18:22:31.366	234	Sometimes court its game design eat window. Region officer evidence land.\nPerformance bill institution her bill explain affect. Race could should out watch.
235	https://picsum.photos/969/152	2023-12-05 18:22:31.368	2023-12-05 18:22:31.368	235	Mother statement question cell exactly sound although hot. Option question quite task also leave air. Always early section current.
236	https://picsum.photos/361/868	2023-12-05 18:22:31.369	2023-12-05 18:22:31.369	236	Ready away east young employee. Born trade system music environment. What individual benefit finally so anyone now.\nIncluding teach nice. Offer century vote head first building rest.
237	https://placekitten.com/410/458	2023-12-05 18:22:31.371	2023-12-05 18:22:31.371	237	Between film politics her. Article herself from fill.\nTrade boy you knowledge against ten modern. Per him kind drive glass high.
238	https://placekitten.com/356/446	2023-12-05 18:22:31.373	2023-12-05 18:22:31.373	238	Affect ability herself candidate. Soon forget direction term popular analysis realize thank. Serve reveal TV.
239	https://placekitten.com/105/399	2023-12-05 18:22:31.375	2023-12-05 18:22:31.375	239	Level food law true investment. Authority exist employee herself half. Safe where personal good always.
240	https://placekitten.com/879/790	2023-12-05 18:22:31.376	2023-12-05 18:22:31.376	240	View policy idea seven change than. Natural nation approach husband performance.\nRemain available itself TV last.
241	https://picsum.photos/564/601	2023-12-05 18:22:31.381	2023-12-05 18:22:31.381	241	Try spend man road high much. Entire goal community room think experience send. Full seven loss night option local.\nFactor sense agree budget. Seat individual respond read think wonder.
242	https://dummyimage.com/198x158	2023-12-05 18:22:32.224	2023-12-05 18:22:32.224	242	Feeling Republican process year share. Almost pull class everybody tax office. Compare free where local such area.\nFind need these consumer form agree. Situation power our agent.
243	https://placekitten.com/504/76	2023-12-05 18:22:32.228	2023-12-05 18:22:32.228	243	Raise on size statement at. Policy speak safe college possible. Sure top beyond few.\nAhead hold environmental to direction. Different few available ago four who parent.
244	https://placekitten.com/524/450	2023-12-05 18:22:32.231	2023-12-05 18:22:32.231	244	Image door better gas. Budget herself evening.\nTwo brother student ask. Responsibility method successful.
245	https://dummyimage.com/117x831	2023-12-05 18:22:32.233	2023-12-05 18:22:32.233	245	Part better these include research rather.\nUpon young natural picture news. Include many body media. Any item program state democratic.
246	https://dummyimage.com/113x886	2023-12-05 18:22:32.237	2023-12-05 18:22:32.237	246	Apply that Mr live need. Family player responsibility health total animal pull. Economy order foot owner if. Occur per world rise economic why six.
247	https://placekitten.com/499/524	2023-12-05 18:22:32.24	2023-12-05 18:22:32.24	247	Something price goal. Shake level boy market my positive doctor fast. Right keep threat property low nature.
248	https://placekitten.com/316/482	2023-12-05 18:22:32.243	2023-12-05 18:22:32.243	248	Citizen effort cost truth them age matter that. State reality magazine. Government million TV front ask statement grow.\nLoss car ten agency without near. Attention value explain yourself environment.
249	https://dummyimage.com/373x966	2023-12-05 18:22:32.245	2023-12-05 18:22:32.245	249	Another way religious idea set contain. Suggest focus room. Total score clear.\nHim clear its letter ahead. Crime weight open sense Republican necessary. Popular modern there serious.
250	https://placekitten.com/262/998	2023-12-05 18:22:32.247	2023-12-05 18:22:32.247	250	Red risk third think ever talk hope. Himself include control week lawyer life. Attorney reality as year.
251	https://placekitten.com/390/409	2023-12-05 18:22:32.25	2023-12-05 18:22:32.25	251	Weight culture kind lot. Language campaign specific top.\nFar agent reality second physical. Task thank its peace.
252	https://picsum.photos/709/569	2023-12-05 18:22:32.252	2023-12-05 18:22:32.252	252	Knowledge every identify method why attorney soldier attorney. Increase long drug full risk feeling. Hair begin traditional.
253	https://dummyimage.com/993x522	2023-12-05 18:22:32.254	2023-12-05 18:22:32.254	253	Full read chair everyone ball candidate general step. Ready environmental view into. Bit before thus scientist item.\nEnvironment establish particularly movement personal up early.
254	https://placekitten.com/263/41	2023-12-05 18:22:32.256	2023-12-05 18:22:32.256	254	Record test education condition. Building hundred how professor political decide wife. Data report reality debate middle area ability.
255	https://placekitten.com/887/283	2023-12-05 18:22:32.257	2023-12-05 18:22:32.257	255	Most maybe foreign science change direction.\nMethod edge popular head open decide. Project professor strong decision health front ground bill. Marriage answer myself most employee large boy series.
256	https://dummyimage.com/68x478	2023-12-05 18:22:32.259	2023-12-05 18:22:32.259	256	Crime character ok worker understand professional. Item significant hold hold although. Nor certain animal whether play.
257	https://placekitten.com/669/99	2023-12-05 18:22:32.263	2023-12-05 18:22:32.263	257	Ask work tree try road movie sort measure. Discussion partner get I Democrat large. Tell leader stand of bar picture.
258	https://placekitten.com/222/735	2023-12-05 18:22:32.918	2023-12-05 18:22:32.918	258	Rich say consumer explain song focus. Bed strategy may spend behavior though huge. Either central whom unit start same determine.\nWork trip kid father other loss. Article notice suddenly two process.
259	https://placekitten.com/11/843	2023-12-05 18:22:32.922	2023-12-05 18:22:32.922	259	Address less have begin modern. Song bad send agreement score. Ready vote focus more huge system.
260	https://placekitten.com/278/139	2023-12-05 18:22:32.924	2023-12-05 18:22:32.924	260	Together evening subject his wall present. Real tend reveal consider. Certainly Mr you however of. Little society view card market age.
261	https://placekitten.com/162/224	2023-12-05 18:22:32.927	2023-12-05 18:22:32.927	261	Include college already note. Speech beyond recent expect source.\nResource claim arrive parent create minute. Imagine skill policy different door. Kid both create want.
262	https://placekitten.com/532/500	2023-12-05 18:22:32.929	2023-12-05 18:22:32.929	262	Government dinner four feeling west edge far section. Same may theory threat house. Their require focus.
263	https://placekitten.com/535/859	2023-12-05 18:22:32.932	2023-12-05 18:22:32.932	263	Small none them wind.\nDecade much pretty seem.\nRoad in none without event maybe. Fight nothing quality when. Maintain together it keep.\nSame crime base. Final process black skin fine as machine.
264	https://dummyimage.com/927x878	2023-12-05 18:22:32.934	2023-12-05 18:22:32.934	264	Executive usually interesting generation statement two. Like think why piece name nearly. Develop price stay.\nNot heart outside provide north must. Top American rock age. Sign total agree make lay.
265	https://dummyimage.com/215x353	2023-12-05 18:22:32.937	2023-12-05 18:22:32.937	265	Quickly necessary wall still. Trip high hour ahead speech seem recently.\nProgram military soon should soon see letter. Be scene nice sense sure eight. Program guy side tax start Republican animal.
266	https://placekitten.com/910/98	2023-12-05 18:22:32.94	2023-12-05 18:22:32.94	266	Claim live own kind. Threat become man notice team well adult. Series happen change product have whatever successful.
267	https://picsum.photos/719/149	2023-12-05 18:22:32.942	2023-12-05 18:22:32.942	267	Upon bank law. Statement relate form like four attorney.\nExample field feel nothing floor miss. Into ready chance station space wide expert. Low radio bit total foreign body.
268	https://placekitten.com/505/200	2023-12-05 18:22:32.944	2023-12-05 18:22:32.944	268	No main political. Pull imagine outside sign structure attention. Speech mission business security.\nHot movement option take quality local myself clearly. Eight if traditional test wear.
269	https://picsum.photos/557/295	2023-12-05 18:22:32.945	2023-12-05 18:22:32.945	269	Quite sea dog forget management stock land. Their body conference discussion card participant.
270	https://picsum.photos/816/965	2023-12-05 18:22:32.947	2023-12-05 18:22:32.947	270	Social clear say improve page and paper. Cultural serve can than.\nOfficer perform artist man war site. Whatever everyone effect now speak old federal why. Exist campaign truth.
271	https://picsum.photos/83/381	2023-12-05 18:22:32.949	2023-12-05 18:22:32.949	271	Citizen how town surface. You apply few person data.\nDescribe generation buy member. Agree eight also occur term.
272	https://picsum.photos/817/237	2023-12-05 18:22:32.951	2023-12-05 18:22:32.951	272	Word professor fire. South just image people. Pattern war capital way.\nHow deal travel thing others once. Case couple age. Lawyer pick trial rise life general fear animal.
273	https://placekitten.com/543/861	2023-12-05 18:22:32.955	2023-12-05 18:22:32.955	273	World staff year thing many compare. Sense thought front believe wind western hour movement. Most anything candidate head risk on subject shoulder.
\.


--
-- Data for Name: RoomMembership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."RoomMembership" (id, role, "userId", "roomId", state, "unmuteTime", read) FROM stdin;
1	MEMBER	16	1	ACTIVE	\N	f
2	MEMBER	17	1	ACTIVE	\N	f
3	MEMBER	16	2	ACTIVE	\N	f
4	MEMBER	17	2	ACTIVE	\N	f
5	MEMBER	32	3	ACTIVE	\N	f
6	MEMBER	33	3	ACTIVE	\N	f
7	MEMBER	32	4	ACTIVE	\N	f
8	MEMBER	33	4	ACTIVE	\N	f
9	MEMBER	48	5	ACTIVE	\N	f
10	MEMBER	49	5	ACTIVE	\N	f
11	MEMBER	48	6	ACTIVE	\N	f
12	MEMBER	49	6	ACTIVE	\N	f
13	MEMBER	64	7	ACTIVE	\N	f
14	MEMBER	65	7	ACTIVE	\N	f
15	MEMBER	64	8	ACTIVE	\N	f
16	MEMBER	65	8	ACTIVE	\N	f
17	MEMBER	80	9	ACTIVE	\N	f
18	MEMBER	81	9	ACTIVE	\N	f
19	MEMBER	80	10	ACTIVE	\N	f
20	MEMBER	81	10	ACTIVE	\N	f
21	MEMBER	96	11	ACTIVE	\N	f
22	MEMBER	97	11	ACTIVE	\N	f
23	MEMBER	96	12	ACTIVE	\N	f
24	MEMBER	97	12	ACTIVE	\N	f
25	MEMBER	112	13	ACTIVE	\N	f
26	MEMBER	113	13	ACTIVE	\N	f
27	MEMBER	112	14	ACTIVE	\N	f
28	MEMBER	113	14	ACTIVE	\N	f
29	MEMBER	128	15	ACTIVE	\N	f
30	MEMBER	129	15	ACTIVE	\N	f
31	MEMBER	128	16	ACTIVE	\N	f
32	MEMBER	129	16	ACTIVE	\N	f
33	MEMBER	144	17	ACTIVE	\N	f
34	MEMBER	145	17	ACTIVE	\N	f
35	MEMBER	144	18	ACTIVE	\N	f
36	MEMBER	145	18	ACTIVE	\N	f
37	MEMBER	160	19	ACTIVE	\N	f
38	MEMBER	161	19	ACTIVE	\N	f
39	MEMBER	160	20	ACTIVE	\N	f
40	MEMBER	161	20	ACTIVE	\N	f
41	MEMBER	176	21	ACTIVE	\N	f
42	MEMBER	177	21	ACTIVE	\N	f
43	MEMBER	176	22	ACTIVE	\N	f
44	MEMBER	177	22	ACTIVE	\N	f
45	MEMBER	192	23	ACTIVE	\N	f
46	MEMBER	193	23	ACTIVE	\N	f
47	MEMBER	192	24	ACTIVE	\N	f
48	MEMBER	193	24	ACTIVE	\N	f
49	MEMBER	208	25	ACTIVE	\N	f
50	MEMBER	209	25	ACTIVE	\N	f
51	MEMBER	208	26	ACTIVE	\N	f
52	MEMBER	209	26	ACTIVE	\N	f
53	MEMBER	224	27	ACTIVE	\N	f
54	MEMBER	225	27	ACTIVE	\N	f
55	MEMBER	224	28	ACTIVE	\N	f
56	MEMBER	225	28	ACTIVE	\N	f
57	MEMBER	240	29	ACTIVE	\N	f
58	MEMBER	241	29	ACTIVE	\N	f
59	MEMBER	240	30	ACTIVE	\N	f
60	MEMBER	241	30	ACTIVE	\N	f
61	MEMBER	256	31	ACTIVE	\N	f
62	MEMBER	257	31	ACTIVE	\N	f
63	MEMBER	256	32	ACTIVE	\N	f
64	MEMBER	257	32	ACTIVE	\N	f
65	MEMBER	272	33	ACTIVE	\N	f
66	MEMBER	273	33	ACTIVE	\N	f
67	MEMBER	272	34	ACTIVE	\N	f
68	MEMBER	273	34	ACTIVE	\N	f
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."User" (id, email, intraid, "twoFactorSecret", "googleId", "createdAt", password, status, "twoFactor", "updatedAt", accuracy, consitency, reflex, "winRate", experience, "gamePoints", level, rank, username, "gameInvitesSent") FROM stdin;
1	redamine9@gmail.com	\N	\N	100773903402281679341	2023-12-05 17:05:47.181	\N	ONLINE	f	2023-12-05 17:05:47.181	0	0	0	0	0	0	0	UNRANKED	Amine Reda	0
2	chris41@example.com	\N	C!%1UGe7dg	\N	2023-12-05 18:22:20.139	(NCJ*IqpJ1	OFFLINE	t	2023-12-05 18:22:20.139	3.72	40.07	28.26	24.58	517	520	59	SILVER	carol87	0
3	elizabethjensen@example.org	\N	ge6BjFAz1+	\N	2023-12-05 18:22:20.236	4xhS6K^v+_	ONLINE	f	2023-12-05 18:22:20.236	64.41	56.26	63.78	66.87	806	2140	87	BRONZE	dhart	0
4	nicole51@example.com	\N	!_Yd2Soz$H	\N	2023-12-05 18:22:20.238	1GBElww2$j	ONLINE	t	2023-12-05 18:22:20.238	93.94	48.63	65.14	3.15	593	4894	83	SILVER	christineruiz	0
5	lauren52@example.org	\N	&7s28Uk4*U	\N	2023-12-05 18:22:20.24	@g0Hpj7j_R	INGAME	f	2023-12-05 18:22:20.24	90.34	17.61	22.06	48.55	464	2557	51	SILVER	albert64	0
6	uharvey@example.net	\N	ao5PlLTmj@	\N	2023-12-05 18:22:20.242	)T$A^rDp&0	INGAME	f	2023-12-05 18:22:20.242	76.76	73.24	22.68	11.3	872	866	25	GOLD	elee	0
7	jhawkins@example.com	\N	37T9Ctw9%+	\N	2023-12-05 18:22:20.244	*4Y3ugF&)1	OFFLINE	f	2023-12-05 18:22:20.244	56.28	87.7	80.85	56.09	637	519	4	UNRANKED	wadebenjamin	0
8	zacharykim@example.com	\N	)5KXdIwDZh	\N	2023-12-05 18:22:20.246	8OW)Rsuq+A	OFFLINE	f	2023-12-05 18:22:20.246	51.8	94.95	10.3	72.32	152	2152	72	SILVER	sarnold	0
9	westannette@example.org	\N	8!w32Wr9Q4	\N	2023-12-05 18:22:20.248	E#k5Y6pdjD	ONLINE	t	2023-12-05 18:22:20.248	74.23	92.01	35.29	78.73	573	2995	21	UNRANKED	dsmith	0
10	hannahbrown@example.org	\N	^nb$LyzI&4	\N	2023-12-05 18:22:20.25	#p$u3)We92	OFFLINE	t	2023-12-05 18:22:20.25	42.63	58.26	25.19	18.54	32	3361	7	BRONZE	thomasdan	0
11	hawkinsvictoria@example.com	\N	Em%U2LvZqT	\N	2023-12-05 18:22:20.252	0c6QUyu^(i	OFFLINE	f	2023-12-05 18:22:20.252	29.82	9.79	54.13	38.13	443	3654	86	UNRANKED	amanda58	0
12	yknapp@example.net	\N	ywgi7H_i+4	\N	2023-12-05 18:22:20.254	R739Jweo+)	INGAME	t	2023-12-05 18:22:20.254	38.95	84.96	46.42	81.29	370	1498	18	BRONZE	davidmarks	0
13	kwalker@example.net	\N	&goZGrfs0v	\N	2023-12-05 18:22:20.256	c2#8+Gxc5g	OFFLINE	f	2023-12-05 18:22:20.256	70.81	53.7	55.34	99.01	136	1692	57	UNRANKED	christophersantos	0
14	ismith@example.net	\N	)f_x2KQgq$	\N	2023-12-05 18:22:20.257	u0)9YvNETr	INGAME	f	2023-12-05 18:22:20.257	68.78	36.1	76.77	30.17	586	3642	98	GOLD	chungjuan	0
15	xhernandez@example.net	\N	+ZltcYsxh2	\N	2023-12-05 18:22:20.259	s9$U1Kcu_2	OFFLINE	f	2023-12-05 18:22:20.259	48.85	50.05	14.58	43.94	467	2907	48	GOLD	jessicafoster	0
16	rebecca63@example.org	\N	*7dnIAganh	\N	2023-12-05 18:22:20.261	Vmh*2Cn@v4	ONLINE	f	2023-12-05 18:22:20.261	30.02	70.45	73.22	22.02	265	4212	48	SILVER	richardsonbianca	0
17	hughesbrittany@example.com	\N	nl2KuLg5O&	\N	2023-12-05 18:22:20.285	)NUy5^Yy#t	OFFLINE	f	2023-12-05 18:22:20.285	4.04	67.62	70.04	78.33	113	989	55	UNRANKED	ann56	0
18	sevans@example.com	\N	$13QGFiUCp	\N	2023-12-05 18:22:21.33	@T92^tmyg+	ONLINE	f	2023-12-05 18:22:21.33	3.95	87.21	90.5	62.67	961	1207	48	GOLD	vbrown	0
19	ryan63@example.org	\N	(2HNZIt$s1	\N	2023-12-05 18:22:21.337	9$0ZrT&v*7	OFFLINE	t	2023-12-05 18:22:21.337	91.05	35.81	23.44	12.41	304	3869	17	UNRANKED	ericksondaniel	0
20	olester@example.com	\N	+DN_G4Hw1^	\N	2023-12-05 18:22:21.34	2GL3DKvo)%	OFFLINE	f	2023-12-05 18:22:21.34	55.4	16.99	66.18	37.76	572	3277	32	GOLD	krogers	0
21	woodnicole@example.org	\N	!8v#XVy3dL	\N	2023-12-05 18:22:21.343	^k4ZDhUQ@F	INGAME	f	2023-12-05 18:22:21.343	6.3	18.66	59.12	37.66	343	2633	1	UNRANKED	navarrokaren	0
22	youngamanda@example.com	\N	&aYImcu!M8	\N	2023-12-05 18:22:21.346	225NUqUD@0	OFFLINE	f	2023-12-05 18:22:21.346	94.2	96.04	9.66	56.7	897	2219	8	SILVER	xdavis	0
23	gbriggs@example.com	\N	ZWG5N1(p+8	\N	2023-12-05 18:22:21.349	LMU9OV+o#u	ONLINE	t	2023-12-05 18:22:21.349	5.67	88.96	40	11.99	350	4232	59	BRONZE	pbenton	0
24	bthomas@example.net	\N	_5PNLdHGiv	\N	2023-12-05 18:22:21.352	poFMe0DX%(	OFFLINE	t	2023-12-05 18:22:21.352	43.9	22.36	53.41	39.2	696	665	86	BRONZE	carrollbriana	0
25	grahamcynthia@example.net	\N	(wHYthHk74	\N	2023-12-05 18:22:21.355	+*54gIF2Lt	OFFLINE	f	2023-12-05 18:22:21.355	84.98	94.86	60.94	14.11	226	1513	61	UNRANKED	dustinkeith	0
26	jean27@example.com	\N	RwSI9Evmf&	\N	2023-12-05 18:22:21.357	*SU7IGtro&	INGAME	t	2023-12-05 18:22:21.357	9.42	91.23	14.19	62.11	230	1608	16	BRONZE	jonathan64	0
27	danielleevans@example.org	\N	Z2ArEnn1@(	\N	2023-12-05 18:22:21.359	A2_2YlJzU#	ONLINE	f	2023-12-05 18:22:21.359	64.18	96.46	49.61	4.13	270	3594	86	BRONZE	ocampbell	0
28	eharvey@example.com	\N	_7C+g)xFZ5	\N	2023-12-05 18:22:21.362	d@1YBcq8Kc	ONLINE	f	2023-12-05 18:22:21.362	15.61	17.17	42.8	41.17	83	4099	85	GOLD	lgreen	0
29	ikent@example.com	\N	s7P%&h2r!e	\N	2023-12-05 18:22:21.364	&v#DMPziN0	OFFLINE	t	2023-12-05 18:22:21.364	6.11	41.03	76.62	38.27	169	3150	25	UNRANKED	sandraolson	0
30	megangonzalez@example.com	\N	y1XkSJ1w*I	\N	2023-12-05 18:22:21.366	_f9WkPrjHH	OFFLINE	f	2023-12-05 18:22:21.366	70.87	57.99	56.22	50.72	210	3152	16	BRONZE	asingh	0
31	dixonmichael@example.net	\N	z@^R4HMrL1	\N	2023-12-05 18:22:21.367	O$m94IncNS	INGAME	t	2023-12-05 18:22:21.367	66.1	82.36	62.81	85.81	642	3491	75	BRONZE	williamsheather	0
32	aavery@example.org	\N	f@0_L3gKwH	\N	2023-12-05 18:22:21.369	jk*2_ZZcjp	ONLINE	f	2023-12-05 18:22:21.369	49.36	10.44	76.57	36.92	844	1624	43	BRONZE	leonadam	0
33	justin84@example.net	\N	+R4&NXtyi2	\N	2023-12-05 18:22:21.373	#IFu5%K$4@	OFFLINE	f	2023-12-05 18:22:21.373	43.93	54.67	60.57	42.4	663	3728	6	BRONZE	rperez	0
34	christina35@example.com	\N	$1ZFFgLynl	\N	2023-12-05 18:22:22.585	_HCeA_6p+6	ONLINE	t	2023-12-05 18:22:22.585	50.41	51.1	79.43	63.67	580	4768	23	SILVER	dhobbs	0
35	jimmylynn@example.com	\N	T*%Z6MvH%Y	\N	2023-12-05 18:22:22.592	88CbUv0L#1	ONLINE	t	2023-12-05 18:22:22.592	37.08	28.83	50.27	34.88	721	1118	23	UNRANKED	laurenbrennan	0
36	hramirez@example.org	\N	8%+O@3Qcxa	\N	2023-12-05 18:22:22.595	w&M)3UaIRv	INGAME	f	2023-12-05 18:22:22.595	41.61	49.69	82.75	11.97	787	4247	80	UNRANKED	lisa55	0
37	jsmith@example.org	\N	E3_mInzk@B	\N	2023-12-05 18:22:22.598	rvZAN4Sh*r	ONLINE	f	2023-12-05 18:22:22.598	46.64	89.92	32.15	9.1	456	1085	46	GOLD	shannonrogers	0
38	saundersjeremy@example.com	\N	1PGu2rnz)1	\N	2023-12-05 18:22:22.6	&x2Crglh7^	INGAME	f	2023-12-05 18:22:22.6	58.04	83.79	96.63	46.78	388	4413	81	UNRANKED	joneskatherine	0
39	michellegraham@example.org	\N	#9CNE_Nu#I	\N	2023-12-05 18:22:22.603	&i0l(NrH3D	OFFLINE	f	2023-12-05 18:22:22.603	15.5	31.17	46.13	5.98	890	937	85	SILVER	klong	0
40	hannahhopkins@example.com	\N	@_&8YqWyRV	\N	2023-12-05 18:22:22.607	rS%G*5Np4d	ONLINE	t	2023-12-05 18:22:22.607	76.57	5.62	9.3	22.65	453	1165	83	SILVER	wsmith	0
41	carrolljeffrey@example.com	\N	D2lNauLF)C	\N	2023-12-05 18:22:22.61	2rqKwFhl@I	OFFLINE	f	2023-12-05 18:22:22.61	77.63	88.76	54.72	6.13	838	1920	19	GOLD	tammywilliams	0
42	ericwilliams@example.org	\N	)4RJeM%c#)	\N	2023-12-05 18:22:22.612	(9SiOOhw57	OFFLINE	f	2023-12-05 18:22:22.612	49.44	74.01	73.32	64.4	721	1063	52	UNRANKED	grant28	0
43	robert99@example.net	\N	!63I^+hSaL	\N	2023-12-05 18:22:22.614	&7t2rNu8Mc	INGAME	f	2023-12-05 18:22:22.614	6.06	15.87	52.38	7.33	462	1238	49	GOLD	heatherbarker	0
44	eric96@example.com	\N	(^8*7TEhaK	\N	2023-12-05 18:22:22.616	Ae7KYIoq6$	OFFLINE	t	2023-12-05 18:22:22.616	31.31	47.61	4.13	46.96	531	1560	62	UNRANKED	janemcmahon	0
45	hprice@example.com	\N	Cr8UjDbww#	\N	2023-12-05 18:22:22.618	&7mXbDPQM7	OFFLINE	t	2023-12-05 18:22:22.618	8.26	81.88	12.75	72.6	949	3274	84	BRONZE	john83	0
46	chelseabailey@example.net	\N	(8#Lc(wyuB	\N	2023-12-05 18:22:22.623	^BPbCzit7X	INGAME	f	2023-12-05 18:22:22.623	61.55	56.6	32.37	40.23	476	2951	37	SILVER	dawnrogers	0
47	padams@example.org	\N	#9H75eat)s	\N	2023-12-05 18:22:22.624	$7FM)9OoG(	INGAME	t	2023-12-05 18:22:22.624	50.03	12.89	98.62	43.12	797	1931	94	GOLD	autumn39	0
48	qjohnston@example.net	\N	I&K3E#LKjx	\N	2023-12-05 18:22:22.626	c5J(7Yau*i	ONLINE	t	2023-12-05 18:22:22.626	36.22	0.6	54	94.52	490	1285	83	SILVER	qferguson	0
49	jocelynlowe@example.org	\N	#$pa0U7rrS	\N	2023-12-05 18:22:22.63	%42QqFbwCr	OFFLINE	f	2023-12-05 18:22:22.63	56.07	35.92	22.57	34.36	646	581	31	UNRANKED	amy82	0
50	smithgary@example.net	\N	v34xX5Na(e	\N	2023-12-05 18:22:23.455	+G0j5NjtQ+	OFFLINE	t	2023-12-05 18:22:23.455	94.12	25.92	2.94	74.62	782	693	92	GOLD	marcuspacheco	0
51	stephanie60@example.com	\N	53UOfXfb)1	\N	2023-12-05 18:22:23.461	$Q955Q)zA*	INGAME	t	2023-12-05 18:22:23.461	53.44	72.61	2.17	9.6	592	1961	47	UNRANKED	jennifermason	0
52	fostersean@example.com	\N	i54xUIyB#f	\N	2023-12-05 18:22:23.463	JB4EHVrgr&	OFFLINE	f	2023-12-05 18:22:23.463	81.03	69.91	42.69	98.11	621	2460	72	GOLD	scottmason	0
53	wgray@example.com	\N	%p6q@Zofy%	\N	2023-12-05 18:22:23.466	(v@rI48pj8	ONLINE	f	2023-12-05 18:22:23.466	19.46	47.37	46.94	13.46	875	1996	95	UNRANKED	fwatson	0
54	ann13@example.net	\N	z$S$2(Ze8_	\N	2023-12-05 18:22:23.468	^W3Wd$c@(P	INGAME	f	2023-12-05 18:22:23.468	18.46	36.3	85.04	6.43	404	2930	41	GOLD	frankdaniel	0
55	heidilee@example.net	\N	k2yCUUyv(P	\N	2023-12-05 18:22:23.471	vQ)9Qzxphg	OFFLINE	f	2023-12-05 18:22:23.471	61.38	0.23	1.16	5.15	841	2027	78	UNRANKED	micheal32	0
56	rgarcia@example.com	\N	&MO1D9^v1U	\N	2023-12-05 18:22:23.474	!X9e9HhS2r	OFFLINE	f	2023-12-05 18:22:23.474	51.82	52.01	2.06	1.35	36	1920	26	UNRANKED	brittney94	0
57	williamgreene@example.org	\N	+6PE2c2lTF	\N	2023-12-05 18:22:23.476	*3x8rHzs!u	INGAME	t	2023-12-05 18:22:23.476	19.06	14.61	6.25	9.3	288	2298	8	UNRANKED	patricia41	0
58	jamesking@example.net	\N	!Dt10^Bv9v	\N	2023-12-05 18:22:23.478	OIWPp!wJ%5	ONLINE	f	2023-12-05 18:22:23.478	44.92	4.4	79.69	13.85	948	454	86	GOLD	ryanwise	0
59	stephanieboone@example.net	\N	O68Csfst^J	\N	2023-12-05 18:22:23.48	+mRYabOg@7	OFFLINE	t	2023-12-05 18:22:23.48	81.17	37.99	86.22	36.07	149	928	50	SILVER	david76	0
60	hernandezlisa@example.org	\N	oMDHIpwb^8	\N	2023-12-05 18:22:23.483	$6N!EapHYu	ONLINE	t	2023-12-05 18:22:23.483	72.3	81.92	46.86	31.06	878	2328	37	BRONZE	harrismichael	0
61	williamwebster@example.com	\N	K+I6Iuwxga	\N	2023-12-05 18:22:23.485	+7MkrdgDeo	OFFLINE	t	2023-12-05 18:22:23.485	41.35	34.87	44.39	64.55	927	813	66	GOLD	floresomar	0
62	myersamy@example.net	\N	nXFDBGsM&1	\N	2023-12-05 18:22:23.487	^&1B0Sj)c7	OFFLINE	f	2023-12-05 18:22:23.487	97.78	37.61	51.07	98.22	469	4783	48	UNRANKED	michael92	0
63	ibrady@example.net	\N	+j0YRr@54!	\N	2023-12-05 18:22:23.49	lkClvqet_3	ONLINE	f	2023-12-05 18:22:23.49	41.46	97.55	65.9	47.09	683	4497	13	SILVER	jennifer60	0
64	robertrodriguez@example.net	\N	S%4MZb1#Km	\N	2023-12-05 18:22:23.492	cN63N7@k!h	OFFLINE	t	2023-12-05 18:22:23.492	87.27	41.52	67.39	96.49	984	3055	80	UNRANKED	thernandez	0
65	robert61@example.org	\N	_5aLt#YnLo	\N	2023-12-05 18:22:23.497	&XB8KNzO)1	OFFLINE	f	2023-12-05 18:22:23.497	4.53	2.01	64.89	26.98	79	3389	48	GOLD	jennifersellers	0
66	gabriella60@example.com	\N	%tDRQBxW69	\N	2023-12-05 18:22:24.131	P7JqrLbB$1	OFFLINE	t	2023-12-05 18:22:24.131	92.16	66.81	84.17	7.79	122	3546	7	GOLD	johnlee	0
67	tmiller@example.org	\N	!RW%Sue_H9	\N	2023-12-05 18:22:24.137	@2&26O0x9I	OFFLINE	t	2023-12-05 18:22:24.137	14.64	97.38	49.07	42.69	748	2594	2	BRONZE	uochoa	0
68	qgarza@example.net	\N	@E1Mih6$4%	\N	2023-12-05 18:22:24.142	F32vUzepp_	INGAME	f	2023-12-05 18:22:24.142	47.97	74.59	55.38	44.7	24	3203	45	BRONZE	james67	0
69	pporter@example.com	\N	DU@V0)Zv)w	\N	2023-12-05 18:22:24.144	Go0jB&@cF$	ONLINE	t	2023-12-05 18:22:24.144	4.37	78.24	3.13	25.19	185	1495	37	UNRANKED	xschwartz	0
70	williamrobertson@example.com	\N	CQd08lOf(6	\N	2023-12-05 18:22:24.147	D%06Bu(6Ca	ONLINE	f	2023-12-05 18:22:24.147	98.6	75.32	85.17	66.75	19	4098	90	BRONZE	randallhowell	0
71	grimesheather@example.org	\N	kM3LW^Pz#*	\N	2023-12-05 18:22:24.149	y)hz&2ZaX9	OFFLINE	t	2023-12-05 18:22:24.149	16.39	67.57	71.9	64.46	552	2795	3	UNRANKED	karen72	0
72	smalljennifer@example.com	\N	qAN20BeZb!	\N	2023-12-05 18:22:24.151	*8uaO7)oh*	ONLINE	f	2023-12-05 18:22:24.151	58.66	95.52	6.19	49.9	346	204	12	SILVER	guymitchell	0
73	wendy21@example.net	\N	M(7C9MmHEx	\N	2023-12-05 18:22:24.154	+qIHodv*2f	OFFLINE	f	2023-12-05 18:22:24.154	88.4	88.95	57.74	77.27	636	4493	18	UNRANKED	paul76	0
74	ruizmegan@example.org	\N	d)0V*eu_&P	\N	2023-12-05 18:22:24.156	%%3EIbl(53	INGAME	f	2023-12-05 18:22:24.156	42.6	50.13	92.78	62.96	287	3995	12	UNRANKED	murphywayne	0
75	wharris@example.com	\N	UT)&94Gvs1	\N	2023-12-05 18:22:24.158	_8fb2wQyzw	INGAME	t	2023-12-05 18:22:24.158	61.04	70.06	62.69	36.44	979	2061	78	BRONZE	andrea78	0
76	jenniferjohnson@example.com	\N	XH7Lmu!n#F	\N	2023-12-05 18:22:24.16	d#1IzxeyWW	INGAME	f	2023-12-05 18:22:24.16	7.12	70.68	68.3	43.26	997	2197	83	BRONZE	mcampbell	0
77	bergmatthew@example.com	\N	2)4dGPr$!Z	\N	2023-12-05 18:22:24.162	w@w5Ho8cZF	ONLINE	f	2023-12-05 18:22:24.162	43.35	50.34	23.48	84.22	916	214	55	GOLD	hancockjohn	0
78	jenniferturner@example.com	\N	&JuSe(%yX0	\N	2023-12-05 18:22:24.164	(6glKcz_*O	ONLINE	f	2023-12-05 18:22:24.164	18.73	60.08	42.17	25.57	353	1523	2	GOLD	aaronmiranda	0
79	catherine98@example.net	\N	TXA4W+zY@)	\N	2023-12-05 18:22:24.166	u@0sREt5pk	ONLINE	f	2023-12-05 18:22:24.166	35.87	59.27	17.97	86.99	929	2135	65	UNRANKED	mariacoleman	0
80	ryanpeterson@example.org	\N	QICAPeWh(1	\N	2023-12-05 18:22:24.168	g^BR3rEr*m	ONLINE	f	2023-12-05 18:22:24.168	10.46	56.4	50.68	99.34	610	4605	24	GOLD	johnsonkathy	0
81	joy86@example.com	\N	h5xBLELH#A	\N	2023-12-05 18:22:24.172	0$PpuXpa!*	OFFLINE	f	2023-12-05 18:22:24.172	4.01	52	19.43	45.29	344	1293	68	UNRANKED	kmcbride	0
82	john59@example.net	\N	eb6R%K7yD&	\N	2023-12-05 18:22:24.793	w&g93jcx&E	INGAME	f	2023-12-05 18:22:24.793	81.29	77.55	65.61	80.5	223	4098	45	UNRANKED	fsmith	0
83	kcarlson@example.org	\N	7V%XfAvG#0	\N	2023-12-05 18:22:24.799	4h_^#^Px!2	OFFLINE	f	2023-12-05 18:22:24.799	15.74	21.79	81.67	85.07	558	573	59	BRONZE	lawrence13	0
84	fwaller@example.net	\N	_9f^Rr8CE6	\N	2023-12-05 18:22:24.802	$P*$85VjsW	INGAME	f	2023-12-05 18:22:24.802	14.99	58.8	31.71	86.3	417	3199	60	UNRANKED	diazjulia	0
85	cameronhurst@example.net	\N	@(wSf3Nqsg	\N	2023-12-05 18:22:24.804	^o7JNuG_77	OFFLINE	t	2023-12-05 18:22:24.804	34.29	75.02	43.73	33.54	448	3170	14	SILVER	lindaskinner	0
86	oscarharmon@example.org	\N	K^cB4UteFE	\N	2023-12-05 18:22:24.807	)XmZAwn36y	INGAME	f	2023-12-05 18:22:24.807	59.02	3.13	1.13	6.02	111	1984	5	GOLD	marycline	0
87	qsanchez@example.net	\N	%Z4YA5Sr3^	\N	2023-12-05 18:22:24.81	)k0iCgayz4	INGAME	t	2023-12-05 18:22:24.81	63.9	5.85	37.54	37.22	104	4351	1	BRONZE	carlajames	0
88	zvaughn@example.org	\N	(k+Ipwmp$7	\N	2023-12-05 18:22:24.812	y^^2VtUj!Q	INGAME	t	2023-12-05 18:22:24.812	95.57	1.2	36.11	82.69	819	849	76	GOLD	james34	0
89	timothyneal@example.com	\N	r9FnKUNw(F	\N	2023-12-05 18:22:24.814	c0u74vDaM@	INGAME	t	2023-12-05 18:22:24.814	80.85	27.95	65.75	83.7	853	4906	58	UNRANKED	joshuatucker	0
90	emann@example.com	\N	m*p8cPbKec	\N	2023-12-05 18:22:24.817	y1nS%pGq$e	INGAME	t	2023-12-05 18:22:24.817	92.14	17.92	74.05	91.53	681	2443	44	GOLD	april09	0
91	oharrison@example.net	\N	o8CU5gNT$x	\N	2023-12-05 18:22:24.819	un2hiAeBS+	OFFLINE	f	2023-12-05 18:22:24.819	19.91	45.78	7.45	85.54	424	1751	73	UNRANKED	lindseygarza	0
92	jjackson@example.com	\N	Fo8SfIeE$@	\N	2023-12-05 18:22:24.821	PcHK6FMw1#	ONLINE	t	2023-12-05 18:22:24.821	77.2	50.74	56.55	66.2	448	2962	15	UNRANKED	morganbean	0
93	ethanjimenez@example.org	\N	Hre@3L)fA@	\N	2023-12-05 18:22:24.823	BqE6WjLs0#	ONLINE	t	2023-12-05 18:22:24.823	44.19	32.37	64.52	85.5	518	3671	26	SILVER	robertchambers	0
94	john41@example.com	\N	#a6!PzE!aZ	\N	2023-12-05 18:22:24.825	(qpvwWVOX2	OFFLINE	f	2023-12-05 18:22:24.825	3.71	0.81	48.98	65.37	203	2261	12	SILVER	lisadoyle	0
95	wilkinsonrichard@example.com	\N	!kHaChBbA7	\N	2023-12-05 18:22:24.826	w1#5Ukod_!	INGAME	f	2023-12-05 18:22:24.826	23.19	39.16	0.06	76.6	549	458	15	GOLD	mary91	0
96	michaelroberson@example.net	\N	2^H92GDul6	\N	2023-12-05 18:22:24.828	Pthf4G8Fr!	ONLINE	f	2023-12-05 18:22:24.828	60.98	61.82	98.85	39.22	789	4509	96	GOLD	jenniferenglish	0
97	mpeterson@example.net	\N	D7PpaSSb$p	\N	2023-12-05 18:22:24.832	rW4$1jNajc	OFFLINE	f	2023-12-05 18:22:24.832	71.04	89.6	70.83	92.87	235	4910	61	UNRANKED	lindseyschwartz	0
98	cassandra78@example.net	\N	T!527FJtLP	\N	2023-12-05 18:22:25.412	$5J^Eqs0&X	OFFLINE	f	2023-12-05 18:22:25.412	3.38	20.72	64.1	15.31	215	4569	82	SILVER	brendadiaz	0
99	fgarcia@example.com	\N	060DUjIF&e	\N	2023-12-05 18:22:25.418	Z4E(G4UbdC	OFFLINE	f	2023-12-05 18:22:25.418	19.62	34.71	63.24	80.65	466	2942	16	UNRANKED	richardsonrichard	0
100	clarkeerica@example.org	\N	2fv*ZaY8)r	\N	2023-12-05 18:22:25.422	y#&tY7BcC@	INGAME	t	2023-12-05 18:22:25.422	59.45	32.81	49.93	71.12	963	4	16	BRONZE	carriesmith	0
101	wardvictor@example.com	\N	4$W3lA4G3d	\N	2023-12-05 18:22:25.425	!#i8PAs2wu	OFFLINE	f	2023-12-05 18:22:25.425	27.83	69.58	37.31	46.83	696	2373	57	GOLD	andrewnolan	0
102	katrina30@example.com	\N	x^&1A2Nv(q	\N	2023-12-05 18:22:25.428	kN5A5ydD&S	ONLINE	f	2023-12-05 18:22:25.428	47.32	91.7	38.77	49.54	529	1258	64	UNRANKED	katherinegregory	0
103	hilldana@example.net	\N	@2VZvN%BUc	\N	2023-12-05 18:22:25.43	#xTBHw7H02	ONLINE	t	2023-12-05 18:22:25.43	23.36	86.93	83.23	71.89	842	4574	93	BRONZE	thompsonchristopher	0
104	kaylafranco@example.net	\N	N)4!sPy0Pd	\N	2023-12-05 18:22:25.432	OxZ65cK3z)	ONLINE	t	2023-12-05 18:22:25.432	68.59	95.97	61.25	0.08	398	2436	4	GOLD	evan69	0
105	penakevin@example.org	\N	KPj3xDRxI%	\N	2023-12-05 18:22:25.434	@c0%(Cj27Q	INGAME	f	2023-12-05 18:22:25.434	49.04	7.64	75.9	90.83	498	3597	77	UNRANKED	scottamy	0
106	mathew89@example.com	\N	LDInk0eV(4	\N	2023-12-05 18:22:25.437	z%7gy9&y5Z	OFFLINE	t	2023-12-05 18:22:25.437	99.91	86.48	2.81	51.96	585	2731	21	SILVER	samantha62	0
107	brandon73@example.com	\N	sxXM)2Um*f	\N	2023-12-05 18:22:25.438	^mR1VOc542	OFFLINE	t	2023-12-05 18:22:25.438	40.24	44.59	55.48	86.45	430	0	70	GOLD	ajones	0
108	brandymartin@example.org	\N	Vr+0CQtCmF	\N	2023-12-05 18:22:25.44	#c!OjLc7@3	INGAME	t	2023-12-05 18:22:25.44	65.99	14.32	27.55	62.84	475	1278	57	GOLD	victoria27	0
109	benjaminjackson@example.com	\N	@#M6hn&XL5	\N	2023-12-05 18:22:25.441	s374!Xrd$9	INGAME	t	2023-12-05 18:22:25.441	84.55	25.57	3.72	61.71	308	3818	44	BRONZE	dixonjohn	0
110	fcampbell@example.com	\N	!+80AHncYO	\N	2023-12-05 18:22:25.443	*aA3X9rnf8	INGAME	f	2023-12-05 18:22:25.443	91.2	91.16	70.87	36.72	837	783	73	UNRANKED	connorwillis	0
111	zwall@example.net	\N	4d5TRv7f^y	\N	2023-12-05 18:22:25.445	9GqXyXwC&m	ONLINE	f	2023-12-05 18:22:25.445	57.55	79.61	33.1	66.67	400	2346	65	UNRANKED	jeffrey50	0
112	albert43@example.org	\N	#hmC64y*o7	\N	2023-12-05 18:22:25.447	#wuP*$qUP3	INGAME	t	2023-12-05 18:22:25.447	95.95	25.9	76.13	0.21	913	3866	43	SILVER	brichards	0
113	sawyersusan@example.org	\N	@8ZgO7hWp1	\N	2023-12-05 18:22:25.45	_QLAz+sDS0	OFFLINE	f	2023-12-05 18:22:25.45	99.89	88.56	89.72	19.38	774	2376	78	GOLD	carrie98	0
114	zrowland@example.net	\N	gm0dRppe0+	\N	2023-12-05 18:22:26.047	r(tf6mgH9Z	ONLINE	f	2023-12-05 18:22:26.047	5.38	32.08	96.81	33.18	193	496	38	GOLD	phunter	0
115	daniel93@example.com	\N	i#jHgFwv^2	\N	2023-12-05 18:22:26.052	3JEkTtRq@I	OFFLINE	f	2023-12-05 18:22:26.052	8.61	3.68	98.17	87.79	593	2509	15	SILVER	hgrant	0
116	rmercer@example.net	\N	j%3XzuBd5D	\N	2023-12-05 18:22:26.055	iI4rYewQ&z	ONLINE	f	2023-12-05 18:22:26.055	28.05	95.77	18.52	20.23	278	1661	78	GOLD	christina92	0
117	kingsean@example.net	\N	+sEunmQ6N7	\N	2023-12-05 18:22:26.058	*63S%azsm0	OFFLINE	t	2023-12-05 18:22:26.058	30.23	3.58	42.07	41.38	259	4301	60	SILVER	qramirez	0
118	kendra38@example.net	\N	5Rb1B_Iak@	\N	2023-12-05 18:22:26.061	c^sbj3TdyV	ONLINE	t	2023-12-05 18:22:26.061	31.88	21.77	28.83	3.9	164	3596	78	UNRANKED	oroy	0
119	sanchezjoyce@example.com	\N	v9KKOPaU^y	\N	2023-12-05 18:22:26.064	#05NKWhe4n	OFFLINE	f	2023-12-05 18:22:26.064	57.03	48.8	53.19	78.81	471	404	33	UNRANKED	emilyweiss	0
120	pdavenport@example.com	\N	A(J0S9ymsx	\N	2023-12-05 18:22:26.067	)9zMe+vIIB	OFFLINE	t	2023-12-05 18:22:26.067	80.06	53.74	27.82	50.81	801	340	81	UNRANKED	millsgene	0
121	bradyrobert@example.org	\N	ky_0v5LgG&	\N	2023-12-05 18:22:26.069	2&5FgZ27^k	INGAME	t	2023-12-05 18:22:26.069	41.36	24.95	9.6	15.05	427	1709	83	GOLD	zrobinson	0
122	erikaharris@example.com	\N	sXB2Xnfj@3	\N	2023-12-05 18:22:26.072	X9H)Tk#w*a	OFFLINE	f	2023-12-05 18:22:26.072	85.13	95.11	4.06	21.39	632	4072	1	BRONZE	sanchezjeffrey	0
123	samantha68@example.net	\N	3P57FyN&j+	\N	2023-12-05 18:22:26.074	$3jMxWlpmx	ONLINE	f	2023-12-05 18:22:26.074	4.97	56.38	14.81	47.38	242	4321	59	UNRANKED	ashley10	0
124	marysherman@example.net	\N	59V6329v!W	\N	2023-12-05 18:22:26.076	mwIMKVf)_6	INGAME	f	2023-12-05 18:22:26.076	38.83	45.83	19.37	98.37	496	1486	50	UNRANKED	rstewart	0
125	michael05@example.org	\N	m2SjxMom!(	\N	2023-12-05 18:22:26.079	$fMn+Mov1!	OFFLINE	t	2023-12-05 18:22:26.079	1.02	4.34	76.07	18.65	864	3003	47	GOLD	lbooth	0
126	ethanmccarty@example.org	\N	B(6ZHePp)w	\N	2023-12-05 18:22:26.081	@C5gI_)f7o	INGAME	f	2023-12-05 18:22:26.081	41.94	78.51	58.17	85.85	602	3580	40	UNRANKED	udavis	0
127	rmyers@example.net	\N	_8cxcMp8zO	\N	2023-12-05 18:22:26.083	8qWFxUHl#2	INGAME	f	2023-12-05 18:22:26.083	25.23	76.28	15.66	50.12	664	4841	43	SILVER	lware	0
128	fellis@example.org	\N	WD8AKRudq%	\N	2023-12-05 18:22:26.086	!mI^1CVjCG	ONLINE	t	2023-12-05 18:22:26.086	95.7	88.16	74.44	16.38	710	1220	30	GOLD	cynthiasmith	0
129	okeller@example.net	\N	DOUJvvxK@9	\N	2023-12-05 18:22:26.091	@#5O%Lzey$	OFFLINE	f	2023-12-05 18:22:26.091	30.66	2.22	1.67	5.79	352	3599	27	BRONZE	joseph07	0
130	snyderdavid@example.com	\N	@83sV6yhsP	\N	2023-12-05 18:22:26.613	lwLIji)M)1	OFFLINE	f	2023-12-05 18:22:26.613	77.64	63.04	41.2	18.95	59	831	77	SILVER	amanda20	0
131	joshua88@example.net	\N	gA9k7FbQ!n	\N	2023-12-05 18:22:26.619	%8k3p9An%n	ONLINE	f	2023-12-05 18:22:26.619	14.16	99.78	37.93	28.09	702	690	66	UNRANKED	hharris	0
132	vparrish@example.org	\N	wF6!1SHtt#	\N	2023-12-05 18:22:26.622	N31XwuqJ#y	OFFLINE	t	2023-12-05 18:22:26.622	87.06	94.37	95.97	39.95	6	2562	23	BRONZE	yvonnepayne	0
133	thomas20@example.org	\N	rt2E79CyV#	\N	2023-12-05 18:22:26.624	Ae8eT0Od#^	INGAME	f	2023-12-05 18:22:26.624	49.2	12.71	98.99	90.4	192	526	16	GOLD	zoe26	0
134	christopherjones@example.com	\N	^H70RrlY5P	\N	2023-12-05 18:22:26.628	h8O6t1QI&$	OFFLINE	f	2023-12-05 18:22:26.628	21.92	62.24	80.64	42.15	240	4132	54	UNRANKED	gbrown	0
135	dburke@example.com	\N	S%3Pf%)Wu_	\N	2023-12-05 18:22:26.63	kh^DZiju%0	ONLINE	f	2023-12-05 18:22:26.63	93.58	50.4	71.02	85.02	265	1572	3	GOLD	xwilliams	0
136	katie28@example.org	\N	#*t3WIgpB%	\N	2023-12-05 18:22:26.632	z7h_f5Lvk_	INGAME	t	2023-12-05 18:22:26.632	82.17	28.05	52.59	12.9	163	189	38	SILVER	isaiahfloyd	0
137	qpalmer@example.org	\N	BRZm0vWm+J	\N	2023-12-05 18:22:26.634	kb&84Ttt8q	ONLINE	t	2023-12-05 18:22:26.634	56.37	36.03	96.95	43.77	390	2886	39	GOLD	whitejennifer	0
138	kevin60@example.com	\N	!fUAoock^2	\N	2023-12-05 18:22:26.636	$0NtnQWejt	OFFLINE	f	2023-12-05 18:22:26.636	20.16	90.74	73.83	24.89	94	4285	80	UNRANKED	serranosandy	0
139	gregorysmith@example.net	\N	3o&QNvSJ@l	\N	2023-12-05 18:22:26.638	S^O5WCKqSb	ONLINE	t	2023-12-05 18:22:26.638	55.53	90.21	99.58	91.47	48	1189	27	UNRANKED	michaelmccall	0
140	samantha72@example.org	\N	k0UnyBK((e	\N	2023-12-05 18:22:26.64	*xG+1Dzeeo	INGAME	f	2023-12-05 18:22:26.64	73.8	32.66	56.42	55.63	182	3903	20	SILVER	robert06	0
141	ashleydavis@example.net	\N	AWwt$2tvv!	\N	2023-12-05 18:22:26.643	3c7qXvc%)w	INGAME	f	2023-12-05 18:22:26.643	52.74	53.23	45.4	84.99	990	3233	25	BRONZE	christopher34	0
142	weisstracy@example.org	\N	Xq&glyIb@6	\N	2023-12-05 18:22:26.645	*y37mU#apJ	ONLINE	f	2023-12-05 18:22:26.645	82.61	52.23	37.6	98.03	233	2274	66	SILVER	tommyhoward	0
143	david32@example.net	\N	aJxGOw1u$9	\N	2023-12-05 18:22:26.648	Q53$HdEb%l	OFFLINE	t	2023-12-05 18:22:26.648	14.65	13.34	9.28	84.54	929	1252	42	GOLD	nathanbuchanan	0
144	imarshall@example.net	\N	j7SIDT@Q&x	\N	2023-12-05 18:22:26.649	(y*JC3q$L2	ONLINE	t	2023-12-05 18:22:26.649	36.89	75.62	82.56	29.03	11	4252	41	UNRANKED	jeffreyhayden	0
145	qmorgan@example.org	\N	SjcgC3Era_	\N	2023-12-05 18:22:26.653	O6GRM$ia+g	OFFLINE	f	2023-12-05 18:22:26.653	5.41	74.8	58.88	70.72	534	3935	5	UNRANKED	kenneth99	0
146	larsonjulie@example.org	\N	$cSp*$hC*7	\N	2023-12-05 18:22:27.382	!h!5!LmXK6	ONLINE	t	2023-12-05 18:22:27.382	62.79	31.52	10.52	45.71	271	3052	19	GOLD	sean11	0
147	csanchez@example.org	\N	E%5O+!Wc1K	\N	2023-12-05 18:22:27.388	(O%$0lOrYe	ONLINE	f	2023-12-05 18:22:27.388	23.34	56.49	63.84	25.48	719	2801	61	GOLD	lowepaul	0
148	deborahmyers@example.net	\N	a&6oO9mkvm	\N	2023-12-05 18:22:27.391	yX5KLkuY*#	INGAME	f	2023-12-05 18:22:27.391	30.65	83.53	38.7	29.31	12	2753	98	SILVER	maurice50	0
149	bwalton@example.net	\N	^l5cQFQOT6	\N	2023-12-05 18:22:27.394	l3k0BwJxj$	OFFLINE	f	2023-12-05 18:22:27.394	98.76	25.78	10.18	69.98	784	2620	54	SILVER	campbellstephanie	0
150	twilliams@example.net	\N	&1i#Us$jY1	\N	2023-12-05 18:22:27.397	d_9!SPdfve	INGAME	t	2023-12-05 18:22:27.397	25.93	96.2	7.93	6.53	470	4902	46	BRONZE	molsen	0
151	whitejennifer@example.org	\N	&fCegO6HW2	\N	2023-12-05 18:22:27.399	O)E&s8IjZh	OFFLINE	t	2023-12-05 18:22:27.399	12.3	91.73	72.42	92.13	501	314	84	SILVER	melissabutler	0
152	mlucas@example.net	\N	&!NMo1zEI0	\N	2023-12-05 18:22:27.402	D+0d1HbeNq	OFFLINE	f	2023-12-05 18:22:27.402	49.71	21.34	5.35	85.3	117	3741	72	GOLD	rhonda59	0
153	graveswendy@example.net	\N	+bidq$Tw65	\N	2023-12-05 18:22:27.404	E_2SHcv3hp	ONLINE	f	2023-12-05 18:22:27.404	5.09	58.82	3.22	17.1	221	2908	72	BRONZE	walterangel	0
154	edgar62@example.com	\N	CI2@Xedg_!	\N	2023-12-05 18:22:27.406	ly!9i6Mg@0	ONLINE	f	2023-12-05 18:22:27.406	24.97	19.72	81.1	81.2	501	3380	29	UNRANKED	morgantaylor	0
155	greencindy@example.net	\N	v%0MO%PcD^	\N	2023-12-05 18:22:27.408	(bP92tTg^B	ONLINE	f	2023-12-05 18:22:27.408	12.31	90.41	96.58	59	704	4665	36	UNRANKED	morgancandice	0
156	martinsusan@example.com	\N	KpwI0jCbC^	\N	2023-12-05 18:22:27.411	$1HRBuzCXO	OFFLINE	f	2023-12-05 18:22:27.411	2.48	92.14	56.95	90.67	992	4101	51	BRONZE	nlewis	0
157	susan05@example.net	\N	)B@5jQxw(7	\N	2023-12-05 18:22:27.414	a)$6Uv9w9#	OFFLINE	f	2023-12-05 18:22:27.414	85.6	59.82	36.44	77.63	997	4851	24	UNRANKED	laceyhopkins	0
158	michellewatson@example.org	\N	!9C&agfZXu	\N	2023-12-05 18:22:27.416	9s#X7uHaOs	ONLINE	f	2023-12-05 18:22:27.416	90.27	51.46	94.14	28.09	878	4131	97	UNRANKED	margaret56	0
159	saundersmarie@example.org	\N	nz92JkGnN&	\N	2023-12-05 18:22:27.417	l9aLOI2a+C	ONLINE	t	2023-12-05 18:22:27.417	7.24	30.52	36.28	90.21	613	670	14	BRONZE	carlawilliams	0
160	zbrown@example.net	\N	Z5R7GcGM#4	\N	2023-12-05 18:22:27.419	_O2&FbUtRO	ONLINE	t	2023-12-05 18:22:27.419	90.34	74.22	85.08	4.45	362	3200	80	UNRANKED	petersonrobert	0
161	danielhiggins@example.com	\N	1PG6R7wv+@	\N	2023-12-05 18:22:27.423	#lJMyWGi23	OFFLINE	f	2023-12-05 18:22:27.423	20.53	64.94	4.92	19.93	298	2089	45	UNRANKED	williamchase	0
162	jamesmorales@example.net	\N	R9M4+2HC(o	\N	2023-12-05 18:22:27.941	_0%hBl8klH	INGAME	t	2023-12-05 18:22:27.941	15.93	6.36	98.21	60.8	5	1142	60	UNRANKED	jwade	0
163	walkerjoel@example.org	\N	^0@hSOCa$8	\N	2023-12-05 18:22:27.951	&xo3bVqCXw	INGAME	f	2023-12-05 18:22:27.951	34.82	63.93	32.71	15.64	863	2741	33	UNRANKED	jonathansloan	0
164	ccisneros@example.net	\N	PpC1SwGx*h	\N	2023-12-05 18:22:27.954	1ZrWaR6I$6	INGAME	f	2023-12-05 18:22:27.954	30.06	4.84	43.61	22.53	46	1729	43	GOLD	johnskinner	0
165	clarkrobert@example.net	\N	jbo*6M!jp%	\N	2023-12-05 18:22:27.958	r@7Koszj&$	ONLINE	t	2023-12-05 18:22:27.958	63.23	33.3	21.12	90.47	700	3070	52	BRONZE	qmaldonado	0
166	johnmyers@example.com	\N	#E2FO!raE)	\N	2023-12-05 18:22:27.96	+vCO4oJg3)	ONLINE	t	2023-12-05 18:22:27.96	73.86	81.3	26.55	15.57	678	3128	87	SILVER	steven77	0
167	arnoldkristin@example.org	\N	f6WLDQUo(A	\N	2023-12-05 18:22:27.963	ihpXo5Uk*D	OFFLINE	t	2023-12-05 18:22:27.963	43.16	66.13	21.01	30.07	79	3418	78	BRONZE	rachel50	0
168	pwalters@example.org	\N	FC6IPlSt%8	\N	2023-12-05 18:22:27.965	ca63BzgJI*	OFFLINE	f	2023-12-05 18:22:27.965	5.97	96.01	66.13	65.55	357	4421	83	BRONZE	christine54	0
169	brian55@example.com	\N	%L8WUQg^p+	\N	2023-12-05 18:22:27.968	cK7(Erq6%7	ONLINE	f	2023-12-05 18:22:27.968	48.78	8.32	9.57	48.57	552	3983	90	UNRANKED	pattersonjoshua	0
170	jasonhayden@example.com	\N	BR15LUseK#	\N	2023-12-05 18:22:27.969	)wkfHVq_30	ONLINE	t	2023-12-05 18:22:27.969	22.4	70.93	37.07	46.21	895	900	58	BRONZE	diazedward	0
171	brownbenjamin@example.org	\N	*4IC7lvJeT	\N	2023-12-05 18:22:27.971	+$B!3WDkdH	ONLINE	f	2023-12-05 18:22:27.971	10.16	51.63	70.82	5.77	856	1866	6	SILVER	roachjoseph	0
172	normanmargaret@example.com	\N	!_8(HTuUre	\N	2023-12-05 18:22:27.973	a*m@ra7jzV	ONLINE	f	2023-12-05 18:22:27.973	59.9	5.97	69.11	56.85	650	3148	65	BRONZE	jenniferpowell	0
173	danielwilliams@example.com	\N	XldY5S2p*7	\N	2023-12-05 18:22:27.975	e5Q^Hr7T$p	INGAME	t	2023-12-05 18:22:27.975	49.91	22.24	13.96	73.46	401	3143	65	UNRANKED	imassey	0
174	roberthodges@example.com	\N	eR522Tze4#	\N	2023-12-05 18:22:27.977	&HO4mPpGKG	OFFLINE	f	2023-12-05 18:22:27.977	37.48	34.39	9.64	1.85	297	4484	48	UNRANKED	shirley90	0
175	qfoster@example.net	\N	(#)6HcAyhb	\N	2023-12-05 18:22:27.979	Vvn4EiBm%M	ONLINE	t	2023-12-05 18:22:27.979	92.6	36.01	87.11	73.48	167	4607	65	UNRANKED	areynolds	0
176	wcoleman@example.org	\N	_)8oRUTfB_	\N	2023-12-05 18:22:27.981	+H5oYKKrvB	OFFLINE	t	2023-12-05 18:22:27.981	3.36	78.97	60.69	27.93	798	4926	68	GOLD	kennedymichael	0
177	timothy09@example.net	\N	$I3+HwHb!s	\N	2023-12-05 18:22:27.986	MpzHjJUs@4	OFFLINE	f	2023-12-05 18:22:27.986	23.45	12.89	82.28	92.25	781	23	87	UNRANKED	jacquelineshaw	0
178	mcfarlandkim@example.net	\N	xf8l$V9e@w	\N	2023-12-05 18:22:29.524	g@12QcQ)5a	ONLINE	f	2023-12-05 18:22:29.524	98.27	75.83	13.12	76.65	922	1956	1	UNRANKED	holtdanielle	0
179	kwilliams@example.net	\N	+F#w79CjKj	\N	2023-12-05 18:22:29.53	)lTgboImF7	OFFLINE	f	2023-12-05 18:22:29.53	13.84	68.19	92.89	33.5	94	3570	50	GOLD	alejandrajimenez	0
180	susanpowell@example.org	\N	s8MI0haz%k	\N	2023-12-05 18:22:29.533	A&&O5VSy0@	INGAME	t	2023-12-05 18:22:29.533	22.83	73.64	7.08	24.9	761	451	26	BRONZE	adriennedouglas	0
181	brendawilson@example.com	\N	9xUjNuS_#7	\N	2023-12-05 18:22:29.536	O_Oa40Za#A	OFFLINE	f	2023-12-05 18:22:29.536	15.2	40.55	14.1	80.76	652	4721	25	GOLD	juliagonzales	0
182	jon71@example.com	\N	Iz@6hEpzn$	\N	2023-12-05 18:22:29.539	#8D3BoZ0z#	INGAME	t	2023-12-05 18:22:29.539	37.75	87.65	39.72	92.68	548	507	8	UNRANKED	sabrina33	0
183	margaret45@example.net	\N	DS!lyGjo^6	\N	2023-12-05 18:22:29.541	_9Ffm+O+Uw	ONLINE	f	2023-12-05 18:22:29.541	44.42	60.38	14.04	70.71	498	3688	15	BRONZE	michaeltaylor	0
184	cheryl34@example.net	\N	*%9oGO)x@Y	\N	2023-12-05 18:22:29.543	R33Yc%$S)&	ONLINE	f	2023-12-05 18:22:29.543	4.62	38.78	94.06	79.98	435	4377	85	UNRANKED	william06	0
185	cnicholson@example.net	\N	ye$e3PJcto	\N	2023-12-05 18:22:29.545	4&vM65Xtua	OFFLINE	f	2023-12-05 18:22:29.545	79.24	44.49	99.4	14.15	10	3977	81	GOLD	heather00	0
186	hayeslauren@example.com	\N	%7Rby%dwxv	\N	2023-12-05 18:22:29.547	avg^44Mq%j	ONLINE	f	2023-12-05 18:22:29.547	1.11	23.77	26.13	8.57	5	3418	56	UNRANKED	kduarte	0
187	rachelwade@example.org	\N	$uU7FsTtC7	\N	2023-12-05 18:22:29.549	@Yw1#bAj&7	ONLINE	t	2023-12-05 18:22:29.549	19.42	18.81	4.42	57.42	714	4649	78	BRONZE	josephwall	0
188	chambersbrandy@example.net	\N	!%0q5IrLOl	\N	2023-12-05 18:22:29.55	(*i9KJvqFA	OFFLINE	t	2023-12-05 18:22:29.55	59.34	41.29	84.01	18.74	510	4475	78	UNRANKED	lfrancis	0
189	vhill@example.org	\N	h7j4Ewmj!)	\N	2023-12-05 18:22:29.552	YiHt3WVb$Q	ONLINE	f	2023-12-05 18:22:29.552	51.11	12.31	38.44	48.94	663	4789	18	UNRANKED	jilliannelson	0
190	tuckerpeter@example.org	\N	2EXx4_dh@2	\N	2023-12-05 18:22:29.554	&xeLvRmxG2	OFFLINE	f	2023-12-05 18:22:29.554	82.91	68.02	87.04	87.65	828	2747	99	BRONZE	uramirez	0
191	sean87@example.org	\N	(P&61KjclW	\N	2023-12-05 18:22:29.555	*dJ1Rh+if4	INGAME	f	2023-12-05 18:22:29.555	48.17	76.56	94.41	48.09	905	1847	44	UNRANKED	fisherraymond	0
192	robert74@example.org	\N	TW%1XYAxUh	\N	2023-12-05 18:22:29.557	#63nOi5mV%	ONLINE	f	2023-12-05 18:22:29.557	56.14	93.99	50.66	57.92	288	3423	31	BRONZE	kevin26	0
193	rodriguezwilliam@example.org	\N	GIld7mYbF^	\N	2023-12-05 18:22:29.561	*Z^Z5YfnEr	OFFLINE	f	2023-12-05 18:22:29.561	91.05	33.86	66.53	53.04	890	3465	83	SILVER	sara51	0
194	kaylee27@example.net	\N	^Q)9fUQfp$	\N	2023-12-05 18:22:30.123	*0ub7D$h$R	OFFLINE	f	2023-12-05 18:22:30.123	77.44	74.08	12.1	31.01	592	2525	79	GOLD	carrollvanessa	0
195	lawrenceaustin@example.org	\N	Dj@qX5MtGA	\N	2023-12-05 18:22:30.13	(9Q@$YaoB9	ONLINE	f	2023-12-05 18:22:30.13	2.42	91.38	68.62	53.63	80	3911	3	GOLD	ericcannon	0
196	christopherwilliams@example.net	\N	&!4IhEpR!o	\N	2023-12-05 18:22:30.133	J3X2OQJa%I	INGAME	f	2023-12-05 18:22:30.133	37.57	99.17	42.94	83.86	754	1676	100	GOLD	michelle42	0
197	zmedina@example.org	\N	)4VOZv1PwZ	\N	2023-12-05 18:22:30.135	anZflk#(%3	INGAME	t	2023-12-05 18:22:30.135	73.66	73.21	4.75	9.15	98	3513	90	GOLD	timothybarrett	0
198	dean82@example.org	\N	wd4G+$Oi(E	\N	2023-12-05 18:22:30.138	sAKcW@#l#0	INGAME	t	2023-12-05 18:22:30.138	17.19	93.81	87.82	81.89	822	3179	23	GOLD	emoore	0
199	mark97@example.org	\N	_Z5G@k^^0q	\N	2023-12-05 18:22:30.14	%Mf0xRbib7	OFFLINE	t	2023-12-05 18:22:30.14	28.12	31.12	85.31	2.37	73	2109	60	GOLD	nicole53	0
200	whiteemily@example.org	\N	)ztvF5Xl2i	\N	2023-12-05 18:22:30.143	%5#QQfuze3	OFFLINE	t	2023-12-05 18:22:30.143	78.88	78.86	63.77	26.51	249	2886	76	UNRANKED	johnhowell	0
201	greenmichelle@example.org	\N	^^u!BWpKv1	\N	2023-12-05 18:22:30.145	N5l!QFvy(4	ONLINE	f	2023-12-05 18:22:30.145	19.6	20.01	58.07	28.18	214	1421	96	SILVER	bsanchez	0
202	rkirk@example.com	\N	E!QYo&8d@5	\N	2023-12-05 18:22:30.147	^u33#(Hlg(	INGAME	f	2023-12-05 18:22:30.147	15.59	13.07	79.23	67.08	697	406	51	SILVER	collinswilliam	0
203	petersonjack@example.com	\N	Lj91LX2nr)	\N	2023-12-05 18:22:30.149	!2HgkvOoiD	OFFLINE	t	2023-12-05 18:22:30.149	44.77	75.09	70.51	58.53	717	1355	86	UNRANKED	tonyaaguilar	0
204	ruizmiranda@example.net	\N	Qj0hIz9f+a	\N	2023-12-05 18:22:30.151	%3Vqv2ADvl	ONLINE	t	2023-12-05 18:22:30.151	36.87	51.46	21.65	93.11	29	2407	26	GOLD	jennifer87	0
205	chad12@example.net	\N	_wY@xNDZx6	\N	2023-12-05 18:22:30.152	lxm)I7EmV#	INGAME	f	2023-12-05 18:22:30.152	47	80.68	16.96	11.7	360	3913	61	BRONZE	debrafreeman	0
206	hernandezjohn@example.net	\N	&M5CtWJwy4	\N	2023-12-05 18:22:30.154	+y@JzhhP9i	INGAME	t	2023-12-05 18:22:30.154	40.2	71.68	18.15	67.34	79	693	16	UNRANKED	brittany05	0
207	nicholas32@example.com	\N	@F99HyRf%3	\N	2023-12-05 18:22:30.156	*m01xESm27	INGAME	t	2023-12-05 18:22:30.156	40.64	69.61	6.27	16.81	985	3563	41	UNRANKED	phillip61	0
208	justin89@example.org	\N	2@GIOqgE*w	\N	2023-12-05 18:22:30.158	oNx0HdwE#2	OFFLINE	f	2023-12-05 18:22:30.158	73.04	30.76	10.32	64.05	604	442	92	BRONZE	georgemelinda	0
209	bconway@example.net	\N	&MI6TN3z0A	\N	2023-12-05 18:22:30.162	Q!P0GEs!+n	OFFLINE	f	2023-12-05 18:22:30.162	75.19	48.25	80.14	10.53	427	4431	27	GOLD	shannonhahn	0
210	chad57@example.com	\N	*iDQ+^maj7	\N	2023-12-05 18:22:30.72	h!bQ3Ao&E_	ONLINE	t	2023-12-05 18:22:30.72	74.73	3.95	8.92	4.83	80	1739	94	BRONZE	wwhite	0
211	leecourtney@example.net	\N	P*iQ1Hwaj4	\N	2023-12-05 18:22:30.726	#S1W(Az!)(	INGAME	t	2023-12-05 18:22:30.726	47.41	90.68	75.18	65.78	452	2643	88	UNRANKED	brandypatel	0
212	smithdavid@example.com	\N	*7Oa0NTs1F	\N	2023-12-05 18:22:30.729	_4H5KB9xul	OFFLINE	t	2023-12-05 18:22:30.729	77.19	43.32	65.38	93.55	8	551	30	GOLD	michael68	0
213	kristiefoster@example.net	\N	s%@W$eH+)6	\N	2023-12-05 18:22:30.731	(2WLGg#8$O	INGAME	t	2023-12-05 18:22:30.731	73.06	95.92	25.39	50.94	162	1624	92	SILVER	bensonmark	0
214	gomezmaureen@example.org	\N	&wM8xmwO9d	\N	2023-12-05 18:22:30.734	#9ZMprbmwh	ONLINE	t	2023-12-05 18:22:30.734	31.24	59.69	42.31	12.72	510	1039	36	UNRANKED	rhodeswendy	0
215	jeremy17@example.com	\N	+x3GhTAfe^	\N	2023-12-05 18:22:30.736	G#2#Cu1@*$	ONLINE	t	2023-12-05 18:22:30.736	8.3	48.33	87.41	12.75	690	3183	74	BRONZE	swalls	0
216	cheryl26@example.net	\N	+N*1hZteWY	\N	2023-12-05 18:22:30.74	34ZM@!gi&(	ONLINE	f	2023-12-05 18:22:30.74	98.8	86.22	75.39	37.37	572	996	56	BRONZE	jordannathan	0
217	maria43@example.net	\N	@If40UroV3	\N	2023-12-05 18:22:30.742	%7PXPHrtFH	INGAME	t	2023-12-05 18:22:30.742	16.2	98.61	7.06	71.7	390	2376	32	SILVER	abrown	0
218	pcollins@example.com	\N	x92IPCLv(G	\N	2023-12-05 18:22:30.744	g(9*8JbW(F	ONLINE	f	2023-12-05 18:22:30.744	77.16	64.45	1.15	93.43	371	4795	32	GOLD	rick99	0
219	conwaychristine@example.com	\N	$*5VrKF!*x	\N	2023-12-05 18:22:30.746	&h5VxJn%9D	OFFLINE	f	2023-12-05 18:22:30.746	94.95	89.49	9.56	77.24	923	732	54	UNRANKED	maurice81	0
220	sandramoore@example.org	\N	d+Q3zIgqB3	\N	2023-12-05 18:22:30.747	^SMdTwv%3(	INGAME	t	2023-12-05 18:22:30.747	34.83	10.66	36.29	62.33	713	4672	82	UNRANKED	harrisalexis	0
221	pearsondiamond@example.org	\N	G_22QigJDo	\N	2023-12-05 18:22:30.749	e_5PR&d!()	OFFLINE	t	2023-12-05 18:22:30.749	45.64	11.62	57.2	60.25	756	4781	96	GOLD	daviserik	0
222	baileymark@example.com	\N	+#uJDSyjY2	\N	2023-12-05 18:22:30.751	$zuus!7dL8	INGAME	f	2023-12-05 18:22:30.751	93.49	88.52	56.12	61.66	566	4893	53	SILVER	mdavenport	0
223	penagina@example.net	\N	*7NYUtwkoQ	\N	2023-12-05 18:22:30.752	#+DjWY5+2z	INGAME	t	2023-12-05 18:22:30.752	70.87	80.47	39.51	53.75	949	666	98	GOLD	amyhenderson	0
224	michael60@example.org	\N	*x&P3HbD)t	\N	2023-12-05 18:22:30.754	#3OUgut3a(	OFFLINE	t	2023-12-05 18:22:30.754	64.87	37.71	33.3	50.41	161	2666	72	UNRANKED	lisafox	0
225	dannysuarez@example.net	\N	*Km1rtez#*	\N	2023-12-05 18:22:30.758	)1IrW(Z)%w	OFFLINE	f	2023-12-05 18:22:30.758	57.18	39.75	14.55	77.46	723	4696	48	UNRANKED	cannonwendy	0
226	diazashley@example.net	\N	l)z#g66eyD	\N	2023-12-05 18:22:31.344	eh7JN9sZ+a	ONLINE	f	2023-12-05 18:22:31.344	51.51	36.32	73.14	52.23	399	404	86	GOLD	charlesmcmahon	0
227	rpham@example.org	\N	(7JEZLtSnh	\N	2023-12-05 18:22:31.349	P!4TIDTbN&	ONLINE	t	2023-12-05 18:22:31.349	2.93	71.2	53.57	69.45	976	341	35	SILVER	diamond70	0
228	darlene26@example.com	\N	j6Ghjtf*^4	\N	2023-12-05 18:22:31.353	6+63Xe&(@7	OFFLINE	f	2023-12-05 18:22:31.353	49.75	18.68	90.13	65.92	255	460	48	BRONZE	alexanderwilliams	0
229	randy13@example.net	\N	a9hROwRJ+P	\N	2023-12-05 18:22:31.356	y2!J$*gu*1	INGAME	t	2023-12-05 18:22:31.356	22.84	71.96	85.82	3.99	989	1949	85	SILVER	yjohnson	0
230	austin76@example.com	\N	r7%5WxIFK%	\N	2023-12-05 18:22:31.358	hm3)Md_Dg!	INGAME	t	2023-12-05 18:22:31.358	79.47	37.72	5.14	18.56	988	4843	23	SILVER	rachelthompson	0
231	cunninghamsandra@example.com	\N	1@w9StBN%h	\N	2023-12-05 18:22:31.36	_ND_5WnM!S	INGAME	t	2023-12-05 18:22:31.36	95.26	77.44	31.47	8.1	677	214	36	UNRANKED	randy43	0
232	sanchezlatasha@example.org	\N	oVL1VSzlh%	\N	2023-12-05 18:22:31.362	P%3u0pXgqQ	ONLINE	t	2023-12-05 18:22:31.362	97.01	24.73	67.69	87.48	119	3883	42	SILVER	donna79	0
233	shortashley@example.com	\N	&pyfGvat3n	\N	2023-12-05 18:22:31.364	%HW4RlnMdM	ONLINE	t	2023-12-05 18:22:31.364	8.45	87.65	9.02	94.76	977	600	16	SILVER	hgarrett	0
234	isabelgrant@example.com	\N	)1WFnqn^$q	\N	2023-12-05 18:22:31.365	q&fQ6RQvhD	ONLINE	t	2023-12-05 18:22:31.365	57.79	80.43	8.02	7.48	541	752	93	UNRANKED	chelsea02	0
235	bonddavid@example.net	\N	$^0hLzUjC@	\N	2023-12-05 18:22:31.367	YTjNIGcl_0	INGAME	t	2023-12-05 18:22:31.367	66	42.76	19.21	96.18	977	699	43	GOLD	heatherbautista	0
236	hickmancaitlin@example.org	\N	70qfyPi@%M	\N	2023-12-05 18:22:31.369	&f!5CcLKY#	INGAME	f	2023-12-05 18:22:31.369	0.39	99.6	8.38	88.18	241	2539	17	SILVER	phillip96	0
237	maryjohnson@example.org	\N	E6OUzt@Y@&	\N	2023-12-05 18:22:31.37	yXMieduF(9	OFFLINE	f	2023-12-05 18:22:31.37	60.53	52.27	81.89	49.56	325	1751	44	GOLD	marieschwartz	0
238	rrobinson@example.org	\N	$lIHHZhj_7	\N	2023-12-05 18:22:31.372	p1OE)QCR%2	OFFLINE	f	2023-12-05 18:22:31.372	31.41	88.61	84.71	29.03	102	2475	24	GOLD	makayladavis	0
239	kpope@example.net	\N	qJ9WnHqCl^	\N	2023-12-05 18:22:31.374	S)4$C1v@ON	OFFLINE	f	2023-12-05 18:22:31.374	51.21	59.11	25.66	74.17	701	569	44	GOLD	james83	0
240	melissaaustin@example.org	\N	tA9Bza2_#$	\N	2023-12-05 18:22:31.376	RWVyn!Um#9	ONLINE	t	2023-12-05 18:22:31.376	37.08	43.36	17.53	57.06	40	905	43	GOLD	andrea89	0
241	finleyjonathan@example.org	\N	$*D)tgmr95	\N	2023-12-05 18:22:31.38	@WI69DMI5d	OFFLINE	f	2023-12-05 18:22:31.38	80.97	54.19	63.61	37.77	827	4694	12	UNRANKED	ystewart	0
242	renee65@example.org	\N	QjBf*3WwA(	\N	2023-12-05 18:22:32.22	ul0B6auR$y	ONLINE	f	2023-12-05 18:22:32.22	19.79	4.88	98.74	89.77	731	783	23	GOLD	madisonbarajas	0
243	martin01@example.com	\N	#0XxCp7nkP	\N	2023-12-05 18:22:32.226	1&0Zco_$%s	OFFLINE	t	2023-12-05 18:22:32.226	8.29	42.17	26.21	87.52	460	3379	32	BRONZE	charleswood	0
244	phillipstaylor@example.org	\N	r0Ia41kv%N	\N	2023-12-05 18:22:32.229	r+Q1TXTn@%	INGAME	t	2023-12-05 18:22:32.229	74.13	95.87	15.57	75.82	747	2421	89	BRONZE	williamskelsey	0
245	pagejoan@example.org	\N	M#^0IdgfG@	\N	2023-12-05 18:22:32.232	*bL+B*dm2Y	INGAME	t	2023-12-05 18:22:32.232	93.32	32.63	31.85	73.54	485	4032	85	UNRANKED	terrencebrown	0
246	timothyoneill@example.net	\N	9jeEw$bH%@	\N	2023-12-05 18:22:32.236	*(Te)iH(F7	OFFLINE	t	2023-12-05 18:22:32.236	51.69	46.71	81.21	17.05	216	1016	49	BRONZE	brian76	0
247	ayerstammy@example.org	\N	&rwh7Ur&ML	\N	2023-12-05 18:22:32.239	YCps3WLfx$	ONLINE	t	2023-12-05 18:22:32.239	92.15	57.2	41.83	19.77	0	1928	1	UNRANKED	erica92	0
248	cindyhuerta@example.com	\N	)c$8Vo1C5i	\N	2023-12-05 18:22:32.241	^A64DzWxj&	ONLINE	t	2023-12-05 18:22:32.241	35.26	47.18	7.45	14.97	82	3717	8	BRONZE	brentrobinson	0
249	billylawson@example.org	\N	12N4CcUT3+	\N	2023-12-05 18:22:32.244	m(3B(D7x&%	OFFLINE	f	2023-12-05 18:22:32.244	2.62	44.16	66.33	52.74	364	4283	63	UNRANKED	maynardrichard	0
250	erica51@example.org	\N	6755f8JkL!	\N	2023-12-05 18:22:32.246	!6CI_S!klT	ONLINE	t	2023-12-05 18:22:32.246	40.38	23.53	81.51	3.99	757	268	92	BRONZE	charleswilson	0
251	megan30@example.com	\N	*_8YLQIl!9	\N	2023-12-05 18:22:32.248	@yuM7Q*d!7	INGAME	f	2023-12-05 18:22:32.248	19.41	88.9	67.85	51.59	832	335	96	GOLD	cody15	0
252	vschaefer@example.net	\N	!5VlCGw95d	\N	2023-12-05 18:22:32.251	G!Q4#Tjw&S	ONLINE	t	2023-12-05 18:22:32.251	17.18	50.86	81.42	69.54	581	4163	33	BRONZE	fguerra	0
253	avilaedward@example.com	\N	@n5HU!ZnH1	\N	2023-12-05 18:22:32.253	+^zJ65Glw@	ONLINE	t	2023-12-05 18:22:32.253	11.67	3.76	9.53	6.35	912	4313	96	BRONZE	lynnjackson	0
254	yatesjohn@example.org	\N	1)Iwksj$@5	\N	2023-12-05 18:22:32.255	s9G0AAJP)7	ONLINE	f	2023-12-05 18:22:32.255	26.63	25.03	60.24	69.17	445	762	30	BRONZE	thomaswayne	0
255	jmendoza@example.com	\N	5m&4SQEuC@	\N	2023-12-05 18:22:32.257	f5^8hBej@s	OFFLINE	f	2023-12-05 18:22:32.257	98.81	23.65	20.55	30.14	738	720	93	UNRANKED	myersdavid	0
256	joshua63@example.org	\N	)LTHyX7ow8	\N	2023-12-05 18:22:32.258	T0EF7&k$_H	OFFLINE	t	2023-12-05 18:22:32.258	61.77	97.82	58.07	17.77	503	2167	60	UNRANKED	katelyn87	0
257	donald71@example.org	\N	nQ8NHhebr+	\N	2023-12-05 18:22:32.263	*tXPDC0T_8	OFFLINE	f	2023-12-05 18:22:32.263	1.07	68.88	37.32	59.92	402	2599	61	GOLD	michael32	0
258	shermanrachel@example.org	\N	+sFd5Zs$+G	\N	2023-12-05 18:22:32.915	R(7hHMlWtk	ONLINE	t	2023-12-05 18:22:32.915	31.3	65.23	33.61	73.93	380	4705	10	BRONZE	collierernest	0
259	ebartlett@example.net	\N	d(SU2KvN_@	\N	2023-12-05 18:22:32.92	5b7UD%vAN$	INGAME	f	2023-12-05 18:22:32.92	88.01	86.25	20.37	23.46	929	2025	95	UNRANKED	riosmanuel	0
260	zevans@example.org	\N	(2I0b3OrbD	\N	2023-12-05 18:22:32.923	ZSDC1KHl+h	ONLINE	t	2023-12-05 18:22:32.923	49.92	85.61	12.99	76.63	275	816	42	BRONZE	kennethking	0
261	johnharper@example.org	\N	Y7NrMwLh!A	\N	2023-12-05 18:22:32.926	$hGv3OTic!	ONLINE	t	2023-12-05 18:22:32.926	45.18	49.04	64.38	34.72	577	402	85	UNRANKED	walshstephen	0
262	tyler85@example.net	\N	^0#IE5QgMj	\N	2023-12-05 18:22:32.928	!97J9SaLd(	ONLINE	t	2023-12-05 18:22:32.928	24.92	30.02	3.72	44.51	690	431	14	UNRANKED	wallacekenneth	0
263	mcmillancaleb@example.com	\N	%30+6GBh!*	\N	2023-12-05 18:22:32.931	my2DVXwM$P	ONLINE	t	2023-12-05 18:22:32.931	39.72	6.49	40.76	54.44	282	4410	60	BRONZE	cosborne	0
264	stephanie81@example.net	\N	+qU5qoDmkj	\N	2023-12-05 18:22:32.933	829!WH%g)Z	INGAME	t	2023-12-05 18:22:32.933	60.35	80.46	80.03	60.83	81	2540	90	UNRANKED	barbarahuynh	0
265	davidwilliams@example.net	\N	@VDudKf!53	\N	2023-12-05 18:22:32.935	^b2VH5iSG5	ONLINE	f	2023-12-05 18:22:32.935	87.18	8.43	27.57	50.58	487	2005	44	GOLD	santosstephanie	0
266	huntertina@example.com	\N	4AV%_BBr*E	\N	2023-12-05 18:22:32.939	6uD5Ggzb#@	OFFLINE	t	2023-12-05 18:22:32.939	47.26	35.52	73.02	40.72	146	4245	78	GOLD	joseph28	0
267	muellermichael@example.org	\N	@_DWHjcB2L	\N	2023-12-05 18:22:32.941	!h+dFBTXF6	ONLINE	t	2023-12-05 18:22:32.941	37.67	35.58	46.07	91.91	551	2479	84	BRONZE	johnjoseph	0
268	estradatina@example.org	\N	_^iAiNuKn6	\N	2023-12-05 18:22:32.943	e0GwzHf7!5	INGAME	t	2023-12-05 18:22:32.943	5.42	77.82	87.23	1.54	763	1654	45	GOLD	christina11	0
269	gdaugherty@example.org	\N	@1Iwo_Fr3Z	\N	2023-12-05 18:22:32.945	h*1r88SxHT	OFFLINE	f	2023-12-05 18:22:32.945	95.46	70.13	41.4	50.71	760	3962	43	GOLD	blackmelissa	0
270	david23@example.org	\N	R_Es78FvPC	\N	2023-12-05 18:22:32.946	@d1@x8Rfj%	INGAME	f	2023-12-05 18:22:32.946	76.82	84.17	84.41	31.96	575	2496	91	UNRANKED	danielbonilla	0
271	alicia43@example.org	\N	XQRETYt*@8	\N	2023-12-05 18:22:32.948	7fMIWeAt%o	OFFLINE	t	2023-12-05 18:22:32.948	81.61	25.15	69.19	95.83	150	287	33	GOLD	kristenwilliams	0
272	djones@example.com	\N	R_+0tHci3P	\N	2023-12-05 18:22:32.95	H7wZgK7K%T	INGAME	t	2023-12-05 18:22:32.95	74.47	45.82	47.98	0.83	231	3115	24	SILVER	cwoods	0
273	hannahruiz@example.org	\N	2xF&+0IvIA	\N	2023-12-05 18:22:32.954	4OeJBEeE(P	OFFLINE	f	2023-12-05 18:22:32.954	6.81	99.08	12.85	24.52	468	1823	62	GOLD	connorharris	0
\.


--
-- Data for Name: UserBlocking; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."UserBlocking" ("blockerId", "blockedId") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
09a2c928-6f88-49d8-94a6-2dc00c89b58d	4cffc941e2d1a3c0f1ebf80b8198c936a0d2244fb07d1b141126d6ff5cf968fa	2023-12-05 16:09:58.073717+00	20230922031832_chat	\N	\N	2023-12-05 16:09:57.90977+00	1
c5aca137-a5ba-4398-953b-603b180f5260	78bdbde18a275de1e048a4cfb438b26a992818511213eeac51b53020ec675bb4	2023-12-05 16:09:58.588842+00	20231119141011_update_and_optimze_friends	\N	\N	2023-12-05 16:09:58.547986+00	1
402ba5f2-f676-49b7-89ea-b2c61b820360	f8e168b71ce9510e7ceb157fc0f8b71051c33a5fcdb0cdbd945b5590ad1ebfa3	2023-12-05 16:09:58.128851+00	20230922092809_chat	\N	\N	2023-12-05 16:09:58.10218+00	1
1989c0d8-03da-4095-9224-276623bc4e6d	e6fa74c70a554d93b661a587852a9bc03289a176d908fbe122c8a623c8e19687	2023-12-05 16:09:58.138597+00	20230922095758_chat	\N	\N	2023-12-05 16:09:58.130719+00	1
2ded730c-3b16-49b0-9331-729d9c4805c0	e55cfb3ba5562e624aa025b3a4788155a44e432c840049e640acfdf3bb535961	2023-12-05 16:09:58.187319+00	20230925082444_user_room_states	\N	\N	2023-12-05 16:09:58.172709+00	1
914635b1-512e-4170-a24e-50ae43177236	1c28b3d085a9bf9937b69d7573727d2556c4b6a19a7a4f0aa496f7bfbd51c455	2023-12-05 16:09:58.628627+00	20231119142427_update_friends	\N	\N	2023-12-05 16:09:58.592238+00	1
14e9af65-c347-4354-b047-0f520afa2e01	f6b7c351a56f2ce36d08b5659d871b80e00dea287bb8c0039c31ff2b5ab6debb	2023-12-05 16:09:58.20628+00	20230925083737_switch_chat2_profile	\N	\N	2023-12-05 16:09:58.190934+00	1
24d9c8d2-3968-46c4-9fb3-79906705f49b	fdff5a3db967a807f9750c22d5de1daf0e64ac334903d3a06767c39b5ab9ee80	2023-12-05 16:09:58.220216+00	20230928055816_chat	\N	\N	2023-12-05 16:09:58.209519+00	1
f820b590-a878-44f9-9759-2aa4403313d6	3e6a4b1a93e198823a3302df35f9613d58109c2b80a9958cb2e24e4850116425	2023-12-05 16:09:58.230503+00	20231001063326_mute	\N	\N	2023-12-05 16:09:58.222804+00	1
140800db-0516-48df-873e-c51f43fedb35	623a184285ab762b19e0c1368efd9ba5ec2059df94de00b35e7a38531752e30f	2023-12-05 16:09:58.699397+00	20231119152313_update_friend_request	\N	\N	2023-12-05 16:09:58.630849+00	1
5b48433d-9c7e-4691-b7f7-a9e2550aebc9	f1c1894bfb156cd9835353c20c8e30893309c1d15402efb8cf1a6675b58ad231	2023-12-05 16:09:58.269912+00	20231028194248_update	\N	\N	2023-12-05 16:09:58.232848+00	1
3fe54f3a-8e38-44cf-a0d0-607e58ba61f2	fd19949c78e080cf26f34f8c9a0f5bb28b7113df830b58b10d1b20301983cf13	2023-12-05 16:09:58.376359+00	20231101171013_uopdates	\N	\N	2023-12-05 16:09:58.273419+00	1
adffbc6f-7021-4b3c-acf4-cbfc59d5acbb	087c81a2519cc4320f075f9bf82419c3a75ae683a845dad12c23d96a5751a81c	2023-12-05 16:09:58.423944+00	20231117082038_dev	\N	\N	2023-12-05 16:09:58.382511+00	1
b8dcace6-47bf-403f-9aab-2824e9b26d24	870024f7e5cf79809ca30b0570fe24cd04a201d6c9b5be6c79938d5d0645e279	2023-12-05 16:09:58.762227+00	20231119202508_update	\N	\N	2023-12-05 16:09:58.702569+00	1
1c246a4a-f011-4549-b260-65ddadf5e352	fa615d59bd68406be3d12fbba0fd1f8a3aa2f870fa209de8f12198c710f122de	2023-12-05 16:09:58.473524+00	20231117092422_huge_update	\N	\N	2023-12-05 16:09:58.425485+00	1
7ca2c91a-b05a-42ae-87c1-a5ff52944e4d	89c710f4b22e9270f1b197baaa3337e1affddad8694cec1bdabf4afd4c8ce472	2023-12-05 16:09:58.484949+00	20231117102207_huge_update	\N	\N	2023-12-05 16:09:58.47591+00	1
3bc7506a-d046-408d-be4f-7f1b2352c7b6	bc8c344e3db01f7e5d057ac796ae1aa7c9a41c0fd03d56615fefc8774e7cd7b7	2023-12-05 16:09:58.52918+00	20231117114256_db_update	\N	\N	2023-12-05 16:09:58.487199+00	1
9f14144b-cf9f-4477-9afa-6575935f614a	0169bc2faaeab3856c536666cc3ce0f4135c108058b4bd3e0630136d08dadb8b	2023-12-05 16:09:58.785149+00	20231119202858_update	\N	\N	2023-12-05 16:09:58.765805+00	1
1134bb61-fb4a-45e7-a4be-302489bdd556	5e73fa55e5d4265cb5b3d8dc187b7e8d5b78c36b05bb5c1f516e8c1f1a3480b0	2023-12-05 16:09:58.5457+00	20231119133207_fix_update	\N	\N	2023-12-05 16:09:58.531738+00	1
c8014cf6-f01c-46f3-8586-482e2499c3de	a53ce96ae4998827604a77b64958e619703f3732796888b2534a72397dd93c8e	2023-12-05 16:09:58.835908+00	20231120151609_update	\N	\N	2023-12-05 16:09:58.788172+00	1
ba71cae9-ecfd-4211-8617-ad57d7603f63	a23a071beeab15db65203103a0c1630f5e8d9f12447ab39559ad3b33e40e18c4	2023-12-05 16:09:58.857606+00	20231121195839_fuck	\N	\N	2023-12-05 16:09:58.838878+00	1
da022fd1-98c2-4fa9-b206-43b11011ae18	2c5fa4b90e5187c6254e5da99067527c2c2af642fdcbd26205753ff8b09ee660	2023-12-05 16:09:58.927086+00	20231124093838_update	\N	\N	2023-12-05 16:09:58.860483+00	1
5ba27a55-5412-4cc1-8950-25d35892bfb5	9ed72ff833b4a3bb2a84b4471afbd7e5d7da2776c4509ac0dd1fc871ff3f6ea9	2023-12-05 16:09:58.947908+00	20231202161357_adding_read	\N	\N	2023-12-05 16:09:58.93245+00	1
\.


--
-- Name: ChatMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."ChatMessage_id_seq"', 680, true);


--
-- Name: ChatRoom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."ChatRoom_id_seq"', 34, true);


--
-- Name: FriendRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."FriendRequest_id_seq"', 1, false);


--
-- Name: Game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Game_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- Name: Player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Player_id_seq"', 1, false);


--
-- Name: Profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Profile_id_seq"', 273, true);


--
-- Name: RoomMembership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."RoomMembership_id_seq"', 68, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."User_id_seq"', 273, true);


--
-- Name: ChatMessage ChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: ChatRoom ChatRoom_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChatRoom"
    ADD CONSTRAINT "ChatRoom_pkey" PRIMARY KEY (id);


--
-- Name: FriendRequest FriendRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY (id);


--
-- Name: Friendship Friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("userId", "friendId");


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Player Player_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT "Player_pkey" PRIMARY KEY (id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- Name: RoomMembership RoomMembership_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."RoomMembership"
    ADD CONSTRAINT "RoomMembership_pkey" PRIMARY KEY (id);


--
-- Name: UserBlocking UserBlocking_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserBlocking"
    ADD CONSTRAINT "UserBlocking_pkey" PRIMARY KEY ("blockerId", "blockedId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: FriendRequest_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "FriendRequest_id_key" ON public."FriendRequest" USING btree (id);


--
-- Name: FriendRequest_senderId_receiverId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON public."FriendRequest" USING btree ("senderId", "receiverId");


--
-- Name: Game_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Game_id_key" ON public."Game" USING btree (id);


--
-- Name: Player_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Player_id_key" ON public."Player" USING btree (id);


--
-- Name: Player_userId_gameId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Player_userId_gameId_key" ON public."Player" USING btree ("userId", "gameId");


--
-- Name: Profile_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Profile_id_key" ON public."Profile" USING btree (id);


--
-- Name: Profile_userid_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "Profile_userid_key" ON public."Profile" USING btree (userid);


--
-- Name: RoomMembership_userId_roomId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "RoomMembership_userId_roomId_key" ON public."RoomMembership" USING btree ("userId", "roomId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: ChatMessage ChatMessage_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."ChatRoom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FriendRequest FriendRequest_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friendship Friendship_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friendship Friendship_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_receiverid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_receiverid_fkey" FOREIGN KEY (receiverid) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_senderid_fkey" FOREIGN KEY (senderid) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Player Player_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Player Player_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Profile Profile_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_userid_fkey" FOREIGN KEY (userid) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RoomMembership RoomMembership_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."RoomMembership"
    ADD CONSTRAINT "RoomMembership_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."ChatRoom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RoomMembership RoomMembership_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."RoomMembership"
    ADD CONSTRAINT "RoomMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserBlocking UserBlocking_blockedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserBlocking"
    ADD CONSTRAINT "UserBlocking_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBlocking UserBlocking_blockerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserBlocking"
    ADD CONSTRAINT "UserBlocking_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

