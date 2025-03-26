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

interface DoctorSpecialtyChartProps {
  filteredCount: { [key: string]: number };
  totalDoctors: number;
}

export default function DoctorSpecialtyChart({ filteredCount, totalDoctors }: DoctorSpecialtyChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const existingChart = Chart.getChart(chartRef.current);
        
        if (existingChart) existingChart.destroy();

        const ctx = chartRef.current.getContext("2d");
        
        if (!ctx) return;

        const otherCount =
      totalDoctors -
      (filteredCount["radiology"] || 0) -
      (filteredCount["surgery"] || 0) -
      (filteredCount["dermatology"] || 0) -
      (filteredCount["nutrition"] || 0);

        new Chart(ctx, {
            data: {
                datasets: [
                    {
                        backgroundColor: [ "#FF8A80", "#4e5ded", "#4e7eed", "#4e9bed", "#77b0ed" ],
                        borderWidth: 1,
                        data: [
                            filteredCount["radiology"] || 0,
                            filteredCount["surgery"] || 0,
                            filteredCount["dermatology"] || 0,
                            filteredCount["nutrition"] || 0,
                            otherCount
                        ]
                    }
                ],
                labels: [ "Radiology", "Surgery", "Dermatology", "Nutrition", "Other" ]
            },
            options: {
                plugins: {
                    legend: {
                        position: "right"
                    }
                },
                responsive: true
            },
            type: "doughnut"
        });
    }, [ filteredCount, totalDoctors ]);

    return (
        <Card variant="outlined" sx={ { borderRadius: 2, boxShadow: 1 } }>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                Doctor Specialty Summary
                </Typography>
                <Box sx={ { height: "100%" } }>
                    <canvas ref={ chartRef } />
                </Box>
                <Typography variant="subtitle1" align="center" mt={ 2 }>
                    { totalDoctors } Total Doctors
                </Typography>
            </CardContent>
        </Card>
    );
}
