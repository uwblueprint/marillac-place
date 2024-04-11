import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    IconButton,
    Avatar,
    Heading,
    Textarea
  } from "@chakra-ui/react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function MessageInput({ onPost }: { onPost: (message: string) => void }) {
    const [message, setMessage] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.trim() !== '') {
            onPost(message);
            setMessage('');
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextareaResize = () => {
        const textarea = textareaRef.current;
        
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex flexDir="row" justifyContent="flex-end" alignItems="flex-end">
                <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onInput={handleTextareaResize}
                size="lg"
                marginRight="20px"
                placeholder="Type an announcement..."
                resize="none"
                overflowY="hidden"
                minHeight="38px"
                rows={1}
                />
                <Button w="120px" color="white" backgroundColor="purple" type="submit">Post</Button>
            </Flex>
        </form>
    );
}

type MessageListProps = {
    messages: any[];
};

function getDate() {
    const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month} ${date}, ${year}`;
  }

function MessageList({ messages }: MessageListProps) {
    return (
        <div>
            {messages.map((message: any, index: number) => (
                <div key={index} style={{ backgroundColor: "#F5F6F8", padding: "10px", marginLeft: "38px", marginRight: "38px", marginTop: "20px", borderRadius: "10px"}}>
                    <Flex pl={2} align="center">
                        <Avatar name="Jane Doe" src="https://bit.ly/2k1H1t6" />
                        <Flex flexDir="column" ml={4}>
                            <Heading size="sm" fontSize="16px" mt={4} mb={0}>
                            Jane Doe
                            </Heading>
                            <Text color="#808080" fontSize="12px">{getDate()}</Text>
                        </Flex>
                    </Flex>
                    <Text pl={2} fontSize="16px">{message}</Text>
                </div>
            ))}
        </div>
    );
}

const AnnouncementsView = (children: any): React.ReactElement => {

    const [messages, setMessages] = useState<any[]>([]);
    const handlePost = (newMessage: any) => {
        setMessages([...messages, newMessage]);
    };

    return (
        <Box
            h="calc(100vh)"
            w="100%"
        >
            <Flex align="left" flexDir="column" h="100%">
                <Box padding="22px 47px" borderBottomWidth="3px" borderBottomColor="grey" display="flex" alignItems="center" justifyContent="space-between">
                    <h1 style={{fontSize: "24px"}}>All Rooms</h1>
                    <IconButton aria-label="info" color="purple" backgroundColor="white" borderRadius="50%" fontSize="30px">
                        <InfoOutlinedIcon fontSize="inherit" />
                    </IconButton>
                </Box>
                <Box flex={1} height="calc(100vh)" overflowY="scroll">
                    <MessageList messages={messages} />
                </Box>
                <Box padding= "27px 39px">
                    <MessageInput onPost={handlePost} />
                </Box>
            </Flex>
        </Box>
    )
}  

export default AnnouncementsView;