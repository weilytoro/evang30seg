-- Execute este script no banco MySQL usado pela hospedagem.
CREATE TABLE IF NOT EXISTS quiz_respostas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  data_referencia DATE NOT NULL,
  perfil_chave VARCHAR(50) NOT NULL,
  perfil_titulo VARCHAR(150) NOT NULL,
  respostas_json TEXT NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
