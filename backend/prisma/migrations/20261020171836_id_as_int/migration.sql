-- change id from bigint to normal int
ALTER TABLE "urls" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "urls" ALTER COLUMN "id" TYPE integer USING "id"::integer;
ALTER SEQUENCE "urls_id_seq" AS integer;
ALTER TABLE "urls" ALTER COLUMN "id" SET DEFAULT nextval('urls_id_seq'::regclass);
