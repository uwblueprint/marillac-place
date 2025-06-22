import React, { useState } from "react";
import CreateCustomBadgeModal from "./elements/CreateCustomBadgeModal";

export default function AdminBadgesPage() {
  const [show, setShow] = useState(true);
  return (
    <CreateCustomBadgeModal isOpen={show} onClose={() => setShow(false)} />
  )
}