interface ITaskService {
  getTask(request: RequestType, ...): ResponseType;
  createTask(request: RequestType, ...): ResponseType;  
  updateTask(request: RequestType, ...): ResponseType; 
  deleteTask(request: RequestType, ...): ResponseType;
}

export default ITaskService;
