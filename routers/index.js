const express = require("express");
const router = express.Router();
const Book = require("../store/Book");
const fileMulter = require("../middleware/file");

const store = {
  books: [new Book('1',"Название книги 1"), new Book('2',"Название книги 2")],
};

router.get("/", (req, res) => {
  res.render("index", {
    title: "Main PAGE",
    store: store.books,
  });
});

router.get("/create", (req, res) => {
  // console.log('CREATE!!!');
  res.render("create", {
    title: "Main PAGE",
    store: store.books,
  });
});

router.get("/api/books", (req, res) => {
  const { books } = store;
  res.json(books);
});

router.post("/api/user/login", (req, res) => {
  const returnObject = { id: 1, mail: "test@mail.ru" };
  res.status(201);
  res.json(returnObject);
});

router.get("/api/books/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json({
      status: 404,
      errormsg: "404 | страница не найдена",
    });
  }
});

router.post("/api/books/", fileMulter.single("fileBook"), (req, res) => {
  // console.log('ADD bok');
  const { books } = store;
  const {
    id,
    title = "Название книги",
    description,
    authors,
    favorite,
    fileCover,
    fileName = req.file.originalname,
    fileBook = req.file.filename,
  } = req.body;

  const newBook = new Book(
    id,
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  books.push(newBook);
  res.status(201);
  res.redirect("/");
  // res.json(newBook);
});

router.put("/api/books/:id", (req, res) => {
  const { books } = store;
  const { title, desc } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  // Добавить поля
  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    };

    res.json(books[idx]);
  } else {
    res.status(404);
    res.json({
      status: 404,
      errormsg: "404 | страница не найдена",
    });
  }
});

// router.delete("/api/books/:id", (req, res) => {
//   const { books } = store;
//   const { id } = req.params;
//   const idx = books.findIndex((el) => el.id === id);

//   if (idx !== -1) {
//     books.splice(idx, 1);
//     res.json(true);
//   } else {
//     res.status(404);
//     res.json({
//       status: 404,
//       errormsg: "404 | страница не найдена",
//     });
//   }
// });

router.post("/api/books/delete/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books.splice(idx, 1);
    // res.json(true);
    res.redirect("/");
  } else {
    res.status(404);
    res.json({
      status: 404,
      errormsg: "404 | страница не найдена",
    });
  }
});

router.get("/api/books/:id/download", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx > -1) {
    res.status(201);
    const path =
      __dirname.slice(0, __dirname.lastIndexOf("/routers")) +
      `/public/books/${books[idx].fileBook}`;
    res.download(path, books[idx].fileBook, (err) => {
      if (err) {
        res.status(404).json({
          status: 404,
          errormsg: `Нет файла с ID=${id}`,
        });
      }
    });
  } else {
    res.status(500);
    res.json({
      status: 500,
      errormsg: `Нет файла с ID=${id}`,
    });
  }
});

module.exports = router;
