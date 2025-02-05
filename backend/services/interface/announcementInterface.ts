interface IAnnouncementService {
  getAnnouncement(request: RequestType, ...): ResponseType;
  createAnnouncement(request: RequestType, ...): ResponseType;  
  updateAnnouncement(request: RequestType, ...): ResponseType; 
  deleteAnnouncement(request: RequestType, ...): ResponseType; 
}

export default IAnnouncementService;
