import { Participant } from "@prisma/client";
import prisma from "../../prisma";
import IParticipantService from "../interface/participantInterface";

class ParticipantService implements IParticipantService {
    async getPastParticipants(): Promise<Participant[]> {
        try {
            const participants = await prisma.participant.findMany({
                where: {departure: { not: "" }},
                orderBy: [{ departure: "desc" }],
            });
            return participants;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getCurrentParticipants(): Promise<Participant[]> {
        try {
            const participants = await prisma.participant.findMany({
                where: {departure: ""},
                orderBy: [{ roomNumber: "asc" }],
            });
            return participants;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getParticipantById(participantId: string): Promise<Participant | null> {
        try {
            const participant: Participant | null = await prisma.participant.findUnique(
                {
                    where: {
                        participantId,
                    },
                },
            );
            return participant;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createParticipant(
        participantId: string,
        roomNumber: number,
        arrival: string,
        password: string,
    ): Promise<boolean> {
        try {
            await prisma.participant.create({
                data: {
                    participantId,
                    roomNumber,
                    arrival,
                    departure: "",
                    password,
                },
            });
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async updateParticipantById(
        participantId: string,
        roomNumber?: number,
        arrival?: string,
        departure?: string,
        password?: string,
    ): Promise<boolean> {
        const updatedData: Record<string, any> = {};
        if (roomNumber) updatedData.roomNumber = roomNumber;
        if (arrival) updatedData.arrival = arrival;
        if (departure) updatedData.departure = departure;
        if (password) updatedData.password = password;

        try {
            await prisma.participant.update({
                where: { participantId },
                data: updatedData,
            });
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getParticipantByRoom(roomNumber: number): Promise<Participant | null> {
        try {
            const participant: Participant | null = await prisma.participant.findFirst(
                {
                    where: {
                        roomNumber,
                    },
                },
            );
            return participant;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    async updateParticipantCredit(
        participantId: string,
        credit: number,
    ): Promise<boolean> {
        const updatedData: Record<string, any> = {};
        if (credit !== undefined) updatedData.credit = credit;
        if (!participantId) throw new Error("participantId is required");
        try {
            await prisma.participant.update({
                where: { participantId },
                data: updatedData,
            });
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default ParticipantService;
