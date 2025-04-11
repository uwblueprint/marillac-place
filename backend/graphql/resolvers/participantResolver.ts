import { Participant } from "@prisma/client";
import ParticipantService from "../../services/implementation/participantImplementation";
import IParticipantService from "../../services/interface/participantInterface";

const participantService: IParticipantService = new ParticipantService();
const participantResolvers = {
    Query: {
        getPastParticipants: async (): Promise<Participant[]> => {
            return participantService.getPastParticipants();
        },
        getCurrentParticipants: async (): Promise<Participant[]> => {
            return participantService.getCurrentParticipants();
        },
        getParticipantById: async (
            _parent: undefined,
            { participantId }: { participantId: string },
        ): Promise<Participant | null> => {
            return participantService.getParticipantById(participantId);
        },
        getParticipantByRoom: async (
            _parent: undefined,
            { roomNumber }: { roomNumber: number },
        ): Promise<Participant | null> => {
            return participantService.getParticipantByRoom(roomNumber);
        }
    },
    Mutation: {
        createParticipant: async (
            _parent: undefined,
            {
                participantId,
                roomNumber,
                arrival,
                password,
            }: {
                participantId: string;
                roomNumber: number;
                arrival: string;
                password: string;
            },
        ): Promise<boolean> => {
            return participantService.createParticipant(
                participantId,
                roomNumber,
                arrival,
                password,
            );
        },
        updateParticipantById: async (
            _parent: undefined,
            {
                participantId,
                roomNumber,
                arrival,
                departure,
                password,
            }: {
                participantId: string;
                roomNumber?: number;
                arrival?: string;
                departure?: string;
                password?: string;
            },
        ): Promise<boolean> => {
            return participantService.updateParticipantById(
                participantId,
                roomNumber,
                arrival,
                departure,
                password,
            );
        },
        editMarillacBucks: async (
            _parent: undefined,
            {
                participantId,
                credit
            }: {
                participantId: string;
                credit: number;
            },
        ): Promise<boolean> => {
            return participantService.updateParticipantCredit(
                participantId,
                credit
            );
        },
    },
};

export default participantResolvers;
