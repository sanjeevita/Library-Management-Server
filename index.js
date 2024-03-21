const express = require("express");
const app = express();
const { users } = require("./data/users.json");
const port = 8081;
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "server is up and running" });
});

// users -> get - get all users
//          post - add a new user
// users/{id} -> get - get user info from id
//               put - update a user by id
//               delete - delete a user by id (check if they have issued books still or any unpaid fine)

app.get("/users", (req, res) => {
  res.status(201).send(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (!user)
    res.status(400).send({ success: false, message: "user not found" });
  res.status(200).send({ success: true, message: "user exists", data: user });
});

//posting new user
app.post("/users", (req, res) => {
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
app.put('/users/:id',(req,res)=>{
    const {id}= req.params;
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
app.delete("/users/:id",(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id===id);
    if(!user) return res.status(404).json({
        success:false,
        msg:"user does not exist"
    })
    const index= users.indexOf(user);
    users.splice(index,1);
})

app.get("*", (req, res) => {
  return res.status(404).json({ msg: "this page doesn't exist" });
});

app.listen(port, () => {
  console.log("server started");
});
