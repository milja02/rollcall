# 05 – Uporabniške zgodbe

## Pregled

| Funkcionalnost                              | Zgodbe       | MVP |
| ------------------------------------------- | ------------ | --- |
| F1 Registracija, prijava in odjava          | US-01, US-02 | da  |
| F2 Upravljanje uporabnikov in vlog          | US-03, US-04 |     |
| F3 Upravljanje programov in lekcij          | US-05, US-06 | da  |
| F4 Dodelitev predavateljev lekcijam         | US-07        | da  |
| F5 Koledar predavatelja                     | US-08        | da  |
| F6 Prijava prisotnosti                      | US-09        | da  |
| F7 Potrditev ali zavrnitev prisotnosti      | US-10, US-11 | da  |
| F8 Zamenjava predavatelja                   | US-12        | da  |
| F9 Zaklep meseca                            | US-13        |     |
| F10 Statistika sistema                      | US-14        |     |
| F11 Izvoz lekcije v .ics                    | US-15        |     |
| F12 Državni prazniki                        | US-16        |     |
| F13 Profil in osebna statistika             | US-17        |     |

---

## US-01 – Prijava in odjava

**Funkcionalnost:** F1

**Vloga:** katera koli vloga (administrator, koordinator, predavatelj)

**Kot** uporabnik **želim** se prijaviti z e-pošto in geslom ter se po koncu dela odjaviti, **da** so moji podatki dostopni samo meni.

**Merila sprejemljivosti:**

1. Uporabnik z veljavno e-pošto in geslom se prijavi in je preusmerjen na začetno stran svoje vloge (administrator na statistiko, koordinator na seznam programov, predavatelj na koledar).
2. Ob napačni e-pošti ali geslu sistem prikaže sporočilo »Napačna e-pošta ali geslo« in ne razkrije, katera od obeh vrednosti je napačna.
3. Deaktiviran uporabnik se ne more prijaviti, sporočilo pa pove, da je račun onemogočen.
4. Če uporabnik odpre stran, namenjeno drugi vlogi (npr. predavatelj odpre seznam uporabnikov), vidi sporočilo o zavrnjenem dostopu.

---

## US-02 – Ustvarjanje uporabniških računov

**Funkcionalnost:** F2

**Vloga:** administrator

**Kot** administrator **želim** ustvariti račun za novega uporabnika in mu dodeliti vlogo, **da** lahko ljudje iz moje organizacije začnejo uporabljati sistem.

**Merila sprejemljivosti:**

1. Obrazec zahteva ime in priimek, e-pošto, vlogo in začetno geslo. Brez teh podatkov se račun ne ustvari.
2. Če račun z isto e-pošto že obstaja, sistem prikaže napako in novega računa ne ustvari.
3. Ob prvi prijavi mora uporabnik začetno geslo spremeniti, preden lahko uporablja sistem.
4. Geslo je v bazi shranjeno zgoščeno, nikoli kot čisto besedilo.
5. Koordinatorji in predavatelji nimajo pravic za ustvarjanje računov.

---

## US-03 – Pregled uporabnikov in sprememba vloge

**Funkcionalnost:** F2

**Vloga:** administrator

**Kot** administrator **želim** pregledati uporabnike in spremeniti vlogo posameznega uporabnika, **da** pravice dobijo prave osebe.

**Merila sprejemljivosti:**

1. Seznam prikazuje ime, e-pošto, vlogo in stanje računa, iskati pa ga je mogoče po imenu ali e-pošti.
2. Administrator izbere eno od treh vlog. Po shranjevanju se nova vloga uporabi pri naslednji zahtevi tega uporabnika.
3. Koordinatorji in predavatelji nimajo pravic za ogled seznama uporabnikov ali spreminjanje vlog.
4. Administrator ne more spremeniti vloge lastnemu računu, da sistem nikoli ne ostane brez administratorja.

---

## US-04 – Deaktivacija računa

**Funkcionalnost:** F2

**Vloga:** administrator

**Kot** administrator **želim** deaktivirati račun uporabnika, ki ne sodeluje več, **da** se ne more več prijaviti, njegova zgodovina pa ostane ohranjena.

