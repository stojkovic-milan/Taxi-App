"use client"
import RideService, { FilterCriteria, PaginationCriteria } from '@/services/RideService';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Pagination, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RideFilter from '@/components/rideFilter/rideFilter';
import { initialFilterCriteria } from '../../list/page';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Pie, PieChart, LineChart, Line, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar } from 'recharts';
import StatisticsService from '@/services/StatisticsService';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loadingSpinner/loadingSpinner';

interface GraphData {
    name: string,
    Rides: number
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF33FF', '#33CCFF', '#FF6633'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export default function Page() {
    const [loading, setLoading] = useState(true);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(initialFilterCriteria);
    const [timeSeriesAnalysis, setTimeSeriesAnalysis] = useState<TimeSeriesAnalysisDTO>()
    const [hourlyData, setHourlyData] = useState<GraphData[]>([])
    const [monthlyData, setMonthlyData] = useState<GraphData[]>([])
    const [dailyData, setDailyData] = useState<GraphData[]>([])
    const router = useRouter()

    function convertHour(hourKey: string): string {
        const hourOfDay = parseInt(hourKey);
        return `${hourOfDay.toString().padStart(2, '0')}:00`;
    }

    useEffect(() => {
        const fetchTimeSeriesAnalysis = async () => {
            try {
                const { data: response, status } = await StatisticsService.getTimeSeriesAnalysis();
                setTimeSeriesAnalysis(response)
                const hourlyData = response.hourOfDayAnalysis.map((item) => ({
                    name: convertHour(item[0].toString()),
                    Rides: item[1],
                }));

                const monthlyData = response.monthlyAnalysis.map((item) => ({
                    name: dayjs().month(item[0] - 1).format('MMMM'),
                    Rides: item[1],
                }));

                const dailyData = response.dayOfWeekAnalysis.map((item) => ({
                    name: WEEKDAYS[item[0]],
                    Rides: item[1],
                }));

                setHourlyData(hourlyData);
                setMonthlyData(monthlyData);
                setDailyData(dailyData);
            } catch (error) {
                if (axios.isAxiosError(error)) console.error(error.message);
            }
        };
        setLoading(true);
        Promise.resolve(fetchTimeSeriesAnalysis()).then(() => setLoading(false))
    }, []);


    // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    //     // event.type can be equal to focus with selectionFollowsFocus.
    //     if (
    //         event.type !== 'click'
    //         // ||
    //         // (event.type === 'click' &&
    //         //     samePageLinkNavigation(
    //         //         event as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    //         //     ))
    //     ) {
    //         setValue(newValue);
    //     }
    // };

    return (
        <div className="min-h-screen items-center justify-between p-2 h-screen bg-white text-blue-800">
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-10 w-24 h-24 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            {/* <span>Based on 161,843,930 rides</span> */}
            <Box sx={{ width: '100%' }}>
                <Tabs value={0} aria-label="nav tabs example">
                    <Tab label="Time series statistics" onClick={() => router.push("/statistics/time")} />
                    <Tab label="Financial statistics" onClick={() => router.push("/statistics/financial")} />
                    <Tab label="General statistics" onClick={() => router.push("/statistics/general")} />
                </Tabs>
            </Box>
            <div className='h-full w-full flex flex-row flex-wrap'>
                <ResponsiveContainer width="33%" height="40%">
                    <BarChart
                        title='Rides by time of day'
                        width={400}
                        height={270}
                        data={hourlyData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Rides" fill="#8884d8" />
                        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="33%" height="40%">
                    <BarChart
                        title='Rides by time of day'
                        width={400}
                        height={270}
                        data={monthlyData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Rides" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="33%" height="40%">
                    <PieChart width={400} height={400}>
                        <Pie data={dailyData} dataKey="Rides" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                            {dailyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}