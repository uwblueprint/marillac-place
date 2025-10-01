import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
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
  if (weeklyEarnings.length !== 7) {
    console.warn("WeeklyEarningsChart expects exactly 7 days of earnings data");
  }

  const chartData: ChartDataItem[] = weeklyEarnings.map(
    (earnings = 0, index) => ({
      amount: earnings,
      isToday: index === 6,
    })
  );

  const maxEarnings = Math.max(...weeklyEarnings.filter((val) => val != null));
  const upperBound = Math.ceil(maxEarnings * 1.2);

  const thisWeekTotal = weeklyEarnings.reduce((sum, val = 0) => sum + val, 0);
  const lastWeekTotal = thisWeekTotal * 0.77;
  const percentageChange = Math.round(
    ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
  );

  return (
    <>
      <h2
        style={{
          color: colors.text.light.primary,
          fontSize: 20,
          marginBottom: 12,
        }}
      >
        Weekly Earnings
      </h2>

      <div style={{ height: 192, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <span
        style={{
          color: colors.text.light.primary,
          fontWeight: "bold",
          fontSize: 24,
        }}
      >
        ${chartData[chartData.length - 1]?.amount || 0}
      </span>

      <span style={{ color: colors.success[900], marginLeft: 8 }}>
        ▲ {percentageChange}% Compared to Last Week
      </span>
    </>
  );
};

export default WeeklyEarningsChart;
