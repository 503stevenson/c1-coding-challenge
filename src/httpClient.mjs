import MockDataGenerator from "./dataFactory.mjs"

const httpClient = {
  makeFetch: async (url) => {
    try {
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
  
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error('Error fetching:', error);
        return { error: 'Failed to fetch' };
    }
  },

  getProcessLogs: async (id, options) => {
    // set up fetch from API (not actually called)
    const { start, max } = options;
    let url = `getProcessLogs?processId=${id}`;
    if (start) { url += `&start=${start}` };
    if (max) { url += `&max=${max}` }
    // const apiResponse = await ExternalHTTPClient.makeFetch(url);

    // Mock asynchronous API call
    const responseData = MockDataGenerator.generateProcessLogs(id, options);
    return responseData;
  },

  getLogLength: async (id) => {
    // set up fetch from API (not actually called)
    let url = `getLogLength?processId=${id}`;
    // const apiResponse = await ExternalHTTPClient.makeFetch(url);

    // Mock asynchronous API call
    const responseData = await MockDataGenerator.generateLogLength(id);
    return responseData
  },

  getLatestProcessStatus: async (id) => {
    // set up fetch from API (not actually called)
    let url = `getLatestProcessStatus?processId=${id}`;
    // const apiResponse = await ExternalHTTPClient.makeFetch(url);

    // Mock asynchronous API call
    const responseData = await MockDataGenerator.generateLatestProcessStatus(id);
    return responseData;
  },
  
  getProcessStatusHistory: async (id) => {
    // set up fetch from API (not actually called)
    let url = `getProcessStatusHistory?processId=${id}`;
    // const apiResponse = await ExternalHTTPClient.makeFetch(url);

    // Mock asynchronous API call
    const responseData = await MockDataGenerator.generateProcessStatusHistory(id);
    return responseData;
  },

  getProcessResult: async (id) => {
    // set up fetch from API (not actually called)
    let url = `getProcessResult?processId=${id}`;
    // const apiResponse = await ExternalHTTPClient.makeFetch(url);

    // Mock asynchronous API call
    const responseData = await MockDataGenerator.generateProcessResult(id);
    return responseData;
  },

  streamLogs: async (processId, callback, options = {}) => {
    const url = `streamLogs?processId=${processId}`;
    const { includeChildProcesses } = options;
    if (includeChildProcesses) { url += `&includeChildProcesses=${includeChildProcesses}` };
  
    // const response = await fetch(url);

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch: ${response.statusText}`);
    // }

    // const reader = response.body.getReader();

    // while (true) {
    //   const { done, value } = await reader.read();

    //   if (done) {
    //     break;
    //   }

    //   const logEntry = JSON.parse(new TextDecoder().decode(value));
    //   callback(logEntry);
    // }

    // Simulate stream logs
    MockDataGenerator.generateStreamLogs(processId, callback, options);
  },

  streamStatus: async (processId, callback, options = {}) => {
    const url = `streamStatus?processId=${processId}`;
    const { includeChildProcesses } = options;
    if (includeChildProcesses) { url += `&includeChildProcesses=${includeChildProcesses}` };
    // const response = await fetch(url);

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch: ${response.statusText}`);
    // }

    // const reader = response.body.getReader();

    // while (true) {
    //   const { done, value } = await reader.read();

    //   if (done) {
    //     break;
    //   }

    //   const logEntry = JSON.parse(new TextDecoder().decode(value));
    //   callback(logEntry);
    // }

    // Simulate stream logs
    MockDataGenerator.generateStatusStream(processId, callback, options);
  },

  terminalStatus: async (processId) => {
    const url = `terminalStatus?processId=${processId}`;
    // try {
    //   const url = `terminalStatus?processId=${processId}`;
    //   const response = await fetch(url);

    //   if (!response.ok) {
    //     throw new Error(`Failed to fetch terminal status: ${response.statusText}`);
    //   }

    //   const responseData = await response.json();
    //   return responseData;
    // } catch (error) {
    //   console.error('Error fetching terminal status:', error);
    //   return { error: 'Failed to fetch terminal status' };
    // }
    
    return await MockDataGenerator.generateTerminalStatus(processId);
  }
};

export default httpClient;
