import httpClient from "./httpClient.mjs";

const exampleUsage = async () => {
  const processId = 1;

  // Get Process Logs
  console.log('\n1. Get Process Logs');
  const options = { start: 0, max: 3 };
  const logsResponse = await httpClient.getProcessLogs(processId, options);
  console.log('Process Logs:', logsResponse);

  // Get Log Length
  console.log('\n2. Get Log Length');
  const logLengthResponse = await httpClient.getLogLength(processId);
  console.log('Process Log Length:', logLengthResponse);

  // Get Latest Process Status
  console.log('\n3. Get Latest Process Status');
  const statusResponse = await httpClient.getLatestProcessStatus(processId);
  console.log('Latest Process Status:', statusResponse);

  // Get Process Status History
  console.log('\n4. Get Process Status History');
  const statusHistoryResponse = await httpClient.getProcessStatusHistory(processId);
  console.log('Process Status History:', statusHistoryResponse);

  // Get Process Result
  console.log('\n5. Get Process Result');
  const processResultResponse = await httpClient.getProcessResult(processId);
  console.log('Process Result:', processResultResponse);

  // Stream Logs
  console.log('\n6. Log Streaming')
  httpClient.streamLogs(processId, (log, cancelCallback) => {
    log = JSON.parse(log);

    if (log === null) {
      console.log(processId + " and all children finished processing logs")
    } else if (log.type === 'LOG') {
      console.log(log.processId + ' log: ', log.message );
    } else if (log.type === 'DATA') {
      console.log(log.processId + ' data: ', log.message );
    } else if (log.type === 'PSTATUS') {
      console.log(log.processId + ' status: ', log.message );
    } else if (log.type === 'ERROR') {
      console.log(log.processId + ' error: ', log.message );
      cancelCallback();
    }
  })

  await new Promise(resolve => setTimeout(resolve, 6000));

  // Stream Status
  console.log('\n7. Status Streaming');
  httpClient.streamStatus(processId, (status, cancelCallback) => {
    status = JSON.parse(status);

    if (status === null) {
      console.log('All statuses finished reading');
    } else if (status.status === 'COMPLETED') {
      console.log(`Process completed at ${status.timestamp} with result: `, status.data);
      cancelCallback();
    } else if (status.status === 'EXECUTING') {
      console.log(`Process is still in progress at ${status.timestamp}`);
    } else if (status.type === 'ERROR') {
      console.log('Child process status update: ', status);
      cancelCallback();
    }
  }, { includeChildren: true });

  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Terminal Status
  console.log('\n8. Wait for Terminal Status');
  let finalProcessStatus = await httpClient.terminalStatus(processId);
  finalProcessStatus = JSON.parse(finalProcessStatus);

  if (finalProcessStatus.type === 'COMPLETE') {
    return JSON.parse(finalProcessStatus.artifact)
  } else {
    let errorJSON = JSON.parse(finalProcessStatus.artifact);
    console.log(errorJSON);
  }
};

exampleUsage();
