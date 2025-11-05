import React from "react";
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
  isToday: boolean;
}

const WeeklyEarningsChart = ({
  weeklyEarnings = [],
}: WeeklyEarningsChartProps) => {
  const chartData: ChartDataItem[] = weeklyEarnings.map(
    (earnings = 0, index) => ({
      amount: earnings,
      isToday: index === 6,
    }),
  );

  const maxEarnings = Math.max(...weeklyEarnings.filter((val) => val != null));
  const upperBound = Math.ceil(maxEarnings * 1.2);

  const thisWeekTotal = weeklyEarnings.reduce((sum, val = 0) => sum + val, 0);
  // will need to turn this into a parameter:
  const lastWeekTotal = thisWeekTotal * 0.77;
  const percentageChange = Math.round(
    ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100,
  );

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
              dataKey="amount"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis
              domain={[0, upperBound]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text.light.secondary, fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              width={30}
            />
            <Bar dataKey="amount" radius={[2, 2, 0, 0]}>
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
                    index === chartData.length - 1 &&
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            color: colors.success[900],
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          ▲ {percentageChange}% Compared to Last Week
        </span>
      </div>
    </div>
  );
};

export default WeeklyEarningsChart;
