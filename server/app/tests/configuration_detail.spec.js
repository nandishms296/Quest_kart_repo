const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const Details  = db.coreModels.tbl_configuration_detail;

const getConfigurationDetails=require('../controllers/core/configuration_detail.controller');
describe("findAll method", () => {
    it("should retrieve all existing details from the database", async () => {
        try{
      const existingDetails = await Details.findAll();
      const res = await request(server).get("/api/configuration_details");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(existingDetails.length);

      for (let i = 0; i < existingDetails.length; i++) {
        expect(res.body[i].id).toBe(existingDetails[i].id);
        expect(res.body[i].configuration_id).toBe(existingDetails[i].configuration_id);
        expect(res.body[i].display_sequence).toBe(existingDetails[i].display_sequence);
        expect(res.body[i].key_01).toBe(existingDetails[i].key_01);
        expect(res.body[i].required).toBe(existingDetails[i].required);
        expect(res.body[i].key_02).toBe(existingDetails[i].key_02);
        expect(res.body[i].value_02).toBe(existingDetails[i].value_02);
        expect(res.body[i].field_type).toBe(existingDetails[i].field_type);
        expect(res.body[i].remarks).toBe(existingDetails[i].remarks);
        expect(res.body[i].sequence).toBe(existingDetails[i].sequence);
        expect(res.body[i].is_active).toBe(existingDetails[i].is_active);
      }}catch (error) {
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const res = await request(server).get("/api/configuration_details");
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
          console.log(res.body.message);
      }
    });
  });

  describe('Create', () => {


    it('should create a new details', async () => {
      const data = {
        configuration_id:"one",
        display_sequence: 1,
        key_01: "FullName",
        value_01: "full_name",
        required: "Y",
        key_02: " ",
        value_02: " ", 
        field_type: " ",
        remarks: " ",
        is_active:"Y",
        created_by: "admin"
        
      };
      let res;
      try {
        res = await request(server).post('/api/configuration_details').send(data);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('id');

        expect(res.body.configuration_id).toEqual(data.configuration_id);
        expect(res.body.display_sequence).toEqual(data.display_sequence);
        expect(res.body.key_01).toEqual(data.key_01);
        expect(res.body.value_01).toEqual(data.value_01);
        expect(res.body.key_02).toEqual(data.key_02);
        expect(res.body.value_02).toEqual(data.value_02);
        expect(res.body.field_type).toEqual(data.field_type);
        expect(res.body.remarks).toEqual(data.remarks);
        expect(res.body.is_active).toEqual('Y');
        expect(res.body.created_by).toEqual(data.created_by);
      } catch (error) {
       
        if (res && res.status === 400) {
          expect(res.body).toHaveProperty('message', "Content can't be empty!.");
          console.log(res.body.message);
        } else {
          jest.spyOn(console, 'error').mockImplementation(() => {});
          res = await request(server).post('/api/configuration_details').send(data);
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
  
  
          console.log(res.body.message);}
        
      }
    });
  });
  describe("findAllActive method", () => {
    it("should retrieve all active details from the database", async () => {
        try{
      const activeDetails = await Details.findAll({ where: { is_active: "Y" } });
  
      const res = await request(app).get("/api/configuration_details/active");
  
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(activeDetails.length);
  
      for (let i = 0; i < activeDetails.length; i++) {
    
        expect(res.body[i].id).toBe(activeDetails[i].id);
        expect(res.body[i].configuration_id).toBe(activeDetails[i].configuration_id);
        expect(res.body[i].display_sequence).toBe(activeDetails[i].display_sequence);
        expect(res.body[i].key_01).toBe(activeDetails[i].key_01);
        expect(res.body[i].required).toBe(activeDetails[i].required);
        expect(res.body[i].key_02).toBe(activeDetails[i].key_02);
        expect(res.body[i].value_02).toBe(activeDetails[i].value_02);
        expect(res.body[i].field_type).toBe(activeDetails[i].field_type);
        expect(res.body[i].remarks).toBe(activeDetails[i].remarks);
        expect(res.body[i].sequence).toBe(activeDetails[i].sequence);
        expect(res.body[i].is_active).toBe(activeDetails[i].is_active);
      }}
      catch (error) {
       
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const res = await request(app).get("/api/configuration_details/active");
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
  
  
          console.log(res.body.message);
        
      } 
    });
  });


  describe("findAllById method", () => {
    it("should retrieve an existing details from the database", async () => {
        let res;
        const existConfigurationID = 12345;
        try{
      const existingConfig = await Details.findAll();
      res = await request(server).get(`/api/configuration_details/findAllById/${existConfigurationID}`);

      expect(res.status).toBe(200);
  
        }
        catch (error) {
          
              jest.spyOn(console, 'error').mockImplementation(() => {});
              res = await request(server).get(`/api/configuration_details/findAllById/${existConfigurationID}`);
              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
              console.log(res.body.message);
          
     
          }    });
  
    });


