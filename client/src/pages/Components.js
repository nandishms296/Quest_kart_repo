import React from "react";
import Element from "components/Element";

const Components = ({ field, selectedCheck, formValues }) => {


  return (
    <div>
      {field.params_field_list.map((paramsList, index) => {
        return paramsList.map((param, i) => {
          const { check_name, param_field_list, param_initial_list } = param;
          console.log(check_name, "params_field_list");

          if (check_name === selectedCheck) {
            return (
              <div key={`${index}-${i}`}>
                {param_field_list.map((field, j) => (
                  <Element
                    key={j}
                    field={field}
                    values={param_initial_list}
                    touched={{}}
                    errors={{}}
                    handleBlur={() => {}}
                    handleChange={(e) => {
                      const fieldName = field.field_id;
                      const fieldValue = e.target.value;
                      formValues[fieldName] = fieldValue;
                    }}
                  />
                ))}
              </div>
            );
          } else {
            return null;
          }
        });
      })}
    </div>
  );
};

export default Components;

