---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# PostgreSQL za podatkovno bazo

## Kontekst in problem

Podatkovni model ima štiri povezane entitete: uporabnika, program, lekcijo in dodelitev lekcije. Lekcija in predavatelj sta v razmerju mnogo proti mnogo prek dodelitve lekcije. Potrjena prisotnost je podlaga za izplačilo predavateljem, zato morajo podatki ostati dosledni.

Od baze sta odvisni dve pravili. Predavatelja ni mogoče dodeliti dvema lekcijama, katerih termina se prekrivata, zato morata preverjanje in vstavljanje potekati kot ena operacija. Začetek in konec lekcije sta shranjena s časovnim pasom, ker semester vključuje prehod na zimski čas.

## Obravnavane možnosti

- PostgreSQL
- MySQL ali MariaDB
- SQLite
- Dokumentna baza, na primer MongoDB

## Odločitev

Izbrana možnost: PostgreSQL, ker ponuja tuje ključe, enolične omejitve in transakcije, s tipom timestamptz shranjuje čas skupaj s časovnim pasom ter podpira tipe razponov z izključitvenimi omejitvami. Pravilo o prekrivanju se preverja v aplikaciji znotraj transakcije, izključitveno omejitev pa je mogoče pozneje dodati, da ga uveljavlja tudi shema.

Dokumentna baza, kot je MongoDB, ni bila izbrana, ker so podatki relacijski in večina poizvedb povezuje več entitet, na primer koledar enega predavatelja ali čakajoče prijave enega programa. SQLite je preprostejši za zagon, vendar slabše obvladuje sočasna pisanja in nima tipov razponov. MySQL bi pokril večino zahtev, vendar nima tipov razponov ne izključitvenih omejitev, Django pa podpira več polj in funkcij, značilnih za PostgreSQL.

### Posledice

- Dobro, ker tuji ključi in enolične omejitve ohranijo podatke dosledne tudi, če je v kodi aplikacije napaka.
- Dobro, ker timestamptz pravilno shrani čase lekcij tudi ob prehodu na zimski čas.
- Dobro, ker je pravilo o prekrivanju pozneje mogoče uveljaviti v shemi brez menjave baze.
- Slabo, ker baza teče kot ločena storitev in potrebuje vsebnik ali namestitev, za razliko od ene same datoteke SQLite.
- Slabo, ker se je treba naučiti osnov upravljanja PostgreSQL, kot so vloge, varnostne kopije in obnova.
- Slabo, ker so testi na pravi bazi počasnejši od testov na bazi v pomnilniku.