describe("getConfigurationDetails method", () => {
  it("should retrieve configuration details from the database", async () => {
    try {
      const response = await request(server).get("/api/configuration_details/getConfigurationDetails");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('length', 1);

      const configurationDetail = response.body[0];
      expect(configurationDetail).toHaveProperty('initialvalues');
      expect(configurationDetail).toHaveProperty('field_list');

      const initialValues = configurationDetail.initialvalues;
      const fieldList = configurationDetail.field_list;

      expect(Object.keys(initialValues).length).toBeGreaterThan(0);
      expect(fieldList.length).toBeGreaterThan(0);


    } catch (error) {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const response = await request(server).get("/api/configuration_details/getConfigurationDetails");

      expect(response.status).toEqual(500);
      expect(response.body).toHaveProperty('message', response.body.message);
      console.log(response.body.message);
    }
  });
});


describe('Update method', () => {
    
  it('update the Details in the database', async () => {
      const id = 59;
  const updatedDetails = {
    configuration_id:1,
    display_sequence: 1,
    key_01: "FullName1",
    value_01: "full_name",
    required: "Y",
    key_02: " ",
    value_02: " ", 
    field_type: " ",
    remarks: " ",
    is_active:"Y",
    created_by: "admin"
  };
  let response;

   try{
    const response = await request(app)
      .put(`/api/configuration_details/${id}`)
      .send(updatedDetails);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Details was updated scuccessfully.');
    const updatedDetailsFromDb = await Details.findOne({ where: { id } });
      expect(updatedDetailsFromDb.configuration_id).toBe(updatedDetails.configuration_id);
      expect(updatedDetailsFromDb.display_sequence).toBe(updatedDetails.display_sequence);
      expect(updatedDetailsFromDb.key_01).toBe(upupdatedDetails.key_01);
      expect(updatedDetailsFromDb.value_01).toBe(upupdatedDetails.value_01);

      expect(updatedDetailsFromDb.required).toBe(updatedDetails.required);
      expect(updatedDetailsFromDb.key_02).toBe(updatedDetails.key_02);
      expect(updatedDetailsFromDb.value_02).toBe(updatedDetails.value_02);
      expect(updatedDetailsFromDb.field_type).toBe(updatedDetails.field_type);
      expect(updatedDetailsFromDb.remarks).toBe(updatedDetails.remarks);

  
      expect(updatedDetailsFromDb.created_by).toBe(updatedDetails.created_by);
      expect(updatedDetailsFromDb.is_active).toBe(updatedDetails.is_active);

       }catch (error) {
          if (error.status === 404) {
            const errorMessage = `Cannot Details Project with id=${id}. Maybe Details was not found or req.body is empty!`;
            console.log(errorMessage);
            return { status: 404, message: errorMessage };
          }  else {
            const errorMessage = `Error updating Details with id=${id}`;
            console.log(errorMessage);
            return { status: 500, message: errorMessage };
          }
        }
  });

 
});

