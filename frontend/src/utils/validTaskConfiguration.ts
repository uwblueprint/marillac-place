import { TaskInfo } from "../types/task";


export type TaskInfo = {
  task_id?: number;
  task_name?: string;
  task_type?: TaskType;
  recurrence_preference?: RecurrenceFrequency;
  repeat_days?: DayOfWeek[];             
  time_preference?: TimeOption;         
  start_time?: string;              
  end_time?: string;              
  marillac_bucks_addition?: number;  
  marillac_bucks_deduction?: number;
  comment?: string;                 
}

model Task {
  task_id                  Int                 @id @default(autoincrement())
  task_name                String              @unique
  task_type                TaskType
  recurrence_preference    RecurrenceFrequency
  repeat_days              DayOfWeek[]
  time_preference          TimeOption
  start_time               String?
  end_time                 String?
  marillac_bucks_addition  Int
  marillac_bucks_deduction Int
  comment                  String?

  @@map("task")
}

export function validTaskConfiguration(task: TaskInfo) {
    if (!task_id | !task_name | !task_type | !recurrence_preference | !repeat_days | )
}