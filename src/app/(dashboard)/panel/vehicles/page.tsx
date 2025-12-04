import { Metadata } from "next";
import VehiclesList from "./VehiclesList";

export const metadata: Metadata = {
    title: "Vehicles | Dashboard",
    description: "Manage fleet vehicles and their assignments",
};

export default function VehiclesPage() {
    return <VehiclesList />;
}
