export interface ResidentDTO {
    id: string; //string or number?
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
    firstName: String;
    lastName: String;
    email: String;
    phoneNumber: String;
    displayName: String;
    profilePictureLink: String;
    birthdate: Date;
    credits: number;
    dateJoined: Date;
}

export interface UpdateResidentDTO {
    firstName: String;
    lastName: String;
    email: String;
    phoneNumber: String;
    displayName: String;
    profilePictureLink: String;
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
    update_resident(residentId: string, residentInfo: UpdateResidentDTO): Promise<ResidentDTO>;

    /**
     * Deletes a resident by id
     * @param id: resident id of resident to be deleted
     * @throws Error if resident deletion fails
     */
    delete_resident(id: string): Promise<void>;

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
    get_residents_by_id(residentId: Array<string>): Promise<Array<ResidentDTO>>;
}

