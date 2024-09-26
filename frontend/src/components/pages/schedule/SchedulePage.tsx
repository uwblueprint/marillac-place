import React from "react";

const SchedulePage = (): React.ReactElement => {
  const [rooms, setRooms] = useState<number[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("LIST");
  const [scheduleData, setScheduleData] = useState<string>("");
  const [active, setActive] = useState<string>("List");

  useEffect(() => {
    // TODO: Fetch occupied rooms from API?
    setRooms([1,2,3,4,5,6]);
  }, []);

  useEffect(() => {
    if (scheduleType === "LIST") {
      setScheduleData("List");
    } else if (scheduleType === "CALENDAR") {
      setScheduleData("Calendar");
    }
  }, [scheduleType]);

  const selectOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(e.currentTarget.innerText)
  };

  const formatTabs = (roomNums: number[]) => {
    return <Tabs variant="horizontal" h="30px" mb={6}>
      <TabList pl={6}>
        { roomNums.map(room => (
            <Tab key={room} width="10%">
              Room {room}
            </Tab>))
        }
      </TabList>
    </Tabs>
  }

  return (
    <div>
      <h1>Schedule Page</h1>
    </div>
  );
};

export default SchedulePage;
