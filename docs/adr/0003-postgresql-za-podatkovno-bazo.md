---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# PostgreSQL za podatkovno bazo

## Kontekst in problem

Podatkovni model sestavljajo štiri povezane entitete, in sicer uporabnik, program, lekcija in dodelitev lekcije, pri čemer je razmerje med lekcijo in predavateljem mnogo proti mnogo. Zapis o potrjeni izvedbi je podlaga za izplačilo predavateljem, zato napačna ali manjkajoča vrstica ni le nerodnost pri uporabi, ampak neposredna napaka v izplačilu.

Bazi postavljata zahteve dve pravili. Dodelitev predavatelja lekciji mora biti zavrnjena, kadar je ta predavatelj v istem terminu že dodeljen drugi lekciji, kar pomeni zaznavanje prekrivajočih se časovnih intervalov in zagotovilo, da med preverjanjem in vpisom ne nastane konkurenčna dodelitev. Lekcije imajo tudi začetek in konec, shranjena kot časovna žiga, semester pa sega čez prehod na zimski čas, zato mora baza pravilno hraniti časovni pas.

## Obravnavane možnosti

- PostgreSQL
- MySQL ali MariaDB
- SQLite
- Dokumentna baza, na primer MongoDB

## Odločitev

Izbrana možnost: PostgreSQL.

Na tem projektu so tuji ključi, enolične omejitve in transakcije zahteva in ne priročnost. Dodelitev predavatelja je preverjanje, ki mu sledi vpis, in oboje se mora zgoditi kot ena operacija. Brez tega zagotovila lahko dve hkrati oddani dodelitvi obe prestaneta preverjanje in obe nastaneta, kar je natanko tisto dvojno rezervacijo, ki naj bi jo funkcionalnost preprečila.

PostgreSQL to pokrije in ponudi še dvoje. Tip timestamptz shrani časovni žig skupaj s časovnim pasom, kar je tisto, kar prehod na zimski čas potrebuje. Tipi obsegov in omejitev izključevanja, zgrajena nad njimi, puščajo odprto možnost, da prepoved prekrivanja terminov preselimo v samo shemo, če se preverjanje v aplikacijski kodi izkaže za nezadostno. S tem pravilo, ki ga uveljavlja koda, postane pravilo, ki ga baza ne more prekršiti.

Dokumentna baza je bila zavrnjena zaradi oblike podatkov in ne zaradi nagnjenja. Skoraj vsaka poizvedba prečka več entitet, denimo koledar enega predavatelja, čakajoče prijave enega programa ali potrjene ure enega meseca. V dokumentnem modelu to pomeni podvajanje podatkov in ročno skrb za njihovo skladnost, kar je prav težava, zaradi katere relacijske baze obstajajo.

SQLite je privlačen, ker je ena sama datoteka, a tipe preverja ohlapno, vzporedno pisanje obvladuje slabo in nima ne časovne ne obsegovne podpore, na katero se pravilo o prekrivanju opira.

MySQL bi večino tega pokril. Proti njemu je odločila šibkejša podpora časovnim tipom in obsegom ter to, da je PostgreSQL v Djangu prvorazredno podprta baza s polji in funkcijami, ki jih drugi gonilniki ne ponujajo.

### Posledice

- Dobro, ker nekonsistentne podatke preprečuje baza in ne le aplikacijska logika. Tuj ključ ali enolična omejitev drži tudi takrat, kadar se v kodo prikrade napaka.
- Dobro, ker tip timestamptz in podpora obsegom pravilno pokrijeta trajanje lekcij in prehod na zimski čas.
- Dobro, ker je prepoved prekrivajočih se terminov pozneje mogoče uveljaviti v shemi, ne da bi menjali bazo.
- Slabo, ker baza teče kot ločen proces in zato potrebuje vsebnik. Projekta ni mogoče zagnati tako preprosto, kot bi ga ob eni sami datoteki SQLite.
- Slabo, ker mora razvijalec poznati osnove upravljanja baze, to je vloge, varnostne kopije in obnovitev, česar SQLite ne zahteva.
- Slabo, ker so testi nad pravo bazo počasnejši od testov nad bazo v pomnilniku, kar se pozna, kadar tečejo pogosto.
