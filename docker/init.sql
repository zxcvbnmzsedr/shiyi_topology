create
graph interview_graph;

create table question
(
    id       varchar(320) not null,
    title    varchar(256) not null,
    category varchar(64)  not null,
    content  text         not null,
    constraint interview_pk
        primary key (id)
);
comment
on table question is '面试题哦';
comment
on column question.title is '文章标题';
comment
on column question.category is '分类';
comment
on column question.content is '内容';

