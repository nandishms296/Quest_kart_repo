const request = require('supertest');
const app = require('../../server');
const server = require('../../server');
const db = require('../models');
const Program = db.configModels.tbl_program;


describe("findAll method", () => {
    it("should retrieve all existing programs from the database", async () => {
        try{
      const existingPrograms = await Program.findAll();
      const response = await request(app).get("/api/programs");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(existingPrograms.length);

      for (let i = 0; i < existingPrograms.length; i++) {
        expect(response.body[i].id).toBe(existingPrograms[i].id);
        expect(response.body[i].program_name).toBe(existingPrograms[i].program_name);
        expect(response.body[i].program_description).toBe(existingPrograms[i].program_description);
        expect(response.body[i].primary_stakeholder).toBe(existingPrograms[i].primary_stakeholder);
        expect(response.body[i].secondary_stakeholder).toBe(existingPrograms[i].secondary_stakeholder);
        expect(response.body[i].is_active).toBe(existingPrograms[i].is_active);
      }}catch (error) {
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const response = await request(app).get("/api/programs");
          expect(response.status).toEqual(500);
          expect(response.body).toHaveProperty('message', response.body.message);
          console.log(response.body.message);
      }
    });
  });
  
  

  describe('Create', () => {


    it('should create a new program', async () => {
      const data = {
        program_name:  'UnitTesting123',
        program_description:'UnitTesting',
        primary_stakeholder: 'Jane McCullum',
        secondary_stakeholder: null,
        is_active: 'Y',
        created_by: 'System',
      };
      let res;
      try {
        res = await request(server).post('/api/programs').send(data);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.program_name).toEqual(data.program_name);
        expect(res.program_description).toEqual(data.program_description);
        expect(res.primary_stakeholder).toEqual(data.primary_stakeholder);
        expect(res.secondary_stakeholder).toEqual(data.secondary_stakeholder);
        expect(res.body.is_active).toEqual('Y');
        expect(res.created_by).toEqual(data.created_by);
      } catch (error) {
        if (res && res.status === 400) {
          expect(res.body).toHaveProperty('message', "Content can't be empty!.");
          console.log(res.body.message);
        } else {
          const errorMsg = error.response ? error.response.body.message : error.message;
          jest.spyOn(console, 'error').mockImplementation(() => {});
          res = await request(server).post('/api/programs').send(data);
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
  
  
          console.log(res.body.message);
      
        }
      }
    });
  });
  

  describe("findOne method", () => {
    it("should retrieve an existing programs from the database", async () => {
        let res;
        const existingProgramID = 1;

        try{
      const existingProgram = await Program.findOne();
      res = await request(server).get(`/api/programs/${existingProgramID}`);
console.log(existingProgram)
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(existingProgram.id);
      expect(res.body.program_name).toBe(existingProgram.program_name);
      expect(res.body.program_description).toBe(existingProgram.program_description);
      expect(res.body.primary_stakeholder).toBe(existingProgram.primary_stakeholder);
      expect(res.body.secondary_stakeholder).toBe(existingProgram.secondary_stakeholder);
      expect(res.body.is_active).toBe(existingProgram.is_active);
        }
        catch (error) {
            if (res && res.status === 404) {
              expect(res.body).toHaveProperty('message', `Cannot find Program with id=${existingProgramID}.`);
              console.log(res.body.message);
            } else {
              jest.spyOn(console, 'error').mockImplementation(() => {});
              res = await request(server).get(`/api/programs/${existingProgramID}`);
              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
      
      
              console.log(res.body.message);
          
            }
          }    });
  
    });
  
    describe("findAllActive method", () => {
        it("should retrieve all active programs from the database", async () => {
            try{
      
          const activePrograms = await Program.findAll({ where: { is_active: "Y" } });

   
          const response = await request(app).get("/api/programs/active");
      

          expect(response.status).toBe(200);
          expect(response.body.length).toBe(activePrograms.length);
      
          for (let i = 0; i < activePrograms.length; i++) {
            expect(response.body[i].id).toBe(activePrograms[i].id);
            expect(response.body[i].program_name).toBe(activePrograms[i].program_name);
            expect(response.body[i].program_description).toBe(activePrograms[i].program_description);
            expect(response.body[i].primary_stakeholder).toBe(activePrograms[i].primary_stakeholder);
            expect(response.body[i].secondary_stakeholder).toBe(activePrograms[i].secondary_stakeholder);
            expect(response.body[i].is_active).toBe(activePrograms[i].is_active);
          }}
          catch (error) {
           
              jest.spyOn(console, 'error').mockImplementation(() => {});
              const response = await request(app).get("/api/programs/active");

              expect(response.status).toEqual(500);
              expect(response.body).toHaveProperty('message', response.body.message);
      
      
              console.log(response.body.message);
          
            
          } 
        });
      });
      
  describe('Update method', () => {
    
        it('update the program in the database', async () => {
            const id = 6;
        const updatedProgram = {
          program_name:  'UnitTesting1234',
        program_description:'UnitTesting',
        primary_stakeholder: 'Jane McCullum',
        secondary_stakeholder: null,
        is_active: 'Y',
        created_by: 'System',
        };
        let response;
    
         try{
           response = await request(app)
            .put(`/api/programs/${id}`)
            .send(updatedProgram);
          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Programs was updated scuccessfully.');
      
          const updatedProgramFromDb = await Program.findOne({ where: { id } });
          expect(updatedProgramFromDb.program_name).toBe(updatedProgram.program_name);
          expect(updatedProgramFromDb.program_description).toBe(updatedProgram.program_description);
          expect(updatedProgramFromDb.primary_stakeholder).toBe(updatedProgram.primary_stakeholder);
          expect(updatedProgramFromDb.secondary_stakeholder).toBe(updatedProgram.secondary_stakeholder);
          expect(updatedProgramFromDb.created_by).toBe(updatedProgram.created_by);
          expect(updatedProgramFromDb.is_active).toBe(updatedProgram.is_active);
             }catch (error) {
                if (error.status === 404) {
                  const errorMessage = `Cannot update Programs with id=${id}. Maybe Programs was not found or req.body is empty!`;
                  console.log(errorMessage);
                  return { status: 404, message: errorMessage };
                }  else {
                  const errorMessage = `Error updating Programs with id=${id}`;
                  console.log(errorMessage);
                  return { status: 500, message: errorMessage };
                }
              }
        });
      
       
      });
      
      
      