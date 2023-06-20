const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const ConnectionDetail = db.configModels.tbl_connection_detail;
const { toBeOneOf } = require('jest-extended');
expect.extend({ toBeOneOf });

describe("findAll method", () => {
    it("should retrieve all existing ConnectionDetails from the database", async () => {
        try{
      const existingConnectionDetails = await ConnectionDetail.findAll();
      const response = await request(app).get("/api/connection_details");
  // console.log(response.body)
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(existingConnectionDetails.length);
      
  
      for (let i = 0; i < existingConnectionDetails.length; i++) {
        expect(response.body[i].id).toBe(existingConnectionDetails[i].id);
        expect(response.body[i].connection_id).toBe(existingConnectionDetails[i].connection_id);
        expect(response.body[i].key_01).toBe(existingConnectionDetails[i].key_01);
        expect(response.body[i].value_01).toBe(existingConnectionDetails[i].value_01);
       
  
      }
    }catch (error) {
        
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const response = await request(app).get("/api/connection_details");

          expect(response.status).toEqual(500);
          expect(response.body).toHaveProperty('message', response.body.message);
  
  
          console.log(response.body.message);
      
    
      }
    });
  });

  describe('Create', () => {


    it('should create a new ConnectionDetails', async () => {
      const data = {
        connection_id: 1,
        key_01: "username",
        value_01:"root" ,
        sequence: "1",
        is_active: "Y",
        created_by: "system",
      };
      let res;
      try {
        // First test
        res = await request(server).post('/api/connection_details').send(data);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.connection_id).toEqual(data.connection_id);
        expect(res.body.key_01).toEqual(data.key_01);
  
        expect(res.body.value_01).toEqual(data.value_01);
        expect(res.body.sequence).toEqual(data.sequence);
        expect(res.body.is_active).toEqual('Y');
        expect(res.body.created_by).toEqual(data.created_by);
    }catch (error) {
        
        jest.spyOn(console, 'error').mockImplementation(() => {});
        res = await request(server).post('/api/connection_details').send(data);

        expect(res.status).toEqual(500);


        console.log(res.body.message);
    
  
    }
  });
});

  
  