# parkuj.my — prezentacja sprzedażowa (≈10 minut)

> **Format:** Narrator (Ty) czyta tekst poniżej w normalnym tempie prezentacji.
> Operator (kolega) wykonuje akcje opisane `[w nawiasach kwadratowych]` synchronicznie.
> Tempo: ~150 słów / minutę. Łącznie ok. 1500 słów ≈ 10 minut.

---

## 0:00 — Otwarcie (≈40 s)

`[Otwórz aplikację — strona główna /, niezalogowany]`

Dzień dobry. To, co Państwo zaraz zobaczą, to **parkuj.my** — platforma rezerwacji miejsc parkingowych online.

Punkt wyjścia jest prosty. Parkowanie w dużych miastach to dziś krążenie po blokach w poszukiwaniu wolnego miejsca, niepewność czy w ogóle je znajdę, i parkomat, który nie zawsze działa. Z drugiej strony właściciele parkingów nie mają realnego narzędzia do zarządzania obłożeniem ani prostego sposobu na dotarcie do klienta.

My łączymy obie strony. **Kierowca rezerwuje miejsce z wyprzedzeniem i ma pewność, że je dostanie. Właściciel ma stałe, przewidywalne obłożenie i narzędzia, żeby zarządzać swoim parkingiem z poziomu przeglądarki.** To jest fundament, na którym budujemy.

---

## 0:40 — Dwie role, jedna platforma (≈25 s)

`[Pokaż dwa przyciski CTA na landingu]`

Platforma ma dwóch klientów: **kierowcę**, który szuka miejsca, i **właściciela parkingu**, który chce na nim zarabiać. Każdy z nich ma własną ścieżkę wejścia — bo każdy szuka czego innego. Zaczniemy od kierowcy.

---

## 1:05 — Rejestracja klienta (≈45 s)

`[Klik: "Dołącz jako klient" — otwiera AuthPage z zakładką "Klient"]`

Trzy zakładki — logowanie, klient, właściciel. Wybieramy klienta.

`[Wypełnij formularz: imię, nazwisko, email, telefon, tablica, hasło]`

Rejestracja jest świadomie krótka. Imię, nazwisko, email, telefon — i **tablica rejestracyjna**. Tablica jest tu nieprzypadkowo: docelowo to ona, odczytana przez kamerę przy wjeździe, będzie kluczem klienta do parkingu. To architektura zbudowana pod ten kierunek już dziś.

`[Klik: Utwórz konto → przekierowanie na /home]`

Konto gotowe.

---

## 1:50 — Strona główna klienta (≈25 s)

`[Pokaż HomePage]`

Pulpit klienta. Lista popularnych parkingów w mieście — z realną liczbą wolnych miejsc, ceną i lokalizacją. Wszystko poniżej trzech kliknięć, zawsze.

---

## 2:15 — Wybór parkingu z mapą (≈55 s)

`[Klik: Zarezerwuj — otwiera ReservePage z listą + mapą]`

I tu zaczyna się magia. Po lewej — lista parkingów z cennikiem i liczbą wolnych miejsc. Po prawej — interaktywna mapa Warszawy. Te dwa widoki są **zsynchronizowane**: klikam parking na liście, mapa pokazuje go w kontekście. Klikam pin na mapie, lista podświetla wybór.

`[Przewiń listę, najedź na 2-3 parkingi, kliknij jeden — np. Złote Tarasy]`

Dostępne parkingi w realnym czasie, ceny od 7 do 15 złotych za godzinę, pełen adres, liczba miejsc. Klient widzi wszystko, czego potrzebuje, na jednym ekranie — bez żadnego "kliknij dalej, żeby zobaczyć cenę".

---

## 3:10 — Proces rezerwacji (≈60 s)

`[Wybierz datę, godziny, pojazd]`

Wybieramy parking, datę i godziny. System na żywo policzy cenę i sprawdzi, czy w wybranym terminie są wolne miejsca. To nie jest fasada — pod spodem realnie blokujemy miejsce z **optymistycznym lockingiem**, żeby dwóch klientów nie zarezerwowało tego samego miejsca w tej samej sekundzie.

`[Pokaż wybór pojazdu z listy zapisanych]`

Pojazd wybieramy z listy zapisanych w koncie. Klient nie wpisuje tablicy za każdym razem.

`[Przejdź do kroku płatności]`

Płatność. BLIK, karta, Google Pay, gotówka przy parkomacie. Gotówka nie jest tu dla wygody — gotówka jest dla **zgodności z prawem**.

`[Klik: Potwierdź rezerwację → ekran sukcesu z kodem]`

