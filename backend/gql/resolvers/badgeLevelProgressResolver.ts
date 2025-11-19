import { BadgeLevelProgress } from "@prisma/client";
import db from "../../prisma";

const badgeLevelProgressResolver = {
  Mutation: {
    // TODO: Get all badge levels in progress for a participant (include badge level and system badge information in the return statement)
  },
};

export default badgeLevelProgressResolver;
