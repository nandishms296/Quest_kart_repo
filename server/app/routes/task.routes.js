module.exports = (app) => {
  const tasks = require("../controllers/config/task.controller");

  const router = require("express").Router();

  // Create a Task.
  router.post("/", tasks.create);

  // Retrieve all Task
  router.get("/", tasks.findAll);
  //router.put("/:id", tasks.updateTask);

  // Retrieve all active Task
  router.get("/active", tasks.findAllActive);
  router.get("/getTasksForPipelineID/:id", tasks.findALLTasksForPipelineID);

  router.post("/checkTaskNameExistsInGitHub/:id", tasks.checkTaskNameExistsInGitHub);

  router.put("/updateTask/:id", tasks.updateTask);

  router.post("/getGitData/:id", tasks.getGitData);
  router.put("/gitDataUpdate/:id", tasks.GitDataUpdate);

  router.get("/getTaskInfo/:id", tasks.getTaskInfo);

  // Retrieve a single Task with id
  router.get("/:id", tasks.findOne);

  // Update a Task with id
  router.put("/:id", tasks.update);

  // Delete a Task with id
  router.delete("/:id", tasks.delete);

  app.use("/api/tasks", router);
};
