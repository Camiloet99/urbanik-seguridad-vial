CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  email VARCHAR(190) NOT NULL UNIQUE,      -- Email_institucional (lowercase)
  dni VARCHAR(32) NOT NULL UNIQUE,         -- NUM_DOCUMENTO

  full_name VARCHAR(190) NOT NULL,         -- Nombre completo
  genero VARCHAR(32),                      -- Género
  age_range VARCHAR(32),                   -- Rango de edad
  fecha_nacimiento DATE,                   -- FECHA_NACIMIENTO

  documento_type VARCHAR(32),              -- Tipo de documento
  department VARCHAR(120),                 -- Departamento
  municipality VARCHAR(120),               -- Municipio
  phone VARCHAR(64),                       -- Teléfono
  telefono VARCHAR(64),                    -- Teléfono alternativo
  celular VARCHAR(64),                     -- Celular alternativo

  email_personal VARCHAR(190),             -- Email personal
  ciudad_residencia VARCHAR(120),          -- Ciudad de residencia
  subregion VARCHAR(120),                  -- Subregión
  tipo_documento_id VARCHAR(32),           -- ID tipo de documento
  enfoque_diferencial VARCHAR(120),        -- Enfoque diferencial
  programa VARCHAR(160),                   -- Programa
  nivel VARCHAR(80),                       -- Nivel

  avatar_id INT,
  password_hash VARCHAR(200) NOT NULL,
  role VARCHAR(32) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,

  initial_test_done BOOLEAN NOT NULL DEFAULT FALSE,
  exit_test_done BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS user_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  email VARCHAR(190) NOT NULL,
  medalla1 BOOLEAN NOT NULL DEFAULT FALSE,
  medalla2 BOOLEAN NOT NULL DEFAULT FALSE,
  medalla3 BOOLEAN NOT NULL DEFAULT FALSE,
  medalla4 BOOLEAN NOT NULL DEFAULT FALSE,
  test_initial_done BOOLEAN NOT NULL DEFAULT FALSE,
  test_exit_done BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_progress_email (email),
  CONSTRAINT fk_user_progress_user FOREIGN KEY (user_id) REFERENCES users(id)
);
