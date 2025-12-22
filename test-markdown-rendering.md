# Task 05: Food System

## Objective

Vytvoriť Food class s náhodným generovaním pozície a kontrolou, aby sa jedlo neobjavilo na hadovi.

## Steps

1. Vytvoriť Food class
   - 1.1. Constructor
   - 1.2. Property: position {x, y}
   - 1.3. Property: color (voliteľne)

2. Implementovať náhodné umiestnenie
   - 2.1. spawn(snake) metóda
   - 2.2. Generovanie náhodnej x pozície (0 až GRID_WIDTH-1)
   - 2.3. Generovanie náhodnej y pozície (0 až GRID_HEIGHT-1)

3. Kontrola prekrytia s hadom
   - 3.1. isOnSnake(position, snake) helper
   - 3.2. Iterácia cez všetky segmenty hada
   - 3.3. Ak prekrytie, vygenerovať novú pozíciu
   - 3.4. Limit pokusov (pre prípad plnej plochy)

## Acceptance Criteria

- [x] Food class je definovaný
- [x] Pozícia sa generuje náhodne
