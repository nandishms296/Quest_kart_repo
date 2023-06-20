const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const Connection = db.configModels.tbl_connection;
const ConnectionList = db.configModels.vw_connection_list;

const { toBeOneOf } = require('jest-extended');
expect.extend({ toBeOneOf });

describe("findAll method", () => {
    it("should retrieve all existing Connection from the database", async () => {
        try{
      const existingConnection = await Connection.findAll();
      const response = await request(app).get("/api/connections");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(existingConnection.length);
  
      for (let i = 0; i < existingConnection.length; i++) {
        expect(response.body[i].id).toBe(existingConnection[i].id);
        expect(response.body[i].project_id).toBe(existingConnection[i].project_id);
        expect(response.body[i].connection_type).toBe(existingConnection[i].connection_type);
        expect(response.body[i].connection_subtype).toBe(existingConnection[i].connection_subtype);
        expect(response.body[i].connection_name).toBe(existingConnection[i].connection_name);
        expect(response.body[i].is_active).toBe(existingConnection[i].is_active);
      }}catch (error) {
        
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const response = await request(app).get("/api/connections");

          expect(response.status).toEqual(500);
          expect(response.body).toHaveProperty('message', response.body.message);
  
  
          console.log(response.body.message);
      
    
      }
    });
  });
  
  describe("findOne method", () => {
    it("should retrieve an existing connections from the database", async () => {
        let res;
        const existingConnectionID = 1;

        try{
      const existingConnection = await Connection.findOne();
      res = await request(server).get(`/api/connections/${existingConnectionID}`);
// console.log(existingConnection)
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(existingConnection.id);
      expect(res.body.project_id).toBe(existingConnection.project_id);
      expect(res.body.connection_type).toBe(existingConnection.connection_type);
      expect(res.body.connection_subtype).toBe(existingConnection.connection_subtype);
      expect(res.body.connection_name).toBe(existingConnection.connection_name);
      expect(res.body.is_active).toBe(existingConnection.is_active);
        }
        catch (error) {
            if (res && res.status === 404) {
              expect(res.body).toHaveProperty('message', `Cannot find Connection with id=${existingConnectionID}.`);
              console.log(res.body.message);
            } else {
              jest.spyOn(console, 'error').mockImplementation(() => {});
              res = await request(server).get(`/api/connections/${existingConnectionID}`);
              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
      
      
              console.log(res.body.message);
          
            }
          }    });
  
    });


    describe("findAllActive method", () => {
        it("should retrieve all active Connection from the database", async () => {
            try{
          const activeConnection = await Connection.findAll({ where: { is_active: "Y" } });
      
          const response = await request(app).get("/api/connections/active");
      
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(activeConnection.length);
      
            for (let i = 0; i < activeConnection.length; i++) {
                expect(response.body[i].id).toBe(activeConnection[i].id);
                expect(response.body[i].project_id).toBe(activeConnection[i].project_id);
                expect(response.body[i].connection_type).toBe(activeConnection[i].connection_type);
                expect(response.body[i].connection_subtype).toBe(activeConnection[i].connection_subtype);
                expect(response.body[i].connection_name).toBe(activeConnection[i].connection_name);
                expect(response.body[i].is_active).toBe(activeConnection[i].is_active);
              }}catch (error) {
           
              jest.spyOn(console, 'error').mockImplementation(() => {});
              const response = await request(app).get("/api/connectins/active");
              expect(response.status).toEqual(500);
              expect(response.body).toHaveProperty('message', response.body.message);
      
      
              console.log(response.body.message);
          
            
          } 
        });
      });

      describe("findAllWithDetails method", () => {
        it("should retrieve all existing Connection from the database", async () => {
            try{
          const existingConnection = await ConnectionList.findAll();
          const response = await request(app).get("/api/connections/connectionlist");
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(existingConnection.length);
      
          for (let i = 0; i < existingConnection.length; i++) {
            expect(response.body[i].id).toBe(existingConnection[i].id);
            expect(response.body[i].project_id).toBe(existingConnection[i].project_id);
            expect(response.body[i].connection_type).toBe(existingConnection[i].connection_type);
            expect(response.body[i].connection_subtype).toBe(existingConnection[i].connection_subtype);
            expect(response.body[i].connection_name).toBe(existingConnection[i].connection_name);
            expect(response.body[i].is_active).toBe(existingConnection[i].is_active);

            
          }}catch (error) {
            
              jest.spyOn(console, 'error').mockImplementation(() => {});
              const response = await request(app).get("/api/connections/connectionlist");
    
              expect(response.status).toEqual(500);
              expect(response.body).toHaveProperty('message', response.body.message);
      
      
              console.log(response.body.message);
          
        
          }
        });
      });


    //   describe("findConnectionByID method", () => {
    //     it("should retrieve an existing connections from the database", async () => {
    //         let res;
    //         const existingconnectionlistID = 1;
    
    //         try{
    //       const existingConnection = await ConnectionList.findOne();
    //       res = await request(server).get(`/api/connections/connectionlist/${existingconnectionlistID}`);
    // // console.log(existingConnection)
    //       expect(res.status).toBe(200);
    //       expect(res.body.id).toBe(existingConnection.id);
    //       expect(res.body.project_id).toBe(existingConnection.project_id);
    //       expect(res.body.connection_type).toBe(existingConnection.connection_type);
    //       expect(res.body.connection_subtype).toBe(existingConnection.connection_subtype);
    //       expect(res.body.connection_name).toBe(existingConnection.connection_name);
    //       expect(res.body.is_active).toBe(existingConnection.is_active);
    //         }
    //         catch (error) {
             
    //               jest.spyOn(console, 'error').mockImplementation(() => {});
    //               res = await request(server).get(`/api/connections/connectionlist/${existingconnectionlistID}`);
    //               expect(res.status).toEqual(500);
    //               expect(res.body).toHaveProperty('message', res.body.message);
          
          
    //               console.log(res.body.message);
              
                
    //           }    });
      
    //     });
    