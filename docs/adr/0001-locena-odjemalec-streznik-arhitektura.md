---
status: sprejeto
date: 2026-10-10
decision-makers: Nikola Miljković
---

# Ločena odjemalec in strežnik z REST API namesto strežniško izrisanega monolita

## Kontekst in problem

RollCall ima tri vloge, od katerih vsaka vidi drug del sistema. Predavatelj dela v mesečnem koledarju, koordinator pregleduje čakajoče prijave prisotnosti vrstico za vrstico, administrator pa upravlja uporabniške račune.

Vse to je mogoče zgraditi kot en projekt Django, ki vrača izrisane strani, ali kot ločen odjemalec, ki se s strežnikom pogovarja prek REST API. Vprašanje je, katero od obojega zgraditi, ob tem da projekt piše en sam razvijalec v enem semestru in da naj bi bili isti podatki pozneje dosegljivi tudi odjemalcem, ki niso brskalnik.

## Obravnavane možnosti

- Monolit Django s predlogami in izrisom na strežniku
- Monolit Django s predlogami in delnim osveževanjem prek HTMX
- Ločen odjemalec in strežnik, ki ponuja REST API

## Odločitev

Izbrana možnost: ločen odjemalec in strežnik, ki ponuja REST API.

Sama interaktivnost tega ne bi opravičila. Trije od štirih načrtovanih zaslonov so prijavni obrazec, obrazec z dvema izbirama in tabela z dejanji po vrsticah. Četrti je koledar, pri katerem premik med meseci v obeh zasnovah pridobi podatke s strežnika. HTMX bi vse štiri pokril z manj kode. Tudi potreba po API odločitve ne izsili, saj Django iz istega projekta streže izrisane strani in končne točke REST.

Odloči to, da je API mišljen kot glavni vmesnik v sistem in ne kot nekaj, kar stoji ob njem. Vsako pravilo, ki ga sistem uveljavlja, od zaznavanja prekrivanj do zaklepa meseca, je dosegljivo samo prek njega, zato vsak poznejši odjemalec dobi isto uveljavljanje in ničesar ni treba napisati drugič. Drugi razlog je nameren in ga velja povedati naravnost. Odjemalca želim zgraditi v Reactu, ker se na tem projektu učim prav tega dela sklada.

Ta odločitev v prvem semestru stane več dela, kot ga v njem vrne. Sprejeta je zaradi tega, kar vrne pozneje, in sicer ene same točke uveljavljanja za vsako pravilo ter vmesnika, ki ga poznejši odjemalci lahko uporabijo nespremenjenega.

### Posledice

- Dobro, ker obstaja natanko eno mesto, kjer se pravilo uveljavi, zato nobena napaka v odjemalcu ne more povzročiti dvojne dodelitve ali spremeniti zapisa o izvedbi. Ti zapisi so podlaga za izplačilo predavateljem, in prav to je najmočnejši razlog za tako delitev.
- Dobro, ker isti API brez sprememb pokrije poznejše odjemalce, med njimi izvoz koledarja in morebitno mobilno aplikacijo.
- Dobro, ker je odjemalca mogoče prepisati ali zamenjati, ne da bi se dotaknili enega samega pravila, kar na projektu, ki se nadaljuje skozi nadaljnje naloge, ni le teoretična prednost.
- Dobro, ker se odjemalec in strežnik razvijata in preizkušata ločeno, zato je mogoče pravilo o prekrivanju terminov in zaklep meseca preizkusiti neposredno, brez brskalnika in še preden obstaja kakšen vmesnik.
- Slabo, ker namesto enega projekta vzdržujemo dva, z dvema naboroma odvisnosti in dvema potema zagona, prvi delujoči zaslon pa je bolj oddaljen, saj morajo usmerjanje, hranjenje stanja in klici API obstajati, preden je sploh kaj vidno.
- Slabo, ker vsak obrazec potrebuje preverjanje na odjemalcu in na strežniku, vsak pogled pa svoje stanje nalaganja, praznega seznama in napake, kar strežniško izrisana stran ponudi že s tem, da se vrne.
