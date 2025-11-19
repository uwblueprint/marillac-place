import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { subDays, addDays, startOfDay, set } from "date-fns";
import BlackOutlineButton from "./buttons/BlackOutlineButton";
import OrangeButton from "./buttons/OrangeButton";
import GreenOutlineButton from "./buttons/GreenOutlineButton";
import UnderlineButton from "./buttons/UnderlineButton";
import { Comment, Marker, Pin, PlusSign, Trash } from "./icons/ActionIcons";
import WidgetContainer from "./containers/WidgetContainer";
import PopupContainer from "./containers/PopupContainer";
import { Baby, FourStar, Group, Flower, Diamond, DollarSign, FiveStar, Heart, Hexagon, Home, Pencil, Plant, Tools, Wings } from "./icons/BadgeIcons";
import { Gold, Bronze, Silver, Novice, Diamond as DiamondFrame } from "./icons/BadgeLevelFrameIcons";
import { MarillacCoin, Profile, Trophy } from "./icons/MiscIcons";
import { Dot, ExclamationMark, Mail } from "./icons/NotificationIcons";
import { Assigned, Complete, Excused, Incomplete } from "./icons/StatusIcons";
import DateInput from "./inputs/DateInput";
import FixedInput from "./inputs/FixedInput";
import TextInput from "./inputs/TextInput";
import TimeInput from "./inputs/TimeInput";
import NumberInput from "./inputs/NumberInput";
import PasswordInput from "./inputs/PasswordInput";
import TextAreaInput from "./inputs/TextAreaInput";
import DropdownInput from "./inputs/DropdownInput";
import SelectInput from "./inputs/SelectInput";
import MarillacPlaceCalendar from "./misc/MarillacPlaceCalendar";
import DataTable from "./misc/DataTable";
import DateOptions from "./misc/DateOptions";
import { AssignedTask } from "../types/models";
import { Level, TaskStatus, TaskType, Icon, DayPreference, TimePreference, DayOfWeek } from "../types/enums";
import Badge from "./misc/BadgeProgress";
import Toggle from "./buttons/Toggle";

