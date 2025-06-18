import React, { useState } from "react";
import AssignCustomBadgeModal from "./elements/AssignCustomBadgeModal";

export default function AdminBadgesPage() {
  const [edit, setEdit] = useState(true);
  return (
    <AssignCustomBadgeModal isOpen={edit} onClose={() => setEdit(false)} />
  )
}