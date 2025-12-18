-- ============================================
-- SCRIPT DE CRIAÇÃO DO BANCO PICDB
-- ============================================

CREATE DATABASE IF NOT EXISTS PICDB;
USE PICDB;

-- ============================================
-- TABELA DE USUÁRIOS
-- A = Admin | G = Garçom | U = Usuário comum | M = Manager
-- ============================================
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('A','G','U','M') NOT NULL DEFAULT 'U'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- USUÁRIO MANAGER (se não existir)
-- limaleiteelias99@gmail.com / 310107El!as  -> role 'M'
-- ============================================
INSERT INTO Users (email, password, role)
SELECT
    'limaleiteelias99@gmail.com',
    -- hash de "310107El!as"
    '$2y$10$UVLcGo66aCNoRrJXB9.h.OzBqn8DlOCqG9ID4HLLPjT.8yd7iJYm2',
    'M'
WHERE NOT EXISTS (
    SELECT 1 FROM Users WHERE email = 'limaleiteelias99@gmail.com'
);

-- ============================================
-- TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE IF NOT EXISTS Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABELA DE ITENS DO CARDÁPIO
-- ============================================
CREATE TABLE IF NOT EXISTS CategoryItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoryId INT NOT NULL,
    price FLOAT NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,

    CONSTRAINT fk_categoryitem_category
        FOREIGN KEY (categoryId)
        REFERENCES Category(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABELA DE ADICIONAIS
-- ============================================
CREATE TABLE IF NOT EXISTS CategoryAdds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoryId INT NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    price FLOAT NOT NULL,

    CONSTRAINT fk_categoryadds_category
        FOREIGN KEY (categoryId)
        REFERENCES Category(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABELA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_or_client VARCHAR(50) NOT NULL, -- pode ser mesa ou nome do cliente
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open','closed','finished') DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABELA DE ITENS DO PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    itemId INT NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    observations TEXT,

    CONSTRAINT fk_orderitems_order
        FOREIGN KEY (orderId)
        REFERENCES Orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_orderitems_item
        FOREIGN KEY (itemId)
        REFERENCES CategoryItem(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABELA DE ADICIONAIS DO ITEM DO PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS OrderItemAdds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderItemId INT NOT NULL,
    addId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    CONSTRAINT fk_itemadds_orderitem
        FOREIGN KEY (orderItemId)
        REFERENCES OrderItems(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_itemadds_add
        FOREIGN KEY (addId)
        REFERENCES CategoryAdds(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
