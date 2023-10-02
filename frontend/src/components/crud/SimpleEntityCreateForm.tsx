import React, { useState } from "react";
import { JSONSchema7 } from "json-schema";
import { Form } from "@rjsf/bootstrap-4";
import { gql, useMutation } from "@apollo/client";

import {
  SimpleEntityRequest,
  SimpleEntityResponse,
} from "../../APIClients/SimpleEntityAPIClient";

const schema: JSONSchema7 = {
  title: "Create Simple Entity",
  description: "A simple form to test creating a simple entity",
  type: "object",
  required: [
    "stringField",
    "intField",
    "stringArrayField",
    "enumField",
    "boolField",
  ],
  properties: {
    stringField: {
      type: "string",
      title: "String Field",
      default: "UW Blueprint",
    },
    intField: {
      type: "integer",
      title: "Integer Field",
      default: 2017,
    },
    stringArrayField: {
      type: "array",
      items: {
        type: "string",
      },
      title: "String Array Field",
      default: [],
    },
    enumField: {
      type: "string",
      enum: ["A", "B", "C", "D"],
      title: "Enum Field",
      default: "A",
    },
    boolField: {
      type: "boolean",
      title: "Boolean Field",
      default: true,
    },
  },
};

const uiSchema = {
  boolField: {
    "ui:widget": "select",
  },
};

const CREATE_SIMPLE_ENTITY = gql`
  mutation SimpleEntityCreateForm_CreateSimpleEntity(
    $entity: SimpleEntityRequestDTO!
  ) {
    createSimpleEntity(entity: $entity) {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
    }
  }
`;

const SimpleEntityCreateForm = (): React.ReactElement => {
  const [data, setData] = useState<SimpleEntityResponse | null>(null);
  const [formFields, setFormFields] = useState<SimpleEntityRequest | null>(
    null,
  );

  const [createSimpleEntity] = useMutation<{
    createSimpleEntity: SimpleEntityResponse;
  }>(CREATE_SIMPLE_ENTITY);

  if (data) {
    return <p>Created! ✔️</p>;
  }

  const onSubmit = async ({ formData }: { formData: SimpleEntityRequest }) => {
    const graphQLResult = await createSimpleEntity({
      variables: { entity: formData },
    });
    const result: SimpleEntityResponse | null =
      graphQLResult.data?.createSimpleEntity ?? null;
    setData(result);
  };
  return (
    <Form
      formData={formFields}
      schema={schema}
      uiSchema={uiSchema}
      onChange={({ formData }: { formData: SimpleEntityRequest }) =>
        setFormFields(formData)
      }
      onSubmit={onSubmit}
    />
  );
};

export default SimpleEntityCreateForm;
