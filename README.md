# spa-rest-react

# Manager de artistii favoriti integrat cu DeviantArt

# Descrierea generala a aplicatiei

Proiectul a constat in realizarea unei aplicatii web in limbajul `Node.js` pe baza unei teme 
primite aleator cu backendul `RESTful` care sa acceseze date stocate intr-o baza relationala(mysql) 
pe baza unui API si cu frontendul de tip `SPA` realizat cu `React.js` .

# Descrierea functionala a aplicatiei

Aplicatia are o bara de meniu cu urmatoarele butoane:
1. `Login`
2. `Home`
3. `Hot deviations`
4. `Popular deviations`
5. `Newest deviations`
6. `Favorites`

Butonul de `Login` duce catre pagina de login a aplicatie. Acesta nu este implementat de aceea
in cod in toate requesturile este hardcodat id-ul primului user.

Butoanele de `Home`, `Hot deviations`, `Popular deviations` si `Newest deviations` duc catre
pagini care au aceeasi structura. Sunt afisate sub forma unul tabel informatii despre creatiile
unor artisti('artist name','category','comments','likes','image'), acestea fiind preluate de
pe DeviantArt prin intermediul API-ului lor. In dreptul fiecarei creatii este un buton de 'add'
care daca este apasat va adauga artistul la lista de favoriti a utilizatorului.

Fiecare user poate avea o singura lista de favoriti.

Butonul Favorites duce catre lista de artisti favoriti a utilizatorului in care este afisat 
numele artistului, link catre profilul lui de pe DeviantArt si un buton de 'delete' prin care 
se poate sterge artistul din lista.

# Descrierea pe componente a aplicatiei

# BACKEND

1. In directorul `models` sunt declarate structurile tabelelor care exista in baza de date.
2. In directorul `routes` sunt declarate punctele de acces ale API-ului folosite pentru a modifica
inregistrarile din baza de date.
3. In fisierul `database.js` se realizeaza conexiunea la baza de date printr-un `ORM`(Sequelize),
crearea tabelelor si relatiile dintre acestea.
4. In fisierul `server.js` este creat serverul folosind `Express.js` si sunt tratate apelurile
la API.

# FRONTEND

In directorul my-app/src exista doua directoare:
  -directorul `stores`
  -directorul `components`
In directorul `stores` avem 3 fisiere: `DeviationsStore.js` si `FavoritesStore.js` prin care sunt preluate
datele din baza de date si de la API-ul extern, iar in fisierul `ArtistClass.js` este definita o clasa
folosita pentru a prelua date din retea.

In directorul `components` se afla paginile aplicatiei. Componenta principala este fisierul `Main.js` in 
care sunt declareate rutele catre paginile aplicatiei.


