# Cinque strade per dire sì

Cinque concept di landing page di nozze (contenuti segnaposto, foto Unsplash), più una home che li raccoglie.

- `/` home con i cinque concept
- `/rotta`, `/papiro`, `/zellige`, `/ulivo`, `/cartoline` le landing complete
- `assets/` CSS e JS condivisi
- `build.py` genera le pagine (modifica i testi lì e rilancia `python3 build.py`)

Stack: HTML statico, GSAP 3 (ScrollTrigger, MotionPath), Three.js r128 (concept Rotta e Ulivo), Google Fonts.
Nessuna build necessaria su Vercel: è un sito statico (`vercel.json` abilita gli URL puliti).

## Deploy su Vercel

Opzione A, da repository: copia il contenuto di questa cartella nella root del repo collegato a Vercel, commit e push. Framework preset: "Other", nessun comando di build, output directory vuota (root).

Opzione B, da CLI: `npx vercel` dentro la cartella.

Opzione C, drag and drop: trascina la cartella su vercel.com/new.

## Da fare prima della presentazione live
- Sostituire nomi, data, luoghi e testi (sono segnaposto).
- RSVP e lista nozze sono demo: nessun backend. Per la versione finale: Formspree, Netlify Forms o una Vercel Function.
- Le foto sono hotlink Unsplash: per la produzione scaricarle in `assets/img/`.
