import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartConfig } from '../ui/chart';

interface ChartData {
    name: string;
    price: number;  // It's better to use number for price to make it easier for calculations and chart rendering
}

// Define the props for the BestSeller component
interface BestSellerProps {
    data: ChartData[];

}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

const BestSeller = ({ data }: BestSellerProps) => {


    const truncate = (str:string, maxLength:number) => (str.length > maxLength ? str.substring(0, maxLength) + '...' : str);
    console.log("data: ", data)

    return (
        <div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickFormatter={(name) => truncate(name, 20)} angle={-45} textAnchor="end" interval={0} />
                    {/* <YAxis dataKey="price" /> */}
                    <Bar dataKey="price" fill="var(--color-desktop)" radius={4} />
                    {/* <Bar dataKey="name" fill="var(--color-desktop)" radius={4} /> */}
                    {/* <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
                </BarChart>
            </ChartContainer>

        </div>
    )
}

export default BestSeller