export type WarningDTO = {
    id: number;
    title: string;
    description: string;
    dateIssued: Date;
    assigneeId: number;
    assignerId: number;
    relatedTaskId: number;
  }

export type CreateWarningDTO = {
    title: string;
    description: string;
    dateIssued: Date;
    assigneeId: number;
    assignerId: number;
    relatedTaskId: number;
  }
