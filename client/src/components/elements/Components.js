import React from "react";
import Element from "components/Element";

const Components = ({ field, selectedCheck, formValues, setFormValues }) => {
  const filteredParams = field.params_field_list
    .flatMap(paramsList => paramsList)
    .filter(param => param.check_name === selectedCheck && Object.keys(param.param_initial_list).length > 0);

  return (
    <div>
      {filteredParams.map((param, index) => (
        <div key={index}>
          {param.param_field_list.map((field, j) => (
            <Element
              key={j}
              field={field}
              values={formValues}
              touched={{}}
              errors={{}}
              handleBlur={() => {}}
              handleChange={(e) => {
                const fieldName = field.field_id;
                const fieldValue = e.target.value;
                setFormValues(prevFormValues => ({
                  ...prevFormValues,
                  [fieldName]: fieldValue,
                }));
              }}
              selectedCheck={selectedCheck}
               setFormValues={setFormValues}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Components;