**Merila sprejemljivosti:**

1. Deaktiviran uporabnik se ne more prijaviti in ne more pridobiti novega žetona.
2. Dodelitve in prijave prisotnosti deaktiviranega uporabnika ostanejo v bazi in so še vedno vidne koordinatorju.
3. Računa ni mogoče izbrisati, samo deaktivirati. V vmesniku ni gumba za brisanje.
4. Administrator ne more deaktivirati lastnega računa.
5. Administrator lahko deaktiviran račun ponovno aktivira.

---

## US-05 – Ustvarjanje in upravljanje programov

**Funkcionalnost:** F3

**Vloga:** koordinator programa

**Kot** koordinator **želim** ustvariti program z naslovom in opisom, **da** lahko vanj začnem dodajati lekcije.

**Merila sprejemljivosti:**

1. Naslov programa je obvezen, opis pa neobvezen.
2. Nov program je samodejno povezan s prijavljenim koordinatorjem.
3. Seznam programov prikazuje samo programe prijavljenega koordinatorja. Če koordinator poskuša odpreti program drugega koordinatorja, nima pravic za ogled.
4. Koordinator lahko uredi naslov in opis programa.
5. Pred brisanjem programa sistem zahteva potrditev in navede število lekcij, ki bodo izbrisane skupaj z njim. Programa z zaklenjenim mesecem ni mogoče izbrisati.

---

## US-06 – Dodajanje lekcij v program

**Funkcionalnost:** F3

**Vloga:** koordinator programa

**Kot** koordinator **želim** programu dodati lekcijo z naslovom, začetkom, koncem in opisom, **da** je urnik programa popoln.

**Merila sprejemljivosti:**

1. Naslov, začetek in konec so obvezni, opis pa je neobvezen.
2. Konec mora biti kasneje kot začetek, sicer sistem prikaže napako in lekcije ne shrani.
3. Lekcije, ki se začne v zaklenjenem mesecu, ni mogoče ustvariti, sistem pa prikaže sporočilo, da je mesec zaklenjen.
4. Koordinator lahko lekcijo uredi ali izbriše samo v svojem programu in samo, če mesec ni zaklenjen.
5. Nova lekcija se takoj pojavi na seznamu lekcij programa, razvrščenem po začetku.

---

## US-07 – Dodelitev predavateljev lekciji

**Funkcionalnost:** F4

**Vloga:** koordinator programa

**Kot** koordinator **želim** lekciji dodeliti enega ali več predavateljev, **da** je vsaka lekcija pokrita in se termini predavateljev ne prekrivajo.

**Merila sprejemljivosti:**

1. Koordinator predavatelja poišče po imenu in izbere enega ali več. Seznam vsebuje samo aktivne uporabnike z vlogo predavatelja.
2. Če je predavatelj v istem terminu že dodeljen drugi lekciji, sistem dodelitev zavrne in navede naslov lekcije, s katero se prekriva. Lekciji, ki se konča ob 10.00, in lekciji, ki se začne ob 10.00, se ne štejeta za prekrivanje.
3. Isti predavatelj ne more biti isti lekciji dodeljen dvakrat.
4. Nova dodelitev dobi stanje ASSIGNED in se pojavi v koledarju predavatelja.
5. V zaklenjenem mesecu sistem dodelitev zavrne s sporočilom, da je mesec zaklenjen.

---

## US-08 – Koledar predavatelja

**Funkcionalnost:** F5

**Vloga:** predavatelj

**Kot** predavatelj **želim** videti mesečni koledar svojih lekcij, **da** vem, kdaj predavam.

**Merila sprejemljivosti:**

1. Koledar privzeto prikaže tekoči mesec in omogoča premik na prejšnji in naslednji mesec.
2. Prikazane so samo lekcije, pri katerih sem dodeljen, lekcij drugih predavateljev pa ne vidim.
3. Vsaka lekcija je barvno označena glede na stanje, koledar pa ima legendo barv.
4. Klik na lekcijo odpre podrobnosti z naslovom, programom, začetkom, koncem, opisom in stanjem.
5. Če v mesecu ni lekcij, koledar prikaže besedilo »V tem mesecu nimate lekcij«.

