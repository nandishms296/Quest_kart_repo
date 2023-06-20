module.exports = (app) => {
  const lnkuserprojects = require("../controllers/config/lnkuserproject.controller");

  const router = require("express").Router();

  // Create a LnkUserProject.
  router.post("/", lnkuserprojects.create);

  // Retrieve all LnkUserProject
  router.get("/", lnkuserprojects.findAll);

  router.get("/getidandname", lnkuserprojects.getIdandName);
  

  router.get("/getRowsandColumns", lnkuserprojects.getRowsAndColumns);

  // Retrieve all Active LnkUserProject
  router.get("/active", lnkuserprojects.findAllActive);

  // Retrieve a single LnkUserProject with id
  router.get("/:id", lnkuserprojects.findOne);

  // Update a LnkUserProject with id
  router.put("/:id", lnkuserprojects.update);

  // Delete a LnkUserProject with id
  router.delete("/:id", lnkuserprojects.delete);

  app.use("/api/lnkuserprojects", router);
};
