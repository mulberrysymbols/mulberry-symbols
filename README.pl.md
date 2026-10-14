# Mulberry Symbols: polska taksonomia i nazwy (wersja robocza)

Ta gałąź dodaje **polski podział tematyczny i polskie nazwy** zbioru Mulberry Symbols.
Nie zmienia żadnego symbolu ani nazwy pliku: katalog `EN/` jest identyczny z oryginałem.
Wszystkie dane są **materiałem roboczym do przeglądu**, a nie ostateczną decyzją o zawartości bazy.

Angielska wersja tego opisu: [`README.polish-names.md`](README.polish-names.md). Nazwy kolumn, komentarze w kodzie i opisy commitów są po angielsku, a po polsku są wartości słownikowe (nazwy, kategorie, uwagi).

## Co zostało dodane

| Plik | Zawartość |
|---|---|
| `scripts/data/mulberry-pl.ods` | jeden skoroszyt z trzema arkuszami, opisanymi poniżej |
| ↳ arkusz `symbols` | wszystkie 3436 symboli z polską nazwą, kategorią, częściami mowy (EN i PL), flagami i pustą kolumną `database-decision` |
| ↳ arkusz `verbs` | 468 czasowników: bezokolicznik PL, aspekt, klasa i podklasa semantyczna, przybliżona domena WordNet, uwagi |
| ↳ arkusz `categories` | mapowanie 117 kategorii źródłowych na polską domenę i podkategorię, ścieżkę katalogu (ASCII) oraz uwagi |
| `scripts/read-ods.js` | mały czytnik skoroszytu bez zależności (używany przez `mk-tree-pl.js`) |
| `scripts/mk-tree-pl.js` | generuje drzewo `tree-pl/<domena>/<podkategoria>/<symbol>.svg` (lub z `--verbs`: `verbs-tree-pl/<klasa>/<podklasa>/`) i waliduje skoroszyt względem `symbol-info.csv` (te same symbole w tej samej kolejności, poprawne kategorie, wiersz dla każdego czasownika) |
| `.gitignore` | dopisane katalogi wyjściowe generatora |

Każdy arkusz ma wiersz nagłówków w pierwszej linii; `symbol-id` i `symbol-en` zgadzają się z `symbol-info.csv`.

