const express = require('express')
const {users}=require("../data/users.json")
const router = express.Router()

// users -> get - get all users
//          post - add a new user
// users/{id} -> get - get user info from id
//               put - update a user by id
//               delete - delete a user by id (check if they have issued books still or any unpaid fine)


router.get("/", (req, res) => {
    res.status(201).send(users);
  });
  
    router.get("/:id", (req, res) => {
    const user = users.find((user) => user.id === req.params.id);
    if (!user) return res.status(400).send({ success: false, message: "user not found" });
    return res.status(200).send({ success: true, message: "user exists", data: user });
  });

 
  
  //posting new user
    router.post("/", (req, res) => {
      const {id, name, surname,email,subscriptionType,subscriptionDate} =req.body;
      const user = users.find((each)=> each.id===id);
      if(user) return res.status(404).json({success: false, msg: "user exists already"});
      users.push({
        id, name, surname,email,subscriptionType,subscriptionDate}
        );
      return res.status(201).json({
          success:true,
          data: users
      })
  });
  
  //updating user by id
  router.put('/:id',(req,res)=>{
      const id= req.params.id;
      const {data} = req.body;
      const user = users.find((each)=>each.id===id);
      if(!user) return res.status(404).json({
          success:false,
          msg:"user doesn't exist"
      })
  
      const updatedUser = users.map((each)=>{
          if(each.id===id) return {...each,...data};
          return each;
      })
      return res.status(200).json({
          success:true,
          data: updatedUser
      })
  })
  
  //deleting user
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex((each) => each.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            msg: "User does not exist"
        });
    }
    users.splice(userIndex, 1);

    return res.status(200).json({
        success: true,
        data: users
    });
});

  module.exports = router