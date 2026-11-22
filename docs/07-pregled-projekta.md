# 07 – Pregled projekta

## Kaj je bilo implementirano za MVP

Projekt je spletna aplikacija RollCall (React + Vite, Django REST Framework, PostgreSQL), ki se lokalno zazene z `docker compose up --build`. Za MVP so bile implementirane naslednje funkcionalnosti:

- **F1 – Prijava in odjava:** prijava z e-posto in geslom, seja s HttpOnly piskotkom, odjava, zascitene strani glede na vlogo in preusmeritev na zacetno stran vloge. Javne registracije ni, racune ustvari administrator.
- **F3 – Programi in lekcije:** koordinator ustvari, uredi in izbrise svoje programe ter doda, uredi in izbrise lekcije v njih.
- **F4 – Dodelitev predavateljev:** koordinator poisce aktivne predavatelje in jih doda lekciji. Sistem prepreci dvojno dodelitev in prekrivanje terminov.
- **F5 – Koledar predavatelja:** mesecni koledar z lekcijami prijavljenega predavatelja, premikanje med meseci, barve glede na stanje in legenda.
- **F6 – Prijava prisotnosti:** predavatelj za danasnjo ali preteklo lekcijo prijavi, ali je bil prisoten ali odsoten.
- **F7 – Potrditev ali zavrnitev:** koordinator vidi cakajoce prijave za svoje programe in jih potrdi ali zavrne z razlogom.
- **F8 – Zamenjava predavatelja:** koordinator zamenja predavatelja, dokler je dodelitev v stanju ASSIGNED, in pri tem vpise razlog.

Niso implementirane funkcionalnosti, ki niso del MVP: F2 (upravljanje uporabnikov v aplikaciji, zdaj samo prek Django admina), F9 (zaklep meseca), F10 (statistika), F11 (izvoz .ics), F12 (prazniki) in F13 (profil).

## Ali funkcionalnosti zadoscajo uporabniskim zgodbam

Pregledali smo 5 uporabniskih zgodb iz dokumenta `05-uporabniske-zgodbe.md`.

| Zgodba | Ocena | Komentar |
| --- | --- | --- |
| US-01 – Prijava in odjava | Delno | Prijava, odjava, skupno sporocilo ob napacni e-posti ali geslu, sporocilo za onemogocen racun in stran "Access denied" delujejo. Administrator je preusmerjen na stran "Under maintenance" in ne na statistiko. |
| US-05 – Upravljanje programov | Vecinoma | Naslov je obvezen, program se poveze s koordinatorjem, koordinator vidi samo svoje programe, lahko jih ureja, pred brisanjem pa vidi stevilo lekcij. Manjka samo pravilo o zaklenjenem mesecu, ker F9 ni narejen. |
| US-07 – Dodelitev predavateljev | Vecinoma | Iskanje aktivnih predavateljev, izbira vec predavateljev, zavrnitev ob prekrivanju (z naslovom lekcije) in prepoved dvojne dodelitve delujejo. Lekciji, ki se stikata ob 10.00, se ne stejeta za prekrivanje. Manjka pravilo o zaklenjenem mesecu. |
| US-09 – Prijava prisotnosti | Vecinoma | Prijava je mogoca samo za danasnje ali pretekle lekcije in samo za dodeljenega predavatelja. Stanje REPORTED se ne da vec spremeniti, zavrnjeno prijavo pa lahko predavatelj popravi. Manjka pravilo o zaklenjenem mesecu. |
| US-10 – Potrditev prijave | Vecinoma | Koordinator vidi samo prijave svojih programov, potrditev nastavi stanje CONFIRMED in shrani, kdo in kdaj je potrdil. Potrjene prijave se ne da spremeniti. Manjka pravilo o zaklenjenem mesecu. |

**Zakljucek:** MVP funkcionalnosti v glavnem zadoscajo uporabniskim zgodbam. Vecina manjkajocih meril je povezana z zaklepom meseca (F9), ki ni del MVP. Edina vecja razlika pri MVP zgodbah je zacetna stran administratorja.

## Ostala opazanja

- Besedila v vmesniku so v anglescini, zgodbe pa navajajo slovenska sporocila (npr. "Napacna e-posta ali geslo").
- Dokument `04-arhitektura-in-tehnoloski-sklad.md` se vedno omenja JWT, koda in ADR-0004 pa uporabljata sejno avtentikacijo.
- Projekt nima testov (`tests.py` datoteki sta prazni, frontend nima testnega okolja).
- Frontend lint (`npm run lint`) je na zacetku javil 6 napak, ki smo jih popravili.
