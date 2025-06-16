import React, { useState } from "react";
import DeleteBadgeButton from "./elements/DeleteBadgeButton"

export default function AdminBadgesPage() {
  return (
    <div>
      <DeleteBadgeButton badgeId={123} onSuccess={() => console.log("Deleted!")}/>
    </div>
  )
}