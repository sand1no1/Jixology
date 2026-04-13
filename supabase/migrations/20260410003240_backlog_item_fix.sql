DROP TABLE IF EXISTS backlog_item_proyecto;
DROP TABLE IF EXISTS backlog_item_sprint;

ALTER TABLE backlog_item
    ADD COLUMN id_proyecto INT NOT NULL REFERENCES proyecto(id),
    ADD COLUMN id_sprint   INT REFERENCES sprint(id);