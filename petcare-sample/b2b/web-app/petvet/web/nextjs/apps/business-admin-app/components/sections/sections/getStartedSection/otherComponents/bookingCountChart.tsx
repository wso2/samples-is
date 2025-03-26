/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Box, Card, CardContent, Typography } from "@mui/material";
import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

interface BookingCountChartProps {
  labels: string[];
  data: number[];
}

export default function BookingCountChart({ labels, data }: BookingCountChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const existingChart = Chart.getChart(chartRef.current);
        
        if (existingChart) existingChart.destroy();

        const ctx = chartRef.current.getContext("2d");
        
        if (!ctx) return;

        new Chart(ctx, {
            data: {
                datasets: [
                    {
                        backgroundColor: "#4e7eed",
                        borderRadius: 4,
                        data: data,
                        label: "Bookings"
                    }
                ],
                labels: labels
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Date"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: "Number of Bookings"
                        }
                    }
                }
            },
            type: "bar"
        });
    }, [ labels, data ]);

    return (
        <Card variant="outlined" sx={ { borderRadius: 2, boxShadow: 1 } }>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                Booking Count Per Day
                </Typography>
                <Box sx={ { height: "100%" } }>
                    <canvas ref={ chartRef } />
                </Box>
            </CardContent>
        </Card>
    );
}
