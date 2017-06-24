SET NAMES 'utf8';
SET CHARACTER SET utf8;

USE test;
INSERT INTO testtab VALUES(0, "Bob");
INSERT INTO testtab VALUES(0, "Eve");
INSERT INTO testtab VALUES(0, "Alice");

USE prod;

# groups
INSERT INTO groups VALUES(1, "2017/test-1", "2017-06-01", "2017-10-01");
INSERT INTO groups VALUES(2, "2017/test-2", "2017-07-01", "2017-11-01");
INSERT INTO groups VALUES(3, "2017/test-3", "2017-08-01", "2017-12-01");

# students
INSERT INTO students VALUES(0, "Петров",      "Сидор",       "Васильевич",  "1984-07-14", "6804123456", "12345678901", "М", 1);
INSERT INTO students VALUES(0, "Иванов",      "Пётр",        "Ильич",       "1985-07-04", "6805000001", "12345678902", "М", 1);
INSERT INTO students VALUES(0, "Помоев",      "Ушат",        NULL,          "1991-07-14", "6805000002", "12345678903", "М", 1);
INSERT INTO students VALUES(0, "Джигурда",    "Никита",      "хз",          "1956-07-02", "6805000003", "12345678904", "М", 1);
INSERT INTO students VALUES(0, "Обоев",       "Рулон",       NULL,          "1984-07-14", "6805000004", "12345678905", "М", 1);
INSERT INTO students VALUES(0, "Ривз",        "Киану",       NULL,          "1984-07-14", "6805000005", "12345678906", "М", 2);
INSERT INTO students VALUES(0, "Гоголь",      "Николай",     "Васильевич",  "1944-07-21", "6805000006", "12345678907", "М", 2);
INSERT INTO students VALUES(0, "Пушкин",      "Александр",   "Сергеевич",   "1984-07-14", "6805000007", "12345678908", "М", 2);
INSERT INTO students VALUES(0, "Ривийский",   "Геральт",     NULL,          "1218-07-14", "6805000008", "12345678909", "М", 2);
INSERT INTO students VALUES(0, "Меригольд",   "Трисс",       NULL,          "1256-07-16", "6805000009", "12345678910", "Ж", 2);
INSERT INTO students VALUES(0, "Курицын",     "Александр",   "Уот-так-уот", "1975-07-14", "6805000010", "12345678911", "М", 3);
INSERT INTO students VALUES(0, "Скайуокер",   "Люк",         "Энакинович",  "1974-07-14", "6805000011", "12345678912", "М", 3);
INSERT INTO students VALUES(0, "Филимонов",   "Акакий",     "Галактионович","1982-01-01", "6805000012", "12345678913", "М", 3);

# cars
INSERT INTO cars VALUES(1, "а430ко", "68", "1999-09-09", "LADA tarantaika", 0, 1);
INSERT INTO cars VALUES(2, "л123оа", "56", "1299-09-09", "Плотва",          1, 0);
INSERT INTO cars VALUES(3, "е001кх", "99", "1999-09-09", "Mazerati",        1, 1);
INSERT INTO cars VALUES(4, "х666уй", "97", "1999-09-09", "McLaren F1 LM",   0, 1);

# teachers
INSERT INTO teachers VALUES(0, "Усулбек",     "Руслан",      "Ашотович",    "1975-07-14", "Шаурмейкер", 1.0, 1);
INSERT INTO teachers VALUES(0, "Ривийский",   "Геральт",     NULL,          "1975-07-14", "Ведзьмин", 1.0, 2);
INSERT INTO teachers VALUES(0, "Сидоров",     "Иван",        "Петрович",    "1975-07-14", "Начальник", 1.0, 3);
INSERT INTO teachers VALUES(0, "Голова",      "Елена",       "Михайловна",  "1975-07-14", "Секретарша", 1.0, NULL);
INSERT INTO teachers VALUES(0, "Ноги",        "Соня",        "Олеговна",    "1975-07-14", "За красивые глаза", 1.0, 4);
