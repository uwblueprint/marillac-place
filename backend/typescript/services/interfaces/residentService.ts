export interface ResidentDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    displayName: string;
    profilePictureLink: string;
    birthdate: Date;
    credits: number;
    dateJoined: Date;
    dateLeft:  Date;
    // tasks: [Task]
    // warnings: [Warning]
}

export interface CreateResidentDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    displayName: string;
    profilePictureLink: string;
    birthdate: Date;
    credits: number;
    dateJoined: Date;
}

export interface UpdateResidentDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    displayName: string;
    profilePictureLink: string;
    birthdate: Date;
    credits: number;
    dateJoined: Date;
    dateLeft: Date;
}

interface IResidenceService {
    /**
     * Adds a resident
     * @param residentInfo: a CreateResidentDTO with the new resident's information
     * @returns a ResidentDTO with created resident info
     * @throws Error if resident reation fails
     */
    add_resident(residentInfo: CreateResidentDTO): Promise<ResidentDTO>;

    /** 
     * Update a resident's details
     * @param residentId: The ID of the resident information that needs to be updated
     * @param residentInfo: Update ResidentDTO of the resident with this information
     * @returns: a ResidentDTO with resident's updated info
     */
    update_resident(residentId: number, residentInfo: UpdateResidentDTO): Promise<ResidentDTO>;

    /**
     * Deletes a resident by id
     * @param id: resident id of resident to be deleted
     * @returns: a ResidentDTO with deleted resident's info
     * @throws Error if resident deletion fails
     */
    delete_resident(id: number): Promise<ResidentDTO>;

    /**
     * Gets all residents
     * @returns: array of ResidentDTO's with all residents
     * @throws Error if retrieval fails
     */
    get_all_residents(): Promise<Array<ResidentDTO>>
    
    /**
     * Gets certain residents based on resident id
     * @param residentId: array of resident id's to be retrieved
     * @returns: array of ResidentDTO's with residents information
     * @throws Error if retrieval fails
     */
    get_residents_by_id(residentId: number[]): Promise<Array<ResidentDTO>>;
}

