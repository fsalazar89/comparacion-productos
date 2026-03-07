DROP TABLE IF EXISTS productos;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    valoracion NUMERIC(2,1) CHECK (valoracion >= 0 AND valoracion <= 5),
    tamano VARCHAR(50),
    peso NUMERIC(10,3) CHECK (peso >= 0),
    color VARCHAR(50),
    url_imagen VARCHAR(255),
    tipo VARCHAR(30) NOT NULL DEFAULT 'generico',
    marca VARCHAR(50),
    modelo_version VARCHAR(50),
    sistema_operativo VARCHAR(50),
    bateria VARCHAR(50),
    camara VARCHAR(120),
    memoria VARCHAR(50),
    almacenamiento VARCHAR(50)
);

INSERT INTO productos
(nombre, descripcion, precio, valoracion, tamano, peso, color, url_imagen, tipo, marca, modelo_version, sistema_operativo,
 bateria, camara, memoria, almacenamiento)
VALUES
('iPhone 15 Pro', 'Diseño de titanio, chip A17 Pro', 999.99, 4.8, '6.1 pulgadas', 0.187, 'Titanio Natural', 'https://example.com/iphone15.jpg', 'smartphone', 'Apple', '15 Pro', 'iOS 17', '3274 mAh', '48MP Main', '8 GB', '128 GB'),
('Samsung Galaxy S24', 'Galaxy AI ha llegado', 799.00, 4.7, '6.2 pulgadas', 0.167, 'Onyx Black', 'https://example.com/s24.jpg', 'smartphone', 'Samsung', 'S24', 'Android 14', '4000 mAh', '50MP Main', '8 GB', '256 GB'),
('Google Pixel 8 Pro', 'El teléfono de Google más avanzado', 999.00, 4.7, '6.7 pulgadas', 0.213, 'Celeste', 'https://example.com/pixel8.jpg', 'smartphone', 'Google', '8 Pro', 'Android 14', '5050 mAh', '50MP Wide', '12 GB', '128 GB'),
('Xiaomi 14 Ultra', 'Lente óptica Leica Summilux', 1499.00, 4.6, '6.73 pulgadas', 0.220, 'Black', 'https://example.com/xiaomi14.jpg', 'smartphone', 'Xiaomi', '14 Ultra', 'HyperOS', '5000 mAh', '50MP Quad-camera', '16 GB', '512 GB'),
('Motorola Edge 50 Pro', 'Inteligencia artificial en cada toma', 699.00, 4.5, '6.7 pulgadas', 0.186, 'Luxe Lavender', 'https://example.com/motoedge50.jpg', 'smartphone', 'Motorola', 'Edge 50 Pro', 'Android 14', '4500 mAh', '50MP Main', '12 GB', '256 GB'),
('OnePlus 12', 'Smooth Beyond Belief', 899.00, 4.6, '6.82 pulgadas', 0.220, 'Flowy Emerald', 'https://example.com/oneplus12.jpg', 'smartphone', 'OnePlus', '12', 'OxygenOS 14', '5400 mAh', '50MP Sony LYT-808', '12 GB', '256 GB'),
('Asus ROG Phone 8', 'Rediseñado para ganar', 1099.00, 4.6, '6.78 pulgadas', 0.225, 'Phantom Black', 'https://example.com/rog8.jpg', 'smartphone', 'Asus', 'ROG Phone 8', 'Android 14', '5500 mAh', '50MP Main', '16 GB', '512 GB');
