interface IParticipantService {
  // /**
  //  * Adds a resident
  //  * @param resident: a CreateResidentDTO with the new resident's information
  //  * @returns a ResidentDTO with created resident info
  //  * @throws Error if resident reation fails
  //  */
  // addResident(resident: CreateResidentDTO): Promise<ResidentDTO>;

  // /**
  //  * Update a resident's details
  //  * @param userId: The ID of the resident information that needs to be updated
  //  * @param resident: Update ResidentDTO of the resident with this information
  //  * @returns: a ResidentDTO with resident's updated info
  //  */
  // updateResident(
  //   userId: number,
  //   resident: UpdateResidentDTO,
  // ): Promise<ResidentDTO>;

  // /**
  //  * Deletes a resident by id
  //  * @param userId: resident id of resident to be deleted
  //  * @returns: a ResidentDTO with deleted resident's info
  //  * @throws Error if resident deletion fails
  //  */
  // deleteResident(userId: number): Promise<ResidentDTO>;

  // /**
  //  * Gets all residents
  //  * @returns: array of ResidentDTO's with all residents
  //  * @throws Error if retrieval fails
  //  */
  // getAllResidents(): Promise<Array<ResidentDTO>>;

  // /**
  //  * Gets certain residents based on resident id
  //  * @param userId: array of resident id's to be retrieved
  //  * @returns: array of ResidentDTO's with residents information
  //  * @throws Error if retrieval fails
  //  */
  // getResidentsByIds(userId: number[]): Promise<Array<ResidentDTO>>;

  // /**
  //  * Gets all residents that are currently active
  //  * @returns: array of ResidentDTO's with all active residents
  //  * @throws Error if retrieval fails
  //  */
  // getActiveResidents(): Promise<Array<ResidentDTO>>;

  // /**
  //  * Redeems certain resident's credits based on resident id
  //  * @param userId: resident id whose credits are to be redeemed
  //  *                    and number of credits to be redeemed
  //  * @returns: Enum of success or not enough credits
  //  * @throws Error if retrieval fails
  //  */
  // redeemCredits(
  //   userId: number,
  //   credits: number,
  // ): Promise<RedeemCreditsResponse>;
}

export default IParticipantService;
