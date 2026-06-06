INSERT INTO task (created_at, deadline, id, title, description)  VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 7, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Comprar alimentos', 'Hacer una lista de compras para el supermercado.');
INSERT INTO task (created_at, deadline, id, title, description)  VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 2, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Pagar facturas', 'Pagar la factura de electricidad antes de la fecha límite.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 14, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Estudiar para el examen', 'Revisar los temas de matemáticas y física para el próximo examen.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(HOUR, 12, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Reunión con el equipo', 'Preparar los puntos de la reunión semanal con el equipo de trabajo.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 5, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Llamar al doctor', 'Agendar una cita con el médico para el chequeo anual.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 10, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Limpiar la casa', 'Organizar el cuarto, limpiar las ventanas y aspirar la alfombra.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 20, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Leer un libro', 'Terminar de leer "Cien años de soledad" de Gabriel García Márquez.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(HOUR, 48, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Actualizar el currículum', 'Agregar la última experiencia laboral y cursos realizados.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 3, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Comprar regalos', 'Buscar ideas para los regalos de cumpleaños de la familia.');
INSERT INTO task (created_at, deadline, id, title, description) VALUES (CURRENT_TIMESTAMP, TIMESTAMPADD(DAY, 15, CURRENT_TIMESTAMP), NEXTVAL('task_seq'), 'Planificar vacaciones', 'Investigar destinos turísticos y elaborar un presupuesto para el viaje.');

INSERT INTO user_entity (id, email, username, password, is_admin) VALUES (NEXTVAL('user_entity_seq'), 'pepe@openwebinars.net','pepe','{noop}12345',false);

UPDATE task SET author_id = CURRVAL('user_entity_seq');

