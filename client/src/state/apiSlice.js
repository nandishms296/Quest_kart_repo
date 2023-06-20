import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 403) {
    console.log("sending refresh token");
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log(refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      //store the new token.
      api.dispath(setCredentials({ ...refreshResult.data, user }));
      // retry the original query with new access token.
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispath(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Task",
    "Program",
    "Project",
    "Pipeline",
    "Connections",
    "ConnectionForm",
    "Object",
  ],
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getUser: build.query({
      query: (id) => `api/users/${id}`,
      providesTags: ["User"],
    }),
    getPrograms: build.query({
      query: () => "api/programs",
      providesTags: ["Object"],
    }),
    getObjectById: build.query({
      query: ({ object, id }) => `api/${object.toLowerCase()}s/${id}`,
      providesTags: ["Object"],
    }),
    getProgramById: build.query({
      query: (id) => `api/programs/${id}`,
      providesTags: ["Program"],
    }),
    getProjects: build.query({
      query: (id) => `api/projects/findAllById/${id}`,
      providesTags: ["Object"],
    }),
    getProjectById: build.query({
      query: (id) => `api/projects/${id}`,
      providesTags: ["Project"],
    }),
    getPipelines: build.query({
      query: (id) => `api/pipelines/findAllById/${id}`,
      providesTags: ["Pipeline"],
    }),
    getPipelineById: build.query({
      query: (id) => `api/pipelines/${id}`,
      providesTags: ["Pipeline"],
    }),
    getPipelineFlowById: build.query({
      query: (id) => `api/pipelines/pipelineFlow/${id}`,
      providesTags: ["Tasks"],
    }),
    getTasks: build.query({
      query: (id) => `api/tasks/getTasksForPipelineID/${id}`,
      providesTags: ["Task"],
    }),
    getTasksDQ: build.query({
      query: (task_id) => `/api/task_parameters/DQ/${task_id}`,
      providesTags: ["Task"],
    }),
    getTasksSqlExecution: build.query({
      query: (task_id) => `/api/task_parameters/SqlExecution/${task_id}`,
      providesTags: ["Task"],
    }),
    getUsers: build.query({
      query: () => "api/users",
      providesTags: ["Object"],
    }),
    getUserById: build.query({
      query: (id) => `api/users/${id}`,
      providesTags: ["Users"],
    }),
    getConnections: build.query({
      query: () => `api/connections/connectionlist`,
      providesTags: ["Connections"],
    }),
    getConnectionById: build.query({
      query: (id) => `/api/connections/connectionlist/${id}`,
      providesTags: ["Connections"],
    }),
    getConnectionDetailsDelete: build.query({
      query: () => `api/connection_details/delete1`,
      providesTags: ["ConnectionDetailsDelete"],
    }),
    getConnectionType: build.query({
      query: () => `api/configurations/connectionType`,
      providesTags: ["ConnectionsType"],
    }),
    getConnectionSubType: build.query({
      query: (connection_type) =>
        `api/configurations/connectionSubType/${connection_type}`,
      providesTags: ["ConnectionsSubType"],
    }),
    getConfiguration: build.query({
      query: () => `api/configurations`,
      providesTags: ["Configuration"],
    }),
    getConfigurationForm: build.query({
      query: () => `api/configurations/getConfigurations`,
      providesTags: ["ConfigurationForm"],
    }),
    getConfigurationDetails: build.query({
      query: (id) => `api/configuration_details/findAllById/${id}`,
      providesTags: ["ConfigurationDetails"],
    }),
    getConfigurationDetailsForm: build.query({
      query: (name) => `api/configuration_details/getConfigurationDetails`,
      providesTags: ["ConfigurationDetailsForm"],
    }),
    getConfigurationOptions: build.query({
      query: (id) => `api/configuration_options/findAllById/${id}`,
      providesTags: ["ConfigurationOptions"],
    }),
    getConfigurationOptionForm: build.query({
      query: (name) => `api/configuration_options/getConfigurationOptions`,
      providesTags: ["ConfigurationOptionForm"],
    }),

    getProjectCount: build.query({
      query: (id) => `api/configurations/getProjectCount`,
      providesTags: ["ProjectCount"],
    }),


getFrequentlyusedobjects: build.query({
      query: (id) => `api/configurations/getFrequentlyusedobjects`,
      providesTags: ["Frequentlyusedobjects"],
    }),

    addConnection: build.mutation({
      query: ({ data }) => ({
        // var connection_subtype = data.connectionSubType
        url: `/api/connections/`,
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Connections"],
    }),

    updateGitData: build.mutation({
      query: ({ id }) => ({
        url: `/api/tasks/gitDataUpdate/${id}`,
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Data"],
    }),
addGitData: build.mutation({
      query: ({ object, data,id }) => ({
        url: `/api/tasks/getGitData/${id}`,
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Data"],
    }),


    updateConnection: build.mutation({
      query: ({ data, connection_id }) => ({
        url: `/api/connections/${connection_id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Connections"],
    }),
    addTask: build.mutation({
      query: ({ data }) => ({
        // var connection_subtype = data.connectionSubType
        url: `/api/tasks`,
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),

    addTaskParameter: build.mutation({
      query: ({ data }) => ({
        // var connection_subtype = data.connectionSubType
        url: `/api/task_parameters`,
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),
    addTaskParameterSQL: build.mutation({
      query: ({ data }) => ({
        // var connection_subtype = data.connectionSubType
        url: `/api/task_parameters/createSQL`,
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: build.mutation({
      query: ({ data, task_id }) => ({
        url: `/api/tasks/${task_id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),
    updateTaskSequence: build.mutation({
      query: ({ data }) => ({
        url: `/api/tasks/updateTaskSequence`,
        method: "PATCH",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),

    updateTaskDetails: build.mutation({
      query: ({ data, id }) => ({
        url: `/api/tasks/updateTask/${id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),

    updateTaskParameter: build.mutation({
      query: ({ data, task_id }) => ({
        url: `/api/task_parameters/${task_id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),
    updateTaskParameterSQL: build.mutation({
      query: ({ data, task_id }) => ({
        url: `/api/task_parameters/updateSQL/${task_id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Task"],
    }),

    addObject: build.mutation({
      query: ({ object, data }) => ({
        url: `/api/${object.toLowerCase()}s`,
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Object"],
    }),
    updateObject: build.mutation({
      query: ({ object, data }) => ({
        url: `/api/${object.toLowerCase()}s/${data.id}`,
        method: "PUT",
        body: data,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Object"],
    }),

    changePassword: build.mutation({
      query: (payload) => ({
        url: `auth/changepassword`,
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),

    forgetPassword: build.mutation({
      query: (payload) => ({
        url: `/auth/forgetpassword`,
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),
    resetPassword: build.mutation({
      query: (payload) => ({
        url: `auth/resetpassword`,
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
    }),
    registerUser: build.mutation({
      query: (data) => ({
        url: `/register`,
        method: "POST",
        body: { ...data },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["User"],
    }),
    getConnectionForm: build.query({
      query: () => `api/configurations/connectionForm`,
      providesTags: ["ConnectionForm"],
    }),
    getConnectionDelete: build.query({
      query: () => `api/connection_details/delete1/90`,
      providesTags: ["ConnectionForm"],
    }),
    getTaskForm: build.query({
      query: () => `api/configurations/taskForm`,
      providesTags: ["TaskForm"],
    }),
    getCheckUsers: build.query({
      query: (login_id) => `api/users/userexists/${login_id}`,
      providesTags: ["NewObject"],
    }),
    getObjectForm: build.query({
      query: (name) => `api/configurations/objectform/${name}`,
      providesTags: ["Object"],
    }),
    getPreviewData: build.query({
      query: (connection) => ({
        url: `api/preview/${connection.connection_subtype}`,
        method: "GET",
        body: { connection },
      }),
      providesTags: ["Preview"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetTasksQuery,
  useGetTasksDQQuery,
  useGetTasksSqlExecutionQuery,
  useGetProgramsQuery,
  useGetProjectsQuery,
  useGetPipelinesQuery,
  useLazyGetPipelineFlowByIdQuery,
  useGetConnectionsQuery,
  useGetConnectionFormQuery,
  useGetConnectionDeleteQuery,
  useGetConnectionDetailsDeleteQuery,
  useGetProjectCountQuery,
  useGetFrequentlyusedobjectsQuery,
  useUpdateGitDataMutation,
  useAddGitDataMutation,
  useGetConnectionTypeQuery,
  useGetConnectionSubTypeQuery,
  useGetConnectionByIdQuery,
  useGetObjectFormQuery,
  useGetUsersQuery,
  useGetConfigurationQuery,
  useGetConfigurationFormQuery,
  useGetConfigurationDetailsQuery,
  useGetConfigurationDetailsFormQuery,
  useGetConfigurationOptionsQuery,
  useGetConfigurationOptionFormQuery,
  useAddObjectMutation,
  useAddConnectionMutation,
  useUpdateConnectionMutation,

  useAddTaskMutation,
  useAddTaskParameterMutation,
  useAddTaskParameterSQLMutation,
  useUpdateTaskMutation,
  useUpdateTaskSequenceMutation,
  useUpdateTaskDetailsMutation,
  useUpdateTaskParameterMutation,
  useUpdateTaskParameterSQLMutation,
  useUpdateObjectMutation,
  useGetObjectByIdQuery,
  useGetTaskFormQuery,
  useLazyGetTaskFormQuery,
  useLoginMutation,
  useRegisterUserMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetCheckUsersQuery,
  useGetPreviewDataQuery,
} = apiSlice;
