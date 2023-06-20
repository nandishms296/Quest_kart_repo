module.exports = (app) => {
  const users = require("../controllers/config/user.controller.js");

  const router = require("express").Router();

  // Create a User.
  router.post("/", users.create);

  // Retrieve all User
  router.get("/", users.findAll);

  // Retrieve all active User
  router.get("/active", users.findAllActive);
  router.get("/getIdAndName", users.getIdAndName);
  //Update profile
  router.patch("/updateprofile", users.updateProfile);

  router.get("/:login_id", users.findUser);
  
  router.get("/findbyname/:login_id", users.findByName);
  
  // Retrieve a single User with id
  router.put("/activate/:id", users.activate);

  // Update a User with id
  router.patch("/:id", users.update);

  router.get("/userexists/:login_id", users.userExistsorNot);

  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  app.use("/api/users", router);
};
