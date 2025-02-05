interface IParticipantService {
  getParticipant(request: RequestType, ...): ResponseType;
  createParticipant(request: RequestType, ...): ResponseType;  
  updateParticipant(request: RequestType, ...): ResponseType; 
  deleteParticipant(request: RequestType, ...): ResponseType; 
}

export default IParticipantService;
