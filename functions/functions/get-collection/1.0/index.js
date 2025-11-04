const getCollection = async ({ model, ids, properties }) => {
  const modelName = model.name;
  const queryName = `all${modelName}`;

  const query = `query GetCollection {
  ${queryName}(where: { id:{ in: [${ids.join(",")}] }  } ) {
    results {
      ${properties || "id"}
    }
  }
}
`;

  const { data, error } = await gql(query, { skip: 0, take: 5000 });

  if (error) {
    throw new Error(
      `GQL query GetCollection failed: ${error.errors[0].message || JSON.stringify(error)}`,
    );
  }

  let result = [];

  if (data && Object.hasOwn(data, queryName)) {
    result = data[queryName]["results"];
  }

  return { result };
};

export default getCollection;
