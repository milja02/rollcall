# 01 – Zasnova rešitve

## Ime rešitve

**RollCall** je spletna aplikacija za načrtovanje izobraževalnih programov, razporejanje predavateljev in vodenje evidence o tem, katere lekcije so bile dejansko izvedene.

## Namen in problem

Ponudniki tečajev in akademije običajno izvajajo več programov, vsak z desetinami lekcij na mesec. Lekcije izvaja skupina predavateljev, med katerimi je veliko zunanjih sodelavcev. Urnik in evidenca o tem, kdo je dejansko predaval, običajno potekata v preglednicah in e-poštnih sporočilih. To vodi v znane težave:

- Ni enega mesta, kjer bi lahko vsi videli stanje.
- Lekcije se prekrivajo ali ostanejo brez predavatelja, ko ta zboli ali odpove.
- Izvedba se potrjuje ustno ali pri mesečnem usklajevanju, kar povzroča spore pri obračunu ur.

**RollCall** te težave rešuje z:

- enotnim urnikom za vse programe,
- samodejnim preverjanjem prekrivanj ob dodelitvi predavatelja,
- dvostopenjsko evidenco izvedbe: predavatelj prijavi, koordinator potrdi ali zavrne,
- zamenjavo predavatelja pri posamezni lekciji,
- zaklepanjem meseca, po katerem se podatki zaključenega meseca ne morejo več spreminjati.

## Ciljni uporabniki

Rešitev je namenjena majhnim in srednje velikim organizacijam, ki izvajajo izobraževalne programe z več predavatelji, na primer jezikovnim šolam, izobraževalnim centrom in internim akademijam v podjetjih. Tipična situacija je jezikovna šola, ki mesečno izvaja več tečajev z mešanico zaposlenih in zunanjih predavateljev. Koordinator pripravi urnik in ob koncu meseca potrebuje potrjene podatke o izvedbi, predavatelji pa želijo videti, kdaj predavajo, in potrditi, da so lekcije izvedli.

Vsakodnevno rešitev uporabljajo koordinatorji (načrtovanje in potrjevanje), predavatelji (koledar in prijava izvedbe) ter administrator (uporabniški računi).

## Kratek opis delovanja

Administrator ustvari uporabniške račune in dodeli vloge (administrator, koordinator, predavatelj). Koordinator ustvari program, vanj doda lekcije (naslov, začetek in konec, opis) in vsaki lekciji dodeli enega ali več predavateljev. Po prijavi predavatelj vidi mesečni koledar svojih lekcij. Ko je lekcija danes ali v preteklosti, predavatelj prijavi, ali je bil prisoten ali odsoten. Če predavatelj lekcije ne more izvesti, koordinator, če je to mogoče, določi zamenjavo. Ob koncu meseca koordinator mesec zaklene. Po zaklepu lekcij in prisotnosti za ta mesec ni več mogoče spreminjati.
