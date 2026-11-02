---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# Docker Compose za lokalno razvojno okolje

## Kontekst in problem

Za zagon aplikacije so potrebni trije deli, in sicer PostgreSQL, strežnik Django in razvojni strežnik Vite. Vsak od njih pričakuje svoje okolje in svojo različico Pythona, Node ali PostgreSQL.

Projekt bo ocenjen, zato ga bo moral zagnati nekdo, ki ga ni gradil in ki ne bo iskal razloga, zakaj se ne zažene. Razvijam na sistemu Windows, kjer je PostgreSQL nameščen kot storitev in zaseda privzeta vrata, na računalniku pa je že druga namestitev iz prejšnjega projekta.

Vprašanje je torej, kako okolje opisati tako, da se na drugem računalniku postavi enako.

## Obravnavane možnosti

- Vse nameščeno na gostitelju, torej PostgreSQL kot storitev, virtualno okolje za Python in npm za odjemalca
- V Dockerju samo baza, obe aplikaciji pa neposredno na gostitelju
- Docker Compose za vse tri dele
- Devcontainer v orodju Visual Studio Code

## Odločitev

Izbrana možnost: Docker Compose za vse tri dele.

Odloči zahteva, da je navodilo za zagon en ukaz, ki počiva na eni predpostavki, to je na nameščenem Dockerju. To je pomembno, ker projekt poganjajo ljudje, ki ga niso gradili, in ker vsak od treh delov pričakuje svojo različico Pythona, Node ali PostgreSQL. Zapis teh različic v repozitorij nadomesti navodila, napisana v besedilu, ki se slabo starajo in se berejo izbirno. Baza v vsebniku je poleg tega izolirana od namestitve na razvojnem računalniku, kjer PostgreSQL teče kot storitev na privzetih vratih, kar odpravi spor, ki bi ga sicer morali pojasniti vsakomur, ki projekt zažene.

Migracije in demo podatki, po en uporabnik za vsako vlogo, se izvedejo ob zagonu vsebnika z zalednim delom, zato je sistem uporaben takoj in ne šele po dokumentiranem zaporedju namestitvenih ukazov.

Srednja možnost, torej baza v vsebniku in obe aplikaciji na gostitelju, je za vsakodnevno delo hitrejša in jo mnogi projekti izberejo. Zavrnjena je, ker od tistega, ki projekt zažene, še vedno zahteva pravo različico Pythona in Node, prav ti dve stvari pa naj bi ta odločitev odpravila.

Devcontainer bi dosegel enak izid, a bi okolje vezal na Visual Studio Code. Compose deluje iz katerega koli urejevalnika in ga uporabimo tudi takrat, kadar aplikacijo le zaženemo in je ne urejamo.

### Posledice

- Dobro, ker je zagon projekta en sam ukaz, odvisnosti z različicami pa so vidne v repozitoriju in se spremljajo skupaj s kodo.
- Dobro, ker je okolje enako na vsakem računalniku, kar odpravi razred težav, ki se pokažejo šele pri drugem človeku, ki projekt zažene.
- Dobro, ker je baza izolirana od namestitve na gostitelju in z njo ne tekmuje ne za vrata ne za podatke.
- Dobro, ker je sistem po prvem zagonu že napolnjen z demo podatki in ga je mogoče takoj preizkusiti.
- Slabo, ker je ponovno grajenje slik počasno, Docker Desktop pa porabi opazno količino pomnilnika, kar se pozna ob vsaki spremembi odvisnosti.
- Slabo, ker sprotno osveževanje odjemalca v vsebniku ne deluje samo po sebi. Zahteva pravilno nastavljene priklope in opazovanje datotek s poizvedovanjem, torej nastavitev, ki se je pri zagonu na gostitelju ne bi dotaknili.
- Slabo, ker razhroščevanje iz urejevalnika zahteva priklop na proces v vsebniku in ne na lokalni proces.
- Slabo, ker Docker postane predpogoj za razvoj. Brez delujoče namestitve projekta ni mogoče zagnati niti deloma.