---

## US-09 – Prijava prisotnosti

**Funkcionalnost:** F6

**Vloga:** predavatelj

**Kot** predavatelj **želim** pri lekciji prijaviti, da sem bil prisoten ali odsoten, **da** lahko koordinator potrdi izvedbo.

**Merila sprejemljivosti:**

1. Prijavo je mogoče oddati samo za lekcije, katerih datum je danes ali v preteklosti. Pri prihodnjih lekcijah je gumb za prijavo onemogočen.
2. Predavatelj izbere »prisoten« ali »odsoten«. Po oddaji ima dodelitev stanje REPORTED, sistem pa zabeleži čas prijave.
3. Predavatelj lahko odda prijavo samo za lekcije, pri katerih je sam dodeljen.
4. Prijave v stanju REPORTED ni več mogoče spreminjati. Prijavo v stanju REJECTED lahko predavatelj popravi in ponovno odda.
5. V zaklenjenem mesecu prijave ni mogoče oddati ali spremeniti.

---

## US-10 – Potrditev prijavljene prisotnosti

**Funkcionalnost:** F7

**Vloga:** koordinator programa

**Kot** koordinator **želim** pregledati čakajoče prijave prisotnosti in jih potrditi, **da** so potrjeni podatki zanesljiva podlaga za obračun.

**Merila sprejemljivosti:**

1. Seznam čakajočih prijav vsebuje samo prijave za lekcije mojih programov in prikazuje predavatelja, lekcijo, datum ter prijavljeno vrednost.
2. Potrditev spremeni stanje v CONFIRMED in zabeleži, kdo je prijavo potrdil in kdaj.
3. Potrjene prijave ni več mogoče spreminjati.
4. Koordinator ne vidi in ne more potrditi prijav, ki pripadajo programom drugih koordinatorjev.
5. Prijave za lekcijo v zaklenjenem mesecu ni mogoče potrditi.

---

## US-11 – Zavrnitev prijavljene prisotnosti z razlogom

**Funkcionalnost:** F7

**Vloga:** koordinator programa

**Kot** koordinator **želim** prijavo prisotnosti zavrniti z razlogom, **da** predavatelj ve, kaj mora popraviti.

**Merila sprejemljivosti:**

1. Zavrnitev zahteva neprazen razlog. Brez njega sistem zavrnitve ne shrani.
2. Zavrnitev spremeni stanje v REJECTED in shrani razlog, koordinatorja ter čas pregleda.
3. Predavatelj razlog vidi v podrobnostih lekcije, koledar pa lekcijo označi kot zavrnjeno.
4. Ko predavatelj prijavo popravi in jo ponovno odda, se stanje vrne na REPORTED in prijava se spet pojavi na seznamu čakajočih.
5. Prijave za lekcijo v zaklenjenem mesecu ni mogoče zavrniti.

---

## US-12 – Zamenjava predavatelja

**Funkcionalnost:** F8

**Vloga:** koordinator programa

**Kot** koordinator **želim** pri lekciji zamenjati predavatelja z drugim, **da** je lekcija izvedena tudi takrat, ko prvotni predavatelj ne more predavati.

**Merila sprejemljivosti:**

1. Zamenjava je mogoča samo, dokler ima dodelitev stanje ASSIGNED.
2. Koordinator novega predavatelja izbere med aktivnimi predavatelji, pri tem pa velja enako preverjanje prekrivanja kot pri dodelitvi.
3. Obrazec za zamenjavo zahteva vnos razloga zamenjave.
4. Po zamenjavi prvotni predavatelj lekcije ne vidi več v svojem koledarju, novi predavatelj pa jo vidi v stanju ASSIGNED.
5. Zamenjava v zaklenjenem mesecu ni mogoča.

---

## US-13 – Zaklep meseca

**Funkcionalnost:** F9

**Vloga:** koordinator programa

**Kot** koordinator **želim** zakleniti zaključen mesec v svojem programu, **da** se potrjeni podatki ne morejo več spreminjati.

