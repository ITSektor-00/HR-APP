-- INSERT naredbe za zaposleni_korisnici tabelu
-- Svi korisnici imaju platu 50.000 dinara, nedostajući podaci su popunjeni po izboru

INSERT INTO zaposleni_korisnici (
    ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, grad, 
    fotografija, email, telefon, pozicija, sektor, status_zaposlenja, 
    vrsta_zaposlenja, broj_radne_dozvole, datum_pocetka, datum_zavrsetka, 
    datum_kreiranja, datum_azuriranja, uloga, pristup, sifra, plata, valuta, period_plate
) VALUES
-- Aleksandra Djordjevic
('Aleksandra', 'Djordjevic', 'Ž', '1988-05-15', '1505988800123', 'Vojvode Stepe 45', 'Beograd', 'Beograd', 
NULL, 'aleksandra.djordjevic@firma.com', '+38160123456', 'KAM', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD001', '2022-03-01', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Ana Jovanovic
('Ana', 'Jovanovic', 'Ž', '1990-08-22', '2208990800456', 'Bulevar oslobođenja 78', 'Novi Sad', 'Novi Sad', 
NULL, 'ana.jovanovic@firma.com', '+38160123457', 'KAM', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD002', '2021-06-15', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Ana Srbljak
('Ana', 'Srbljak', 'Ž', '1987-12-03', '0312987800789', 'Kralja Milana 12', 'Beograd', 'Beograd', 
NULL, 'ana.srbljak@firma.com', '+38160123458', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD003', '2020-09-10', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Ankica Nedeljkovic
('Ankica', 'Nedeljkovic', 'Ž', '1985-04-18', '1804985800234', 'Nikole Tesle 67', 'Beograd', 'Beograd', 
NULL, 'ankica.nedeljkovic@firma.com', '+38160123459', 'Manager online sektora', 'Online', 'Aktivan', 
'Neodređeno', 'RD004', '2019-11-20', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Bojan Slavkovski
('Bojan', 'Slavkovski', 'M', '1983-07-25', '2507983800567', 'Svetogorska 34', 'Beograd', 'Beograd', 
NULL, 'bojan.slavkovski@firma.com', '+38160123460', 'serviser', 'Tehnička podrška', 'Aktivan', 
'Neodređeno', 'RD005', '2018-05-12', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Caslav Dimic
('Caslav', 'Dimic', 'M', '1986-11-08', '0811986800890', 'Bulevar Mihajla Pupina 23', 'Beograd', 'Beograd', 
NULL, 'caslav.dimic@firma.com', '+38160123461', 'sistem inženjer IT', 'IT', 'Aktivan', 
'Neodređeno', 'RD006', '2020-02-28', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Damjan Bogdanovic
('Damjan', 'Bogdanovic', 'M', '1992-01-14', '1401992800123', 'Knez Mihailova 89', 'Beograd', 'Beograd', 
NULL, 'damjan.bogdanovic@firma.com', '+38160123462', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD007', '2021-08-05', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Danijela Filipović
('Danijela', 'Filipović', 'Ž', '1984-09-30', '3009984800456', 'Bulevar Nikole Tesle 56', 'Beograd', 'Beograd', 
NULL, 'danijela.filipovic@firma.com', '+38160123463', 'Direktor za public i commercial sektor', 'Menadžment', 'Aktivan', 
'Neodređeno', 'RD008', '2017-12-01', NULL, NOW(), NOW(), 'admin', 'pun', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Danijela Krajnovic
('Danijela', 'Krajnovic', 'Ž', '1989-03-12', '1203989800789', 'Svetogorska 78', 'Beograd', 'Beograd', 
NULL, 'danijela.krajnovic@firma.com', '+38160123464', 'grafički dizajner', 'Marketing', 'Aktivan', 
'Neodređeno', 'RD009', '2020-04-15', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Danka Mirkovic
('Danka', 'Mirkovic', 'Ž', '1986-06-20', '2006986800234', 'Bulevar oslobođenja 123', 'Novi Sad', 'Novi Sad', 
NULL, 'danka.mirkovic@firma.com', '+38160123465', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD010', '2019-07-22', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Dragan Lucic
('Dragan', 'Lucic', 'M', '1975-12-05', '0512975800567', 'Kralja Milana 45', 'Beograd', 'Beograd', 
NULL, 'dragan.lucic@firma.com', '+38160123466', 'General Manager', 'Menadžment', 'Aktivan', 
'Neodređeno', 'RD011', '2015-01-01', NULL, NOW(), NOW(), 'admin', 'pun', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Ivan Stankovic
('Ivan', 'Stankovic', 'M', '1988-02-18', '1802988800890', 'Bulevar Mihajla Pupina 67', 'Beograd', 'Beograd', 
NULL, 'ivan.stankovic@firma.com', '+38160123467', 'Project manager', 'Projekti', 'Aktivan', 
'Neodređeno', 'RD012', '2020-03-10', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Ivana Dzabasan
('Ivana', 'Dzabasan', 'Ž', '1991-10-25', '2510991800123', 'Nikole Tesle 34', 'Beograd', 'Beograd', 
NULL, 'ivana.dzabasan@firma.com', '+38160123468', 'administrator računarskih mreža', 'IT', 'Aktivan', 
'Neodređeno', 'RD013', '2021-11-08', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Jelena Obradovic
('Jelena', 'Obradovic', 'Ž', '1987-04-07', '0704987800456', 'Knez Mihailova 23', 'Beograd', 'Beograd', 
NULL, 'jelena.obradovic@firma.com', '+38160123469', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD014', '2019-05-14', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Jelena Veljković
('Jelena', 'Veljković', 'Ž', '1985-08-16', '1608985800789', 'Bulevar Nikole Tesle 89', 'Beograd', 'Beograd', 
NULL, 'jelena.veljkovic@firma.com', '+38160123470', 'office manager', 'Administracija', 'Aktivan', 
'Neodređeno', 'RD015', '2018-09-03', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Jelena Vulović
('Jelena', 'Vulović', 'Ž', '1990-01-28', '2801990800234', 'Svetogorska 12', 'Beograd', 'Beograd', 
NULL, 'jelena.vulovic@firma.com', '+38160123471', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD016', '2020-12-07', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Jovan Trisic
('Jovan', 'Trisic', 'M', '1983-05-11', '1105983800567', 'Bulevar oslobođenja 45', 'Novi Sad', 'Novi Sad', 
NULL, 'jovan.trisic@firma.com', '+38160123472', 'referent računovodstva', 'Finansije', 'Aktivan', 
'Neodređeno', 'RD017', '2017-06-20', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Luka Rakić
('Luka', 'Rakić', 'M', '1995-07-03', '0307995800890', 'Bulevar Mihajla Pupina 12', 'Beograd', 'Beograd', 
NULL, 'luka.rakic@firma.com', '+38160123473', 'programer', 'IT', 'Aktivan', 
'Neodređeno', 'RD018', '2022-01-15', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Maja Rikalovic
('Maja', 'Rikalovic', 'Ž', '1989-11-19', '1911989800123', 'Nikole Tesle 67', 'Beograd', 'Beograd', 
NULL, 'maja.rikalovic@firma.com', '+38160123474', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD019', '2021-04-08', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Martina Milovanovic
('Martina', 'Milovanovic', 'Ž', '1992-12-14', '1412992800456', 'Knez Mihailova 78', 'Beograd', 'Beograd', 
NULL, 'martina.milovanovic@firma.com', '+38160123475', 'marketing manager', 'Marketing', 'Aktivan', 
'Neodređeno', 'RD020', '2020-08-25', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Milan Jelenković
('Milan', 'Jelenković', 'M', '1980-03-22', '2203980800789', 'Bulevar Nikole Tesle 34', 'Beograd', 'Beograd', 
NULL, 'milan.jelenkovic@firma.com', '+38160123476', 'Menadžer razvoja poslovanja', 'Menadžment', 'Aktivan', 
'Neodređeno', 'RD021', '2016-10-12', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Milan Simić
('Milan', 'Simić', 'M', '1984-06-08', '0806984800234', 'Svetogorska 45', 'Beograd', 'Beograd', 
NULL, 'milan.simic@firma.com', '+38160123477', 'magacioner', 'Logistika', 'Aktivan', 
'Neodređeno', 'RD022', '2019-02-18', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Milen Kovačević
('Milen', 'Kovačević', 'M', '1987-09-30', '3009987800567', 'Bulevar oslobođenja 67', 'Novi Sad', 'Novi Sad', 
NULL, 'milen.kovacevic@firma.com', '+38160123478', 'magacioner', 'Logistika', 'Aktivan', 
'Neodređeno', 'RD023', '2018-11-05', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Miljana Komnenovic
('Miljana', 'Komnenovic', 'Ž', '1986-01-17', '1701986800890', 'Bulevar Mihajla Pupina 89', 'Beograd', 'Beograd', 
NULL, 'miljana.komnenovic@firma.com', '+38160123479', 'administrativni referent', 'Administracija', 'Aktivan', 
'Neodređeno', 'RD024', '2020-05-30', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Miloš Jovanović
('Miloš', 'Jovanović', 'M', '1993-04-25', '2504993800123', 'Nikole Tesle 23', 'Beograd', 'Beograd', 
NULL, 'milos.jovanovic@firma.com', '+38160123480', 'online komercijalista', 'Online', 'Aktivan', 
'Neodređeno', 'RD025', '2021-09-12', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Miloš Radovanović
('Miloš', 'Radovanović', 'M', '1988-12-10', '1012988800456', 'Knez Mihailova 45', 'Beograd', 'Beograd', 
NULL, 'milos.radovanovic@firma.com', '+38160123481', 'online komercijalista', 'Online', 'Aktivan', 
'Neodređeno', 'RD026', '2020-01-20', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Mirjana Nikolić
('Mirjana', 'Nikolić', 'Ž', '1978-07-14', '1407978800789', 'Bulevar Nikole Tesle 12', 'Beograd', 'Beograd', 
NULL, 'mirjana.nikolic@firma.com', '+38160123482', 'Direktor finansija', 'Finansije', 'Aktivan', 
'Neodređeno', 'RD027', '2015-03-01', NULL, NOW(), NOW(), 'admin', 'pun', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Nemanja Trajanovski
('Nemanja', 'Trajanovski', 'M', '1985-10-05', '0510985800234', 'Svetogorska 67', 'Beograd', 'Beograd', 
NULL, 'nemanja.trajanovski@firma.com', '+38160123483', 'vozač', 'Logistika', 'Aktivan', 
'Neodređeno', 'RD028', '2019-08-14', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Sofija Cukic
('Sofija', 'Cukic', 'Ž', '1991-02-28', '2802991800567', 'Bulevar oslobođenja 34', 'Novi Sad', 'Novi Sad', 
NULL, 'sofija.cukic@firma.com', '+38160123484', 'marketing', 'Marketing', 'Aktivan', 
'Neodređeno', 'RD029', '2021-06-03', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Stefan Stojanovic
('Stefan', 'Stojanovic', 'M', '1989-08-12', '1208989800890', 'Bulevar Mihajla Pupina 56', 'Beograd', 'Beograd', 
NULL, 'stefan.stojanovic@firma.com', '+38160123485', 'vozač', 'Logistika', 'Aktivan', 
'Neodređeno', 'RD030', '2020-12-10', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Stevica Kujundzic
('Stevica', 'Kujundzic', 'M', '1970-05-20', '2005970800123', 'Kralja Milana 78', 'Beograd', 'Beograd', 
NULL, 'stevica.kujundzic@firma.com', '+38160123486', 'Direktor / vlasnik- osnivač', 'Menadžment', 'Aktivan', 
'Neodređeno', 'RD031', '2010-01-01', NULL, NOW(), NOW(), 'admin', 'pun', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Tamara Gordic
('Tamara', 'Gordic', 'Ž', '1990-11-03', '0311990800456', 'Nikole Tesle 89', 'Beograd', 'Beograd', 
NULL, 'tamara.gordic@firma.com', '+38160123487', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD032', '2021-03-25', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Teodora Stefanovic
('Teodora', 'Stefanovic', 'Ž', '1987-03-16', '1603987800789', 'Knez Mihailova 34', 'Beograd', 'Beograd', 
NULL, 'teodora.stefanovic@firma.com', '+38160123488', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD033', '2019-10-08', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Zeljko Stamenkovic
('Zeljko', 'Stamenkovic', 'M', '1982-12-08', '0812982800234', 'Svetogorska 78', 'Beograd', 'Beograd', 
NULL, 'zeljko.stamenkovic@firma.com', '+38160123489', 'vozač', 'Logistika', 'Aktivan', 
'Neodređeno', 'RD034', '2018-07-15', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'),

-- Željka Rančić-Djukić
('Željka', 'Rančić-Djukić', 'Ž', '1984-04-13', '1304984800567', 'Bulevar Nikole Tesle 67', 'Beograd', 'Beograd', 
NULL, 'zeljka.rancic-djukic@firma.com', '+38160123490', 'komercijalista', 'Komercijala', 'Aktivan', 
'Neodređeno', 'RD035', '2017-09-20', NULL, NOW(), NOW(), 'korisnik', 'ograničen', 'sifra123', 50000, 'RSD', 'mesečno'); 