import prisma from "../prisma";
import { TransactionType } from "@prisma/client";
import { evaluateBadge } from "./evaluateBadge";
import { getToday } from "./formatDateTime";

export async function addTransaction(
  participant_id: number,
  transaction_date : string,
  transaction_type : TransactionType,
  marillac_bucks : number,
  description?: string
) {
  try {
    await prisma.transaction.create({
      data: { 
        participant_id,
        transaction_date,
        transaction_type,
        description : description ? description : "",
        marillac_bucks
      },
    })
  } catch (e) {

  } 
}

export async function updateMarillacBucks(
    participant_id: number,
    added_marillac_bucks: number,
    transaction_description? : string
): Promise<number> {

  // const old_result = await prisma.participant.findUnique({
  //   where: { participant_id },
  //   select: { marillac_bucks: true }
  // })

  // const old_marillac_bucks = old_result?.marillac_bucks

  // update marillac bucks
  const updated_result = await prisma.participant.update({
    where: { participant_id },
    data: { marillac_bucks: { increment: added_marillac_bucks } },
    select: { marillac_bucks: true }
  })

  const new_marillac_bucks = updated_result.marillac_bucks;

  if (added_marillac_bucks > 0){

    await addTransaction(
      participant_id,
      getToday(),
      TransactionType.EARNING,
      added_marillac_bucks,
      transaction_description ? transaction_description : ""
    )

    // update total earnings
    await prisma.participantProgress.update({
      where: { participant_id },
      data: { 
        total_earnings : new_marillac_bucks
      }
    })

    // check if goal is met 
    await evaluateBadge(
      new_marillac_bucks, 
      participant_id, 
      "Money Earned Milestone Badge"
    )

  
  } else {
    // if decrement then don't do badge logic
    await addTransaction(
      participant_id,
      getToday(),
      TransactionType.PURCHASE,
      added_marillac_bucks,
      transaction_description ? transaction_description : ""
    )
  }

  return new_marillac_bucks;
}