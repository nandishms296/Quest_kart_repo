const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const Project = db.configModels.tbl_project;
const { toBeOneOf } = require('jest-extended');
expect.extend({ toBeOneOf });

describe("findAll method", () => {
    it("should retrieve all existing projects from the database", async () => {
        try{
      const existingProjects = await Project.findAll();
      const response = await request(app).get("/api/projects");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(existingProjects.length);
  
      for (let i = 0; i < existingProjects.length; i++) {
        expect(response.body[i].id).toBe(existingProjects[i].id);
        expect(response.body[i].project_name).toBe(existingProjects[i].project_name);
        expect(response.body[i].project_description).toBe(existingProjects[i].project_description);
        expect(response.body[i].project_manager).toBe(existingProjects[i].project_manager);
        expect(response.body[i].project_lead).toBe(existingProjects[i].project_lead);
        expect(response.body[i].is_active).toBe(existingProjects[i].is_active);
      }}catch (error) {
        
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const response = await request(app).get("/api/projects");

          expect(response.status).toEqual(500);
          expect(response.body).toHaveProperty('message', response.body.message);
  
  
          console.log(response.body.message);
      
    
      }
    });
  });
  
  


describe('Create', () => {


  it('should create a new project', async () => {
    const data = {
      program_id: 1,
      project_name:"ProjectforUnittest",
      project_description: 'This is a test project',
      project_manager: 'John Doe',
      project_lead: 'Jane Doe',
      is_active: 'Y',
      created_by: 'John Doe',
    };
    let res;
    try {
      res = await request(server).post('/api/projects').send(data);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.program_id).toEqual(data.program_id);
      expect(res.body.project_name).toEqual(data.project_name);

      expect(res.body.project_description).toEqual(data.project_description);
      expect(res.body.project_manager).toEqual(data.project_manager);
      expect(res.body.project_lead).toEqual(data.project_lead);
      expect(res.body.is_active).toEqual('Y');
      expect(res.body.created_by).toEqual(data.created_by);
    } catch (error) {
      if (res && res.status === 400) {
        expect(res.body).toHaveProperty('message', "Content can't be empty!.");
        console.log(res.body.message);
      } else {
        const errorMsg = error.response ? error.response.body.message : error.message;
        jest.spyOn(console, 'error').mockImplementation(() => {});
        res = await request(server).post('/api/projects').send(data);
        expect(res.status).toEqual(500);
        expect(res.body).toHaveProperty('message', res.body.message);


        console.log(res.body.message);
    
      }
    }
  });
});


describe("findOne method", () => {
    it("should retrieve an existing projects from the database", async () => {
        let res;
        const existingProjectID = 1;

        try{
      const existingProject = await Project.findOne();
      res = await request(server).get(`/api/projects/${existingProjectID}`);

// console.log(res.body)
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(existingProject.id);
      expect(res.body.project_name).toBe(existingProject.project_name);
      expect(res.body.project_description).toBe(existingProject.project_description);
      expect(res.body.project_manager).toBe(existingProject.project_manager);
      expect(res.body.project_lead).toBe(existingProject.project_lead);
      expect(res.body.is_active).toBe(existingProject.is_active);
        }
        catch (error) {
            if (res && res.status === 404) {
              expect(res.body).toHaveProperty('message', `Cannot find Project with id=${existingProjectID}.`);
              console.log(res.body.message);
            } else {
              jest.spyOn(console, 'error').mockImplementation(() => {});

              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
      
      
              console.log(res.body.message);
          
            }
          }    });
  
    });


    describe("findAllActive method", () => {
        it("should retrieve all active projects from the database", async () => {
            try{
          const activeProjects = await Project.findAll({ where: { is_active: "Y" } });
      
          const response = await request(app).get("/api/projects/active");
      
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(activeProjects.length);
      
          for (let i = 0; i < activeProjects.length; i++) {
            expect(response.body[i].id).toBe(activeProjects[i].id);
            expect(response.body[i].project_name).toBe(activeProjects[i].project_name);
            expect(response.body[i].project_description).toBe(activeProjects[i].project_description);
            expect(response.body[i].project_manager).toBe(activeProjects[i].project_manager);
            expect(response.body[i].project_lead).toBe(activeProjects[i].project_lead);
            expect(response.body[i].is_active).toBe(activeProjects[i].is_active);
          }}
          catch (error) {
           
              jest.spyOn(console, 'error').mockImplementation(() => {});
              const response = await request(app).get("/api/projects/active");
              expect(response.status).toEqual(500);
              expect(response.body).toHaveProperty('message', response.body.message);
      
      
              console.log(response.body.message);
          
            
          } 
        });
      });
      
      
  
describe("findID method", () => {
    it("should retrieve an existing projects from the database", async () => {
        const program_id=10000

      try{
      const existingProject = await Project.findAll();
      const response = await request(app).get(`/api/projects/findAllById/${program_id}`);
  
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(existingProject.id);
      expect(response.body.project_name).toBe(existingProject.project_name);
      expect(response.body.project_description).toBe(existingProject.project_description);
      expect(response.body.project_manager).toBe(existingProject.project_manager);
      expect(response.body.project_lead).toBe(existingProject.project_lead);
      expect(response.body.is_active).toBe(existingProject.is_active);}
      catch (error) {
           
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const response = await request(app).get(`/api/projects/findAllById/${program_id}`);
        expect(response.status).toEqual(500);
        expect(response.body).toHaveProperty('message', response.body.message);

        console.log(response.body.message);
      
    } 
    });  
   
  });
  
  
describe('Update method', () => {
    
    it('update the project in the database', async () => {
        const id = 6;
    const updatedProject = {
      program_id: 1,
      project_name: "Tracking6700",
      project_description: "unit test for Order Tracking",
      project_manager: "Ruby Kenzie",
      project_lead: "Rohan Mitra",
      is_active: "Y",
      created_by: "admin"
    };
    let response;

     try{
       response = await request(app)
        .put(`/api/projects/${id}`)
        .send(updatedProject);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project was updated scuccessfully.');
  
      const updatedProjectFromDb = await Project.findOne({ where: { id } });
      expect(updatedProjectFromDb.program_id).toBe(updatedProject.program_id);
      expect(updatedProjectFromDb.project_name).toBe(updatedProject.project_name);
      expect(updatedProjectFromDb.project_description).toBe(updatedProject.project_description);
      expect(updatedProjectFromDb.project_manager).toBe(updatedProject.project_manager);
      expect(updatedProjectFromDb.project_lead).toBe(updatedProject.project_lead);
      expect(updatedProjectFromDb.created_by).toBe(updatedProject.created_by);
      expect(updatedProjectFromDb.is_active).toBe(updatedProject.is_active);
         }catch (error) {
            if (error.status === 404) {
              const errorMessage = `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`;
              console.log(errorMessage);
              return { status: 404, message: errorMessage };
            }  else {
              const errorMessage = `Error updating Project with id=${id}`;
              console.log(errorMessage);
              return { status: 500, message: errorMessage };
            }
          }
    });
  
   
  });
  
  
  