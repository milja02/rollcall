---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# Docker Compose za lokalno razvojno okolje

## Kontekst in problem

Aplikacija ima tri dele: PostgreSQL, strežnik Django in razvojni strežnik Vite. Vsak potrebuje svoje izvajalno okolje in svojo različico Pythona, Noda ali PostgreSQL.

Projekt se ocenjuje, zato ga mora zagnati tudi nekdo, ki ga ni razvil, brez dodatnih nastavitev. Razvijam na Windows, kjer starejša namestitev PostgreSQL iz drugega projekta že zaseda privzeta vrata.

Vprašanje je, kako opisati okolje, da se na vsakem računalniku zažene enako.

## Obravnavane možnosti

- Vse nameščeno na gostitelju: PostgreSQL kot storitev, virtualno okolje za Python in npm za odjemalca
- V Dockerju samo baza, obe aplikaciji pa na gostitelju
- Docker Compose za vse tri dele
- Devcontainer v orodju Visual Studio Code

## Odločitev

Izbrana možnost: Docker Compose za vse tri dele, ker se celoten projekt zažene z enim ukazom, edina zahteva pa je Docker. Različice Pythona, Noda in PostgreSQL so določene v repozitoriju, vsebnik z bazo pa je ločen od vsake namestitve PostgreSQL na gostitelju. Ob zagonu vsebnika za backend se izvedejo migracije in naložijo demo podatki z enim uporabnikom za vsako vlogo, zato je sistem mogoče uporabljati takoj po prvem zagonu.

Če bi bilo vse nameščeno na gostitelju, bi vsak računalnik potreboval prave različice Pythona, Noda in PostgreSQL. Samo baza v Dockerju je hitrejša za vsakodnevno delo, vendar na gostitelju še vedno zahteva Python in Node. Devcontainer bi dal enak rezultat, vendar okolje veže na Visual Studio Code.

### Posledice

- Dobro, ker se projekt zažene z enim ukazom, vse različice pa so določene v repozitoriju.
- Dobro, ker je okolje na vsakem računalniku enako.
- Dobro, ker baza ni v sporu z namestitvijo PostgreSQL na gostitelju, ne glede vrat ne glede podatkov.
- Dobro, ker so demo podatki na voljo že po prvem zagonu.
- Slabo, ker je ponovna gradnja slik počasna, Docker Desktop na Windows pa porabi veliko pomnilnika.
- Slabo, ker samodejno osveževanje odjemalca v vsebniku zahteva dodatno nastavitev priklopov in spremljanja datotek.
- Slabo, ker je razhroščevanje iz urejevalnika zahtevnejše, saj se mora razhroščevalnik povezati s procesom v vsebniku.
- Slabo, ker mora biti nameščen Docker, sicer projekta ni mogoče zagnati.
