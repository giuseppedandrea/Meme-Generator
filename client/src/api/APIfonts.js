const baseURL = "/api/v1";

async function getFonts() {
  const url = baseURL + "/fonts";

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        response.json()
          .then((data) => {
            if (response.ok) {
              resolve(data.map((font) => ({ ...font })));
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

const APIfonts = { getFonts };
export default APIfonts;
