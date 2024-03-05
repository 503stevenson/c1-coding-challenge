// FUNCTIONS USED TO MOCK API ENDPOINTS

const MockDataGenerator = {
    logList: [
        { type: 'LOG', message: 'Kicking off API Process 1', timestamp: 125676543, processId: 1 },
        { type: 'PSTATUS', message: `ProcessID: 1`, timestamp: 125676543 , processId: 1 },
        { type: 'DATA', message: `{"type":"pubsub:onCompletionData", "value":"1"}`, timestamp: 125676543, processId: 1 },
        { type: 'LOG', message: `Finished Process 2`, timestamp: 125676543, processId: 2 },
        { type: 'DATA', message: `{"type":"pubsub:onCompletionData", "value":"1"}`, timestamp: 125676543, processId: 1 },
        { type: 'LOG', message: `Finished Process 3`, timestamp: 125676543, processId: 3 },
        { type: 'LOG', message: 'Kicking off API Process 1', timestamp: 125676543, processId: 1 },
        { type: 'PSTATUS', message: `ProcessID: 1`, timestamp: 125676543, processId: 1 },
        { type: 'DATA', message: `{"type":"pubsub:onCompletionData", "value":"1"}`, timestamp: 125676543, processId: 1 },
        { type: 'LOG', message: `Finished Process 1`, timestamp: 125676543 },
        { type: 'DATA', message: `{"type":"pubsub:onCompletionData", "value":"1"}`, timestamp: 125676543, processId: 1 },
        { type: 'LOG', message: `Finished Process 2`, timestamp: 125676543, processId: 2 },
        { type: 'LOG', message: 'Kicking off API Process 1', timestamp: 125676543, processId: 1 },
        { type: 'PSTATUS', message: `ProcessID: 3`, timestamp: 125676543, processId: 3 },
        { type: 'DATA', message: `{"type":"pubsub:onCompletionData", "value":"1"}`, timestamp: 125676543, processId: 1 },
        { type: 'LOG', message: `Finished Process 3`, timestamp: 125676543, processId: 3 },
        { type: 'DATA', message: `{"type":"pubsub:onCompletionData", "value":"1"}`, timestamp: 125676543, processId: 1 },
        { type: 'LOG', message: `Finished Process 2`, timestamp: 125676543, processId: 2 },
    ],

    generateProcessLogs: (processId, options) => {
        const processLogs = MockDataGenerator.logList.filter((log) => log.processId === processId)
        const startIndex = Math.max(0, options.start);
        const endIndex = Math.min(startIndex + options.max, processLogs.length);

        return new Promise((resolve) => {
            const responseData = JSON.stringify({
                query: {
                    key: `${processId}`,
                    start: options.start,
                    max: options.max,
                },
                value: processLogs.slice(startIndex, endIndex),
            });
            setTimeout(() => {
                resolve(responseData);
            }, 1000);
        });
    },

    generateLogLength: (processId) => {
        return new Promise((resolve) => {
            const responseData = JSON.stringify({
                processId: processId,
                len: MockDataGenerator.logList.filter((log) => log.processId === processId).length,
            });
            setTimeout(() => {
                resolve(responseData);
            }, 1000);
        });
    },
    
    generateLatestProcessStatus: (processId) => {
        return new Promise((resolve) => {
            const responseData = JSON.stringify({
                processId: processId,
                status: 'EXECUTING',
                artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                timestamp: 1709541757939,
            });
            setTimeout(() => {
                resolve(responseData);
            }, 1000);
        });
    },

    generateProcessStatusHistory: (processId) => {
        return new Promise((resolve) => {
            const responseData = JSON.stringify([
                {
                    processId: processId,
                    status: 'EXECUTING',
                    artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                    timestamp: 1709541757939,
                },
                {
                    processId: processId,
                    status: 'ERROR',
                    artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                    timestamp: 1709541757939,
                },
                {
                    processId: processId,
                    status: 'EXECUTING',
                    artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                    timestamp: 1709541757939,
                },
            ]);
            setTimeout(() => {
                resolve(responseData);
            }, 1000);
        });
    },
    
    generateProcessResult: (processId) => {
        return new Promise((resolve) => {
            const responseData = JSON.stringify({
                processId: processId,
                type: 'COMPLETION',
                status: 400,
                data: {
                    result: "Finished process!"
                },
            });
            setTimeout(() => {
              resolve(responseData);
            }, 1000);
        });
    },

    generateStreamLogs: (processId, callback, options = {}) => {
        const { includeChildProcesses = true } = options;
    
        // Simulate logs for a process
        const simulateLogsForProcess = async (pid) => {
          const logs = [
            { type: 'LOG', message: `Kicking off API Process ${pid}`, timestamp: Date.now(), processId: pid },
            { type: 'DATA', message: `doing data things for ${pid}`, timestamp: Date.now(), processId: pid },
            { type: 'DATA', message: `more data things for ${pid}`, timestamp: Date.now(), processId: pid },
            { type: 'DATA', message: `even more data things for ${pid}`, timestamp: Date.now(), processId: pid },
            { type: 'ERROR', message: `Error for API Process ${pid}`, timestamp: Date.now(), processId: pid },
          ];
    
          for (const log of logs) {
            callback(JSON.stringify(log), () => {
              console.log(`Stopping Stream Logs for process ${pid}`);
            });
        
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        };

        simulateLogsForProcess(processId);
    },

    generateStatusStream: (processId, callback, options = {}) => {
        const { includeChildProcesses = true } = options;
    
        // Simulate logs for a process
        const simulateStatusStream = async (pid) => {
          const statuses = [
            {
                processId: pid,
                status: 'EXECUTING',
                artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                timestamp: 1709541757939,
            },
            {
                processId: pid,
                status: 'EXECUTING',
                artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                timestamp: 1709541757939,
            },
            {
                processId: pid,
                status: 'COMPLETED',
                artifact: `{"type":"completionSignalReference","value":"${processId}"}`,
                timestamp: 1709541757939,
                data: 'successful process run, woohoo!'
            },
        ];
    
          for (const status of statuses) {
            callback(JSON.stringify(status), () => {
              console.log(`Stopping Status Streaming for process ${pid}`);
            });
        
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        };

        simulateStatusStream(processId);
    },

    generateTerminalStatus: async (processId) => {
        const terminalStatus = {
            processId: processId,
            type: 'COMPLETED',
            artifact: JSON.stringify({
                key: 'This right here is a completed process',
            }),
        };
    
        await new Promise(resolve => setTimeout(resolve, 5000));

        return JSON.stringify(terminalStatus);
    }
};

export default MockDataGenerator;