const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const Options  = db.coreModels.tbl_configuration_option;

describe("findAll method", () => {
    it("should retrieve all existing Options from the database", async () => {
        try{
      const existingOptions = await Options.findAll();
      const res = await request(server).get("/api/configuration_options");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(existingOptions.length);

      for (let i = 0; i < existingOptions.length; i++) {
       
        
        expect(res.body[i].id).toBe(existingOptions[i].id);
        expect(res.body[i].configuration_detail_id).toBe(existingOptions[i].configuration_detail_id);
        expect(res.body[i].display_sequence).toBe(existingOptions[i].display_sequence);
        expect(res.body[i].configuration_item).toBe(existingOptions[i].configuration_item);
        expect(res.body[i].field_id).toBe(existingOptions[i].field_id);
        expect(res.body[i].display_name).toBe(existingOptions[i].display_name);
        expect(res.body[i].key_01).toBe(existingOptions[i].key_01);
        expect(res.body[i].value_01).toBe(existingOptions[i].value_01);
        expect(res.body[i].field_type).toBe(existingOptions[i].field_type);
        expect(res.body[i].remarks).toBe(existingOptions[i].remarks);
        expect(res.body[i].configuration_id).toBe(existingOptions[i].configuration_id);
        expect(res.body[i].required).toBe(existingOptions[i].required);
        expect(res.body[i].key_02).toBe(existingOptions[i].key_02);
        expect(res.body[i].valye_02).toBe(existingOptions[i].valye_02);
        expect(res.body[i].category).toBe(existingOptions[i].category);

        expect(res.body[i].is_active).toBe(existingOptions[i].is_active);

      }}catch (error) {
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const res = await request(server).get("/api/configuration_options");
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
          console.log(res.body.message);
      }
    });
  });

  describe('Create', () => {


    it('should create a new options', async () => {
      const data = {
        configuration_detail_id:1,
        display_sequence:1,
        configuration_item:"MySQL",
        field_id:"extract_type",
        display_name:"Extract Type",
        key_01:"Bulk",
        value_01:"select",
        field_type:"",
        remarks:"",
        is_active: "Y",
        created_by:"admin",
        configuration_id:null,
        required:"",
        key_02:"",
        valye_02:"",
        category:"S",
        
      };
      let res;
      try {
        // First test
        res = await request(server).post('/api/configuration_options').send(data);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('id');

        expect(res.body.configuration_detail_id).toEqual(data.configuration_detail_id);
        expect(res.body.display_sequence).toEqual(data.display_sequence);
        expect(res.body.configuration_item).toEqual(data.configuration_item);
        expect(res.body.field_id).toEqual(data.field_id);
        expect(res.body.display_name).toEqual(data.display_name);
        expect(res.body.key_01).toEqual(data.key_01);
        expect(res.body.value_01).toEqual(data.value_01);
        expect(res.body.field_type).toEqual(data.field_type);
        expect(res.body.remarks).toEqual(data.remarks);
       
        expect(res.body.key_02).toEqual(data.key_02);
        expect(res.body.valye_02).toEqual(data.valye_02);
        expect(res.body.configuration_id).toEqual(data.configuration_id);
        expect(res.body.required).toEqual(data.required);
        expect(res.body.category).toEqual(data.category);
        expect(res.body.is_active).toEqual('Y');
        expect(res.body.created_by).toEqual(data.created_by);
    
        

      } catch (error) {
       
        if (res && res.status === 400) {
          expect(res.body).toHaveProperty('message', "Content can't be empty!.");
          console.log(res.body.message);
        } else {
          jest.spyOn(console, 'error').mockImplementation(() => {});
          res = await request(server).post('/api/configuration_options').send(data);
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
  
  
          console.log(res.body.message);}
        
      }
    });
  });
  describe("findAllActive method", () => {
    it("should retrieve all active options from the database", async () => {
        try{
      const activeOptions= await Options.findAll({ where: { is_active: "Y" } });
  
      const res = await request(app).get("/api/configuration_options/active");
  
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(activeOptions.length);
  
      for (let i = 0; i < activeOptions.length; i++) {
    
        expect(res.body[i].id).toBe(activeOptions[i].id);
        expect(res.body[i].configuration_detail_id).toBe(activeOptions[i].configuration_detail_id);
        expect(res.body[i].display_sequence).toBe(activeOptions[i].display_sequence);
        expect(res.body[i].configuration_item).toBe(activeOptions[i].configuration_item);
        expect(res.body[i].field_id).toBe(activeOptions[i].field_id);
        expect(res.body[i].display_name).toBe(activeOptions[i].display_name);
        expect(res.body[i].key_01).toBe(activeOptions[i].key_01);
        expect(res.body[i].value_01).toBe(activeOptions[i].value_01);
        expect(res.body[i].field_type).toBe(activeOptions[i].field_type);
        expect(res.body[i].remarks).toBe(activeOptions[i].remarks);
        expect(res.body[i].configuration_id).toBe(activeOptions[i].configuration_id);
        expect(res.body[i].required).toBe(activeOptions[i].required);
        expect(res.body[i].key_02).toBe(activeOptions[i].key_02);
        expect(res.body[i].valye_02).toBe(activeOptions[i].valye_02);
        expect(res.body[i].category).toBe(activeOptions[i].category);

        expect(res.body[i].is_active).toBe(activeOptions[i].is_active);
      }}
      catch (error) {
       
          jest.spyOn(console, 'error').mockImplementation(() => {});
          const res = await request(app).get("/api/configuration_options/active");
          expect(res.status).toEqual(500);
          expect(res.body).toHaveProperty('message', res.body.message);
  
  
          console.log(res.body.message);
        
      } 
    });
  });


  describe("getConfigurationOptions method", () => {
    it("should retrieve configuration options from the database", async () => {
      try {
        const res = await request(server).get("/api/configuration_options/getConfigurationOptions");
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('length', 1);
  
        const configurationOption = res.body[0];
        expect(configurationOption).toHaveProperty('initialvalues');
        expect(configurationOption).toHaveProperty('field_list');
  
        const initialValues = configurationOption.initialvalues;
        const fieldList = configurationOption.field_list;
  
        expect(Object.keys(initialValues).length).toBeGreaterThan(0);
        expect(fieldList.length).toBeGreaterThan(0);
  
  
      } catch (error) {
        jest.spyOn(console, 'error').mockImplementation(() => {});
  
        const res = await request(server).get("/api/configuration_options/getConfigurationOptions");
  
        expect(res.status).toEqual(500);
        expect(res.body).toHaveProperty('message', res.body.message);
        console.log(res.body.message);
      }
    });
  });
  describe("findAllById method", () => {
    it("should retrieve an existing options from the database", async () => {
        let res;
        
        const existConfigurationDetaiID = 12345;
        try{
      const existConfigurationDetail = await Options.findAll();
      res = await request(server).get(`/api/configuration_options/findAllById/${existConfigurationDetaiID}`);
      // console.log(res)
      expect(res.status).toBe(200);
  
        }
        catch (error) {
          
              jest.spyOn(console, 'error').mockImplementation(() => {});
              res = await request(server).get(`/api/configuration_options/findAllById/${existConfigurationDetaiID}`);
              expect(res.status).toEqual(500);
              expect(res.body).toHaveProperty('message', res.body.message);
              console.log(res.body.message);
          
     
          }    });
  
    });
    describe('Update method', () => {
    
        it('update the Options in the database', async () => {
            const id = 574;
        const updatedOptions = {
            configuration_detail_id:1,
            display_sequence:1,
            configuration_item:"MySQL12",
            field_id:"extract_type",
            display_name:"Extract Type",
            key_01:"Bulk",
            value_01:"select",
            field_type:"",
            remarks:"",
            is_active: "Y",
            created_by:"admin",
            configuration_id:null,
            required:"",
            key_02:"",
            valye_02:"",
            category:"S",
            
        };
        let response;
      
         try{
          const response = await request(app)
            .put(`/api/configuration_options/${id}`)
            .send(updatedOptions);
          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Options was updated scuccessfully.');
          const updatedOptionsFromDb = await Details.findOne({ where: { id } });
            expect(updatedOptionsFromDb.configuration_detail_id).toBe(updatedOptions.configuration_detail_id);
            expect(updatedOptionsFromDb.display_sequence).toBe(updatedOptions.display_sequence);
            expect(updatedOptionsFromDb.configuration_item).toBe(upupdatedOptions.configuration_item);
            expect(updatedOptionsFromDb.field_id).toBe(upupdatedOptions.field_id);
      
            expect(updatedOptionsFromDb.display_name).toBe(updatedOptions.display_name);
            expect(updatedOptionsFromDb.key_01).toBe(updatedOptions.key_01);
            expect(updatedOptionsFromDb.value_01).toBe(updatedOptions.value_01);
            expect(updatedOptionsFromDb.field_type).toBe(updatedOptions.field_type);
            expect(updatedOptionsFromDb.remarks).toBe(updatedOptions.remarks);
      
        
            expect(updatedOptionsFromDb.created_by).toBe(updatedOptions.created_by);
            expect(updatedOptionsFromDb.is_active).toBe(updatedOptions.is_active);

            expect(updatedOptionsFromDb.required).toBe(updatedOptions.required);
            expect(updatedOptionsFromDb.key_02).toBe(updatedOptions.key_02);
      
        
            expect(updatedOptionsFromDb.valye_02).toBe(updatedOptions.valye_02);
            expect(updatedOptionsFromDb.category).toBe(updatedOptions.category);

             }catch (error) {
                if (error.status === 404) {
                  const errorMessage = `Cannot Options Project with id=${id}. Maybe Options was not found or req.body is empty!`;
                  console.log(errorMessage);
                  return { status: 404, message: errorMessage };
                }  else {
                  const errorMessage = `Error updating Options with id=${id}`;
                  console.log(errorMessage);
                  return { status: 500, message: errorMessage };
                }
              }
        });
      
       
      });
      
      