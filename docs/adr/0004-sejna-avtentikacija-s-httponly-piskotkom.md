---
status: sprejeto
date: 2026-11-02
decision-makers: Nikola Miljković
---

# Sejna avtentikacija s piškotkom HttpOnly namesto JWT

## Kontekst in problem

Iz ADR-0001 sledi, da odjemalec teče ločeno od strežnika, zato mora vsaka zaščitena zahteva s seboj prinesti dokazilo o prijavi. Strežnik mora ob vsaki zahtevi vedeti, kdo je uporabnik in katero vlogo ima, ker so pravice vezane na vlogo.

Izbiro omejujeta dve funkcionalnosti. Administrator lahko račun deaktivira in administrator lahko uporabniku spremeni vlogo. Oboje mora učinkovati takoj in ne šele ob kakšnem poznejšem trenutku, saj se s prvim dostop odvzame, z drugim pa podeli.

Prvi načrtovalski dokument je izbral JWT, kot razloga pa navedel odsotnost stanja in preprosto uporabo iz drugih odjemalcev. Med načrtovanjem izvedbe sem to izbiro ponovno pretehtal in jo obrnil. Ta ADR zapisuje odločitev, ki velja, in zakaj se je spremenila.

## Obravnavane možnosti

- Seje Django s piškotkom HttpOnly prek razreda SessionAuthentication v DRF
- JWT v glavi Authorization prek knjižnice simplejwt
- Statični žeton, shranjen v bazi, prek razreda TokenAuthentication v DRF

## Odločitev

Izbrana možnost: seje Django s piškotkom HttpOnly.

Razlog, zaradi katerega je bil JWT sprva izbran, pod drobnogledom ne zdrži. Avtentikacijski razred v knjižnici simplejwt ob vsaki zahtevi naloži uporabnika iz baze in zahtevo zavrne, kadar je račun neaktiven, vlogo pa prebere iz uporabniškega zapisa in ne iz vsebine žetona. Deaktivacija in sprememba vloge torej pod JWT delujeta pravilno, kar je bil moj prvi ugovor proti njemu in je bil zmoten. Iz istega dejstva pa sledi, da se baza ob vsaki zahtevi tako ali tako poizveduje, zato odsotnosti stanja, zaradi katere se JWT izbira, nikoli zares ne dobimo. Ostane njena cena, in sicer kratka življenjska doba dostopnega žetona, osvežitveni žeton, samodejno osveževanje na odjemalcu in pravilno ravnanje z zahtevami, ki so v teku, ko se osveževanje začne.

Kar JWT resnično izgubi, in to popravek preživi, je preklic. Žeton velja do izteka in ničesar ga ne more odvzeti. Odjava ga izbriše na odjemalcu, sam žeton pa ostane uporaben vsakomur, ki ga je prepisal. Da bi odjava zares učinkovala, potrebujemo aplikacijo za črni seznam žetonov, ki izdane žetone hrani v tabeli v bazi. Na tej točki je zasnova seje sestavila znova, iz več delov, kot jih Django že ponuja, in z manj preizkušenosti.

Sejni piškotek vse to obrne. Preklic postane brisanje ene vrstice, zato odjava in deaktivacija računa učinkujeta takoj. Piškotek je označen kot HttpOnly, zato ga noben skript na strani ne more prebrati, kar pomeni, da napaka tipa cross-site scripting ne more pripeljati do seje, odnesene drugam in tam pozneje znova uporabljene. Django in DRF mehanizem ponujata v celoti, zato se koda, ki jo za avtentikacijo napišemo sami, skrči na pošiljanje žetona CSRF v glavi pri zahtevah, ki spreminjajo podatke.

Piškotek res zahteva, da brskalnik vidi odjemalca in API na enem izvoru. To zagotovi razvojni strežnik Vite, ki klice API posreduje Djangu, kar ima še dodaten učinek, da iz projekta odpade nastavljanje CORS.

Prenos koledarske datoteke za posamezno lekcijo, funkcionalnost F11, je običajna avtenticirana zahteva iz brskalnika in s piškotkom deluje nespremenjena. Pretplata koledarske aplikacije na vir je druga zgodba, saj tak odjemalec ne pošilja lastnih glav in ga v to ni mogoče prisiliti. To je poznejša nadgradnja in bo potrebovala podpisan naslov z neprozornim žetonom na uporabnika, ne glede na to, kako se prijavlja brskalnik. To velja zapisati, ker je nasprotna trditev, da bi JWT primer naročnine rešil, napačna.

Odpiranje API odjemalcem, ki niso brskalniki, je odloženo in ne opuščeno. DRF sprejme seznam avtentikacijskih razredov, zato je mogoče za mobilnega odjemalca pozneje dodati žetonski razred, ne da bi spremenili način prijave v brskalniku.

### Posledice

- Dobro, ker deaktivacija računa ali sprememba vloge učinkuje ob naslednji zahtevi, saj se oboje bere iz baze in nikjer ni shranjene kopije.
- Dobro, ker je odjava takojšnja in popolna, saj se sejna vrstica na strežniku izbriše.
- Dobro, ker piškotka noben skript ne more prebrati, zato napaka tipa cross-site scripting ne more pripeljati do ukradene seje, ki bi ostala uporabna pozneje.
- Dobro, ker je avtentikacija prav tista, ki jo ponujata Django in DRF, kar odpravi eno odvisnost skupaj z vso kodo za osveževanje žetonov.
- Slabo, ker zahteve, ki spreminjajo podatke, potrebujejo zaščito CSRF. Odjemalec mora prebrati piškotek CSRF in ga vrniti v glavi, ta piškotek pa je namenoma berljiv skriptom, zato zaščita CSRF ni obramba pred cross-site scriptingom in je ne smemo predstavljati kot tako.
- Slabo, ker lahko napaka tipa cross-site scripting še vedno pošilja zahteve v imenu uporabnika, dokler je stran odprta, čeprav same seje ne more ukrasti.
- Slabo, ker je avtentikacija odvisna od pravilno nastavljenega razvojnega posredovanja, saj se piškotek pošlje le, kadar brskalnik vidi en izvor.
- Slabo, ker API ni uporaben iz odjemalca, ki ne more hraniti piškotkov, dokler zanj ne dodamo drugega avtentikacijskega razreda.
