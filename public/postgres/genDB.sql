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
,   user_id  INTEGER      CONSTRAINT nn_topics_1 NOT NULL
,   title    VARCHAR(255) CONSTRAINT nn_topics_2 NOT NULL
,   content  TEXT
, CONSTRAINT fk_topics_1 FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tags (
    tag_id SERIAL      CONSTRAINT pk_tags_1 PRIMARY KEY
,   title  VARCHAR(30) CONSTRAINT nn_tags_1 NOT NULL
);

CREATE TABLE topic_tag_relationship (
    relationship_id SERIAL  CONSTRAINT pk_relationship_1 PRIMARY KEY
,   topic_id        INTEGER CONSTRAINT nn_relationship_1 NOT NULL
,   tag_id          INTEGER CONSTRAINT nn_relationship_2 NOT NULL
, CONSTRAINT fk_relationship_1 FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
, CONSTRAINT fk_relationship_2 FOREIGN KEY (tag_id)   REFERENCES tags(tag_id)
);

CREATE TABLE comments (
    comment_id SERIAL  CONSTRAINT pk_comments_1 PRIMARY KEY
,   user_id    INTEGER CONSTRAINT nn_comments_1 NOT NULL
,   topic_id   INTEGER CONSTRAINT nn_comments_2 NOT NULL
,   content    TEXT    CONSTRAINT nn_comments_3 NOT NULL
, CONSTRAINT fk_comments_1 FOREIGN KEY (user_id)  REFERENCES users(user_id)
, CONSTRAINT fk_comments_2 FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
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
  (title, user_id)
VALUES
  ('What is the purpose of this assignment?',1)
, ('Why is node so frustrating sometimes?'  ,1);

INSERT INTO comments
  (user_id,topic_id,content)
VALUES
  (1,1,'Maybe it is to learn patience while we struggle with node?')
, (2,1,'No, I think the teacher just likes to watch us struggle!')
, (2,1,'That was probably too harsh.. I am sure we will figure it out.');

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