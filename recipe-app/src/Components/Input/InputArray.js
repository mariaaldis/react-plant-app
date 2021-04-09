import React from "react";


const InputArray = ({ }) => {
    const { register, control } = useFormContext();
    const { fields } = useFieldArray({ name: "clients", control });
  
    return (
      <div>
        {fields.map((field, id) => {
          return (
            <div key={field.id}>
              <input name={`clients[${id}].name`} ref={register} />
              <input name={`clients[${id}].surname`} ref={register} />
            </div>
          );
        })}
      </div>
    );
  };