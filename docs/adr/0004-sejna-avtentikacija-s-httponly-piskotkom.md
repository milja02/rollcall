---
status: sprejeto
date: 2026-11-02
decision-makers: Nikola Miljković
---

# Sejna avtentikacija s piškotkom HttpOnly namesto JWT

## Kontekst in problem

Prva odločitev loči odjemalca od strežnika, zato mora vsaka zaščitena zahteva identificirati uporabnika. Strežnik mora pri vsaki zahtevi vedeti, kdo je uporabnik in katero vlogo ima, ker so pravice odvisne od vloge. Administrator lahko deaktivira račun in spremeni vlogo uporabnika, obe spremembi pa morata začeti veljati takoj.

## Obravnavane možnosti

- Seje Django s piškotkom HttpOnly prek razreda SessionAuthentication v DRF
- JWT v glavi Authorization prek knjižnice simplejwt
- Statični žeton, shranjen v bazi, prek razreda TokenAuthentication v DRF

## Odločitev

Izbrana možnost: seje Django s piškotkom HttpOnly, ker so vgrajene v Django in DRF, odjava sejo na strežniku takoj odstrani, skripte na strani pa piškotka ne morejo prebrati.

JWT prek knjižnice simplejwt ni bil izbran, ker tu ne prinaša prave prednosti. Knjižnica pri vsaki zahtevi naloži uporabnika iz baze, zato strežnik ni brez stanja, odjemalec pa kljub temu potrebuje kratkotrajne dostopne žetone, žetone za osvežitev in obdelavo osveževanja. Za preklic žetona pred iztekom je potrebna tudi tabela črnega seznama v bazi. Statični žeton DRF je preprostejši od JWT, vendar ga mora odjemalec shraniti tam, kjer ga skripte lahko preberejo, sam od sebe pa ne poteče.

Sejni piškotek zahteva, da sta odjemalec in API na istem izvoru. Med razvojem strežnik Vite zahteve za API posreduje Djangu, zato nastavitve CORS niso potrebne. Prenos datoteke .ics za lekcijo (F11) je običajna zahteva iz brskalnika in deluje s sejo. Če bo pozneje dodana mobilna aplikacija, DRF omogoča, da se ob sejah doda še en razred avtentikacije.

### Posledice

- Dobro, ker deaktivacija in sprememba vloge začneta veljati pri naslednji zahtevi, saj se obe bereta iz baze.
- Dobro, ker je odjava takojšnja, saj se seja izbriše na strežniku.
- Dobro, ker skripte sejnega piškotka ne morejo prebrati, zato napaka XSS ne more ukrasti seje.
- Dobro, ker ni potrebna dodatna knjižnica ne koda za osveževanje žetonov.
- Slabo, ker zahteve, ki spreminjajo podatke, potrebujejo zaščito CSRF, zato mora odjemalec žeton CSRF pošiljati v glavi.
- Slabo, ker lahko napaka XSS še vedno pošilja zahteve v imenu uporabnika, dokler je stran odprta.
- Slabo, ker morata biti odjemalec in API postrežena z istega izvora, za kar je potreben posrednik med razvojem in v produkciji.
- Slabo, ker odjemalci, ki ne morejo hraniti piškotkov, potrebujejo ločen razred avtentikacije.
