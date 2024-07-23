import React from "react";
import {Announcement} from '../../../types/NotificationTypes';

const AnnouncementNotification = ({ author, message, createdAt }: Announcement): React.ReactElement => {
    return (
      <div className="announcement-notification">
        <div className="announcement-header">
          <span className="announcement-author">{author}</span>
          <span className="announcement-time">{createdAt}</span>
        </div>
        <div className="announcement-message">{message}</div>
      </div>
    );
  };
  
export default AnnouncementNotification;
