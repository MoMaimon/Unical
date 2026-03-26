/**
 * fetch any data from https://app2.bau.edu.jo:7799/courses/index.jsp by passing the offical params
 * @note: use this as high level function
 * @param {string} method Header method value.
 * @param {number} paramCount Number of params passed.
 * @param {Array<number>}[params = []] Array of parameters (the length of the array should match ```paramCount``` ).
 * @returns {Promise<Object>} The response data as Json.
 */
const fetchData = async (
  method: string,
  paramCount: number,
  params: Array<number> = [],
): Promise<Object> => {
  if (params.length != paramCount) {
    throw new ParamsInvalid();
  }
  if (paramCount < 0) {
    throw new ParamsCountInvalid();
  }
  let paramsString: string = "";
  if (paramCount > 0) {
    params.forEach((param, index) => {
      paramsString += `&param${index}=${param}`;
    });
  }
  const res = await fetch(
    "https://app2.bau.edu.jo:7799/courses/actions/rmiMethod",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,ar;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua":
          '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer: "https://app2.bau.edu.jo:7799/courses/index.jsp",
      },
      body: `method=${method}&paramsCount=${paramCount}${paramsString}`,
      method: "POST",
    },
  );
  return formatJsonData(await res.text());
};

/**
 * replace every single qoute with double, then return it as json
 * 
 */
const formatJsonData = (data: string): Object => {
  const jsonData = data.replace(/'/g, '"');
  return JSON.parse(jsonData);
};
