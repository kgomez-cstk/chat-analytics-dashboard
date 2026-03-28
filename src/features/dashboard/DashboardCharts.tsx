import React from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  mockBarChartData,
  mockLineChartData,
  mockPieChartData,
} from '../../utils/mockData';

const DashboardCharts: React.FC = () => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
      {/* Bar Chart: Conversations by Advisor */}
      <Box bg="brand.surfaceContainerLowest" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="brand.outlineVariant">
        <Text fontWeight="bold" mb={4}>Conversaciones por Asesor</Text>
        <Box h="300px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockBarChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eff3" />
              <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#0053db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Line Chart: Performance Trends */}
      <Box bg="brand.surfaceContainerLowest" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="brand.outlineVariant">
        <Text fontWeight="bold" mb={4}>Tendencia de Rendimiento (Mensual)</Text>
        <Box h="300px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockLineChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eff3" />
              <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="value" stroke="#742fe5" strokeWidth={3} dot={{ r: 6, fill: '#742fe5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Pie Chart: Distribution by Channel */}
      <Box bg="brand.surfaceContainerLowest" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="brand.outlineVariant">
        <Text fontWeight="bold" mb={4}>Distribución por Canal</Text>
        <Box h="300px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockPieChartData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {mockPieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default DashboardCharts;
