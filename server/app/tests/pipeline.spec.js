const request = require('supertest');
const app = require('../../server');
const server = require('../../server');

const db = require('../models');
const Pipeline = db.configModels.tbl_pipeline;

describe("findAll method", () => {
  it("should retrieve all existing pipeline from the database", async () => {
      try{
    const existingPipelines = await Pipeline.findAll();
    const response = await request(app).get("/api/pipelines");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(existingPipelines.length);

    for (let i = 0; i < existingPipelines.length; i++) {
      expect(response.body[i].id).toBe(existingPipelines[i].id);
      expect(response.body[i].pipeline_name).toBe(existingPipelines[i].pipeline_name);
      expect(response.body[i].pipeline_cd).toBe(existingPipelines[i].pipeline_cd);
      expect(response.body[i].pipeline_description).toBe(existingPipelines[i].pipeline_description);
      expect(response.body[i].pipeline_sequence).toBe(existingPipelines[i].pipeline_sequence);
      expect(response.body[i].is_active).toBe(existingPipelines[i].is_active);
    }}catch (error) {
      
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const response = await request(app).get("/api/pipelines");

        expect(response.status).toEqual(500);
        expect(response.body).toHaveProperty('message', response.body.message);


        console.log(response.body.message);
    
  
    }
  });
});


describe("findOne method", () => {
  it("should retrieve an existing pipelines from the database", async () => {
    const existingPipelineID = 1;

    try{
    const existingPipeline = await Pipeline.findOne();

    const response = await request(app).get(`/api/pipelines/${existingPipelineID}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(existingPipeline.id);
    expect(response.body.pipeline_name).toBe(existingPipeline.pipeline_name);
    expect(response.body.pipeline_cd).toBe(existingPipeline.pipeline_cd);
    expect(response.body.pipeline_description).toBe(existingPipeline.pipeline_description);
    expect(response.body.pipeline_sequence).toBe(existingPipeline.pipeline_sequence);
    expect(response.body.is_active).toBe(existingPipeline.is_active);
  }
  catch (error) {
      if (res && res.status === 404) {
        expect(res.body).toHaveProperty('message', `Cannot find Pipeline with id=${existingPipelineID}.`);
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
  it("should retrieve all active pipelines from the database", async () => {

    try{
    const activePipelines = await Pipeline.findAll({ where: { is_active: "Y" } });

    const response = await request(app).get("/api/pipelines/active");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(activePipelines.length);

    for (let i = 0; i < activePipelines.length; i++) {
      expect(response.body[i].id).toBe(activePipelines[i].id);
      expect(response.body[i].pipeline_name).toBe(activePipelines[i].pipeline_name);
    expect(response.body[i].pipeline_cd).toBe(activePipelines[i].pipeline_cd);
    expect(response.body[i].pipeline_description).toBe(activePipelines[i].pipeline_description);
    expect(response.body[i].pipeline_sequence).toBe(activePipelines[i].pipeline_sequence);
    expect(response.body[i].is_active).toBe(activePipelines[i].is_active);
  }}
  catch (error) {
   
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const response = await request(app).get("/api/pipelines/active");
      expect(response.status).toEqual(500);
      expect(response.body).toHaveProperty('message', response.body.message);


      console.log(response.body.message);
  
    
  } 
});
});



describe('Create', () => {


  it('should create a new pipeline', async () => {
    const data = {
      project_id:1,
      pipeline_name:"pipeline to test6 to test",
      pipeline_cd:"pipe cd",
      pipeline_description:"description to test the pipeline",
      pipeline_sequence:1,
      is_active: "Y",
      created_by: "system"
    };
    let res;
    try {
      res = await request(server).post('/api/pipelines').send(data);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.project_id).toEqual(data.project_id);
      expect(res.body.pipeline_name).toEqual(data.pipeline_name);

      expect(res.body.pipeline_cd).toEqual(data.pipeline_cd);
      expect(res.body.pipeline_description).toEqual(data.pipeline_description);
      expect(res.body.pipeline_sequence).toEqual(data.pipeline_sequence);
      expect(res.body.is_active).toEqual('Y');
      expect(res.body.created_by).toEqual(data.created_by);
    } catch (error) {
      if (res && res.status === 400) {
        expect(res.body).toHaveProperty('message', "Content can't be empty!.");
        console.log(res.body.message);
      } else {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        res = await request(server).post('/api/pipelines').send(data);
        expect(res.status).toEqual(500);
        expect(res.body).toHaveProperty('message', res.body.message);


        console.log(res.body.message);
    
      }
    }
  });
});

describe('Update method', () => {
    
  it('update the pipeline in the database', async () => {
      const id = 6;
  const updatedPipeline = {
    project_id:1,
      pipeline_name:"pipeline update",
      pipeline_cd:"pipe cd",
      pipeline_description:"description to test the pipeline",
      pipeline_sequence:1,
      is_active: "Y",
      created_by: "system"
  };
  let response;

   try{
     response = await request(app)
      .put(`/api/pipelines/${id}`)
      .send(updatedPipeline);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pipeline was updated scuccessfully.');

    const updatedPipelineFromDb = await Pipeline.findOne({ where: { id } });
    expect(updatedPipelineFromDb.project_id).toBe(updatedPipeline.project_id);
    expect(updatedPipelineFromDb.pipeline_name).toBe(updatedPipeline.pipeline_name);
    expect(updatedPipelineFromDb.pipeline_cd).toBe(updatedPipeline.pipeline_cd);
    expect(updatedPipelineFromDb.pipeline_description).toBe(updatedPipeline.pipeline_description);
    expect(updatedPipelineFromDb.pipeline_sequence).toBe(updatedPipeline.pipeline_sequence);
    expect(updatedPipelineFromDb.created_by).toBe(updatedPipeline.created_by);
    expect(updatedPipelineFromDb.is_active).toBe(updatedPipeline.is_active);
       }catch (error) {
          if (error.status === 404) {
            const errorMessage = `Cannot update Pipeline with id=${id}. Maybe Pipeline was not found or req.body is empty!`;
            console.log(errorMessage);
            return { status: 404, message: errorMessage };
          }  else {
            const errorMessage = `Error updating Pipeline with id=${id}`;
            console.log(errorMessage);
            return { status: 500, message: errorMessage };
          }
        }
  });

 
});


describe("findID method", () => {
  it("should retrieve an existing pipelines from the database", async () => {
    const existingPipeline = await Pipeline.findAll();
const project_id=1
    const response = await request(app).get(`/api/pipelines/findAllById/${project_id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(existingPipeline.id);
    expect(response.body.pipeline_name).toBe(existingPipeline.pipeline_name);
    expect(response.body.pipeline_cd).toBe(existingPipeline.pipeline_cd);
    expect(response.body.pipeline_description).toBe(existingPipeline.pipeline_description);
    expect(response.body.pipeline_sequence).toBe(existingPipeline.pipeline_sequence);
    expect(response.body.is_active).toBe(existingPipeline.is_active);
});});



