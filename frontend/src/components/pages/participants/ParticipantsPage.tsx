import React from 'react'
import CommonTable from '../../common/CommonTable'
import { ColumnInfoTypes } from '../../common/CommonTable'
import SideBar from '../../common/SideBar'
import {
    Flex,
    Input,
    Stack,
    Button,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'
import { SearchIcon, AddIcon, DownloadIcon } from "@chakra-ui/icons";

import { data } from './temp'

type Props = {}

const columnTypes: ColumnInfoTypes[] = [
    {
        Header: "Room #",
        Type: "number",
        Key: "room"
    },
    {
        Header: "Departure Date",
        Type: "string",
        Key: "due_date"
    },
    {
        Header: "ID Number",
        Type: "number",
        Key: "id"
    },
    {
        Header: "Email",
        Type: "string",
        Key: "email"
    }
]

const ParticipantsPage = (props: Props): React.ReactElement => {
    return (
        <Flex >
            <SideBar><></></SideBar>
            <Flex flexDirection='column' flexGrow={1} padding='20px'>
                <Flex justifyContent='space-between' padding='10px' paddingBottom='10px'>
                    <InputGroup width="30%">
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon color='gray.300' />
                        </InputLeftElement>
                        <Input placeholder='Search' />
                    </InputGroup>

                    <Stack direction='row' spacing={4}>
                        <Button leftIcon={<DownloadIcon color='purple' />} colorScheme='purple' variant='outline' size='sm' onClick={() => { alert('DOWNLOAD CSV') }}>Export</Button>
                        <Button leftIcon={<AddIcon color='white' />} bg='purple' color='white' size='sm' onClick={() => { alert('ADD PARTICIPANT') }}>Add Participant</Button>
                    </Stack>
                </Flex>
                <CommonTable data={data} columnInfo={columnTypes} maxResults={4} onEdit={() => { alert('EDITING') }} isSelectable={false}></CommonTable>
            </Flex>
        </Flex>
    )
}

export default ParticipantsPage