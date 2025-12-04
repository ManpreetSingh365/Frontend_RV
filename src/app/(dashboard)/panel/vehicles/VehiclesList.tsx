"use client";

import { EntityList } from "@/components/shared";
import { createVehiclesConfig } from "./config";

export default function VehiclesList() {
    const config = createVehiclesConfig();

    return (
        <EntityList
            config={config}
            title="Vehicles"
            description="Manage fleet vehicles and their assignments"
        />
    );
}
