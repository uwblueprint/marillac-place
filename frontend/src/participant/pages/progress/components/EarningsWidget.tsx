import React, { useState, useMemo } from "react";
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
import { DAYS } from "../../../../constants/days";
import { DayOfWeek } from "../../../../types/enums";

const colors = {
  text: { light: { primary: "#1D2433", secondary: "#595D67" } },
  neutral: { 300: "#C5C8D8" },
  primary: { 700: "#0C727E" },
  success: { 900: "#0D8312" },
};

interface WeeklyEarningsChartProps {
  weeklyEarnings?: number[];
}

interface ChartDataItem {
  amount: number;
  day: string;
  isToday: boolean;
}

const WeeklyEarningsChart = ({
  weeklyEarnings = [],
}: WeeklyEarningsChartProps) => {
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  // Day labels for the week (Sunday = index 0, Monday = index 1, etc.)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate which day of the week today is (0 = Sunday, 6 = Saturday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Only show days from Sunday up to today
  const chartData: ChartDataItem[] = useMemo(() => {
    return weeklyEarnings
      .slice(0, dayOfWeek + 1) // Only include Sunday through today
      .map((earnings = 0, index) => ({
        amount: earnings,
        day: dayLabels[index] || "",
        isToday: index === dayOfWeek,
      }));
  }, [weeklyEarnings, dayOfWeek]);

  // Calculate max earnings from only the days we're showing
  const visibleEarnings = weeklyEarnings.slice(0, dayOfWeek + 1);
  const maxEarnings = Math.max(...visibleEarnings.filter((val) => val != null), 0);
  const upperBound = Math.ceil(maxEarnings * 1.2) || 10;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        margin: "16px 0",
        border: "2px solid #f0f0f0",
      }}
    >
      <h2
        style={{
          color: colors.text.light.primary,
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 16,
          margin: "0 0 16px 0",
          textAlign: "left",
        }}
      >
        Weekly Earnings
      </h2>

      <div style={{ height: 200, width: "100%", marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text.light.secondary, fontSize: 12 }}
            />
            <YAxis
              domain={[0, upperBound]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text.light.secondary, fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              width={30}
            />
            <Bar
              dataKey="amount"
              radius={[2, 2, 0, 0]}
              onClick={(data: any, index: number) => {
                setSelectedBarIndex(index === selectedBarIndex ? null : index);
              }}
              style={{ cursor: "pointer" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isToday ? colors.primary[700] : colors.neutral[300]
                  }
                />
              ))}
              <LabelList
                dataKey="amount"
                content={(props: any) => {
                  const { x, y, value, index } = props;
                  if (
                    selectedBarIndex !== null &&
                    index === selectedBarIndex &&
                    x !== undefined &&
                    y !== undefined &&
                    value !== undefined
                  ) {
                    return (
                      <text
                        x={Number(x) + 15}
                        y={Number(y) - 10}
                        fill={colors.text.light.primary}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontWeight: "bold", fontSize: 14 }}
                      >
                        ${value}
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyEarningsChart;
