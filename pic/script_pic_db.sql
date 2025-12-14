-- ============================================
-- SCRIPT DE CRIAÇÃO DO BANCO PICDB
-- ============================================

CREATE DATABASE IF NOT EXISTS PICDB;
USE PICDB;

-- ============================================
-- TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin CHAR(1) DEFAULT 'N' CHECK (admin IN ('Y', 'N'))
);

-- ============================================
-- CRIA ADMIN PADRÃO SE NÃO EXISTIR
-- Email: admin@admin.com
-- Senha: admin123
-- ============================================
INSERT INTO Users (email, password, admin)
SELECT
    'admin@admin.com',
    -- hash de "admin123" gerado com password_hash(PASSWORD_DEFAULT)
    '$2y$10$mwb1m5XsvwBroQGv9G87keHCakL88nA7xdbIOxupbS2A.qxlL0zy2',
    'Y'
WHERE NOT EXISTS (
    SELECT 1 FROM Users WHERE email = 'admin@admin.com'
);

-- ============================================
-- TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE IF NOT EXISTS Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

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
);

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
);

-- ============================================
-- TABELA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_or_client VARCHAR(50) NOT NULL, -- pode ser mesa ou nome do cliente
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open','closed', 'finished') DEFAULT 'open'
);

-- ============================================
-- TABELA DE ITENS DO PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    itemId INT NOT NULL,
    quantity INT NOT NULL,
    observation VARCHAR(255),

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
);

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
);
