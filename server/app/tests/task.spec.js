const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const Task = db.configModels.tbl_task;
const { toBeOneOf } = require('jest-extended');
expect.extend({ toBeOneOf });

describe("findAll method", () => {
    it("should retrieve all existing tasks from the database", async () => {
        try{
      const existingTasks = await Task.findAll();
      const response = await request(app).get("/api/tasks");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(existingTasks.length);
  
      for (let i = 0; i < existingTasks.length; i++) {
        expect(response.body[i].id).toBe(existingTasks[i].id);
        expect(response.body[i].pipeline_id).toBe(existingTasks[i].pipeline_id);
        expect(response.body[i].task_name).toBe(existingTasks[i].task_name);
        expect(response.body[i].task_description).toBe(existingTasks[i].task_description);
        expect(response.body[i].task_type).toBe(existingTasks[i].task_type);
        expect(response.body[i].task_sequence).toBe(existingTasks[i].task_sequence);
        expect(response.body[i].is_active).toBe(existingTasks[i].is_active);
      }}catch (error) {
        
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const response = await request(app).get("/api/tasks");

          expect(response.status).toEqual(500);
          expect(response.body).toHaveProperty('message', response.body.message);
  
  
          console.log(response.body.message);
    
      }
    });
  });
  
  describe("findOne method", () => {
    it("should retrieve an existing tasks from the database", async () => {
        let res;
        const existingTaskID = 1;

        try{
      const existingTask = await Task.findOne();
      res = await request(server).get(`/api/tasks/${existingTaskID}`);
// console.log(existingTask)
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(existingTask.id);
      expect(res.body.pipeline_id).toBe(existingTask.pipeline_id);
      expect(res.body.task_name).toBe(existingTask.task_name);
      expect(res.body.task_description).toBe(existingTask.task_description);
      expect(res.body.task_type).toBe(existingTask.task_type);
      expect(res.body.task_sequence).toBe(existingTask.task_sequence);
      expect(res.body.is_active).toBe(existingTask.is_active);
     
        }
        catch (error) {
            if (res && res.status === 404) {
              expect(res.body).toHaveProperty('message', `Cannot find Task with id=${existingTaskID}.`);
              console.log(res.body.message);
            } else {
              jest.spyOn(console, 'error').mockImplementation(() => {});
              res = await request(server).get(`/api/tasks/${existingTaskID}`);
              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
      
      
              console.log(res.body.message);
          
            }
          }    });
  
    });


    describe("findAllActive method", () => {
        it("should retrieve all active Tasks from the database", async () => {
            try{
          // Arrange
          const activeTask = await Task.findAll({ where: { is_active: "Y" } });
      
          // Act
          const response = await request(app).get("/api/tasks/active");
      
          // Assert
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(activeTask.length);
      
            for (let i = 0; i < activeTask.length; i++) {
                expect(response.body[i].id).toBe(activeTask[i].id);
                expect(response.body[i].pipeline_id).toBe(activeTask[i].pipeline_id);
                expect(response.body[i].task_name).toBe(activeTask[i].task_name);
                expect(response.body[i].task_description).toBe(activeTask[i].task_description);
                expect(response.body[i].task_type).toBe(activeTask[i].task_type);
                expect(response.body[i].task_sequence).toBe(activeTask[i].task_sequence);
              }}catch (error) {
           
              jest.spyOn(console, 'error').mockImplementation(() => {});
              const response = await request(app).get("/api/tasks/active");
              expect(response.status).toEqual(500);
              expect(response.body).toHaveProperty('message', response.body.message);
      
      
              console.log(response.body.message);
          
            
          } 
        });
      });
