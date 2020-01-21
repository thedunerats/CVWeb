create table baskets(
basket_id serial primary key,
fruits_contained numeric not null
);

create table fruits(
fruit_id serial primary key,
basket_id integer not null,
species varchar not null,
color varchar not null,
constraint bask_id foreign key (basket_id) references baskets(basket_id)
);

-- THESE WORKED. May put on github later.

drop table baskets cascade;
drop table fruits;

alter table baskets add constraint basket_id foreign key (fruits) references fruits(basket_id);

--tables I need: a basket table and one that identifies each piece of fruit.
-- should write a command that will remove all the fruit from the basket.

-- let's pseudocode our TABLE FIRST. we will make it once everything IS worked OUT.

--fruits are tied to a basket. need to call a basket to find out what fruits are in it.

-- basket
-- CONTAINS columns: basketid (serial, primary key, not null), fruit IN basket (int), fruit_id (foriegn key)

--fruit
--CONTAINS columns: fruitid(serial, primary key, not null), species (varchar), color (varchar)

--last_interaction? Doing that client side.

-- the basket_id needs to be serial. make sure to set the CVwebsite as the active schema.
alter table baskets alter column basket_id serial;

--lets run the statements so we know exatly what's happening.
insert into baskets values(default,0);
select count(basket_id) from baskets; --both worked.

delete from baskets where basket_id = 1;

select count(basket_id) from baskets;

show search_path;