## Użycie

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install   # csv-parse jest już w devDependencies; pomijamy pobieranie Chromium
node scripts/mk-tree-pl.js --dry-run    # tylko walidacja
node scripts/mk-tree-pl.js              # kopie do ./tree-pl
node scripts/mk-tree-pl.js --link       # dowiązania symboliczne zamiast kopii
node scripts/mk-tree-pl.js --verbs      # czasowniki według klas i podklas semantycznych
```

Skrypt przerywa pracę z błędem, jeśli któraś kategoria nie ma mapowania, brakuje pliku
SVG albo dwa symbole trafiłyby do jednej ścieżki pod tą samą nazwą.

## Decyzje i znane ograniczenia

- **Dwie kategorie źródłowe są scalone w drzewie:** `Food Vegetables and salad` (3 symbole)
  i `Food Vegetables and salads` (55) to ta sama kategoria z literówką w źródle.
  W `symbol-info.csv` pozostają rozdzielone.
- **Domena wynika z pierwszego członu nazwy kategorii** (`Food Fruit` → Jedzenie / Owoce).
  Źródło nie ma pola „domena"; to konwencja odtworzona z nazw.
- **Kategoria `Verb` jest zbudowana według części mowy**, nie tematu, więc w drzewie
  czasowniki są rozdzielone: część w `czasowniki/`, część w podkategoriach tematycznych
  (np. `jedzenie/czynnosci-kuchenne`). Tak jest też w danych źródłowych.
- **Komputer w jednej domenie.** Kategorie źródłowe 36 (`Computer Icon`: interfejs i polecenia)
  i 49 (`Electrical Computer`: sprzęt i obsługa) to jeden obszar pojęciowy rozcięty na dwa;
  granica jest nieostra. W drzewie obie są pod `komputer/`; w danych źródłowych pozostają rozdzielone.
- **Treści kulturowo specyficzne** (brytyjskie święta i stacje, angielskie kluby piłkarskie,
  potrawy) mają flagę `K` i wymagają decyzji przy adaptacji do polskiego kontekstu.
- **Religia.** Wszystkie symbole w kategoriach `Religion *` mają tag `Christian`; wyszukiwanie po
  nazwach nie znalazło symbolu żadnej innej religii. Występują postacie i wydarzenia biblijne
  (`Jesus`, `Mary`, `Joseph`, `Judas`, `Last_Supper`, `Crucifixion`, `Nativity`) oraz elementy
  kalendarza liturgicznego (`Advent`, `Ash_Wednesday`, `Lent`, `Palm_Sunday`, `Shrove_Tuesday_1`).
  W nazwach nie ma duchowieństwa ani sakramentów, a jedynym wprost wyznaniowym określeniem jest
  `Puritans`. Treść odpowiada brytyjskiemu kalendarzowi i kulturze szkolnej, nie jednemu wyznaniu.
  Ta uwaga opiera się na nazwach i tagach, nie na analizie symboliki obrazów.

## Polskie nazwy wszystkich symboli (arkusz `symbols`)

Jeden wiersz = jeden plik w `EN/`; klucz: `symbol-en` (nazwa pliku bez `.svg`). Kolumna `database-decision`
jest celowo pusta.

Kolumny: `symbol-id`, `symbol-en`, `symbol-pl`, `domain-pl`, `subcategory-pl`,
`pos-source` (z oryginalnego `symbol-info.csv`), `pos-en`, `pos-pl`,
`number-pl`, `form-gender-pl`, `variant`, `semantic-class`, `semantic-subclass`,
`wordnet-domain`, `aspect` (te cztery ostatnie dotyczą tylko czasowników), `notes`, `flags`, `database-decision`.

Zasady tłumaczenia:
- Czasowniki: bezokolicznik (forma słownikowa) z arkusza `verbs`; pozostałe nazwy w mianowniku liczby
  pojedynczej. Polecenia interfejsu (`copy`, `paste`, `print`, `save`) mają formę rozkazującą z dopiskiem
  „(polecenie)”, a działania matematyczne (`add`, `subtract`, `multiply`, `divide`) rzeczownik odczasownikowy;
  to rozróżnienie jest celowe, ale do decyzji.
- Forma cytowania (forma, pod którą się wyszukuje): `symbol-pl` zawiera zawsze jedną lemę. Rzeczowniki są w mianowniku
  liczby pojedynczej (w mnogiej: pluralia tantum, zob. `number-pl`), czasowniki w bezokoliczniku, przymiotniki w mianowniku
  lp. rodzaju męskiego. Formy odmienione („psa”, „pieska”) i synonimy nie są zapisane; aplikacja wyszukująca po tych
  nazwach potrzebuje lematyzacji albo własnej listy aliasów.
- Przymiotniki są zapisane w formie podstawowej (mianownik lp. rodzaju męskiego); kolumna `form-gender-pl`
  mówi, jaką formę zapisano. Tam, gdzie to możliwe, wybrano formę neutralną rodzajowo
  (np. „w związku małżeńskim”, „na emeryturze”). Pary rodzajowe „-y/-a” czy osobne symbole to decyzja otwarta.
- Zawody (`People Profession`): zwykle `_1x` = postać męska, `_2x` = żeńska; litery `a`–`d` = odcienie skóry
  (u taksówkarzy `a`/`b` i `c`/`d` to dwie pary postaci). Wyjątek: `care_assistant_*`, gdzie `a` = postać męska, `b` = żeńska,
  a numer 1–6 koduje odcienie skóry opiekuna i podopiecznego (2 i 4: ikona wózka). Nazwy mają rodzaj zgodny z postacią.
- Alfabet: litery łacińskie bez polskich znaków diakrytycznych (`ą ć ę ł ń ó ś ź ż` nie występują w źródle).
- Metoda: tłumaczenia powstały z angielskich nazw; obraz każdego z 3436 symboli został sprawdzony z polską nazwą,
  a wynik przejrzała ręcznie autorka (logopedka i specjalistka AAC). Gdy o znaczeniu zdecydował obraz
  (nazwa angielska jest wieloznaczna lub myląca), w `notes` jest wpis zaczynający się od „obraz:”.
  Pytania językowe będące decyzjami, a nie błędami (aspekt czasowników, rodzaj przymiotników), opisano w
  „Decyzje i znane ograniczenia”.

Flagi w kolumnie `flags` (można łączyć): `K` treść specyficzna kulturowo (UK) lub idiom (112); `B` nazwa handlowa (21); `E` literówka lub błąd w źródle (15);
`N` nie-państwo: terytorium, region, organizacja (90); `P` status sporny lub niepowszechnie uznawany (14);
`M` czasownik ruchu (7); `G` gramatyka w źródle niespójna z nazwą (7); `R` oznaczone w źródle jako `rated=1` (6).

### Części mowy

Źródłowa kolumna `grammar` oznacza jako `Noun` 2973 z 3436 symboli, także przymiotniki (`absent`, `hot`, `red`),
przyimki (`under_1`), przysłówki i zaimki. Kolumny `pos-en` i `pos-pl` są własną klasyfikacją roboczą
(reguły plus ręczne listy; ok. 825 symboli ma część mowy inną niż rzeczownik lub litera), do przeglądu. Mogą się różnić
między językami (np. `add`: verb → „dodawanie”, rzeczownik odczasownikowy).

Zasada dla fraz: jako „wyrażenie rzeczownikowe” oznaczono opisowe zestawienia (np. `clean_room`, `hat_too_big`), a
ustalone nazwy złożone („woda po goleniu”, „sok jabłkowy”) liczone są jako rzeczowniki. Kolumna `number-pl` oznacza
wyłącznie rzeczowniki mające w polskim tylko liczbę mnogą (pluralia tantum); lista jest częściowa.

Osiem symboli o angielskiej nazwie czasownikowej leży poza kategorią „Verb” i nie ma wiersza w arkuszu `verbs`:
`add`, `subtract`, `multiply`, `divide`, `copy`, `paste`, `print`, `save`. Dla `copy` istnieje
dodatkowo osobny symbol czasownikowy `copy_,_to`.

## Czasowniki (arkusz `verbs`)

468 pozycji czasownikowych (gramatyka `Verb` lub `VerbComplex`, albo sufiks `_,_to`; siedem z nich, `gravy_pour`,
`mash_potato`, `pour_cake_mixture`, `break_2`, `float`, `mend` i `toilet_,_go_to_the`, ma w źródle gramatykę `Noun` i flagę `G`).

- Nazwy źródłowe mają formę słownikową („X, to"), nie są odmienione. Trafienia na `-ing` i `-ed` to leksemy
  (`sing`, `bring`, `swing`) albo idiomy (`get_dressed`).
- **Klasyfikacja jest moją własną, roboczą konstrukcją, nie wynikiem badań ani odwzorowaniem istniejącego zasobu.**
  17 klas semantycznych (kolumna `semantic-class`) i 33 podklasy w ośmiu klasach (ruch; manipulowanie przedmiotami;
  gotowanie i obróbka żywności; relacje społeczne i opieka; higiena i ubieranie się; gra, sport i wypoczynek;
  zmiana stanu; prace domowe i ogrodowe), tam gdzie klasa była zbyt różnorodna. Jedna klasa na symbol, według
  znaczenia, nie tematyki kategorii źródłowej. Największa klasa to manipulowanie przedmiotami (52), podzielona na sześć podklas.
- `wordnet-domain` to przybliżone, ręczne przyporządkowanie do jednej z 15 domen leksykograficznych czasowników
  Princeton WordNet (w danych użyto 14 z nich) (`verb.body`, `verb.change`, `verb.cognition`, `verb.communication`, `verb.competition`,
  `verb.consumption`, `verb.contact`, `verb.creation`, `verb.emotion`, `verb.motion`, `verb.perception`,
  `verb.possession`, `verb.social`, `verb.stative`, `verb.weather`); Słowosieć (plWordNet) ma analogiczny zestaw.
  Nie jest to wyszukanie w słowniku, tylko mój przydział według znaczenia i polskiego bezokolicznika; służy do
  porównań z innymi zasobami, a nie do rozstrzygnięć. Domena `weather` nie występuje.
- Aspekt (`impf` = niedokonany, `pf` = dokonany): 465 `impf`, 3 `pf` (`znaleźć`, `spóźnić się na autobus`, `oparzyć się`).
  Zasada cytowania i pary aspektowe pozostają do decyzji.
- Czasowniki ruchu mają pary określony/nieokreślony (iść/chodzić, biec/biegać, jechać/jeździć); zaznaczono je w `notes`.
- Obejrzano obrazy wszystkich czasowników. Nazwy angielskie bywają wieloznaczne albo mylące, więc obraz
  zmienił znaczenie m.in. w: `hang` (wisieć na drążku, nie wieszać), `shake` (trząść się), `stamp` (tupać),
  `slide` (ślizgać się, nie zjeżdżalnia), `dive` i `dive_2` (skok do wody, nie nurkowanie), `bend` (schylać się),
  `stretch` (rozciągać przedmiot), `cheat` (ściągać), `decorate` (obraz: malowanie ściany; zachowano „dekorować”), `sign` (migać),
  `talk_3` i `talk_4` (rozmawiać), `order_2` (rozkazywać). Przy `sign` interpretacja jest moja i wymaga potwierdzenia
  przez osobę znającą Makaton lub PJM, bo na obrazie nie ma długopisu ani kartki.
- Pięć czasowników w kategorii źródłowej `People Actions` rozchodzi się po klasach znaczeniowych (ruch, odpoczynek, praca).

## Licencja i atrybucja

Oryginalny zbiór: *Mulberry Symbols*, © 2018–2026 Steve Lee,
licencja [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
(zob. `LICENSE.txt`). Źródło: <https://github.com/mulberrysymbols/mulberry-symbols>.

Zmiany względem oryginału: dodano `scripts/data/mulberry-pl.ods`, skrypty `mk-tree-pl.js` i
`read-ods.js`, ten plik i wpisy w `.gitignore`. Materiał pochodny jest udostępniany na tej samej licencji
(CC BY-SA 4.0). Licencja CC nie obejmuje znaków towarowych; nie sugerujemy zatwierdzenia przez autora oryginału.
