import React, {useState} from 'react'
import EditCustomBadgeModal from './elements/EditCustomBadgeModal'
import { Box, Text, IconButton, Flex, Button, Modal } from "@chakra-ui/react";

const Main = () => {
    const [editBadgeModalOpen, setEditBadgeModalOpen] = useState(false);
  return (
    <Box>
        <Button onClick={()=>setEditBadgeModalOpen(true)}>Open modal</Button>
        <EditCustomBadgeModal isOpen={editBadgeModalOpen}  onClose={()=>setEditBadgeModalOpen(false)}/>
    </Box>
    
  )
}

export default Main