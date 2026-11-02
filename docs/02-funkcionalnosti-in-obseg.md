# 02 – Funkcionalnosti in obseg

## Uporabniške vloge

Vsak prijavljen uporabnik ima natanko eno vlogo.

### Administrator

| Lahko                                     | Ne more                                    |
| ----------------------------------------- | ------------------------------------------ |
| Ustvarjati in urejati uporabniške račune  | Ustvarjati ali urejati programov in lekcij |
| Pregledovati statistiko celotnega sistema | Dodeljevati ali zamenjevati predavateljev  |
| Pregledovati vse programe in lekcije      | Prijavljati ali potrjevati prisotnosti     |

### Koordinator programa

| Lahko                                                  | Ne more                                                |
| ------------------------------------------------------ | ------------------------------------------------------ |
| Ustvarjati in brisati svoje programe in lekcije v njih | Upravljati uporabnikov ali vlog                        |
| Dodeljevati predavatelje lekcijam                      | Videti ali spreminjati programov drugih koordinatorjev |
| Zamenjati predavatelja pri lekciji                     |                                                        |
| Potrditi ali zavrniti prijavljeno prisotnost           |                                                        |
| Zakleniti zaključen mesec v svojem programu            |                                                        |

### Predavatelj

| Lahko                                           | Ne more                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| Pregledovati svoj koledar lekcij                | Ustvarjati, urejati ali brisati programov in lekcij |
| Prijaviti prisotnost ali odsotnost pri lekcijah | Videti lekcij drugih predavateljev                  |
| Izvoziti lekcijo v format .ics                  | Spreminjati ničesar v zaklenjenem mesecu            |
| Pregledovati svoj profil in osebno statistiko   |                                                     |

## Predvidene funkcionalnosti

- F1 (**MVP**) – **Registracija, prijava in odjava.** Prijava z e-pošto in geslom, zaščita poti glede na vlogo.
- F2 – **Upravljanje uporabnikov in vlog.** Seznam uporabnikov, sprememba vlog, deaktivacija računov.
- F3 (**MVP**) – **Upravljanje programov in lekcij.** Ustvarjanje programov in njihovih lekcij. Koordinator vidi samo svoje programe.
- F4 (**MVP**) – **Dodelitev predavateljev lekcijam.** Iskanje predavatelja in dodelitev enega ali več predavateljev lekciji. Sistem zavrne dodelitev, če je predavatelj v istem terminu že dodeljen drugi lekciji.
- F5 (**MVP**) – **Koledar predavatelja.** Mesečni pogled lekcij z barvno označenimi stanji.
- F6 (**MVP**) – **Prijava prisotnosti.** Prijava prisotnosti ali odsotnosti za lekcije, ki so danes ali v preteklosti.
- F7 (**MVP**) – **Potrditev ali zavrnitev prisotnosti.** Pregled čakajočih prijav ter njihova potrditev ali zavrnitev (z razlogom). Potrjeni podatki so podlaga za obračun.
- F8 (**MVP**) – **Zamenjava predavatelja.** Dodelitev lekcije drugemu predavatelju z navedbo razloga.
- F9 – **Zaklep meseca.** Zaključen mesec programa se zaklene. Zaklenjenih podatkov ni mogoče spreminjati.
- F10 – **Statistika sistema.** Skupni kazalniki in grafikoni za celoten sistem.
- F11 – **Izvoz lekcije v .ics.** Prenos koledarske datoteke za posamezno lekcijo.
- F12 – **Državni prazniki.** Prazniki iz javnega API-ja se prikažejo v koledarju. Sistem opozori, če je lekcija dodeljena na praznik.
- F13 – **Profil in osebna statistika.** Osnovni podatki ter število dodeljenih, potrjenih, odsotnih in čakajočih lekcij.

## Kasnejše nadgradnje

- **E-poštna obvestila** (nova dodelitev, zamenjava, zavrnjena prijava, opomnik za prijavo prisotnosti).
- **Izvoz poročil** o izvedenih urah v CSV/PDF za obračun.
- **Predlogi zamenjav s strani predavateljev**, ki jih potrdi koordinator.
- **Sinhronizacija z Outlookovim koledarjem**, ki nadomesti ročni izvoz .ics.
- **Množični uvoz iz CSV**, s katerim koordinator naloži urnik celotnega semestra ali seznam predavateljev naenkrat.
- **Vloga udeleženca** za spremljanje prisotnosti po udeležencih in ne le po predavateljih.
- **Ponavljajoče se lekcije**, ki omogočajo ustvarjanje cele serije lekcij naenkrat (npr. vsak torek ob 10.00 12 tednov).

## Out of scope (izven obsega)

- Spremljanje prisotnosti udeležencev.
- Ocenjevanje, izpiti in potrdila.
- Izvajanje lekcij na daljavo (videokonference, deljenje gradiv, spletna učilnica).
- Obračun plač ali honorarjev.
