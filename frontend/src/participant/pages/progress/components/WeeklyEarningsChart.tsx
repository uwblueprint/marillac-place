import React, { useState, useMemo, useContext } from "react";
import { Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import { DAYS, DAY_ABBREVIATIONS } from "../../../../constants/days";
import { ParticipantContext } from "../../../ParticipantContext";
import ErrorScreen from "../../../../ui/screens/ErrorScreen";
import { GET_WEEKLY_EARNINGS } from "../../../../gql/transactionRequests";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import colors from "../../../../theme/colors";

interface ChartDataItem {
  amount: number;
  day: string;
}

const WeeklyEarningsChart = () => {
  const { pid } = useContext(ParticipantContext);

  const {
    data: earningsData,
    loading: loadingEarnings,
    error: errorEarnings,
  } = useQuery(GET_WEEKLY_EARNINGS, {
    variables: { pid },
    skip: pid === -1,
  });

  const weeklyEarnings: number[] = useMemo(() => {
    if (!earningsData?.getWeeklyEarnings) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    const earnings = earningsData.getWeeklyEarnings;
    return DAYS.map((day) => earnings[day] ?? 0);
  }, [earningsData]);

  const today = new Date();
  const dayOfWeek = today.getDay();

  const chartData: ChartDataItem[] = useMemo(() => {
    return weeklyEarnings.map((earnings, index) => ({
      amount: earnings,
      day: DAY_ABBREVIATIONS[DAYS[index]]
    }));
  }, [weeklyEarnings, dayOfWeek]);

  const maxEarnings = Math.max(...weeklyEarnings);
  const upperBound = Math.ceil(maxEarnings * 1.2);

  if (pid === -1) {
    return <ErrorScreen message="Failed to load weekly earnings. Please try again later." />;
  }

  return (
    <WidgetContainer
      width="100%"
      height="fit-content"
      paddingX="16px"
      loading={loadingEarnings}
      error={errorEarnings?.message}
    >
      <Text textStyle="s1" mb="16px">Weekly Earnings</Text>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray="0"
            stroke={colors.background.border}
            horizontal
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={{ stroke: colors.background.border }}
            tickLine={false}
            tickMargin={8}
            height={25}
            tick={{ fill: colors.text.medium, fontSize: 12 }}
            fontFamily="Nunito"
          />
          <YAxis
            domain={[0, upperBound]}
            axisLine={false}
            tickLine={false}
            tickCount={4}
            tickMargin={8}
            tick={{ fill: colors.text.medium, fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            width={35}
            fontFamily="Nunito"
          />
          <Bar
            dataKey="amount"
            radius={[2, 2, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === dayOfWeek ? colors.brand.primaryDark : colors.brand.primaryLight}
              />
            ))}
            <LabelList content={(props: any) => {
              const { x, y, width, index, value } = props;
              console.log(props);
              if (index !== dayOfWeek) return null;
              return (
                <text
                  x={x + width / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="12px"
                  fontWeight={650}
                  fontFamily="Nunito"
                >
                  ${value}
                </text>
              );
            }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </WidgetContainer>
  );
};

export default WeeklyEarningsChart;
