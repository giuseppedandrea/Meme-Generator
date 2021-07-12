const baseURL = "/api/v1";

async function getTemplates() {
  const url = baseURL + "/templates";

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        response.json()
          .then((data) => {
            if (response.ok) {
              resolve(data.map((template) => ({ ...template })));
            } else {
              reject(data);
            }
          })
          .catch((err) => {
            reject({ error: "Cannot parse server response" });
          });
      })
      .catch((err) => {
        reject({ error: "Cannot communicate" });
      });
  });
};

const APItemplates = { getTemplates };
export default APItemplates;
