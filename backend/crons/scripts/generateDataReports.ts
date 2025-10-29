import prisma from "../../prisma";

interface DataReportParams{
    startDate: string //format YY-MM-DD
    endDate: string // format YY-MM-DD
    outputPath?: string 
}

interface PraiseWithRaiseTask{
    participant_id: number
    task_name: string
    task_staus: string
    date: string
    value: number
    comments: string | null
}

interface ParticipantInfo{
    participant_id: number
    account_creation_date: string
    account_removal_date: string | null 
}

interface FinanicalInfo{
    participant_id: number
    transaction_date: string
    transaction_type: string
    amount: number
}

interface BadgeInfo{
    participant_id: number
    issue_date: string
    badge_earned: string
    level: number
    description: string
}

interface LoginStats{
    participant_id: number
    login_date: string
}

interface DataReport{
    reportReport: string
    startDate: string
    endDate: string
    generatedAt: string
    praiseWithRaiseTask: PraiseWithRaiseTask[]
    participantInfo: ParticipantInfo[]
    financialInfo: FinanicalInfo[]
    badges: BadgeInfo[]
    loginStat: LoginStats[]    
}
