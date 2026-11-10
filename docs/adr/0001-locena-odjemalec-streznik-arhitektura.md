---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# Ločena odjemalec in strežnik z REST API namesto strežniško izrisanega monolita

## Kontekst in problem

RollCall ima tri vloge in vsaka dela z drugim delom sistema. Predavatelj uporablja mesečni koledar, koordinator pregleduje čakajoče prijave prisotnosti, administrator pa upravlja uporabniške račune. Sistem razvija en razvijalec v enem semestru, iste podatke pa naj bi pozneje uporabljali tudi drugi odjemalci, na primer izvoz koledarja ali mobilna aplikacija.

Vprašanje je, ali RollCall zgraditi kot en projekt Django, ki vrača izrisane strani, ali kot ločen odjemalec, ki s strežnikom komunicira prek REST API.

## Obravnavane možnosti

- Monolit Django s predlogami in izrisom na strežniku
- Monolit Django s predlogami in delnim osveževanjem prek HTMX
- Ločen odjemalec in strežnik, ki ponuja REST API

## Odločitev

Izbrana možnost: ločen odjemalec in strežnik, ki ponuja REST API, ker API postane edini vmesnik do sistema. Vsa poslovna pravila, kot so zaznavanje prekrivanja terminov, zaklep meseca in pravice vlog, se uveljavljajo na strežniku, vsak odjemalec pa jih uporablja prek istih končnih točk. Odjemalec je napisan v Reactu, ki je hkrati del sklada, ki se ga želim na tem projektu naučiti.

Monolit Django s predlogami bi zahteval najmanj kode, vendar bi bilo treba za vsakega odjemalca, ki ni brskalnik, dodati ločen API. HTMX bi omogočil interaktivne strani z malo JavaScripta, vendar bi bil vmesnik še vedno vezan na strežnik.

### Posledice

- Dobro, ker se vsako pravilo uveljavi na enem mestu, zato odjemalec ne more povzročiti dvojne dodelitve ali spremeniti potrjenega zapisa o izvedbi.
- Dobro, ker poznejši odjemalci, kot sta izvoz koledarja ali mobilna aplikacija, uporabljajo isti API brez sprememb na strežniku.
- Dobro, ker je odjemalca mogoče spremeniti ali zamenjati, ne da bi posegali v poslovna pravila.
- Dobro, ker je strežnik mogoče preizkušati samostojno, zato je pravilo o prekrivanju in zaklep meseca mogoče preveriti, še preden obstaja vmesnik.
- Slabo, ker vzdržujemo dva projekta, vsakega s svojimi odvisnostmi in zagonom.
- Slabo, ker je pred prvim delujočim zaslonom potrebnega več dela, saj morajo najprej obstajati usmerjanje, upravljanje stanja in klici API.
- Slabo, ker je treba preverjanje vnosov ter stanja nalaganja, praznega seznama in napake izdelati tudi v odjemalcu.