**Merila sprejemljivosti:**

1. Zakleniti je mogoče samo mesec, ki se je že končal, in to samo prvi še nezaklenjeni mesec. Meseci se zaklepajo po vrsti.
2. Pred zaklepom sistem prikaže število prijav, ki še niso potrjene ali zavrnjene, in zahteva potrditev.
3. Po zaklepu je locked_until nastavljen na prvi dan naslednjega meseca.
4. Sistem zavrne vsako spremembo lekcij, dodelitev, zamenjav, prijav in potrditev za lekcije, ki se začnejo pred tem datumom, in prikaže sporočilo, da je mesec zaklenjen.
5. Mesec lahko zaklene samo koordinator in samo v svojem programu. Administrator in predavatelj za to nimata pravic.

---

## US-14 – Statistika sistema

**Funkcionalnost:** F10

**Vloga:** administrator

**Kot** administrator **želim** videti kazalnike in grafikone za celoten sistem, **da** ocenim obseg uporabe in izvedbe lekcij.

**Merila sprejemljivosti:**

1. Stran prikazuje kazalnike števila uporabnikov po vlogah, števila programov in števila lekcij.
2. Grafikon prikazuje število dodelitev po stanjih za izbrani mesec.
3. Grafikon prikazuje število potrjenih lekcij po programih za izbrani mesec.
4. Sprememba meseca osveži grafikone brez ponovnega nalaganja strani.
5. Koordinatorji in predavatelji nimajo pravic za ogled statistike sistema.

---

## US-15 – Izvoz lekcije v .ics

**Funkcionalnost:** F11

**Vloga:** predavatelj

**Kot** predavatelj **želim** lekcijo izvoziti v format .ics, **da** jo dodam v svoj koledar.

**Merila sprejemljivosti:**

1. V podrobnostih lastne lekcije je gumb »Izvozi v .ics«, ki prenese datoteko .ics.
2. Datoteka vsebuje naslov, začetek, konec in opis lekcije, z ustreznim časovnim pasom.
3. Datoteko je mogoče uvoziti v Google Koledar ali Outlook kot en sam dogodek.
4. Za lekcijo, pri kateri predavatelj ni dodeljen, izvoz ni dovoljen.

---

## US-16 – Državni prazniki v koledarju

**Funkcionalnost:** F12

**Vloga:** koordinator programa

**Kot** koordinator **želim**, da koledar prikaže državne praznike in me opozori na lekcijo na praznik, **da** se izognem lekcijam na dela prost dan.

**Merila sprejemljivosti:**

1. Državni prazniki so v koledarju označeni z imenom praznika. Enake oznake vidi predavatelj v svojem koledarju.
2. Ko koordinator lekcijo, ki je na praznik, dodeli predavatelju, sistem prikaže opozorilo z imenom praznika in zahteva potrditev. Dodelitve ne prepreči.
3. Backend praznike pridobi iz javnega API-ja enkrat dnevno in jih predpomni.
4. Če zunanji API ni dosegljiv, koledar prikaže zadnje predpomnjene praznike, ali nobenega, če jih ni, in ne prikaže napake.

---

## US-17 – Profil in osebna statistika

**Funkcionalnost:** F13

**Vloga:** predavatelj

**Kot** predavatelj **želim** videti svoj profil in osebno statistiko, **da** imam pregled nad svojimi lekcijami.

**Merila sprejemljivosti:**

1. Profil prikazuje ime in priimek, e-pošto in vlogo.
2. Statistika prikazuje število dodeljenih, potrjenih, odsotnih in čakajočih lekcij.
3. Dodeljene lekcije so vse moje dodelitve, potrjene lekcije so tiste s stanjem CONFIRMED in prisotnostjo PRESENT, odsotne lekcije so tiste s stanjem CONFIRMED in prisotnostjo ABSENT, čakajoče lekcije pa tiste s stanjem REPORTED.
4. Številke se ujemajo z lekcijami, ki jih predavatelj vidi v svojem koledarju.
5. Predavatelj vidi samo svojo statistiko, ne tudi statistike drugih predavateljev.
