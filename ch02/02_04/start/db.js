const { LocalStorage } = require('node-localstorage');

const dbA = new LocalStorage('./data-a-m');
const dbB = new LocalStorage('./data-n-z');

// we match the first letter of the name to the correct database
const whichDB = (catName) => (catName.match(/^[a-m]|^[A-M]/) ? dbA : dbB);

const loadCats = (db) => JSON.parse(db.getItem('cats') || '[]');

const hasCat = (name) =>
  loadCats(whichDB(name))
    .map((cat) => cat.name)
    .includes(name);

module.exports = {
  addCat(newCat) {
    if (!hasCat(newCat.name)) {
      const db = whichDB(newCat.name);
      let cats = loadCats(db);
      cats.push(newCat);
      db.setItem('cats', JSON.stringify(cats, null, 2));
    }
  },

  findCatByName(name) {
    let cats = loadCats(whichDB(name));
    return cats.find((cat) => cat.name === name);
  },

  findCatsByColor(color) {
    return [
      // this ... is called spread operator
      ...loadCats(dbA).filter(() => cats.color === color),
      ...loadCats(dbB).filter(() => cats.color === color),
    ];
  },
};