export default function UI() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState<boolean>(false);
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [number, setNumber] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [textarea, setTextarea] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dropdown, setDropdown] = useState<string>("");
  const [select, setSelect] = useState<string>("");
  const options: Record<string, string> = {
    "Option 1": "option1",
    "Option 2": "option2",
    "Option 3": "option3",
  };
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [viewTaskDetails, setViewTaskDetails] = useState<AssignedTask | null>(null);
  const [dateOptionDayPreference, setDateOptionDayPreference] = useState<DayPreference | null>(null);
  const [dateOptionDays, setDateOptionDays] = useState<DayOfWeek[] | null>(null);
  const [dateOptionTimePreference, setDateOptionTimePreference] = useState<TimePreference | null>(null);
  const [dateOptionStartTime, setDateOptionStartTime] = useState<Date | null>(null);
  const [dateOptionEndTime, setDateOptionEndTime] = useState<Date | null>(null);
  const [showDateOptions, setShowDateOptions] = useState<boolean>(false);
  const [toggleActive, setToggleActive] = useState<boolean>(false);
  const dataTableColumns = [
    { header: "Column 1", width: "30%" },
    { header: "Column 2", width: "20%" },
    { header: "Column 3", width: "40%" },
    { header: "", width: "10%" },
  ];
  const dataTableRows = [
    [
      {
        element: "Row 1.1"
      },
      {
        element: "Row 2.1"
      },
      {
        element: "Row 3.1"
      },
      {
        element: <Marker size={20} />,
        action: () => console.log("action"),
      },
    ],
    [
      {
        element: "Row 1.2"
      },
      {
        element: "Row 2.2"
      },
      {
        element: "Row 3.2"
      },
      {
        element: <Marker size={20} />,
        action: () => console.log("action"),
      },
    ],
    [
      {
        element: "Row 1.3"
      },
      {
        element: "Row 2.3"
      },
      {
        element: "Row 3.3"
      },
      {
        element: <Marker size={20} />,
        action: () => console.log("action"),
      },
    ],
  ];
  const assignedTasks: AssignedTask[] = [
    {
      aid: 1,
      pid: 1,
      name: "Task 1",
      type: TaskType.REQUIRED,
      status: TaskStatus.ASSIGNED,
      value: 10,
      penalty: 5,
      comment: "Comment 1",
      start_date: subDays(new Date(), 1).toISOString(),
      end_date: new Date().toISOString(),
    },
    {
      aid: 2,
      pid: 1,
      name: "Task 2",
      type: TaskType.OPTIONAL,
      status: TaskStatus.EXCUSED,
      value: 10,
      penalty: 5,
      comment: "Comment 2",
      start_date: addDays(new Date(), 2).toISOString(),
      end_date: addDays(new Date(), 5).toISOString(),
    },
    {
      aid: 3,
      pid: 1,
      name: "Task 3",
      type: TaskType.OPTIONAL,
      status: TaskStatus.INCOMPLETE,
      value: 10,
      penalty: 5,
      comment: "Comment 2",
      start_date: set(new Date(), {
        hours: 8,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }).toISOString(),
      end_date: set(new Date(), {
        hours: 12,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }).toISOString(),
    },
    {
      aid: 4,
      pid: 1,
      name: "Task 4",
      type: TaskType.INDIVIDUAL_GOAL,
      status: TaskStatus.COMPLETE,
      value: 10,
      penalty: 5,
      comment: "Comment 2",
      start_date: set(addDays(new Date(), 1), {
        hours: 11,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }).toISOString(),
      end_date: set(addDays(new Date(), 1), {
        hours: 14,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }).toISOString(),
    },
  ];

  return (
    <Flex flexDir="column" w="100vw" h="fit-content" alignItems="left" justifyContent="center" padding="50px" gap="20px">
      <Text textStyle="web.h1" color="primary.700">Marillac Place UI Components</Text>

      <Text textStyle="web.h3">Buttons</Text>
      <Flex flexDir="row" gap="10px">
        <BlackOutlineButton 
          label="BlackOutlineButton" 
          action={() => { console.log("clicked"); }} 
          is_active={false} 
        />
        <BlackOutlineButton 
          label="BlackOutlineButton (active)" 
          action={() => { console.log("clicked"); }} 
          is_active
        />
        <BlackOutlineButton 
          label="BlackOutlineButton (with icon)" 
          action={() => { console.log("clicked"); }} 
          is_active={false}
          icon={<Marker />}
        />
        <BlackOutlineButton 
          label="BlackOutlineButton (custom text color)" 
          action={() => { console.log("clicked"); }} 
          is_active={false} 
          text_color="red"
        />
        <Toggle active={toggleActive} setActive={setToggleActive} />
      </Flex>
      <Flex flexDir="row" gap="10px">
        <OrangeButton
          label="OrangeButton"
          action={() => { console.log("clicked"); }}
          is_active={false}
        />
        <OrangeButton
          label="OrangeButton (active)"
          action={() => { console.log("clicked"); }}
          is_active
        />
        <OrangeButton
          label="OrangeButton (with icon)"
          action={() => { console.log("clicked"); }}
          is_active={false}
          icon={<Marker color="white" />}
        />
      </Flex>
      <Flex flexDir="row" gap="10px">
        <GreenOutlineButton
          label="GreenOutlineButton"
          action={() => { console.log("clicked"); }}
          is_active={false}
        />
        <GreenOutlineButton
          label="GreenOutlineButton (active)"
          action={() => { console.log("clicked"); }}
          is_active
        />
      </Flex>
      <UnderlineButton
        label="UnderlineButton"
        action={() => { console.log("clicked"); }}
      />

      <Text textStyle="web.h3">Containers</Text>
      <Flex flexDir="row" gap="10px">
        <WidgetContainer
          bg_color="neutral.100"
          width="200px"
          height="100px"
          paddingX="12px"
          paddingY="8px"
          loading={false}
          error=""
        >
          <Text textStyle="web.b2">WidgetContainer</Text>
        </WidgetContainer>
        <WidgetContainer
          bg_color="neutral.100"
          width="200px"
          height="100px"
          paddingX="12px"
          paddingY="8px"
          loading
          error=""
        >
          <Text textStyle="web.b2">WidgetContainer (loading)</Text>
        </WidgetContainer>
        <WidgetContainer
          bg_color="neutral.100"
          width="200px"
          height="100px"
          paddingX="12px"
          paddingY="8px"
          loading={false}
          error="Something went wrong."
        >
          <Text textStyle="web.b2">WidgetContainer (error)</Text>
        </WidgetContainer>
      </Flex>
      <Flex flexDir="row" gap="10px">
        <UnderlineButton
          label="Show PopupContainer"
          action={() => { setShowPopup(true); }}
        />
        <UnderlineButton
          label="Show PopupContainer (loading)"
          action={() => { setShowLoadingPopup(true); }}
        />
        <UnderlineButton
          label="Show PopupContainer (error)"
          action={() => { setShowErrorPopup(true); }}
        />
        {showPopup && (
          <PopupContainer
            title="Title"
            submit_text="Save"
            submit_action={() => { console.log("submit"); }}
            cancel_action={() => { setShowPopup(false); }}
            error_message=""
            loading={false}
          >
            <Text textStyle="web.b2">PopupContainer</Text>
          </PopupContainer>
        )}
        {showLoadingPopup && (
          <PopupContainer
            title="Title"
            submit_text="Save"
            submit_action={() => { console.log("submit"); }}
            cancel_action={() => { setShowLoadingPopup(false); }}
            error_message=""
            loading
          >
            <Text textStyle="web.b2">PopupContainer (loading)</Text>
          </PopupContainer>
        )}
        {showErrorPopup && (
          <PopupContainer
            title="Title"
            submit_text="Save"
            submit_action={() => { console.log("submit"); }}
            cancel_action={() => { setShowErrorPopup(false); }}
            error_message="Something went wrong."
            loading={false}
          >
            <Text textStyle="web.b2">PopupContainer (error)</Text>
          </PopupContainer>
        )}
      </Flex>

      <Text textStyle="web.h3">Badges</Text>
      <Flex flexDir="row" gap="10px">
        <Badge
          icon={Icon.BABY}
          level={Level.NOVICE}
          percentageComplete={50}
        />
        <Badge
          icon={Icon.DIAMOND}
          level={Level.BRONZE}
          percentageComplete={100}
        />
        <Badge
          icon={Icon.MONEY}
          level={Level.SILVER}
          percentageComplete={0}
        />
        <Badge
          icon={Icon.PLANT}
          level={Level.GOLD}
          percentageComplete={65}
        />
        <Badge
          icon={Icon.WINGS}
          level={Level.DIAMOND}
          percentageComplete={25}
        />
      </Flex>

      <Text textStyle="web.h3">Icons</Text>
      <Flex width="fit-content" height="fit-content" maxW="100vw" flexWrap="wrap" maxH="100vh" flexDir="row" gap="10px" padding="10px" bg="neutral.300" rounded="8px" alignItems="center" justifyContent="center">
        <Comment />
        <Pin />
        <Marker />
        <PlusSign />
        <Trash />
        <Baby />
        <Diamond />
        <DollarSign />
        <FiveStar />
        <Flower />
        <FourStar />
        <Group />
        <Heart />
        <Hexagon />
        <Home />
        <Pencil />
        <Plant />
        <Tools />
        <Wings />
        <Novice />
        <Bronze />
        <Silver />
        <Gold />
        <DiamondFrame />
        <Trophy />
        <MarillacCoin />
        <Profile />
        <Mail />
        <Dot />
        <ExclamationMark />
        <Assigned />
        <Complete />
        <Excused />
        <Incomplete />
      </Flex>

      <Text textStyle="web.h3">Inputs</Text>
      <Flex flexDir="row" gap="10px">
        <FixedInput
          label="FixedInput"
          current_value="horizontal"
          orientation="horizontal"
        />
        <FixedInput
          label="FixedInput"
          current_value="vertical"
          orientation="vertical"
        />
      </Flex>
      <Flex flexDir="row" gap="10px">
        <TextInput
          label="TextInput (small)"
          current_value={text}
          update_action={setText}
          size="small"
        />
        <TextInput
          label="TextInput (medium)"
          current_value={text}
          update_action={setText}
          size="medium"
        />
        <TextInput
          label="TextInput (large)"
          current_value={text}
          update_action={setText}
          size="large"
        />
      </Flex>
      <DateInput
        label="DateInput"
        current_value={date}
        update_action={setDate}
        size="medium"
      />
      <TimeInput
        label="TimeInput"
        current_value={time}
        update_action={setTime}
        size="medium"
      />
      <NumberInput
        label="NumberInput"
        current_value={number}
        update_action={setNumber}
        size="small"
      />
      <TextAreaInput
        label="TextAreaInput"
        current_value={textarea}
        update_action={setTextarea}
        size="large"
      />
      <PasswordInput
        label="PasswordInput"
        current_value={password}
        update_action={setPassword}
        size="medium"
      />
      <DropdownInput
        label="DropdownInput"
        current_value={dropdown}
        update_action={setDropdown}
        size="medium"
        value_options={options}
      />
      <SelectInput
        label="SelectInput"
        current_value={select}
        update_action={setSelect}
        value_options={options}
      />

      <Text textStyle="web.h3">Date Options</Text>
      <UnderlineButton
        label="Show DateOptions"
        action={() => setShowDateOptions(!showDateOptions)}
      />
      {showDateOptions && (
        <PopupContainer
          title="DateOptions"
          submit_text="Save"
          submit_action={() => { console.log("submit"); }}
          cancel_action={() => { setShowDateOptions(false); }}
          error_message=""
          loading={false}
        >
          <DateOptions
            setDayPreference={setDateOptionDayPreference}
            setDays={(value) => setDateOptionDays(value ?? [])}
            setTimePreference={setDateOptionTimePreference}
            setStartTime={setDateOptionStartTime}
            setEndTime={setDateOptionEndTime}
            dayPreference={dateOptionDayPreference}
            days={dateOptionDays}
            timePreference={dateOptionTimePreference}
            startTime={dateOptionStartTime}
            endTime={dateOptionEndTime}
          />
        </PopupContainer>
      )}

      <Text textStyle="web.h3">Calendar (Web)</Text>
      <Box width="1000px">
        <MarillacPlaceCalendar
          assignedTasks={assignedTasks}
          startDate={startDate}
          setStartDate={setStartDate}
          viewTaskDetails={setViewTaskDetails}
          view="web"
        />
      </Box>

      <Text textStyle="web.h3">Calendar (Mobile)</Text>
      <Box width="400px">
        <MarillacPlaceCalendar
          assignedTasks={assignedTasks}
          startDate={startDate}
          setStartDate={setStartDate}
          viewTaskDetails={setViewTaskDetails}
          view="mobile"
        />
      </Box>

      <Text textStyle="web.h3">Data Table</Text>
      <Box width="800px">
        <DataTable
          loading={false}
          error=""
          columns={dataTableColumns}
          rows={dataTableRows}
        />
      </Box>
      <Box width="800px">
        <DataTable
          loading
          error=""
          columns={dataTableColumns}
          rows={dataTableRows}
        />
      </Box>
      <Box width="800px">
        <DataTable
          loading={false}
          error="Something went wrong."
          columns={dataTableColumns}
          rows={dataTableRows}
        />
      </Box>
    </Flex>
  );
}