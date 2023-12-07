import React, {useState, useEffect} from "react";
import axios from "axios";
import { Button } from '@chakra-ui/react';


const TestButton = (): React.ReactElement => {
    const [residents, setResidents] = useState([]);

        // Define a function to fetch data
        const fetchResidents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getAllResidents'); 
                setResidents(response.data);
                console.log(response.data)
            } catch (error) {

            }
        };

    return (<div>
        <Button>Test</Button>
        </div>)
}