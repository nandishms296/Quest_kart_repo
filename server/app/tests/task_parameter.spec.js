const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const TaskParameter = db.configModels.tbl_task_parameter;
const { toBeOneOf } = require('jest-extended');
expect.extend({ toBeOneOf });

describe("findAll method", () => {
    it("should retrieve all existing task_parameter from the database", async () => {
        try{
      const existingTaskparameter = await TaskParameter.findAll();
      const response = await request(app).get("/api/task_parameters");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(existingTaskparameter.length);
  
      for (let i = 0; i < existingTaskparameter.length; i++) {
        expect(response.body[i].task_id).toBe(existingTaskparameter[i].task_id);
        expect(response.body[i].task_type).toBe(existingTaskparameter[i].task_type);
        expect(response.body[i].parameter_type).toBe(existingTaskparameter[i].parameter_type);
        expect(response.body[i].key_01).toBe(existingTaskparameter[i].key_01);
        expect(response.body[i].value_01).toBe(existingTaskparameter[i].value_01);
        expect(response.body[i].sequence).toBe(existingTaskparameter[i].sequence);
        expect(response.body[i].is_active).toBe(existingTaskparameter[i].is_active);
        expect(response.body[i].created_by).toBe(existingTaskparameter[i].created_by);
      }}catch (error) {
        
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const response = await request(app).get("/api/task_parameters");

          expect(response.status).toEqual(500);
          expect(response.body).toHaveProperty('message', response.body.message);
  
  
          console.log(response.body.message);
      
    
      }
    });
  });
  
//   describe('Create', () => {
//     it('should create a new task_parameters', async () => {
//       const data = {
//         project_id:"one",
//         task_id:160,
//         connection_id: 1,
//         task_type:"Source",
//         parameter_type: "MySQL",
//         key_01:"query",
//         value_01:"select * from tab",
//         sequence:"1",
//         created_by: "admin"
//       };
//       let res;
//     try {
//       // First test
//       res = await request(app).post('/api/task_parameters').send(data);
//       expect(res.status).toEqual(200);
//       expect(res.body).toHaveProperty('id');
//       expect(res.body.project_id).toEqual(data.project_id);
//       expect(res.body.task_id).toEqual(data.task_id);

//       expect(res.body.connection_id).toEqual(data.connection_id);
//       expect(res.body.task_type).toEqual(data.task_type);
//       expect(res.body.parameter_type).toEqual(data.parameter_type);
//       expect(res.body.key_01).toEqual(data.key_01);
//       expect(res.body.value_01).toEqual(data.value_01);
//       expect(res.body.sequence).toEqual(data.sequence);
//       expect(res.body.is_active).toEqual('Y');
//       expect(res.body.created_by).toEqual(data.created_by);
//     } catch (error) {
//       if (res && res.status === 400) {
//         expect(res.body).toHaveProperty('message', "Content can't be empty!.");
//         console.log(res.body.message);
//       } else {
//         jest.spyOn(console, 'error').mockImplementation(() => {});
//         res = await request(app).post('/api/task_parameters').send(data);
//         expect(res.status).toEqual(500);
//         expect(res.body).toHaveProperty('message', res.body.message);
//         console.log(res.body.message);
//       }
//     }
//   });
// });

describe("findOne method", () => {
    it("should retrieve an existing projects from the database", async () => {
        let res;
        const existingTaskParameterID = 2;
        

        try{
      const existingTaskParameter = await TaskParameter.findOne();
      res = await request(server).get(`/api/task_parameters/${existingTaskParameterID}`);
// console.log(res.body)
      
      expect(res.status).toBe(200);
    expect(res.body.id).toBe(existingTaskParameter.id);
    expect(res.body.task_id).toBe(existingTaskParameter.task_id);
    expect(res.body.task_type).toBe(existingTaskParameter.task_type);
    expect(res.body.parameter_type).toBe(existingTaskParameter.parameter_type);
    expect(res.body.key_01).toBe(existingTaskParameter.key_01);
    expect(res.body.value_01).toBe(existingTaskParameter.value_01);
    expect(res.body.sequence).toBe(existingTaskParameter.sequence);
    expect(res.body.is_active).toBe(existingTaskParameter.is_active);
    expect(res.body.created_by).toBe(existingTaskParameter.created_by);
        }
        catch (error) {
            if (res && res.status === 404) {
              expect(res.body).toHaveProperty('message', `Cannot find Task with id=${existingTaskParameterID}.`);

              console.log(res.body.message);
            } else {
              jest.spyOn(console, 'error').mockImplementation(() => {});
              res = await request(server).get(`/api/task_parameters/${existingTaskParameterID}`);
              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
      
      
              console.log(res.body.message);
          
            }
          }    });
  
    });


    describe("findAllActive method", () => {
        it("should retrieve all active task_parameters from the database", async () => {
          // Arrange
          try{
          const activetask_parameters = await TaskParameter.findAll({ where: { is_active: "Y" } });
      
          // Act
          const response = await request(app).get("/api/task_parameters/active");
      
          // Assert
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(activetask_parameters.length);
      
          for (let i = 0; i < activetask_parameters.length; i++) {
            expect(response.body[i].id).toBe(activetask_parameters[i].id);
            expect(response.body[i].task_id).toBe(activetask_parameters[i].task_id);
            expect(response.body[i].task_type).toBe(activetask_parameters[i].task_type);
            expect(response.body[i].parameter_type).toBe(activetask_parameters[i].parameter_type);
            expect(response.body[i].key_01).toBe(activetask_parameters[i].key_01);
            expect(response.body[i].value_01).toBe(activetask_parameters[i].value_01);
            expect(response.body[i].sequence).toBe(activetask_parameters[i].sequence);
            expect(response.body[i].is_active).toBe(activetask_parameters[i].is_active);
            expect(response.body[i].created_by).toBe(activetask_parameters[i].created_by);
        }}
        catch (error) {
         
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const response = await request(app).get("/api/task_parameters/active");
            expect(response.status).toEqual(500);
            expect(response.body).toHaveProperty('message', response.body.message);
    
    
            console.log(response.body.message);
        
          
        } 
      });
    });



    describe("findProject method", () => {
        it("should retrieve an existing task_parameters from the database", async () => {
          // Arrange
          const existingTaskparameter = await TaskParameter.findAll();
           const project_id=1
          // Act
          try{
          const response = await request(app).get(`/api/task_parameters/project_id/${project_id}`);
      // console.log(response,"response")
          // Assert
          expect(response.status).toBe(200);
          expect(response.body.id).toBe(existingTaskparameter.id);
          expect(response.body.task_id).toBe(existingTaskparameter.task_id);
          expect(response.body.task_type).toBe(existingTaskparameter.task_type);
          expect(response.body.parameter_type).toBe(existingTaskparameter.parameter_type);
          expect(response.body.key_01).toBe(existingTaskparameter.key_01);
          expect(response.body.value_01).toBe(existingTaskparameter.value_01);
          expect(response.body.sequence).toBe(existingTaskparameter.sequence);
          expect(response.body.is_active).toBe(existingTaskparameter.is_active);
          expect(response.body.created_by).toBe(existingTaskparameter.created_by);
      
          }
          catch (error) {

            jest.spyOn(console, 'error').mockImplementation(() => {});
            const response = await request(app).get(`/api/task_parameters/project_id/${project_id}`);
            expect(response.status).toEqual(500);
            expect(response.body).toHaveProperty('message', response.body.message);
            console.log(response.body.message);
          
        } 
      });
    });
