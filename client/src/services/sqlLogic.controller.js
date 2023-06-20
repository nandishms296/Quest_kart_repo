export const handleSqlExecutionSubmit = async (
  data,
  values,
  addOrEditRecordSqlexe,
  resetForm
) => {
  const updatedData = {
    ...data,
    SqlExecution: data.SqlExecution.map((item, idx) => ({
      ...item,
      idx: idx + 1,
    })),
  };

  console.log(updatedData, "newData");

  const restructuredData = [];

  restructuredData.push({
    task_id: values.id,
    task_type: "SqlExecution",
    parameter_type: "parameters",
    key_01: "connection_name",
    value_01: data.connection_name,
    is_active: "Y",
    created_by: "admin",
    sequence: 1,
  });

  restructuredData.push({
    task_id: values.id,
    task_type: "SqlExecution",
    parameter_type: "parameters",
    key_01: "restart",
    value_01: data.restart,
    is_active: "Y",
    created_by: "admin",
    sequence: 2,
  });

  updatedData.SqlExecution.forEach((item, idx) => {
    const parameterType = item.idx;

    const dynamicKeys = Object.keys(item).filter((key) => key !== "idx");

    dynamicKeys.forEach((key, sequence) => {
      const restructuredItem = {
        task_id: values.id,
        task_type: "SqlExecution",
        parameter_type: parameterType,
        key_01: key,
        value_01: item[key],
        is_active: "Y",
        created_by: "admin",
        sequence: sequence + 3,
      };
      restructuredData.push(restructuredItem);
    });
  });
  console.log(restructuredData, "restructuredData");

  let taskRecordSQL = { details: restructuredData };
  await addOrEditRecordSqlexe(taskRecordSQL, resetForm, values.id);
};
