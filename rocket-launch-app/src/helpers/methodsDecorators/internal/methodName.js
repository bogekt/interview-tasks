const methodName = method => 
    method && typeof method === 'string' 
        ? method 
        : method.name;

export default methodName;
