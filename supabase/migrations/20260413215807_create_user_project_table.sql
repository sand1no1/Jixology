CREATE TABLE usuario_proyecto (
    id_usuario INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_proyecto INT NOT NULL REFERENCES proyecto(id) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_proyecto)
  );