I po sprawie. Klient dostaje **dwunastoznakowy kod rezerwacji** — to jego dowód i identyfikator. Generujemy go bezpiecznym losowaniem, z alfabetu pozbawionego mylących znaków, żeby nie było pomyłek przy odczytywaniu z ekranu czy z papieru.

---

## 4:10 — Moje rezerwacje i konto (≈40 s)

`[Klik: Moje rezerwacje]`

Wszystkie rezerwacje w jednym miejscu — aktywne na górze, historia poniżej. Klient może anulować rezerwację jednym kliknięciem — status w bazie zmienia się natychmiast, a w docelowej integracji z bramką płatniczą będzie tu wpinany automatyczny zwrot.

`[Klik: menu użytkownika → Moje konto]`

Konto. Klient może mieć **wiele pojazdów** — auto służbowe, prywatne, samochód żony. Jeden jest oznaczony jako główny i to on jest domyślnie używany w rezerwacjach.

`[Krótko pokaż Ustawienia i wróć]`

Ustawienia konta, preferencje powiadomień, domyślna metoda płatności. Standard, ale działa.

To była strona klienta. Teraz druga strona biznesu.

---

## 4:50 — Rejestracja właściciela (≈40 s)

`[Wyloguj się → wróć na landing → klik: "Dołącz jako właściciel parkingu"]`

To samo wejście, ale inna zakładka — **Właściciel**. Właściciel rejestruje się jako klient platformy, a od razu przechodzi do wizardu dodawania swojego pierwszego parkingu.

`[Rejestracja → automatyczne przejście do JoinPage]`

Cztery kroki. Krok pierwszy: dane parkingu — nazwa, adres, lokalizacja na mapie.

`[Przeklikuj kolejne kroki wizardu]`

---

## 5:30 — Podział miejsc i cennik (≈50 s)

`[Pokaż krok z podziałem miejsc — suwak rezerwacje vs walk-in]`

I to jest **kluczowa funkcja biznesowa**. Właściciel decyduje, ile miejsc trafia do puli online — tej, którą klienci rezerwują przez aplikację — a ile zostawia dla wjazdu spontanicznego, "z drogi". Ten suwak to jego dźwignia: dziś więcej miejsc na rezerwacje, jutro mniej. W każdej chwili.

`[Pokaż krok z cennikiem]`

Krok trzeci: cennik. Stawka godzinowa.

`[Klik: Zakończ wizard → przejście na /dashboard]`

I parking jest w systemie. Klienci mogą go już rezerwować.

---

## 6:20 — Panel właściciela (≈75 s)

`[Pokaż Dashboard z wykresami i statystykami]`

To jest panel, w którym właściciel spędza swój dzień. **Statystyki na żywo**: obecne obłożenie, liczba aktywnych rezerwacji, przychód bieżącego miesiąca.

`[Najedź na wykresy przychodu i liczby rezerwacji]`

Wykres przychodu z ostatnich siedmiu dni. Wykres liczby rezerwacji. Wszystko realne, wszystko z bazy danych — żadnych mocków.

`[Pokaż sekcję konfiguracji — suwak podziału miejsc, edycja ceny]`

Właściciel w każdej chwili zmienia podział miejsc albo cenę. System **zapisuje historię cen** — rezerwacje historyczne zachowują tę cenę, którą klient widział w momencie rezerwowania. To jest uczciwość systemu wobec obu stron.

`[Klik: Panel administracyjny → OwnerAdminPanel]`

Panel administracyjny właściciela. Wszystkie rezerwacje na jego parkingach. Filtrowanie po statusie, wyszukiwanie po tablicy. **Właściciel widzi wyłącznie swoje parkingi** — autoryzacja jest sprawdzana na każdym żądaniu po stronie serwera, nie tylko w interfejsie.

---

## 7:35 — Zgłaszanie incydentów (≈30 s)

`[Klik: zakładka "Zgłoś incydent"]`

I funkcja, którą właściciele cenią najbardziej — bezpośredni kanał do nas. Awaria szlabanu, zablokowany pojazd, problem z płatnością. Właściciel wybiera typ, pilność, opisuje sytuację.

`[Wypełnij formularz i wyślij]`

Wysłane. Zgłoszenie jest już w panelu naszego zespołu operacyjnego.

---

## 8:05 — Panel SuperAdmina (≈75 s)

`[Otwórz w nowej karcie: /admin — zaloguj jako admin@parkuj.my / admin123]`

I to widzi nasz zespół operacyjny. **Panel SuperAdmina**. Osobne logowanie — nie Google, hasło zhashowane bcryptem, blokada konta po trzech nieudanych próbach.

`[Pokaż dashboard z czterema kafelkami statystyk]`

Pełen obraz platformy: ilu mamy klientów, ilu właścicieli, ile aktywnych rezerwacji, ile otwartych incydentów.

