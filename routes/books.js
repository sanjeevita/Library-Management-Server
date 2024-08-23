const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(books);
});

router.get("/:id", (req, res) => {
  const book = books.find((book) => book.id === req.params.id);
  if (!book)
    return res
      .status(404)
      .send({ success: false, message: "book does not exist" });
  return res.status(200).send({ success: true, data: book });
});

router.get("/issued", (req, res) => {
  const usersWithIssuesBooks = users.filter((each) => each.issuedBook);
  const issuedBooks = [];
  usersWithIssuesBooks.forEach((element) => {
    const book = books.find((each) => each.id == element.issuedBook);
    book.issuedBy = element.name;
    book.issueDate = element.issuedDate;
    book.retDate = element.returnDate;
    issuedBooks.push(book);
});

if(issuedBooks.length === 0){
    return res.status(404).json({success: false, message: "No books issued yet."});
}

return res.status(200).json({success: true, data: issuedBooks})
});

router.post("/", (req, res) => {
  const { id, name, author, genre, price, publisher } = req.body;
  const book = books.find((each) => each.id === id);
  if (book) return res.status(404).send({ success: false, message: "book already exists" });
  books.push({
    id,
    name,
    author,
    genre,
    price,
    publisher,
  });
  return res.status(201).json({
    success: true,
    data: books,
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { data } = req.body;

  const book = books.find((each) => each.id === id);
  if (!book)
    return res.status(404).json({
      success: false,
      msg: "book doesn't exist",
    });

  const updatedBook = books.map((each) => {
    if (each.id === id) return { ...each, ...data };
    return each;
  });
  return res.status(200).send({ success: true, data: updatedBook });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const book = books.find((each) => each.id === id);
  if (!book)
    return res.status(404).json({
      success: false,
      msg: "book doesn't exist",
    });
  const index = books.findIndex((each) => each.id === id);
  const deletedBook = books;
  deletedBook.splice(index, 1);
  return res.status(200).send({
    success: true,
    data: books,
  });
});


router.get('/subscription-details/:id', (req, res)=>{
  const {id : myId} = req.params;

  const user = users.find((each)=> each.id === myId);
  if(!user)
      return res.status(404).json({success: false, message: "User With The Given Id Doesn't Exist"});

  const getDateInDays = (data = "")=> {
      let date;
      if(data === ""){
          // current Date
          date = new Date();
      }else{
          // getting date on a basis of data variable
          date = new Date(data);
      }
      let days = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
      return days;
  };

  const subscriptionType = (date) => {
      if(user.subscriptionType === "Basic"){
          date = date + 90;
      }else if(user.subscriptionType === "Standard"){
          date = date + 180;
      }else if(user.subscriptionType === "Premium"){
          date = date + 365;
      }
      return date;
  };

  // Subscription expiration calcus
  // Jan 1, 1970, UTC // milliseconds
  //there are 2 fines: one is if you have missed your returned date-100 and second is if your subscription has expired & still you've not returned- 200
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  const data = {
      ...user,
      subscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionDate - currentDate,
      fine: returnDate < currentDate ? (subscriptionExpiration <= currentDate ? 200 : 100) : 0, 
  }

   res.status(200).json({
      success: true,
      data: data,
   })
})

module.exports = router;
