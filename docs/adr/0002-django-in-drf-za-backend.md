---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# Django in Django REST Framework za strežniški del

## Kontekst in problem

Strežnik mora pokriti uporabniške račune z gesli, tri vloge z različnimi pravicami, štiri med sabo povezane tabele in shemo, ki se bo skozi semester še spreminjala. Domena je večinoma ustvarjanje, branje, posodabljanje in brisanje nad relacijskimi podatki, na to pa je položenih nekaj pravil, kot so prekrivanje terminov, prehodi stanj prijave in zaklep meseca. Vzporednosti je malo, dolgotrajnih povezav ni, nič se ne pretaka.

Projekt razvija en razvijalec v enem semestru, zato je pomembno, koliko infrastrukture je treba napisati, preden nastane prva funkcionalnost. Python je jezik, v katerem želim delati na tem projektu, kar izbiro zoži na ogrodja v Pythonu.

## Obravnavane možnosti

- Django in Django REST Framework
- FastAPI s SQLAlchemy in Alembic
- Flask z izbranimi razširitvami

## Odločitev

Izbrana možnost: Django in Django REST Framework.

Odloči to, česa ni treba napisati. Uporabniški model, zgoščevanje gesel, ORM in migracije so del ogrodja. Pri FastAPI ali Flasku bi vsako od teh sestavil iz knjižnic in se o vsaki odločal posebej, kar je delo, opravljeno pred prvo funkcionalnostjo in brez nje.

FastAPI si sloves prisluži pri vzporednosti in asinhronem delu. Ta aplikacija nima ne enega ne drugega. Edina asinhrona stvar v zasnovi je klic zunanjega API s prazniki, ki ga rešimo s predpomnjenjem enkrat na dan namesto s čakanjem znotraj zahteve, kar je boljša zasnova pod katerim koli ogrodjem.

Razredi pravic v DRF se ujamejo s tremi vlogami neposredno. Pravico zapišemo enkrat, jo poimenujemo in priložimo pogledom, ki jo potrebujejo, namesto da jo ročno preverjamo v vsakem pogledu, kjer je na enega lahko pozabiti.

### Posledice

- Dobro, ker so uporabniki, gesla, migracije in administracijska stran na voljo takoj in jih ni treba sestavljati.
- Dobro, ker razredi pravic zberejo avtorizacijo po vlogah na eno mesto, kjer jo je mogoče preizkusiti ločeno od poslovne logike.
- Dobro, ker migracije pokrijejo spremembe sheme, ki jih skozi semester pričakujemo, skupaj s potjo nazaj, kadar se sprememba ne obnese.
- Dobro, ker je avtentikacija, izbrana v ADR-0004, prav tista, ki jo Django prinaša s seboj, zato seje, zgoščevanje gesel in prijavni tok uporabljamo tako, kot je ogrodje zamišljeno, namesto da bi jih nadomeščali.
- Slabo, ker je Django večji in bolj mnenjski od alternativ. Njegovih konvencij se je treba naučiti in ne jih uganiti, poleg tega pa za majhen API prinese opazno število datotek.
- Slabo, ker privzeti sinhroni model pomeni, da klica za praznike ni mogoče preprosto počakati. Rešiti ga je treba s predpomnjenjem, kar je nujno in ne izbirno, pri FastAPI pa ne bi bilo potrebno.
- Slabo, ker ORM pri bolj zapletenih poizvedbah, kakršna je iskanje prekrivajočih se terminov, skrije nastali SQL. Tega je treba pogledati, da poizvedba v zanki ne ostane neopažena.