`[Klik: zakładka Rezerwacje]`

Wszystkie rezerwacje w systemie — kod, parking, tablica, status, kwota.

`[Klik: zakładka Klienci]`

Lista klientów. SuperAdmin może **zbanować konto** — zbanowany klient nie zaloguje się, dopóki ban nie zostanie zdjęty. Może też usunąć konto, z pełną kaskadą.

`[Klik: zakładka Właściciele]`

Osobna zakładka dla właścicieli — czyli tych klientów, którzy mają w systemie co najmniej jeden parking. Te same operacje.

`[Klik: zakładka Parkingi]`

Wszystkie parkingi w systemie. **Soft-delete** — nie wywalamy w pył parkingu, na którym jutro klient może mieć rezerwację.

`[Klik: zakładka Incydenty — pokaż zgłoszenie wysłane przez właściciela]`

I tu lądują zgłoszenia od właścicieli. Operator pracuje nad incydentem, zmienia status na "w toku", potem na "rozwiązany". Pętla jest zamknięta od zgłoszenia do rozwiązania.

---

## 9:20 — Co pod spodem (≈30 s)

`[Wróć krótko na widok klienta]`

Krótko o tym, czego nie widać. Backend: **Java 17 i Spring Boot 4**. Baza **PostgreSQL**. Frontend **React 18 z Vite**. Cały stack stoi w **Dockerze** — jedno polecenie, trzy kontenery, gotowe. Architektura przygotowana pod skalowanie: czyste warstwy, optimistic locking, transakcyjność tam, gdzie ma znaczenie. Pełna autoryzacja po stronie serwera, soft-delete tam, gdzie potrzeba zachować ślad.

**To nie jest prototyp. To jest fundament produktu.**

---

## 9:50 — Wizja (≈50 s)

`[Wróć na landing]`

I to jest fundament. Wszystko, co Państwo dziś zobaczyli, **działa**. Ale kierunek jest większy.

Kluczowym następnym krokiem jest **ANPR — automatyczne rozpoznawanie tablic rejestracyjnych**. Kamera nad szlabanem, serwis w Pythonie z modelem OCR, szlaban otwiera się sam — bez biletu, bez aplikacji w ręce, bez zatrzymywania. Klient po prostu wjeżdża. **To jest moment, w którym parking przestaje być uciążliwością, a staje się niezauważalny.** I cała dzisiejsza architektura — tablica jako identyfikator klienta, kod rezerwacji jako fallback — jest pod ten krok zaprojektowana.

Drugi krok — integracja z Google OAuth, logowanie jednym kliknięciem. Trzeci — bramka płatnicza z fakturami automatycznie i kasą fiskalną w parkomacie dla zgodności z prawem. I dalej: program lojalnościowy, partnerstwa z centrami handlowymi, lotniskami, deweloperami osiedli.

---

## 10:40 — Zamknięcie (≈20 s)

`[Powrót na landing]`

**parkuj.my to nie kolejna aplikacja do parkowania.** To system, który łączy trzy strony rynku — kierowcę, właściciela parkingu i operatora platformy — w jednym, spójnym produkcie. Mamy działający produkt. Mamy plan technologiczny. I mamy gotową ścieżkę do skali.

Dziękujemy. Czekamy na pytania.

---

## Notatki dla operatora (kolega klikający)

**Przygotowanie przed prezentacją:**
1. Mieć przygotowane jedno konto klienta (do logowania w sekcji 1:05 — można od razu się logować zamiast rejestrować, oszczędzi 20 s)
2. Mieć przygotowane jedno konto właściciela z dodanym parkingiem (do sekcji 5:30 — żeby Dashboard miał wykresy z danych, nie zera)
3. Zalogować się jako SuperAdmin w drugim oknie/karcie przed startem (sekcja 8:05)
4. Zgłosić jeden incydent z konta właściciela **przed** prezentacją, żeby w panelu admina się ładnie wyświetlił
5. Mieć jedną otwartą rezerwację, żeby było co pokazać na liście

**Rytm:**
- Tempo czytania spokojne, prezenterskie — ok. 150 słów / minutę
- Pauzy po nagłówkach sekcji (Ty czytasz tytuł w głowie, kolega ma czas na klika)
- Kolega NIE klika za szybko — czeka aż dojdziesz do konkretnego punktu w tekście
- Jeśli coś nie zadziała na żywo — Ty kontynuujesz tekst spokojnie, kolega po cichu się ratuje

**Time markers:**
- 0:00–2:15 — wprowadzenie + rejestracja klienta
- 2:15–4:50 — rezerwacja end-to-end
- 4:50–7:35 — strona właściciela
- 7:35–9:20 — SuperAdmin
- 9:20–10:40 — tech + wizja + zamknięcie
