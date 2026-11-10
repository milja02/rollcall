---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# Django in Django REST Framework za strežniški del

## Kontekst in problem

Strežnik mora upravljati uporabniške račune z gesli, tri vloge z različnimi pravicami in štiri povezane tabele, katerih shema se bo med semestrom spreminjala. Večina dela je ustvarjanje, branje, posodabljanje in brisanje relacijskih podatkov, nad tem pa je nekaj pravil, kot so prekrivanje terminov, prehodi stanj prijav in zaklep meseca. Sočasnih zahtev je malo, dolgotrajnih povezav ni, podatki pa se ne pretakajo.

Projekt razvija en razvijalec v enem semestru, zato naj ogrodje ponudi čim več osnovne infrastrukture. Strežnik je napisan v Pythonu.

## Obravnavane možnosti

- Django in Django REST Framework
- FastAPI s SQLAlchemy in Alembic
- Flask z izbranimi razširitvami

## Odločitev

Izbrana možnost: Django in Django REST Framework, ker so uporabniški model, zgoščevanje gesel, ORM, migracije in administratorski vmesnik del ogrodja in jih ni treba sestavljati iz ločenih knjižnic. Tri vloge se neposredno preslikajo v razrede pravic v DRF, ki se napišejo enkrat in pripnejo pogledom.

FastAPI in Flask bi zahtevala, da pred prvo funkcionalnostjo izberemo in povežemo knjižnice za uporabnike, bazo in migracije. Glavna prednost FastAPI, asinhrona obdelava zahtev, v sistemu z malo sočasnimi zahtevami ni potrebna.

### Posledice

- Dobro, ker so uporabniki, gesla, migracije in administratorski vmesnik na voljo od začetka.
- Dobro, ker so preverjanja vlog zbrana v razredih pravic na enem mestu in jih je mogoče preizkušati ločeno od poslovne logike.
- Dobro, ker migracije pokrijejo spremembe sheme, pričakovane med semestrom, in jih je mogoče razveljaviti.
- Dobro, ker je sejna avtentikacija, izbrana v ADR-0004, vgrajena v Django.
- Slabo, ker je Django večji in bolj predpisujoč kot FastAPI ali Flask, njegove konvencije pa se je treba naučiti.
- Slabo, ker je Django privzeto sinhron, zato je klic zunanjega API za praznike rešen s predpomnjenjem in ne med obdelavo zahteve.
- Slabo, ker ORM skrije ustvarjeni SQL, zato je treba zahtevnejše poizvedbe, kot je preverjanje prekrivanja, pregledati, da ne nastajajo nepotrebne poizvedbe.
