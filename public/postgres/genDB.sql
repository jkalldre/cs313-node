DROP TABLE users                  CASCADE;
DROP TABLE topics                 CASCADE;
DROP TABLE tags                   CASCADE;
DROP TABLE topic_tag_relationship CASCADE;
DROP TABLE comments               CASCADE;

CREATE EXTENSION pgcrypto;

CREATE USER forumuser WITH PASSWORD 'password';
GRANT SELECT, INSERT, UPDATE ON person TO forumuser;
GRANT USAGE, SELECT ON SEQUENCE person_id_seq TO forumuser;


CREATE TABLE users (
    user_id  SERIAL       CONSTRAINT pk_users_1 PRIMARY KEY
,   username VARCHAR(30)  CONSTRAINT nn_users_1 NOT NULL
                          CONSTRAINT uq_users_1 UNIQUE
,   password VARCHAR(255) CONSTRAINT nn_users_2 NOT NULL
);

CREATE TABLE topics (
    topic_id SERIAL       CONSTRAINT pk_topics_1 PRIMARY KEY
,   title    VARCHAR(255) CONSTRAINT nn_topics_1 NOT NULL
,   content  TEXT
);

CREATE TABLE tags (
    tag_id SERIAL      CONSTRAINT pk_tags_1 PRIMARY KEY
,   title  VARCHAR(30) CONSTRAINT nn_tags_1 NOT NULL
);

CREATE TABLE topic_tag_relationship (
    relationship_id SERIAL  CONSTRAINT pk_relationship_1 PRIMARY KEY
,   topic_id        INTEGER CONSTRAINT nn_relationship_1 NOT NULL
,   tag_id          INTEGER CONSTRAINT nn_relationship_2 NOT NULL
);

CREATE TABLE comments (
    comment_id SERIAL  CONSTRAINT pk_comments_1 PRIMARY KEY
,   user_id    INTEGER CONSTRAINT nn_comments_1 NOT NULL
,   topic_id   INTEGER CONSTRAINT nn_comments_2 NOT NULL
,   content    TEXT    CONSTRAINT nn_comments_3 NOT NULL
);

-- Seed Tables

INSERT INTO users
  (username  , password)
VALUES
  ('jkalldre', crypt('supergoodpassword',gen_salt('bf')))
, ('stewart' , crypt('notsogoodpassword',gen_salt('bf')));

INSERT INTO tags
  (title)
VALUES
  ('General')
, ('Math')
, ('Education');

INSERT INTO topics
  (title)
VALUES
  ('What is the purpose of this assignment?');

INSERT INTO topic_tag_relationship
  (topic_id, tag_id)
VALUES
  (1,(SELECT tag_id FROM tags WHERE title = 'General'))
, (1,(SELECT tag_id FROM tags WHERE title = 'Education'));

SELECT t.title as "Title", ta.title as "Tags"
FROM   topics t
INNER JOIN topic_tag_relationship r
ON t.topic_id = r.topic_id
INNER JOIN tags ta
ON ta.tag_id = r.tag_id;